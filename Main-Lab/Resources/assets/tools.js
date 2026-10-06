(() => {
  const htmlEscape = (value) => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

  const xmlUnescape = (value) => value.replace(/&(amp|lt|gt|quot|apos);/g, (_, entity) => ({
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
  })[entity]);

  const formatXml = (value) => {
    const document = new DOMParser().parseFromString(value, 'application/xml');
    const error = document.querySelector('parsererror');
    if (error) throw new Error('Invalid XML');
    const compact = new XMLSerializer().serializeToString(document).replace(/>\s*</g, '><');
    let depth = 0;
    return compact.replace(/(>)(<)(\/?)/g, '$1\n$2$3').split('\n').map((line) => {
      if (/^<\//.test(line)) depth -= 1;
      const formatted = `${'  '.repeat(Math.max(0, depth))}${line}`;
      if (/^<(?!\/|\?|!)[^>]*[^/]>$/.test(line)) depth += 1;
      return formatted;
    }).join('\n');
  };

  const utf8Base64 = (value) => {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  };

  const base64Utf8 = (value) => {
    const normalized = value.replace(/\s/g, '');
    if (!normalized || !/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 === 1) throw new Error('Invalid Base64');
    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  };

  const imageDataUrlPattern = /^data:image\/(?:avif|bmp|gif|jpe?g|png|svg\+xml|webp);base64,[A-Za-z0-9+/]+={0,2}$/i;

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsDataURL(file);
  });

  const setStatus = (tool, message, state = '') => {
    const status = tool.querySelector('.roomos-tool__status');
    status.textContent = message;
    status.dataset.state = state;
  };

  const setCopyEnabled = (tool, enabled) => {
    const copyButton = tool.querySelector('[data-action="copy"]');
    if (copyButton) copyButton.disabled = !enabled;
  };

  const clearTextTool = (tool) => {
    tool.querySelectorAll('textarea').forEach((element) => { element.value = ''; });
    const result = tool.querySelector('[data-roomos-result]');
    if (result) result.hidden = true;
    setCopyEnabled(tool, false);
    setStatus(tool, 'Cleared from this browser tab.', 'success');
  };

  const copyOutput = async (tool) => {
    const output = tool.querySelector('textarea[readonly]');
    if (!output?.value) return;

    try {
      await navigator.clipboard.writeText(output.value);
      setStatus(tool, 'Copied to your clipboard.', 'success');
    } catch {
      output.focus();
      output.select();
      setStatus(tool, 'Select the output and copy it manually.', 'error');
    }
  };

  const splitLines = (value) => value.replace(/\r\n?/g, '\n').split('\n');

  const myersDiff = (oldLines, newLines, equals) => {
    const max = oldLines.length + newLines.length;
    const trace = [];
    const frontier = new Map([[1, 0]]);

    for (let distance = 0; distance <= max; distance += 1) {
      trace.push(new Map(frontier));
      for (let diagonal = -distance; diagonal <= distance; diagonal += 2) {
        const previousDown = frontier.get(diagonal + 1) ?? 0;
        const previousRight = frontier.get(diagonal - 1) ?? 0;
        const moveDown = diagonal === -distance || (diagonal !== distance && previousRight < previousDown);
        let oldIndex = moveDown ? previousDown : previousRight + 1;
        let newIndex = oldIndex - diagonal;

        while (oldIndex < oldLines.length && newIndex < newLines.length && equals(oldLines[oldIndex], newLines[newIndex])) {
          oldIndex += 1;
          newIndex += 1;
        }
        frontier.set(diagonal, oldIndex);

        if (oldIndex >= oldLines.length && newIndex >= newLines.length) {
          const operations = [];
          let currentOld = oldLines.length;
          let currentNew = newLines.length;

          for (let step = trace.length - 1; step > 0; step -= 1) {
            const prior = trace[step];
            const currentDiagonal = currentOld - currentNew;
            const priorDiagonal = currentDiagonal === -step || (currentDiagonal !== step && (prior.get(currentDiagonal - 1) ?? 0) < (prior.get(currentDiagonal + 1) ?? 0))
              ? currentDiagonal + 1
              : currentDiagonal - 1;
            const priorOld = prior.get(priorDiagonal) ?? 0;
            const priorNew = priorOld - priorDiagonal;

            while (currentOld > priorOld && currentNew > priorNew) {
              operations.push({ type: 'equal', oldIndex: currentOld - 1, newIndex: currentNew - 1 });
              currentOld -= 1;
              currentNew -= 1;
            }

            if (currentOld === priorOld) {
              operations.push({ type: 'insert', newIndex: currentNew - 1 });
              currentNew -= 1;
            } else {
              operations.push({ type: 'delete', oldIndex: currentOld - 1 });
              currentOld -= 1;
            }
          }

          while (currentOld > 0 && currentNew > 0) {
            operations.push({ type: 'equal', oldIndex: currentOld - 1, newIndex: currentNew - 1 });
            currentOld -= 1;
            currentNew -= 1;
          }
          while (currentOld > 0) operations.push({ type: 'delete', oldIndex: --currentOld });
          while (currentNew > 0) operations.push({ type: 'insert', newIndex: --currentNew });
          return operations.reverse();
        }
      }
    }

    return [];
  };

  const renderDiffCell = (line) => {
    const cell = document.createElement('div');
    cell.className = `roomos-tool__diff-cell${line ? ` roomos-tool__diff-cell--${line.type}` : ''}`;
    const lineNumber = document.createElement('span');
    lineNumber.className = 'roomos-tool__diff-line-number';
    lineNumber.textContent = line?.number ?? '';
    const content = document.createElement('span');
    content.className = 'roomos-tool__diff-content';
    content.textContent = line?.text ?? '';
    cell.append(lineNumber, content);
    return cell;
  };

  const renderDiffRow = (view, oldLine, newLine) => {
    const row = document.createElement('div');
    row.className = 'roomos-tool__diff-row';
    if (oldLine?.type === 'skip') {
      row.classList.add('roomos-tool__diff-row--skip');
      const summary = document.createElement('span');
      summary.className = 'roomos-tool__diff-content';
      summary.textContent = oldLine.text;
      row.append(summary);
    } else {
      row.append(renderDiffCell(oldLine), renderDiffCell(newLine));
    }
    view.append(row);
  };

  const renderDiff = (tool) => {
    const leftInput = tool.querySelector('#roomos-diff-left');
    const rightInput = tool.querySelector('#roomos-diff-right');
    const ignoreWhitespace = tool.querySelector('#roomos-diff-ignore-whitespace').checked;
    const showUnchanged = tool.querySelector('#roomos-diff-show-unchanged').checked;
    const oldLines = splitLines(leftInput.value);
    const newLines = splitLines(rightInput.value);
    const results = tool.querySelector('.roomos-tool__results');
    const view = tool.querySelector('.roomos-tool__diff-view');
    const normalize = (line) => ignoreWhitespace ? line.replace(/\s/g, '') : line;

    if (!leftInput.value && !rightInput.value) {
      results.hidden = true;
      setStatus(tool, 'Paste syntax into at least one field to compare it.', 'error');
      return;
    }

    const operations = myersDiff(oldLines, newLines, (oldLine, newLine) => normalize(oldLine) === normalize(newLine));
    const changedIndexes = operations.reduce((indexes, operation, index) => {
      if (operation.type !== 'equal') indexes.push(index);
      return indexes;
    }, []);
    view.replaceChildren();

    if (!changedIndexes.length) {
      renderDiffRow(view, { type: 'equal', number: '—', text: 'The snippets match.' }, { type: 'equal', number: '—', text: 'The snippets match.' });
      results.hidden = false;
      setStatus(tool, 'The snippets match.', 'success');
      return;
    }

    const context = 3;
    const visible = new Set();
    if (showUnchanged) {
      operations.forEach((_, index) => visible.add(index));
    } else {
      changedIndexes.forEach((index) => {
        for (let candidate = Math.max(0, index - context); candidate <= Math.min(operations.length - 1, index + context); candidate += 1) visible.add(candidate);
      });
    }

    let oldNumber = 1;
    let newNumber = 1;
    operations.forEach((operation) => {
      if (operation.type !== 'insert') operation.oldNumber = oldNumber++;
      if (operation.type !== 'delete') operation.newNumber = newNumber++;
    });

    let hiddenLines = 0;
    for (let index = 0; index < operations.length;) {
      const operation = operations[index];
      if (!visible.has(index)) {
        hiddenLines += 1;
        index += 1;
      } else {
        if (hiddenLines) {
          renderDiffRow(view, { type: 'skip', text: `⋯ ${hiddenLines} unchanged line${hiddenLines === 1 ? '' : 's'} hidden ⋯` });
          hiddenLines = 0;
        }
        if (operation.type === 'equal') {
          renderDiffRow(view, { type: 'equal', number: operation.oldNumber, text: oldLines[operation.oldIndex] }, { type: 'equal', number: operation.newNumber, text: newLines[operation.newIndex] });
          index += 1;
          continue;
        }

        const changedBlock = [];
        while (index < operations.length && operations[index].type !== 'equal') changedBlock.push(operations[index++]);
        const removed = changedBlock.filter((item) => item.type === 'delete');
        const added = changedBlock.filter((item) => item.type === 'insert');
        const rows = Math.max(removed.length, added.length);
        for (let row = 0; row < rows; row += 1) {
          const removedLine = removed[row];
          const addedLine = added[row];
          renderDiffRow(
            view,
            removedLine && { type: 'delete', number: removedLine.oldNumber, text: oldLines[removedLine.oldIndex] },
            addedLine && { type: 'insert', number: addedLine.newNumber, text: newLines[addedLine.newIndex] },
          );
        }
      }
    }
    if (hiddenLines) renderDiffRow(view, { type: 'skip', text: `⋯ ${hiddenLines} unchanged line${hiddenLines === 1 ? '' : 's'} hidden ⋯` });
    results.hidden = false;
    setStatus(tool, `${changedIndexes.length} changed line${changedIndexes.length === 1 ? '' : 's'} found.`, 'success');
  };

  const configureTextTool = (tool, transform, emptyMessage) => {
    const input = tool.querySelector('textarea:not([readonly])');
    const output = tool.querySelector('textarea[readonly]');
    const result = tool.querySelector('[data-roomos-result]');
    tool.querySelector('[data-action="convert"]').addEventListener('click', () => {
      if (!input.value) {
        output.value = '';
        if (result) result.hidden = true;
        setCopyEnabled(tool, false);
        setStatus(tool, emptyMessage, 'error');
        return;
      }
      try {
        output.value = transform(input.value);
        if (result) result.hidden = false;
        setCopyEnabled(tool, true);
        setStatus(tool, 'Converted locally in this browser tab.', 'success');
      } catch {
        output.value = '';
        if (result) result.hidden = true;
        setCopyEnabled(tool, false);
        setStatus(tool, 'The Base64 value could not be decoded as UTF-8 text.', 'error');
      }
    });
    tool.querySelector('[data-action="copy"]').addEventListener('click', () => copyOutput(tool));
    tool.querySelector('[data-action="clear"]').addEventListener('click', () => clearTextTool(tool));
  };

  const configureImagePreview = (tool, dataUrl) => {
    const preview = tool.querySelector('[data-image-preview]');
    preview.querySelector('img').src = dataUrl;
    preview.hidden = false;
  };

  const clearImagePreview = (tool) => {
    const preview = tool.querySelector('[data-image-preview]');
    preview.querySelector('img').removeAttribute('src');
    preview.hidden = true;
  };

  const configureBase64Tool = (tool) => {
    const subtools = [...tool.querySelectorAll('[data-roomos-subtool]')];
    tool.querySelectorAll('[data-base64-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        const selected = tab.dataset.base64Tab;
        tool.querySelectorAll('[data-base64-tab]').forEach((candidate) => {
          candidate.setAttribute('aria-selected', candidate === tab ? 'true' : 'false');
        });
        subtools.forEach((subtool) => { subtool.hidden = subtool.dataset.roomosSubtool !== selected; });
      });
    });

    const textEncode = tool.querySelector('[data-roomos-subtool="text-encode"]');
    const textDecode = tool.querySelector('[data-roomos-subtool="text-decode"]');
    configureTextTool(textEncode, utf8Base64, 'Enter text to encode.');
    configureTextTool(textDecode, base64Utf8, 'Enter Base64 text to decode.');

    const imageEncode = tool.querySelector('[data-roomos-subtool="image-encode"]');
    const imageFile = imageEncode.querySelector('input[type="file"]');
    const imageOutput = imageEncode.querySelector('textarea[readonly]');
    imageFile.addEventListener('change', async () => {
      const [file] = imageFile.files;
      if (!file) return;
      try {
        configureImagePreview(imageEncode, await readFileAsDataUrl(file));
        setStatus(imageEncode, 'Image selected locally. Encode it to copy a Data URL.', 'success');
      } catch {
        clearImagePreview(imageEncode);
        setStatus(imageEncode, 'The selected image could not be read.', 'error');
      }
    });
    imageEncode.querySelector('[data-action="encode-image"]').addEventListener('click', async () => {
      const [file] = imageFile.files;
      if (!file) {
        setStatus(imageEncode, 'Choose an image file to encode.', 'error');
        return;
      }
      try {
        imageOutput.value = await readFileAsDataUrl(file);
        configureImagePreview(imageEncode, imageOutput.value);
        setCopyEnabled(imageEncode, true);
        setStatus(imageEncode, 'Image encoded locally as a Data URL.', 'success');
      } catch {
        setStatus(imageEncode, 'The selected image could not be encoded.', 'error');
      }
    });
    imageEncode.querySelector('[data-action="copy"]').addEventListener('click', () => copyOutput(imageEncode));
    imageEncode.querySelector('[data-action="clear"]').addEventListener('click', () => {
      imageFile.value = '';
      imageOutput.value = '';
      clearImagePreview(imageEncode);
      setCopyEnabled(imageEncode, false);
      setStatus(imageEncode, 'Cleared from this browser tab.', 'success');
    });

    const imageDecode = tool.querySelector('[data-roomos-subtool="image-decode"]');
    const imageInput = imageDecode.querySelector('textarea');
    imageDecode.querySelector('[data-action="decode-image"]').addEventListener('click', () => {
      const dataUrl = imageInput.value.trim();
      if (!imageDataUrlPattern.test(dataUrl)) {
        clearImagePreview(imageDecode);
        setStatus(imageDecode, 'Paste a valid image Data URL to decode.', 'error');
        return;
      }
      configureImagePreview(imageDecode, dataUrl);
      setStatus(imageDecode, 'Image decoded locally in this browser tab.', 'success');
    });
    imageDecode.querySelector('[data-action="clear"]').addEventListener('click', () => {
      imageInput.value = '';
      clearImagePreview(imageDecode);
      setStatus(imageDecode, 'Cleared from this browser tab.', 'success');
    });
  };

  const configureXmlTool = (tool) => {
    const subtools = [...tool.querySelectorAll('[data-roomos-subtool]')];
    tool.querySelectorAll('[data-xml-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        const selected = tab.dataset.xmlTab;
        tool.querySelectorAll('[data-xml-tab]').forEach((candidate) => {
          candidate.setAttribute('aria-selected', candidate === tab ? 'true' : 'false');
        });
        subtools.forEach((subtool) => { subtool.hidden = subtool.dataset.roomosSubtool !== selected; });
      });
    });
    configureTextTool(tool.querySelector('[data-roomos-subtool="escape"]'), htmlEscape, 'Enter XML to escape.');
    configureTextTool(tool.querySelector('[data-roomos-subtool="unescape"]'), xmlUnescape, 'Enter escaped XML to unescape.');
    configureTextTool(tool.querySelector('[data-roomos-subtool="format"]'), formatXml, 'Enter XML to format and validate.');
  };

  const configureJsonFormatTool = (tool) => {
    const input = tool.querySelector('textarea:not([readonly])');
    const output = tool.querySelector('textarea[readonly]');
    const result = tool.querySelector('[data-roomos-result]');
    const convert = (indent) => {
      if (!input.value.trim()) { setStatus(tool, 'Enter JSON to validate.', 'error'); return; }
      try {
        output.value = JSON.stringify(JSON.parse(input.value), null, indent);
        result.hidden = false;
        setCopyEnabled(tool, true);
        setStatus(tool, 'JSON is valid.', 'success');
      } catch (error) {
        result.hidden = true;
        setCopyEnabled(tool, false);
        setStatus(tool, `Invalid JSON: ${error.message}`, 'error');
      }
    };
    tool.querySelector('[data-action="format"]').addEventListener('click', () => convert(2));
    tool.querySelector('[data-action="minify"]').addEventListener('click', () => convert(0));
    tool.querySelector('[data-action="copy"]').addEventListener('click', () => copyOutput(tool));
    tool.querySelector('[data-action="clear"]').addEventListener('click', () => clearTextTool(tool));
  };

  const configure = (tool) => {
    if (tool.dataset.initialized === 'true') return;
    tool.dataset.initialized = 'true';
    const kind = tool.dataset.roomosTool;

    if (kind === 'diff') {
      tool.querySelector('[data-action="compare"]').addEventListener('click', () => renderDiff(tool));
      tool.querySelector('[data-action="clear"]').addEventListener('click', () => {
        tool.querySelectorAll('textarea').forEach((element) => { element.value = ''; });
        tool.querySelector('.roomos-tool__results').hidden = true;
        setStatus(tool, 'Cleared from this browser tab.', 'success');
      });
      return;
    }

    if (kind === 'base64') {
      configureBase64Tool(tool);
      return;
    }

    if (kind === 'xml') {
      configureXmlTool(tool);
      return;
    }

    if (kind === 'json-format') {
      configureJsonFormatTool(tool);
      return;
    }

    const transforms = {
      flatten: [(value) => value.replace(/\r?\n/g, ' ').trim(), 'Enter multiline text to flatten.'],
      'json-string': [JSON.stringify, 'Enter text to escape for JSON.'],
    };
    configureTextTool(tool, ...transforms[kind]);
  };

  window.RoomosTools = {
    init(root = document) {
      root.querySelectorAll('[data-roomos-tool]').forEach(configure);
    },
  };
})();
