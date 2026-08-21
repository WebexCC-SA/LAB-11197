/********************************************************
Copyright (c) 2024 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
               https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
*********************************************************/

/**
 * Macro Author:              Robert(Bobby) McGonigle Jr
 *                            Technical Markteting Engineering, Leader
 *                            Cisco Systems
 * 
 * ---------------------------------------------------------------------
 * 
 * Lab Developer(s):          Christopher Nornan
 *                            Systems Engineer
 *                            Cisco Systems
 * 
 *                            Robert(Bobby) McGonigle Jr
 *                            Technical Markteting Engineering, Leader
 *                            Cisco Systems
 * 
 * ---------------------------------------------------------------------
 * 
 * Last Revised October 2024
 */

/** Abstract!!!
 * 
 * Lab 1451 Part Lab Buddy is a script that enables a UI on your Codec 
 * to help faciliate the lessons through Part 2 lab 1451 "Device xAPI, Room Customization and Deployment"
 * 
 * - https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/
 * 
 * Please follow the directions in the lab guide for installation and use
 * 
 * Please DO NOT modify the script while partaling in the lab
 * 
 *    But feel free to take it apart outside the lab to see how it works :)
 */

import xapi from 'xapi';

const config = {
  UserInterface: {
    PanelId: 'wx1_1451_pt2_labBuddy',
    IconUrl: 'https://www.webex.com/content/dam/wbx/global/images/webex-favicon.png',
    Name: 'Subscription Assistant [Lab 1451]'
  },
  CameraId: 1,
  DevMode: true
};

let spinnerValue = 0;

function scale255to100(value) {
  if (value < 0 || value > 255) {
    throw new Error('Value must be between 0 and 255.');
  };
  const converted = (value / 255) * 100;
  return Math.round(converted);
};

function scale100to255(value) {
  if (value < 0 || value > 100) {
    throw new Error('Value must be between 0 and 100.');
  };
  const converted = (value / 100) * 255;
  return Math.round(converted);
};

async function StartSubscriptions() {
  console.debug('Starting Subcriptions...');
  function formRoomOSHyperlink(input) {
    const modified = input.replace(/^x/, '');
    const finalString = modified.replace(/_/g, '.');
    const url = `https://roomos.cisco.com/xapi/${finalString}`;
    return { xAPI: input.replace(/_/g, ' '), Url: url };
  };

  const subs = Object.getOwnPropertyNames(Subscribe);
  subs.sort();
  let mySubscriptions = [];
  subs.forEach(element => {
    Subscribe[element]();
    mySubscriptions.push(formRoomOSHyperlink(element));
    Subscribe[element] = function () {
      console.debug({ Warn: `The [${element.replaceAll('_', ' ')}] subscription is already active, unable to fire it again` });
    };
  });
  console.debug(`[${mySubscriptions.length}] Subscriptions Set ||`, 'Subscriptions List:');
  mySubscriptions.forEach(element => {
    const formattedLines = JSON.stringify(element, null, 2).split('\n');
    formattedLines.forEach(line => {
      if (line != '}' && line != '{') {
        if (line.includes('http')) {
          console.debug(` ↳ ${line.replace(/^\s*/, '')}`);
        } else {
          console.debug(line.replace(/^\s*/, ''));
        };
      };
    });
  });
};

const Subscribe = {
  xEvent_UserInterface_Extensions_Widget_Action: function () {
    xapi.Event.UserInterface.Extensions.Widget.Action.on(({ WidgetId, Type, Value }) => {
      if (WidgetId.includes(`wx1_1451_lB~`)) {
        let [app, page, widgetType, action] = WidgetId.split(`~`);
        // console.debug(app, page, widgetType, action)
        switch (page) {
          case 'xConfigurations':
            if (Type == 'released') {
              switch (action) {
                case 'DefaultVolume':
                  const level = scale255to100(Value);
                  const textBox = 'Lvl: ' + level;
                  xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: [app, page, 'TextBox', action].join('~'), Value: textBox });
                  xapi.Config.Audio.DefaultVolume.set(level);
                  break;
                case 'AirplayPassword':
                  xapi.Config.Video.Input.AirPlay.Password.set(Value);
                  break;
              };
            };
            if (Type == 'changed') {
              switch (action) {
                case 'DefaultVolume':
                  const level = scale255to100(Value);
                  const textBox = 'Lvl: ' + level;
                  xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: [app, page, 'TextBox', action].join('~'), Value: textBox });
                  break;
                case 'AirplayMode':
                  xapi.Config.Video.Input.AirPlay.Mode.set(Value.toLowerCase() == 'on' ? 'On' : 'Off');
                  break;
                case 'AirplayBeacon':
                  xapi.Config.Video.Input.AirPlay.Beacon.set(Value.toLowerCase() == 'on' ? 'Auto' : 'Off');
                  break;
              };
            };
            break;
          case 'xStatuses':
            if (Type == 'pressed') {
              switch (action) {
                case 'Camera:ZoomIn':
                  xapi.Command.Camera.Ramp({ Zoom: 'In', CameraId: config.CameraId });
                  break;
                case 'Camera:ZoomOut':
                  xapi.Command.Camera.Ramp({ Zoom: 'Out', CameraId: config.CameraId });
                  break;
                case 'Camera:PanTilt':
                  switch (Value) {
                    case 'up': case 'down':
                      xapi.Command.Camera.Ramp({ Tilt: Value, CameraId: config.CameraId });
                      break;
                    case 'left': case 'right':
                      xapi.Command.Camera.Ramp({ Pan: Value, CameraId: config.CameraId });
                      break;
                  };
                  break;
              };
              if (action.includes('Camera:')) {
                xapi.Command.Video.Selfview.Set({ Mode: 'On', FullscreenMode: 'Off', PIPPosition: 'LowerRight', OnMonitorRole: 'First' });
                xapi.Command.Video.Input.SetMainVideoSource({ ConnectorId: config.CameraId });
                xapi.Command.Cameras.SpeakerTrack.Deactivate();
                xapi.Command.Cameras.SpeakerTrack.Frames.Deactivate();
              };
            };
            if (Type == 'released') {
              switch (action) {
                case 'SetVolume':
                  const level = scale255to100(Value);
                  const textBox = 'Lvl: ' + level;
                  xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: [app, page, 'TextBox', action].join('~'), Value: textBox });
                  xapi.Command.Audio.Volume.Set({ Level: level });
                  break;
                case 'Camera:ZoomIn':
                case 'Camera:ZoomOut':
                  xapi.Command.Camera.Ramp({ Zoom: 'Stop', CameraId: config.CameraId });
                  break;
                case 'Camera:PanTilt':
                  switch (Value) {
                    case 'up': case 'down':
                      xapi.Command.Camera.Ramp({ Tilt: 'Stop', CameraId: config.CameraId });
                      break;
                    case 'left': case 'right':
                      xapi.Command.Camera.Ramp({ Pan: 'Stop', CameraId: config.CameraId });
                      break;
                  };
                  break;
              };
            };
            if (Type == 'changed') {
              switch (action) {
                case 'SetVolume':
                  const level = scale255to100(Value);
                  const textBox = 'Lvl: ' + level;
                  xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: [app, page, 'TextBox', action].join('~'), Value: textBox });
                  break;
              };
            };
            break;
          case 'xEvents':
            console.debug(`xEvents =>`, { WidgetId, Type, Value });
            if (Type == 'released') {
              switch (action) {
                case 'UIMessages':
                  let msg = { Title: `[${Value}] Display!`, Text: `This is the result of the UserInterface Message [${Value}] Display xCommand!`, Duration: 8, FeedbackId: `webexOne~lab1451~UI~Message~${Value}~Display` }
                  if (Value == 'Prompt') {
                    msg.Text += '<p> Select one of the Following'
                    msg['Option.1'] = 'Prompts have [1]';
                    msg['Option.2'] = 'up to [2]';
                    msg['Option.3'] = '5 Prompt Options [3]';
                    msg['Option.4'] = 'You can Include [4]';
                    msg['Option.5'] = 'In your Customization! [5]';
                  };
                  xapi.Command.UserInterface.Message[Value].Display(msg).catch(e => {
                    // Handles Messages that don't include a FeedbackId paramter
                    msg.FeedbackId = undefined;
                    xapi.Command.UserInterface.Message[Value].Display(msg);
                  });
                  break;
                case 'Slider':
                  const level = Value;
                  const textBox = 'Lvl: ' + level;
                  xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: [app, page, 'TextBox', action].join('~'), Value: textBox });
                  break;
                case 'Spinner':
                  if (Value == 'increment') {
                    spinnerValue += 5;
                  } else {
                    spinnerValue -= 5;
                  };
                  xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: [app, page, widgetType, action].join('~'), Value: spinnerValue });
                  break;
              };
            };
            if (Type == 'changed') {
              switch (action) {
                case 'Slider':
                  const level = Value;
                  const textBox = 'Lvl: ' + level;
                  xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: [app, page, 'TextBox', action].join('~'), Value: textBox });
                  break;
              };
            };
            break;
          case 'SectionCleanup':
            if (Type == 'released') {
              if (action == 'RunCleanup') {
                xapi.Command.UserInterface.Message.Prompt.Display({
                  Title: `⚠️ Warning: Run Section Cleanup? ⚠️`,
                  Text: `Running this may impact your progress in any particular lesson in Part 2. Only run this when instructed to do so when the lab guide requests it.`,
                  FeedbackId: `wx1_lab1451_cleanupProcess`,
                  "Option.1": `Yes, Run the Cleanup Script`,
                  "Option.2": `No, I'm still working`,
                  "Option.3": 'Dimiss'
                });
              };
            };
            break;
        };
      };
    });
  },
  xEvent_UserInterface_Extensions_Panel_Clicked: function () {
    xapi.Event.UserInterface.Extensions.Panel.Clicked.on(({ PanelId }) => {
      if (PanelId == config.UserInterface.PanelId) {
        if (config.DevMode) {
          setTimeout(() => {
            xapi.Command.UserInterface.Extensions.Panel.Open({ PanelId: config.UserInterface.PanelId, PageId: `wx1_1451_lB~xConfigurations` });
          }, 125)
        };
      };
    });
  },
  xEvent_UserInterface_Extensions_Event_PageOpened: function () {
    xapi.Event.UserInterface.Extensions.Event.PageOpened.on(({ PageId }) => {
      if (PageId.includes(`wx1_1451_lB~`)) {
        if (config.DevMode) {
          if (!debounce.PageOpened.active) {
            debounce.PageOpened.active = true;
            xapi.Command.UserInterface.Extensions.Panel.Open({ PanelId: config.UserInterface.PanelId, PageId: PageId });
            clearTimeout(debounce.PageOpened.run);
            debounce.PageOpened.run = setTimeout(() => { debounce.PageOpened.active = false; }, 50);
          };
        };
      };
    });
  },
  xEvent_UserInterface_Message_Prompt_Response: function () {
    xapi.Event.UserInterface.Message.Prompt.Response.on(event => {
      if (event.FeedbackId == `wx1_lab1451_cleanupProcess` && parseInt(event.OptionId) == 1) {
        runCleanup();
      };
    });
  },
  xConfig_Audio_DefaultVolume: async function () {
    const currentValue = await xapi.Config.Audio.DefaultVolume.get();

    async function setWidget(val) {
      let [app, page, widgetType, action] = ['wx1_1451_lB', 'xConfigurations', 'TextBox', 'DefaultVolume'];
      await updateWidget(`LVL: ${val}`, app, page, widgetType, action);
      widgetType = 'Slider';
      await updateWidget(scale100to255(val), app, page, widgetType, action);
    }

    setWidget(currentValue);

    xapi.Config.Audio.DefaultVolume.on(event => {
      setWidget(event);
    });
  },
  xConfig_Video_Input_AirPlay: async function () {
    const currentValue = await xapi.Config.Video.Input.AirPlay.get();

    async function setWidget(val) {
      let [app, page, widgetType, action] = ['wx1_1451_lB', 'xConfigurations', 'Toggle', 'AirplayMode'];
      if (val?.Mode) {
        await updateWidget(val.Mode, app, page, widgetType, action);
      }
      action = 'AirplayBeacon';
      if (val?.Beacon) {
        await updateWidget(val.Beacon == 'Auto' ? 'on' : 'off', app, page, widgetType, action);
      }
      action = 'AirplayPassword'; widgetType = 'GroupButton';
      if (val?.Password) {
        await updateWidget('unset', app, page, widgetType, action);
      }
    }

    setWidget(currentValue);

    xapi.Config.Video.Input.AirPlay.on(event => {
      setWidget(event);
    });
  },
  xStatus_Audio_Volume: async function () {
    const currentValue = await xapi.Status.Audio.Volume.get();

    async function setWidget(val) {
      let [app, page, widgetType, action] = ['wx1_1451_lB', 'xStatuses', 'TextBox', 'SetVolume'];
      await updateWidget(`LVL: ${val}`, app, page, widgetType, action);
      widgetType = 'Slider';
      await updateWidget(scale100to255(val), app, page, widgetType, action);
    }

    setWidget(currentValue);

    xapi.Status.Audio.Volume.on(event => {
      setWidget(event);
    });
  },
};

async function updateWidget(value, ...args) {
  const widgetId = args.slice(0, 4).join('~');

  if (value.toString().toLowerCase() == 'unset' || (value == '' || value == undefined)) {
    await xapi.Command.UserInterface.Extensions.Widget.UnsetValue({ WidgetId: widgetId });
    return;
  }

  await xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: widgetId, Value: value });
  return;
}

const debounce = {
  PageOpened: {
    active: false,
    run: ''
  }
};

async function runCleanup() {
  await xapi.Config.Audio.DefaultVolume.set(50).catch(e => console.debug('Failed to Set DefaultVolume [Cleanup]', e));
  await xapi.Command.UserInterface.Extensions.Panel.Remove({ PanelId: 'wx1_lab_multilineCommand' }).catch(e => console.debug('Failed to Remove Panel [Cleanup]', e));
  await xapi.Command.Video.Selfview.Set({ Mode: 'Off', FullscreenMode: 'Off', OnMonitorRole: 'First', PIPPosition: 'LowerRight' }).catch(e => console.debug('Failed to Set Selfview Mode [Cleanup]', e));
  await xapi.Command.Video.Input.SetMainVideoSource({ ConnectorId: config.CameraId }).catch(e => console.debug('Failed to Set MainSource [Cleanup]', e));
  await xapi.Command.Audio.Volume.SetToDefault({ Device: 'Internal' }).catch(e => console.debug('Failed to Audio Volume to Default [Cleanup]', e));

  const feedbackSlots = [1, 2, 3, 4];

  for (const targetSlot of feedbackSlots) {
    await xapi.Command.HttpFeedback.Deregister({ FeedbackSlot: targetSlot }).catch(e => console.debug(`Failed to Deregister Feedback Slot [${targetSlot}] [Cleanup]`, e));
  };

  return new Promise(async resolve => {
    function isOnlyActiveName(data, targetName) {
      let activeCount = 0;
      for (const item of data) {
        if (item.Active === "True") {
          activeCount++;
          if (item.Name === targetName) {
            continue;
          } else {
            return false;
          };
        };
      };
      return activeCount === 1 && data.some(item => item.Name === targetName && item.Active === "True");
    };

    const macroList = (await xapi.Command.Macros.Macro.Get()).Macro;

    for (let macro of macroList) {
      if (macro.Name != _main_macro_name() && macro.Active == 'True') {
        await xapi.Command.Macros.Macro.Deactivate({ Name: macro.Name });
        console.debug(`Deactivating Macro [${macro.Name}]`);
      };
    };
    const areMacrosReady = isOnlyActiveName(macroList, _main_macro_name());

    await xapi.Command.UserInterface.Extensions.Panel.Close();

    await xapi.Command.UserInterface.Message.Prompt.Display({
      Title: 'Cleanup Process Complete!',
      Text: 'Your system is ready for the next Lesson 😁',
      Duration: 5
    });

    //await unsetWidgetValues();

    if (areMacrosReady) {
      resolve();
    } else {
      await xapi.Command.Macros.Runtime.Restart();
      resolve();
    };
  });
};

async function buildUserInterface() {

  console.debug('Building UserInterface....');

  const xml = `<Extensions><Panel><Order>99</Order><Origin>local</Origin><Location>HomeScreenAndCallControls</Location><Icon>Lightbulb</Icon><Name>${config.UserInterface.Name}</Name><ActivityType>Custom</ActivityType><Page><Name>⚙️ xConfigurations</Name><Row><Name>Audio DefaultVolume</Name><Widget><WidgetId>wx1_1451_lB~xConfigurations~Slider~DefaultVolume</WidgetId><Type>Slider</Type><Options>size=3</Options></Widget><Widget><WidgetId>wx1_1451_lB~xConfigurations~TextBox~DefaultVolume</WidgetId><Name>LVL: ??</Name><Type>Text</Type><Options>size=1;fontSize=normal;align=center</Options></Widget></Row><Row><Name>Airplay</Name><Widget><WidgetId>wx1_1451_lB~xConfigurations~TextBox~AirplayMode</WidgetId><Name>Mode</Name><Type>Text</Type><Options>size=1;fontSize=normal;align=center</Options></Widget><Widget><WidgetId>wx1_1451_lB~xConfigurations~Toggle~AirplayMode</WidgetId><Type>ToggleButton</Type><Options>size=1</Options></Widget><Widget><WidgetId>wx1_1451_lB~xConfigurations~TextBox~AirplayBeacon</WidgetId><Name>Beacon</Name><Type>Text</Type><Options>size=1;fontSize=normal;align=center</Options></Widget><Widget><WidgetId>wx1_1451_lB~xConfigurations~Toggle~AirplayBeacon</WidgetId><Type>ToggleButton</Type><Options>size=1</Options></Widget><Widget><WidgetId>wx1_1451_lB~xConfigurations~TextBox~AirplayPassword</WidgetId><Name>Choose Mock Password Below</Name><Type>Text</Type><Options>size=4;fontSize=normal;align=center</Options></Widget><Widget><WidgetId>wx1_1451_lB~xConfigurations~GroupButton~AirplayPassword</WidgetId><Type>GroupButton</Type><Options>size=4</Options><ValueSpace><Value><Key>password</Key><Name>password</Name></Value><Value><Key>admin1234</Key><Name>admin1234</Name></Value></ValueSpace></Widget></Row><PageId>wx1_1451_lB~xConfigurations</PageId><Options/></Page><Page><Name>🩺 xStatuses</Name><Row><Name>Adjust Volume</Name><Widget><WidgetId>wx1_1451_lB~xStatuses~Slider~SetVolume</WidgetId><Type>Slider</Type><Options>size=3</Options></Widget><Widget><WidgetId>wx1_1451_lB~xStatuses~TextBox~SetVolume</WidgetId><Name>Vol: ??</Name><Type>Text</Type><Options>size=1;fontSize=normal;align=center</Options></Widget></Row><Row><Name>Camera Control Wheel</Name><Widget><WidgetId>wx1_1451_lB~xStatuses~Button~Camera:ZoomOut</WidgetId><Name>Zoom Out (➖)</Name><Type>Button</Type><Options>size=2</Options></Widget><Widget><WidgetId>wx1_1451_lB~xStatuses~Button~Camera:ZoomIn</WidgetId><Name>Zoom In (➕)</Name><Type>Button</Type><Options>size=2</Options></Widget><Widget><WidgetId>wx1_1451_lB~xStatuses~ControlWheel~Camera:PanTilt</WidgetId><Type>DirectionalPad</Type><Options>size=4</Options></Widget></Row><PageId>wx1_1451_lB~xStatuses</PageId><Options/></Page><Page><Name>📅 xEvents</Name><Row><Name>UserInterface Messages...</Name><Widget><WidgetId>wx1_1451_lB~xEvents~GroupButton~UIMessages</WidgetId><Type>GroupButton</Type><Options>size=4</Options><ValueSpace><Value><Key>Prompt</Key><Name>Prompt</Name></Value><Value><Key>TextInput</Key><Name>TextInput</Name></Value><Value><Key>Rating</Key><Name>Rating</Name></Value><Value><Key>Alert</Key><Name>Alert</Name></Value></ValueSpace></Widget></Row><Row><Name>UserInterface Extensions...</Name><Widget><WidgetId>wx1_1451_lB~xEvents~IconButton~IconButton</WidgetId><Type>Button</Type><Options>size=1;icon=red</Options></Widget><Widget><WidgetId>wx1_1451_lB~xEvents~Button~TextButton</WidgetId><Name>Text</Name><Type>Button</Type><Options>size=1</Options></Widget><Widget><WidgetId>wx1_1451_lB~xEvents~Spinner~Spinner</WidgetId><Type>Spinner</Type><Options>size=2;style=vertical</Options></Widget><Widget><WidgetId>wx1_1451_lB~xEvents~GroupButton~GroupButton</WidgetId><Type>GroupButton</Type><Options>size=4</Options><ValueSpace><Value><Key>Group A</Key><Name>Group A</Name></Value><Value><Key>Group B</Key><Name>Group B</Name></Value><Value><Key>Group C</Key><Name>Group C</Name></Value></ValueSpace></Widget><Widget><WidgetId>wx1_1451_lB~xEvents~Toggle~Toggle</WidgetId><Type>ToggleButton</Type><Options>size=1</Options></Widget><Widget><WidgetId>wx1_1451_lB~xEvents~Slider~Slider</WidgetId><Type>Slider</Type><Options>size=2</Options></Widget><Widget><WidgetId>wx1_1451_lB~xEvents~TextBox~Slider</WidgetId><Name>--</Name><Type>Text</Type><Options>size=1;fontSize=normal;align=center</Options></Widget><Widget><WidgetId>wx1_1451_lB~xEvents~ControlWheel~ControlWheel</WidgetId><Type>DirectionalPad</Type><Options>size=4</Options></Widget></Row><PageId>wx1_1451_lB~xEvents</PageId><Options/></Page><Page><Name>⚠️ Section Cleanup</Name><Row><Name/><Widget><WidgetId>wx1_1451_lB~SectionCleanup~Button~RunCleanup</WidgetId><Name>⚠️ Run Section Cleanup? ⚠️</Name><Type>Button</Type><Options>size=4</Options></Widget></Row><PageId>wx1_1451_lB~SectionCleanup</PageId><Options/></Page></Panel></Extensions>`;

  await xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: config.UserInterface.PanelId }, xml);

  if (config.UserInterface.IconUrl != '' && config.UserInterface.IconUrl != undefined) {
    try {
      let getIconAndId = (await xapi.Command.UserInterface.Extensions.Icon.Download({ Url: config.UserInterface.IconUrl })).IconId;
      let uploadIcon = await xapi.Command.UserInterface.Extensions.Panel.Update({ IconId: getIconAndId, Icon: 'Custom', PanelId: config.UserInterface.PanelId });
    } catch (e) {
      console.debug(e);
    };
  };
  console.debug('Building UserInterface built!');
};

async function unsetWidgetValues() {
  const parseWidgetIds = (xmlString) => {
    const regex = /<WidgetId>(.*?)<\/WidgetId>/g;
    const widgetIds = [];
    let match;
    while ((match = regex.exec(xmlString)) !== null) {
      const value = match[1];
      if (value.includes('wx1_1451_lB~')) {
        widgetIds.push(value);
      };
    };
    return widgetIds;
  };
  const panel = await xapi.Command.UserInterface.Extensions.Export();

  const widgetIds = parseWidgetIds(panel.Data);

  for (const widget of widgetIds) {
    await xapi.Command.UserInterface.Extensions.Widget.UnsetValue({ WidgetId: widget }).catch(e => console.debug(`Failed to unset WidgetId: ${widget}`, e));
  };
};

async function setupLab1451Config() {
  await xapi.Config.Standby.Control.set('Off');
  await xapi.Config.Standby.Halfwake.Mode.set('Manual');
  await xapi.Config.HttpClient.Mode.set('On');
  await xapi.Config.HttpClient.AllowInsecureHTTPS.set('True');
};

const init = async () => {

  console.debug(`[${_main_macro_name()}] Initializing...`);

  await setupLab1451Config();

  await StartSubscriptions();

  await buildUserInterface();

  //await unsetWidgetValues();

  console.debug(`[${_main_macro_name()}] Initialized!`);
};

init();