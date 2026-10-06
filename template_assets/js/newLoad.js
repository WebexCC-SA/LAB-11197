String.prototype.capitalizeFirstLetter = function () {
    if (this.length === 0) {
        return ""; // Return an empty string if the original string is empty
    }
    // Capitalize the first character
    const firstChar = this.charAt(0).toUpperCase();
    // Lowercase the rest of the string
    const restOfString = this.slice(1)

    return firstChar + restOfString;
};

// This function will handle the dynamic highlighting
function applyCustomHighlights() {
    // Original sessionStorage logic (keep this as is)
    // This part seems to be related to other functionality you have
    Object.keys(sessionStorage).forEach(key => {
        Array.from(document.getElementsByClassName(key)).forEach((element) => {
            element.innerHTML = sessionStorage.getItem(key);
        });
    });

    // Define the mapping between your custom tags and the CSS classes
    const highlightTags = {
        'highlight_0': 'custom-highlight-0',
        'highlight_1': 'custom-highlight-1',
        'highlight_2': 'custom-highlight-2',
        'highlight_3': 'custom-highlight-3',
        'highlight_4': 'custom-highlight-4',
        'highlight_5': 'custom-highlight-5',
        'highlight_6': 'custom-highlight-6',
        'highlight_7': 'custom-highlight-7',
        'hl_0': 'custom-highlight-0',
        'hl_1': 'custom-highlight-1',
        'hl_2': 'custom-highlight-2',
        'hl_3': 'custom-highlight-3',
        'hl_4': 'custom-highlight-4',
        'hl_5': 'custom-highlight-5',
        'hl_6': 'custom-highlight-6',
        'hl_7': 'custom-highlight-7'
    };

    // Iterate over each custom tag type
    for (const tagName in highlightTags) {
        const className = highlightTags[tagName]; // Get the CSS class name for the current tag
        // Get all elements with the current custom tag name (e.g., <highlight_1>)
        // Array.from is used to convert the live HTMLCollection to a static Array
        // so that modifications during iteration don't cause issues.
        const elements = Array.from(document.getElementsByTagName(tagName));

        elements.forEach(el => {
            // Create a new <span> element
            const span = document.createElement('span');
            // Add the corresponding CSS class to the new <span>
            span.classList.add(className);
            // Copy the original content from inside the custom tag to the new <span>
            span.innerHTML = el.innerHTML;

            // Replace the custom tag element with the newly created <span> element
            // Ensure the parentNode exists before attempting to replace
            if (el.parentNode) {
                el.parentNode.replaceChild(span, el);
            }
        });
    }

    // Original 'copy' tag logic (keep this as is)
    // This part handles click events for elements with the tag <copy>
    Array.from(document.getElementsByTagName("copy")).forEach(el => {
        if (el.dataset.copyInitialized === 'true') return;
        el.dataset.copyInitialized = 'true';
        el.addEventListener("click", function (event) {
            if (event.target.tagName === "COPY") {
                navigator.clipboard.writeText(event.target.innerText);
            }
            if (event.target.tagName === "W") { // Assuming 'W' is a nested tag within 'copy'
                navigator.clipboard.writeText(event.target.parentNode.innerText);
            }
        });
    });

    Array.from(document.getElementsByTagName("roomosdoc")).forEach(el => {
        if (el.dataset.roomosDocInitialized === 'true') return;
        el.dataset.roomosDocInitialized = 'true';
        el.addEventListener("click", function (event) {
            let rawPath;
            let path;
            if (event.target.tagName === "ROOMOSDOC") {
                console.log(event.target.innerText)
                if (!event.target.innerText.includes(':')) {
                    rawPath = event.target.innerText.trim().replace(/\"/gm, '');
                } else {
                    alert('Malformed Object')
                    return;
                }
            }
            if (event.target.tagName === "W") { // Assuming 'W' is a nested tag within 'copy'
                if (!event.target.parentNode.innerText.includes(':')) {
                    rawPath = event.target.parentNode.innerText.trim().replace(/\"/gm, '');
                } else {
                    alert('Malformed Object')
                    return;
                }
            }
            path = rawPath.replace(/\s+/gm, ' ').split(' ');
            path = path.map(item => item.trim());
            if (path[0][0].toLowerCase() == 'x') {
                path[0] = path[0].slice(1)
                path = path.map(item => item.capitalizeFirstLetter());
            }
            window.open(`https://roomos.cisco.com/xapi/${path.join('.')}/`, '_blank');
        });
    });

    Array.from(document.getElementsByTagName("roomosfind")).forEach(el => {
        if (el.dataset.roomosFindInitialized === 'true') return;
        el.dataset.roomosFindInitialized = 'true';
        //https://roomos.cisco.com/xapi/search?search=Configuration+Audio
        el.addEventListener("click", function (event) {
            let rawPath;
            let path;
            if (event.target.tagName === "ROOMOSFIND") {
                console.log(event.target.innerText)
                if (!event.target.innerText.includes(':')) {
                    rawPath = event.target.innerText.trim().replace(/\"/gm, '');
                } else {
                    alert('Malformed Object')
                    return;
                }
            }
            if (event.target.tagName === "W") { // Assuming 'W' is a nested tag within 'copy'
                if (!event.target.parentNode.innerText.includes(':')) {
                    rawPath = event.target.parentNode.innerText.trim().replace(/\"/gm, '');
                } else {
                    alert('Malformed Object')
                    return;
                }
            }
            path = rawPath.replace(/\s+/gm, ' ').split(' ');
            path = path.map(item => item.trim().replace(/\[/g, '\\[').replace(/\]/g, '\\]'));
            if (path[0][0].toLowerCase() == 'x') {
                path[0] = path[0].slice(1)
            }
            window.open(`https://roomos.cisco.com/xapi/search?search=${path.join('+')}`, '_blank');
        });
    });
}

// Ensure the highlighting function runs after the entire HTML document has been loaded and parsed.
// This is crucial because the script needs to find and manipulate elements that exist on the page.
if (typeof document$ !== 'undefined') {
    document$.subscribe(applyCustomHighlights);
} else {
    document.addEventListener('DOMContentLoaded', applyCustomHighlights);
}

// MkDocs Material replaces page content without firing DOMContentLoaded during
// instant navigation. Re-initialize new page content after every activation.
// Element data attributes above keep repeated activations idempotent.
if (typeof document$ !== 'undefined') {
    document$.subscribe(applyCustomHighlights);
}

// Your existing setValues function (keep this as is)
function setValues() {
    document.querySelector("#info").querySelectorAll("input").forEach((input) => {
        sessionStorage.setItem(input.name, input.value);
    });
    // Prevent default form submission if this is part of a form
    // Note: 'event' should be passed as a parameter to setValues(event) if used in an event listener
    if (typeof event !== 'undefined' && event.preventDefault) {
        event.preventDefault();
    }
    // Re-run the highlight logic in case new content is added/modified
    applyCustomHighlights();
}

function setValuesPopUp(message, clientX, clientY, duration = 1800) {
    // Create the notification element
    const notification = document.createElement('div');
    notification.classList.add('setValue-notification');
    notification.textContent = message;

    // Set the initial position based on mouse click coordinates
    // The CSS transform will then adjust it to appear "above" the click point
    notification.style.left = clientX + 'px';
    notification.style.top = clientY + 'px';

    // Append the notification directly to the body
    document.body.appendChild(notification);

    // Trigger the show animation after a small delay to allow CSS transition
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Automatically remove the notification after 'duration' milliseconds
    setTimeout(() => {
        notification.classList.remove('show');
        // Remove the element from the DOM after the fade-out transition completes
        notification.addEventListener('transitionend', () => {
            notification.remove();
        }, { once: true }); // The { once: true } option ensures the listener is removed after it fires
    }, duration);
}

const setLabValuesButton = document.getElementById('setLabValues');
if (setLabValuesButton) {
    setLabValuesButton.addEventListener('click', (event) => {
        // Pass the mouse coordinates (event.clientX, event.clientY) to the function
        setValuesPopUp('Lab References Updated!', event.clientX + 20, event.clientY - 20);
    });
}
