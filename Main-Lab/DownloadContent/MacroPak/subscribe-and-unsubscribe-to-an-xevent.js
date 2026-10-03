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

import xapi from 'xapi';

/**
 * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#266-subscribing-to-xevents
 * 
 * Lesson: Subscribe and Unsubscribe to an xEvent
*/

const delay_in_seconds = 10;

// Edit this Object to include your xEvent Subscription
const subscribeToWidgetActions = ''; //<-- Make Your Changes Here

// Do not edit past this line, but feel free to review what's going on :)

// Here, we use JS Timeouts to set an action to run after X seconds. Timeouts use milliseconds, hence why we multiply by 1000
setTimeout(() => {

  subscribeToWidgetActions(); //<-- By calling the Object we assigned our Subscription too as a function(), we will unsubscribe from it

  console.warn("WidgetActions Subscription stopped!");

}, delay_in_seconds * 1000)


// This countdown is used to help you visualize when the process will complete it's course
// We use console.warn to have this countdown print in another color in the Macro Console
function countdown(startNumber) {
  let currentNumber = startNumber;

  console.warn(`WidgetActions Subscription stopping in [${currentNumber}] seconds`);

  const interval = setInterval(() => {
    currentNumber--;
    if (currentNumber > 0) {
      console.warn(`WidgetActions Subscription stopping in [${currentNumber}] seconds`);
    }

    if (currentNumber < 1) {
      clearInterval(interval);
    }
  }, 1000);
}

const myPanelId = 'wx1_lab_multilineCommand';

const myUserinterfaceXML = `<Extensions>
  <Panel>
    <Order>1</Order>
    <PanelId>wx1_lab_multilineCommand</PanelId>
    <Location>HomeScreen</Location>
    <Icon>Info</Icon>
    <Color>#FC5143</Color>
    <Name>Multiline Command</Name>
    <ActivityType>Custom</ActivityType>
    <Page>
      <Name>Page</Name>
      <Row>
        <Name>Buttons</Name>
        <Widget>
          <WidgetId>wx1_GroupButton</WidgetId>
          <Type>GroupButton</Type>
          <Options>size=4</Options>
          <ValueSpace>
            <Value>
              <Key>GroupButton_A</Key>
              <Name>A</Name>
            </Value>
            <Value>
              <Key>GroupButton_B</Key>
              <Name>B</Name>
            </Value>
            <Value>
              <Key>GroupButton_C</Key>
              <Name>C</Name>
            </Value>
          </ValueSpace>
        </Widget>
        <Widget>
          <WidgetId>wx1_TextButton</WidgetId>
          <Name>Text</Name>
          <Type>Button</Type>
          <Options>size=1</Options>
        </Widget>
        <Widget>
          <WidgetId>wx1_IconButton</WidgetId>
          <Type>Button</Type>
          <Options>size=1;icon=green</Options>
        </Widget>
        <Widget>
          <WidgetId>wx1_SpinnerButton</WidgetId>
          <Type>Spinner</Type>
          <Options>size=2</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Control Wheel</Name>
        <Widget>
          <WidgetId>wx1_ControlWheel</WidgetId>
          <Type>DirectionalPad</Type>
          <Options>size=4</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Toggle and Slider</Name>
        <Widget>
          <WidgetId>wx1_Toggle</WidgetId>
          <Type>ToggleButton</Type>
          <Options>size=1</Options>
        </Widget>
        <Widget>
          <WidgetId>wx1_Slider</WidgetId>
          <Type>Slider</Type>
          <Options>size=3</Options>
        </Widget>
      </Row>
      <Options/>
    </Page>
  </Panel>
</Extensions>`


const buildUserInterface = async function () {
  try {
    const saveUI = await xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: myPanelId }, myUserinterfaceXML)
    console.log(`Panel [${myPanelId}] saved to the codec`)
  } catch (e) {
    console.error(e)
  }
}

function init() {
  countdown(delay_in_seconds);

  buildUserInterface()
}

init();