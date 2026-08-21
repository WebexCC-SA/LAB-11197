{{ config.cProps.devNotice }}
{{ config.cProps.acronyms }}

# Accessing the xAPI via the Macro Editor** ~(section\ {{config.cProps.rxp.sectionIds.macro}})~

!!! abstract

    The Macro Editor is a `Web Based IDE` that's built into each Cisco Codec running {++ce9.2.X or higher (excluding the Sx10)++} that allows for the development of solutions using the ==Device xAPI and ES6 Javascript==. In a sense, the Macro Editor is like a virtual room control processor built right into the product.

    It's capable of running {++10 active macros++} at any given time and allows for storage of up to ==2mb of text across all files== (Sounds small, but it's more than you think :smiley:).

    You may have as many inactive macros as you can contain with the 2mb limit, which can be useful for storing information, organizing and modularizing work.

    -  For example, some developers in the community have implemented function libraries formatted as a macro, such as 
        - <a href="https://github.com/cisco-ce/guido">Gui-Do</a>: A suite of functions that enables dynamic UI generation with the use of JSON Object
        - <a href="https://github.com/ctg-tme/audio-zone-manager-library-macro/tree/main">Audio Zone Manager</a>: Or AZM is a suite of function that enables the mapping of audio microphones inputs to other resources for audio based automation in space.
    
!!! important

    !!! example "Note"

        This section is meant to teach your the structure of the xAPI when working the Macro Editor. 
        
        Though written in Javascript, this is not a javascript tutorial. There are links to relevant topics throughout the section in case you're stuck on any particular topic

    {++Part 3: Building a Customization using Macros++} will leverage the Macro Editor and the UI Extensions of your codec to develop a solution using the xAPI

    Syntax covered here is also relevant to the JSXAPI Node.js SDK, which is covered in JSXAPI ^{{ config.cProps.rxp.sectionIds.jsxapi }}^.

!!! important "Section Requirements"

    Download the MacroPak below, these Macros will be used throughout this section

    <div class="grid cards" markdown>

    -   <i class="fa-solid fa-download"></i> __Click the icon below to Download the MacroPak__ <i class="fa-solid fa-file-code"></i>

        ---

        <figure markdown="span">
              [![MacroPak](./images/cisco-logo-transparent.png){ width="200" }](https://github.com/WebexCC-SA/LAB-1451/raw/refs/heads/main/docs/Main-Lab/DownloadContent/MacroPak.zip)
            <figcaption>MacroPak</figcaption>
        </figure>
    </div>


## **Enabling Macros** ~({{config.cProps.rxp.sectionIds.macro}}.1)~

!!! blank ""

    - Login to your Codec's Web UI
    - Navigate to Settings>Macro Editor
        - The Macro Editor is disabled by Default, press enable

    ???+ tip
        Enabling through the WebUI as we had above can be don via the xAPI as well.
        
        Running ==xConfiguration Macros Mode: On== does the same thing.

        You can even run xConfigurations in bulk across your portfolio using Webex Control Hub or Ce-Deploy, both are covered in, regards to Macro Customization, part 4 of this lab.

## **Navigating the Macro Editor and installing the MacroPak** ~({{config.cProps.rxp.sectionIds.macro}}.2)~

??? vidcast "Vidcast: Macro Editor IDE Review"

    <div style="padding-bottom:56.25%; position:relative; display:block; width: 100%">
      <iframe src="https://app.vidcast.io/share/embed/d6dacbb3-9792-4d27-b1fa-434f2ff37f03" width="100%" height="100%" title="Macro Editor IDE Review" frameborder="0" loading="lazy" allowfullscreen style="position:absolute; top:0; left: 0;border: solid; border-radius:12px;"></iframe>
    </div>

??? vidcast "Vidcast: Installing the MacroPack"

    <div style="padding-bottom:56.25%; position:relative; display:block; width: 100%">
      <iframe src="https://app.vidcast.io/share/embed/f31a92e0-609d-430c-bb45-d834c52cb1d3" width="100%" height="100%" title="Installing MacroPak Files - WX1 2024 Lab 1451" frameborder="0" loading="lazy" allowfullscreen style="position:absolute; top:0; left: 0;border: solid; border-radius:12px;"></iframe>
    </div>

## **Executing xCommands** ~({{config.cProps.rxp.sectionIds.macro}}.3)~

???+ lesson "Lesson: Execute an xCommand ~({{config.cProps.rxp.sectionIds.macro}}.3.1)~"

    All device xAPIs are referenced by the imported `xapi` object. By default, a new Macro will contain

    ``` { .javascript , title="xAPI Import" }
    import xapi from 'xapi';
    ```

    <a class="md-button md-button--primary" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import" target="_blank" >
          Learn more about <strong>Imports</strong> <i class="fa-solid fa-square-up-right"></i>
    </a>

    Unlike other ES6 Javascript environments, you only have access to base Javascript functions and techniques as well as the device's xAPI

    - You're **==NOT==** able to import external libraries into this environment.

    All xAPI can be accessed by first referencing the `xapi` object following by the same command path using dot notation

    !!! example "Click on the tabs to see how Terminal Syntax relates to Macro Syntax"

        === "Terminal Syntax"

            ``` shell
            xCommand Time DateTime Get

            OK
            *r DateTimeGetResult (status=OK): 
            *r DateTimeGetResult Day: 24
            *r DateTimeGetResult Hour: 0
            *r DateTimeGetResult Minute: 47
            *r DateTimeGetResult Month: 9
            *r DateTimeGetResult Second: 1
            *r DateTimeGetResult Year: 2024
            ** end
            ```

        === "Macro Syntax"

            ``` javascript
            import xapi from 'xapi';

            xapi.Command.Time.DateTime.Get().then(time => console.log(time))

            /* Log Output
            {
              "Day": "24",
              "Hour": "0",
              "Minute": "47",
              "Month": "9",
              "Second": "44",
              "Year": "2024",
              "status": "OK"
            }
            */
            ```

            ??? curious ":thinking: Why is `.then(time => console.log(time))` trailing the command?"

                Well that's the nature of this environment. In a terminal session, the command is immediately followed by a response

                But in working with the xAPI in a Macro or `jsxapi` NodeJs environment, the response is certainly there, but we need to capture in an object and then log it to the console.

                Most, if not all, functions from the `xapi` object are Javascript Promises. When executed, they'll either resolve or reject (OK or Error) and you can handle them as you see fit in your automation.

                <a class="md-button md-button--primary" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank" >
                      Learn more about <strong>Promises</strong> <i class="fa-solid fa-square-up-right"></i>
                </a>

                ??? tool "To get a bit more technical"

                    In the Example above, we first call the `xCommand Time DateTime Get` command. JS Promises can leverage the `.then()` method, which allows us to take that value of a successful outcome and store it into another object, in this case `time`, and when `time` is populated with a value, we can immediately run a function `=>` of this value to run additional processes. Here, we pass it into the in-built JS function; `console.log`, to log it into the Macro's log output.

                    If your function is rejected, then the `.catch()` method  can handle those outcomes in the same way `.then()` works on resolutions.

    !!! Tip

        Parameters for Macro Syntax are setup as a JSON Object and must be passed into a function as a parameter

        <a class="md-button md-button--primary" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON" target="_blank" >
          Learn more about <strong>JSON</strong> <i class="fa-solid fa-square-up-right"></i>
        </a>

        At a high level, functions defined in the `xapi` can have 1 or 2 function parameters pass. One being the parameters for the xAPI call writing in a JSON Object [Represented by `myChildParams` below], the other for multiline content (if available) [Represented by `myMultiLineContent` below]

        It's important to note that not all `xapi` functions have multiline input, but it's good to know where it's placed should there be any

        === "Parameter Example"

            ``` { .js }
            import xapi from 'xapi';

            const myChildParams = { Parameter: 'One', Parameter: 2, Parameter: '...' };
            const myMultiLineContent= `...`;

            xapi.Parent.Child(myChildParams, myMultiLineContent);
            ```

            <a class="md-button md-button--primary" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions" target="_blank" >
                  Learn more about <strong>Functions</strong> <i class="fa-solid fa-square-up-right"></i>
            </a>

    - **xAPI:** xCommand Video Selfview Set

    - **Task:** 
        - Activate the ==xCommands_Lesson-1_MacroPak_2-6-3== macro
        - Structure the xAPI Path above using Macro Syntax and apply the following parameters
            - Mode: On
            - FullScreenMode: On
            - OnMonitorRole: First
    
    - Save your Macro and monitor the Macro Console as well as the Device to see if you had a successful response

    - When Complete, deactivate the ==xCommands_Lesson-1_MacroPak_2-6-3== macro
    
    ??? success "View Successful Macro Syntax"

        === "Simple Execution"

            ``` javascript

            import xapi from 'xapi';

            xapi.Config.Video.Selfview.Set({ Mode: "On", FullScreenMode: "On", OnMonitorRole: "Off" });

            ```
          
        === "Promises > `.then()` Method"

            ``` javascript

            import xapi from 'xapi';

            xapi.Config.Video.Selfview.Set({ Mode: "On", FullScreenMode: "On", OnMonitorRole: "Off" }).then(resolution => {

              // Log the xAPI resolution
              console.log('Config.Video.Selfview.Set Resolution', resolution);

              /* Run Additional Function Here*/

            }).catch(error => {

              // Log the xAPI rejection
              console.error('Config.Video.Selfview.Set Error', error);

              /* Run Additional Function Here*/

            });
            ```

            <a class="md-button md-button--primary" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank" >
                  Learn more about <strong>Promises</strong> <i class="fa-solid fa-square-up-right"></i>
            </a>
        
        === "Promises > Async Await"

            ``` javascript
            import xapi from 'xapi';

            const setSelfview = async function(parameters => {
              try {
                const runxAPI = await xapi.Config.Video.Selfview.Set(parameters);

                // Log the Resolution captured in a runxAPI object
                console.log(runxAPI);

                /* Run Additional Function Here*/

              } catch (error) (

                // Log the Rejection captured in a error object
                console.error(error);

                /* Run Additional Function Here*/

              );
            });

            // Run the setSelfview Function and pass in the Parameters for xCommand Video Selfview Set
            setSelfview({ Mode: "On", FullScreenMode: "On", OnMonitorRole: "Off" });
            ```

            <a class="md-button md-button--primary" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function" target="_blank" >
                  Learn more about <strong>Async Functions</strong> <i class="fa-solid fa-square-up-right"></i>
            </a>


??? lesson "Lesson: Execute an xCommand with multiple arguments with the same name ~({{config.cProps.rxp.sectionIds.macro}}.3.2)~"

    In cases where we need to declare multiple arguments of the same name, rather than duplicating and re-running the parameters, we instead leverage Javascript's Array capabilities

    <a class="md-button md-button--primary" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" target="_blank" >
      Learn more about <strong>Arrays</strong> <i class="fa-solid fa-square-up-right"></i>
    </a>

    !!! example "Click on the tabs to see how Terminal Syntax relates to Macro Syntax"

        === "Terminal Syntax"

            ``` { .shell }
            xParent Child ChildParam_X: 1, ChildParam_X: 2
            ```
            <br>

        === "Macro Syntax"

            ``` { .javascript }
            import xapi from 'xapi';

            xapi.Parent.Child({
              ChildChildParam_X: [1, 2] // Rather than calling ChildParam_X twice, we'll simply place both values we need into an Array
            })
            ```
    
    - **xAPI(s):** 
        - xCommand Video Selfview Set
        - xCommand Video Input SetMainVideoSource

    - **Task:** 

        - Activate the ==xCommands_Lesson-2_MacroPak_2-6-3== macro
        - Structure ==xCommand Video Input SetMainVideoSource== using Macro Syntax and apply the following parameters, but assign the value `1` to ConnectorId twice
          - ConnectorId: 1
          - Layout: Equal
        - Add this xCommand to the ==showAndCompose()== function
        - Save your Macro and monitor the Macro Console as well as the Device to see if you had a successful response

        - When Complete, deactivate the ==xCommands_Lesson-2_MacroPak_2-6-3== macro

    ??? success "View Successful Macro Syntax"

        ``` javascript
        import xapi from 'xapi';

        /**
         * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#263-executing-xcommands
         * 
         * Lesson 2: Execute an xCommand with multiple arguments with the same name
         */

        const showAndComposeCamera = function () {
          xapi.Command.Video.Selfview.Set({ Mode: 'On', FullscreenMode: 'On', OnMonitorRole: 'First' });

          // Enter your solution below this line
          xapi.Command.Video.Input.SetMainVideoSource({
            ConnectorId: [1, 1],
            Layout: 'Equal'
          })
          // Don't go past this line
        }

        showAndComposeCamera();
        ```

    <!-- ??? challenge "Challenge: Log and Handle Errors"

        - Convert the `showAndComposeCamera()` function into an Async Function
        - Wrap all xAPI references in a Try Catch block
        - Add a console log for a Successful outcome
        - Add a console log for an Error

        - Save the Macro and observe the log

        <a class="md-button md-button--primary" href="../challengeAnswers/" target="_blank" >
          Giving Up? Check out the Challenge Answers Page <i class="fa-solid fa-square-up-right"></i>
        </a> -->

??? lesson "Lesson: Execute an xCommand with a multiline argument ~({{config.cProps.rxp.sectionIds.macro}}.3.3)~"

    !!! example "Click on the tabs to see how Terminal Syntax relates to Macro Syntax"

        === "Terminal Syntax"

            ``` {.shell, .no-copy}
            [Command Path]
            [Multi Line Content]
            .
            ```
            <br>

        === "Macro Syntax"

            ``` { .javascript }
            import xapi from 'xapi';

            const myChildParams = { Parameter: 'One', Parameter: 2, Parameter: '...' };
            const myMultiLineContent= `...`;

            xapi.Parent.Child(myChildParams, myMultiLineContent);
            ```
    
    - **xAPI(s):** 
        - xCommand Video Selfview Set
        - xCommand Video Input SetMainVideoSource
        - xCommand UserInterface Extensions Panel Save

    - **Task:** 

        - Activate the ==xCommands_Lesson-3_MacroPak_2-6-3== macro
        - Assign the value `wx1_lab_multilineCommand` to the ==myPanelId== object
        - Assign the following XML payload to the ==myUserinterface== object
            ```xml
            <Extensions>
              <Panel>
                <Order>1</Order>
                <PanelId>wx1_lab_multilineCommand</PanelId>
                <Location>HomeScreen</Location>
                <Icon>Info</Icon>
                <Color>#00FFFF</Color>
                <Name>MultiLine Command [2.6.3]</Name>
                <ActivityType>Custom</ActivityType>
              </Panel>
            </Extensions>
            ```
        - Structure ==xCommand UserInterface Extensions Panel Save== using Macro Syntax and apply the following parameters
            - PanelId [Use the ==myPanelId== object for this field]
            - body [Use the ==myUserinterfaceXML== object for this field] (This is a MultiLine Argument)
        - Add this xCommand to the ==buildUserInterface()== function
        - Save your Macro and monitor the Macro Console as well as the Device to see if you had a successful response

        - When Complete, deactivate the ==xCommands_Lesson-3_MacroPak_2-6-3== macro

    ??? success "View Successful Macro Syntax and Log output"

        ``` javascript
        import xapi from 'xapi';

        /**
         * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#263-executing-xcommands
         * 
         * Lesson 3: Execute an xCommand with a multiline argument
         */

        // Assign values to these Objects
        const myPanelId = 'wx1_lab_multilineCommand';

        const myUserinterfaceXML = `<Extensions>
              <Panel>
                <Order>1</Order>
                <PanelId>wx1_lab_multilineCommand</PanelId>
                <Location>HomeScreen</Location>
                <Icon>Info</Icon>
                <Color>#00FFFF</Color>
                <Name>MultiLine Command [2.6.3]</Name>
                <ActivityType>Custom</ActivityType>
              </Panel>
            </Extensions>`


        const buildUserInterface = async function (){
          try {
            // Enter your solution below this line

            const saveUI = await xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: myPanelId }, myUserinterfaceXML)

            // Don't go past this line
            console.log(`Panel [${myPanelId}] saved to the codec`)
          } catch (e){
            console.error(e)
          }
        }


        async function cleanupLesson2(){
          await xapi.Command.Video.Selfview.Set({Mode: 'Off'});
          await xapi.Command.Video.Input.SetMainVideoSource({ConnectorId: 1, Layout: 'Equal'});
        }

        async function init(){
          await cleanupLesson2()

          await buildUserInterface();
        }

        init();
        ```

    ??? curious ":thinking: Having issues with saving Strings to Objects in your macro?"

        There are 3 ways to define string literals

        <div>
            <table>
              <thead>
                  <tr>
                      <th>Key</th>
                      <th>Name</th>
                      <th>Example</th>
                      <th>Extra Properties</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>`'`</td>
                      <td style="white-space: nowrap;">Single Quote</td>
                      <td style="white-space: nowrap;"><code>const myString = "It's a sunny day."</code></td>
                      <td>Can encapsulate a string with single quotes `'` inside</td>
                  </tr>
                  <tr>
                      <td>`"`</td>
                      <td style="white-space: nowrap;">Double Quote</td>
                      <td style="white-space: nowrap;"><code>const myOtherString = 'They said, "Hello!"';</code></td>
                      <td>Can encapsulate a string with double quotes `"` inside</td>
                  </tr>
                  <tr>
                      <td>`` ` ``</td>
                      <td style="white-space: nowrap;">Backtick Quote</td>
                      <td style="white-space: nowrap;"><code>const myFinalString = `They didn't say "World"`</code></td>
                      <td>Can encapsulate double and single quotes, allows for multiline strings, allows for string interpolation</td>
                  </tr>
              </tbody>
          </table>
        </div>

        <a class="md-button md-button--primary" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String" target="_blank" >
          Learn more about <strong>Strings</strong> <i class="fa-solid fa-square-up-right"></i>
        </a>

??? lesson "Lesson: Execute an xCommand which generates data and responds ~({{config.cProps.rxp.sectionIds.macro}}.3.4)~"

    When collecting data from an xCommand in the Macro Editor, you either need to use the `.then()` method and log that value to the console or use an Async function to capture the value of that xCommand into a object, then log that object

    - **xAPI:** xCommand UserInterface Extensions List

    - **Task:**
        - Activate the ==xCommands_Lesson-4_MacroPak_2-6-3== macro
        - Structure ==xCommand UserInterface Extensions List== using Macro Syntax and do 1 of the following

            - Use `.then()` to capture the value of ==xCommand UserInterface Extensions List== then log that value to the console

                <strong>Or<strong>

            - declare an async function called `checkExtensions`, place ==xCommand UserInterface Extensions List== written in Macro Syntax
                - Wrap that in a Try Catch statement
                - Assign the value of the xAPI to an object
                - Then log the value of that object to the console

        - Save your Macro and monitor the Macro Console as well as the Device to see if you had a successful response

        - When Complete, deactivate the ==xCommands_Lesson-4_MacroPak_2-6-3== macro

    <div style="display: flex; gap: 10px;">
        <a class="md-button md-button--primary" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank">
            Learn more about <strong>Promises</strong> <i class="fa-solid fa-square-up-right"></i>
        </a>
        <a class="md-button md-button--primary" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function" target="_blank">
            Learn more about <strong>Async Functions</strong> <i class="fa-solid fa-square-up-right"></i>
        </a>
    </div>
    
    ??? success "View Successful Macro Syntax and Log output"

        === "Using `.then()`"

            ```javascript
            import xapi from 'xapi';

            /**
             * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#263-executing-xcommands
             * 
             * Lesson 4: Execute an xCommand which generates data and responds
             */

            xapi.Command.UserInterface.Extensions.List().then(ext => {
              console.log(ext);
            }).catch(error => {
              console.error(error);
            });
            ```

        === "Using `Async Await`"

            ```javascript
            import xapi from 'xapi';

            /**
             * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#263-executing-xcommands
             * 
             * Lesson 4: Execute an xCommand which generates data and responds
             */
            
            const checkExtensions = async function () {

              try {
                const getExtensions = await xapi.Command.UserInterface.Extensions.List();
                console.log(getExtensions);
              } catch (error) {
                console.error(error);
              };
            };

            checkExtensions();
            ```

    

## **Setting, Getting and Subscribing to xConfigurations** ~({{config.cProps.rxp.sectionIds.macro}}.4)~

!!! Abstract

    Getting xConfiguration values, and later on xStatus Values, use the nearly same techniques for xCommands that generate data and respond.

    However, when ==Getting== an xConfiguration or an xStatus, you'll need to add the `.get()` method at the end of the xAPI call.

    Subsequently, when ==Setting== an xConfiguration, you'll need to add the `.set()` method at the end of the xAPI call.

    !!! example "Compare Macro Command vs Config syntax"

        === "xCommands"

            xapi.==Command==.ChildPath ==(childParameter, childMultiLine)==

        === "xConfigurations Get"

            xapi.==Config==.ChildPath ==.get()==

        === "xConfigurations Set"

            xapi.==Config==.ChildPath ==.get({++'ChildValue'++})==

    !!! important ""

        We'll continue the remainder of the examples with only Async Await syntax, as a best practice, but if you're familiar with `.then()`, `.catch()` and `.finally()` syntax and prefer writing like that, feel free to do so

???+ lesson "Lesson: Get an xConfiguration Value ~({{config.cProps.rxp.sectionIds.macro}}.4.1)~"

    - **xAPI:** xConfig Audio DefaultVolume

    - **Task:**
        - Activate the ==xConfigs_Lesson-1_MacroPak_2-6-4== macro
        - Modify the `getConfigValue()` function by replacing the existing value of `targetConfig` with ==xConfig Audio DefaultVolume== written in Macro Syntax
        - Save your Macro and monitor the Macro Console as well as the Device to see if you had a successful response

        - When Complete, deactivate the ==xConfigs_Lesson-1_MacroPak_2-6-4== macro


    ??? "View Successful Macro Syntax and Log output"

        === "Macro"

            ``` javascript
            import xapi from 'xapi';

            /**
             * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#264-setting-getting-and-subscribing-to-xconfigurations
             * 
             * Lesson 1: Getting an xConfiguration Value
             */

            // Enter your solution below this line


            const getConfigValue = async function () {
              try {
                // Modify targetConfig below

                const targetConfig = await xapi.Config.Audio.DefaultVolume.get();

                // Don't go past this line
                console.log('DefaultVolume:', targetConfig)
              } catch (e) {
                console.error(e);
              };
            };

            getConfigValue();
            ```

        === "Log Output"

            | Timestamp | Source                                | Message                   |
            |-----------|---------------------------------------|---------------------------|
            | HH:MM:SS  | [system]                             | Runtime stopped!          |
            | HH:MM:SS  | [system]                             | Using XAPI transport: WebSocket |
            | HH:MM:SS  | [system]                             | Starting macros...        |
            | HH:MM:SS  | xConfigs_Lesson-1_MacroPak_2-6-4   | QJS Ready                 |
            | HH:MM:SS  | xConfigs_Lesson-1_MacroPak_2-6-4   | DefaultVolume: 75         |

??? lesson "Lesson: Set a new xConfiguration Value ~({{config.cProps.rxp.sectionIds.macro}}.4.2)~"

    - **xAPI:** xConfig Audio DefaultVolume

    - **Task:**
        - Activate the ==xConfigs_Lesson-2_MacroPak_2-6-4== macro
        - Modify the `setConfigValue()` function by replacing the existing value of `targetConfig` with ==xConfig Audio DefaultVolume== written in Macro Syntax
        - Instead of hardcoding the value we want to set, place the `value` parameter into the `.set(value)` method instead
            - This will allow us to change this value easier as we call the function in different parts of our script
        - Save your Macro and monitor the Macro Console as well as the Device to see if you had a successful response

        - When Complete, deactivate the ==xConfigs_Lesson-2_MacroPak_2-6-4== macro


    ??? "View Successful Macro Syntax and Log output"

        === "Macro"

            ``` javascript
            import xapi from 'xapi';

            /**
             * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#264-setting-getting-and-subscribing-to-xconfigurations
             * 
             * Lesson 2: Set a new xConfiguration Value
             */

            // Enter your solution below this line


            const setConfigValue = async function (value = 50) {
              try {
                // Modify targetConfig below

                const targetConfig = await xapi.Config.Audio.DefaultVolume.set(value);

                // Don't go past this line
                console.debug('DefaultVolume Set');
              } catch (e) {
                console.error(e);
              };
            };


            const getConfigValue = async function () {
              try {
                const targetConfig = await xapi.Config.Audio.DefaultVolume.get();
                console.log('DefaultVolume:', targetConfig);
              } catch (e) {
                console.error(e);
              };
            };

            async function init(){
              
              await setConfigValue(100); // <-- Change this Value [0-100] and Resave

              await getConfigValue();
            }

            init();
            ```

        === "Log Output"

            | Timestamp | Source                                | Message                   |
            |-----------|---------------------------------------|---------------------------|
            | HH:MM:SS  | [system]                             | Runtime stopped!          |
            | HH:MM:SS  | [system]                             | Using XAPI transport: WebSocket |
            | HH:MM:SS  | [system]                             | Starting macros...        |
            | HH:MM:SS  | xConfigs_Lesson-2_MacroPak_2-6-4   | QJS Ready                 |
            | HH:MM:SS  | xConfigs_Lesson-2_MacroPak_2-6-4   | DefaultVolume: [Some Value]         |

??? lesson "Lesson: Get multiple xConfigurations under a Common Node ~({{config.cProps.rxp.sectionIds.macro}}.4.3)~"

    - **xAPI:** xConfig Audio

    - **Task:**
        - Activate the ==xConfigs_Lesson-3_MacroPak_2-6-4== macro
        - Modify the `getConfigValue()` function by replacing the existing value of `targetConfig` with ==xConfig Audio== written in Macro Syntax
        - Save your Macro and monitor the Macro Console as well as the Device to see if you had a successful response

        - When Complete, deactivate the ==xConfigs_Lesson-3_MacroPak_2-6-4== macro


    ??? "View Successful Macro Syntax and Log output"

        === "Macro"

            ``` javascript
            import xapi from 'xapi';

            /**
             * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#264-setting-getting-and-subscribing-to-xconfigurations
             * 
             * Lesson 1: Getting an xConfiguration Value
             */

            // Enter your solution below this line

            const getConfigValue = async function () {
              try {
                // Modify targetConfig below

                const targetConfig = await xapi.Config.Audio.get();

                // Don't go past this line
                console.log('DefaultVolume:', targetConfig)
              } catch (e) {
                console.error(e);
              };
            };

            getConfigValue();
            ```

        === "Log Output"

            | Timestamp | Source                                | Message                   |
            |-----------|---------------------------------------|---------------------------|
            | HH:MM:SS  | [system]                             | Runtime stopped!          |
            | HH:MM:SS  | [system]                             | Using XAPI transport: WebSocket |
            | HH:MM:SS  | [system]                             | Starting macros...        |
            | HH:MM:SS  | xConfigs_Lesson-3_MacroPak_2-6-4   | QJS Ready                 |
            | HH:MM:SS  | xConfigs_Lesson-3_MacroPak_2-6-4   | `{"DefaultVolume":"100","Ethernet":{"Encryption":"Required","SAPDiscovery":{"Address":"239.255.255.255","Mode":"Off"}},"Input":{"Ethernet":[{"Channel":[{"Gain":"45","Mode":"On","Pan":"Mono","Zone":"1","id":"1"},{"Gain":"45","Mode":"On","Pan":"Mono","Zone":"1","id":"2"},{"Gain":"45","Mode":"On","Pan":"Mono","Zone":"1","id":"3"},{"Gain":"45","Mode":"On","Pan":"Mono","Zone":"1","id":"4"},{"Gain":"45","Mode":"On","Pan":"Mono","Zone":"1","id":"5"},{"Gain":"45","Mode":"On","Pan":"Mono","Zone":"1","id":"6"},{"... And the list goes on"}],"EchoControl":{"Mode":"On","NoiseReduction":"On"},"Equalizer":{"ID":"1","Mode":"Off"},"Mode":"On","id":"1"}]}}{..."And the List Goes On"}`         |

??? lesson "Lesson: Subscribe and Unsubscribe to an xConfiguration ~({{config.cProps.rxp.sectionIds.macro}}.4.4)~"

    !!! info

        Subscriptions in the Macro Editor introduce another method we can append to the end of the path called `.on()`

        `.on()` allows us to subscribe to any changes in xConfigurations, xStatuses and xEvents until the script has either stopped or until the xAPI path is unsubscribed too

        `.on()` expect an object, similar to using `.then()` for you to place the incoming data and run function off of it

        !!! example "Click on the tabs to see how Terminal Syntax relates to Macro Syntax"

            === "Terminal Syntax"

                ``` shell
                xFeedback Register Configuration/Child/Child
                ** end

                OK
                *c xConfiguration Child Child Value: 85
                ** end
                *c xConfiguration Child Child Value: 44
                ** end
                *c xConfiguration Child Child Value: 36
                ** end
                ```

            === "Macro Syntax"

                ``` javascript
                import xapi from 'xapi';

                xapi.Configuration.Child.Child.on(ChildValue => {
                  console.log('New ChildValue:', ChildValue);
                });

                /* Log Output
                New ChildValue: 85
                New ChildValue: 44
                New ChildValue: 36
                */
                ```

    
    - **xAPI:** xConfiguration Audio DefaultVolume

    - **Task**:
        - Activate the ==xConfigs_Lesson-4_MacroPak_2-6-4== macro
        - Modify the `subscribeToDefaultVolume` object by replacing it's value with ==xConfig Audio== written in Macro Syntax using the `.on()` method
            - In order to unsubscribe, we need to assign our xAPI subscription to an object, so we can later call it, which will end it's subscription
            - For example, after you assign the ==subscribeToDefaultVolume== properly, running ==subscribeToDefaultVolume=={++()++} will stop your active subscription
        - Save your Macro and monitor the Macro Console as well as the Device to see if you had a successful response
            - NOTE: This macro will automatically unsubscribe for you. Review those steps, to get a better understand as to how we unsubscribe.

        - When Complete, deactivate the ==xConfigs_Lesson-4_MacroPak_2-6-4== macro

    ??? success "View Successful Macro Syntax and Log output"

        === "Macro"

            ``` javascript
            import xapi from 'xapi';

            /**
             * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#264-setting-getting-and-subscribing-to-xconfigurations
             * 
             * Lesson 4: Subscribe and Unsubscribe to an xConfiguration
            */

            const delay_in_seconds = 10;

            // Edit this Object to include your xConfiguration Subscription
            const subscribeToDefaultVolume = xapi.Config.Audio.DefaultVolume.on(event => {
              console.log('DefaultVolume Set to:', event)
            })

            // Do not edit past this line, but feel free to review what's going on :)

            // Here, we use JS Timeouts to set an action to run after X seconds. Timeouts use milliseconds, hence why we multiply by 1000
            setTimeout(() => {

              subscribeToDefaultVolume(); //<-- By calling the Object we assigned our Subscription too as a function(), we will unsubscribe from it

              console.warn("DefaultVolume Subscription stopped!");

            }, delay_in_seconds * 1000)


            // Here, we're randomly assigning a value between 1 and 100 to the Default Volume, so we can see that configuration on our Subscription
            function setRandomDefaultVolume() {
              const randomValue = Math.floor(Math.random() * 100) + 1;

              xapi.Config.Audio.DefaultVolume.set(randomValue);
            }


            // This countdown is used to help you visualize when the process will complete it's course
            // We use console.warn to have this countdown print in another color in the Macro Console
            function countdown(startNumber) {
              let currentNumber = startNumber;

              console.warn(`DefaultVolume Subscription stopping in [${currentNumber}] seconds`);

              const interval = setInterval(() => {
                currentNumber--;
                if (currentNumber > 0) {
                  console.warn(`DefaultVolume Subscription stopping in [${currentNumber}] seconds`);
                }

                if (currentNumber < 1) {
                  clearInterval(interval);
                }
              }, 1000);
            }

            function init() {
              setInterval(() => {
                setRandomDefaultVolume();
              }, 500)

              countdown(delay_in_seconds);
            }

            init();
            ```

        === "Log Output"

            | Time       | Source                          | Message                                         |
            |------------|---------------------------------|-------------------------------------------------|
            | HH:MM:SS   | [system]                       | Runtime stopped!                               |
            | HH:MM:SS   | [system]                       | Using XAPI transport: WebSocket                |
            | HH:MM:SS   | [system]                       | Starting macros...                             |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Subscription stopping in [5] seconds |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | QJS Ready                                      |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Set to: 70                       |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Subscription stopping in [4] seconds |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Set to: 48                       |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Set to: 13                       |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Subscription stopping in [3] seconds |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Set to: 92                       |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Set to: 52                       |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Subscription stopping in [2] seconds |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Set to: 46                       |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Set to: 69                       |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Subscription stopping in [1] seconds |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Set to: 21                       |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Set to: 57                       |
            | HH:MM:SS   | xConfigs_Lesson-4_MacroPak_2-6-4 | DefaultVolume Subscription stopped!             |

??? lesson "Lesson: Subscribe and Unsubscribe to Multiple xConfigurations under a Common Node ~({{config.cProps.rxp.sectionIds.macro}}.4.5)~"

    !!! info

        Just like we can subscribe to 1 point of interest in an xConfig branch, we can subscribe to a Higher Common Node as well

        We'll do so for the Airplay Config section of you codec
    
    - **xAPI:** xConfiguration Video Input Airplay

    - **Task**:
        - Activate the ==xConfigs_Lesson-5_MacroPak_2-6-4== macro
        - Modify the `subscribeToAirplay` object by replacing it's value with ==xConfiguration Video Input Airplay== written in Macro Syntax using the `.on()` method
            - In order to unsubscribe, we need to assign our xAPI subscription to an object, so we can later call it, which will end it's subscription
            - For example, after you assign the ==subscribeToAirplay== properly, running ==subscribeToAirplay=={++()++} will stop your active subscription
        - Save your Macro and monitor the Macro Console as well as the Device to see if you had a successful response
            - NOTE: This macro will automatically unsubscribe for you. Review those steps, to get a better understand as to how we unsubscribe.

        - When Complete, deactivate the ==xConfigs_Lesson-5_MacroPak_2-6-4== macro

    ??? success "View Successful Macro Syntax and Log output"

        === "Macro"

            ``` javascript
            import xapi from 'xapi';

            /**
             * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#264-setting-getting-and-subscribing-to-xconfigurations
             * 
             * Lesson 5: Subscribe and Unsubscribe to Multiple xConfigurations under a Common Node
             */

            const delay_in_seconds = 5;

            // Edit this Object to include your xConfiguration Subscription
            const subscribeToAirplay = xapi.Config.Video.Input.Airplay.on(event => {
              console.log('Airplay Changes:', event)
            })

            // Do not edit past this line, but feel free to review what's going on :)

            // Here, we use JS Timeouts to set an action to run after X seconds. Timeouts use milliseconds, hence why we multiply by 1000
            setTimeout(() => {

              subscribeToAirplay(); //<-- By calling the Object we assigned our Subscription too as a function(), we will unsubscribe from it

              console.warn("Airplay Subscription stopped!");

            }, delay_in_seconds * 1000)


            // Here, we're randomly assigning a values to the Airplay config, so we can see that configuration on our Subscription
            function setRandomAirplayConfigs() {

              function randomNumber() {
                return Math.floor(Math.random() * 10);
              }

              const randomPass = `${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}`

              xapi.Config.Video.Input.AirPlay.Mode.set(Math.random() < 0.5 ? "On" : "Off");

              xapi.Config.Video.Input.AirPlay.Beacon.set(Math.random() < 0.5 ? "Auto" : "Off");

              xapi.Config.Video.Input.AirPlay.Password.set(randomPass);
            }


            // This countdown is used to help you visualize when the process will complete it's course
            // We use console.warn to have this countdown print in another color in the Macro Console
            function countdown(startNumber) {
              let currentNumber = startNumber;

              console.warn(`Airplay Subscription stopping in [${currentNumber}] seconds`);

              const interval = setInterval(() => {
                currentNumber--;
                if (currentNumber > 0) {
                  console.warn(`Airplay Subscription stopping in [${currentNumber}] seconds`);
                }

                if (currentNumber < 1) {
                  clearInterval(interval);
                }
              }, 1000);
            }

            function init() {
              setInterval(() => {
                setRandomAirplayConfigs();
              }, 500)

              countdown(delay_in_seconds);
            }

            init();
            ```

        === "Log Output"

            | Time       | Source                          | Message                                         |
            |------------|---------------------------------|-------------------------------------------------|
            | HH:MM:SS   | [system]                       | Runtime stopped!                               |
            | HH:MM:SS   | [system]                       | Using XAPI transport: WebSocket                |
            | HH:MM:SS   | [system]                       | Starting macros...                             |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Subscription stopping in [5] seconds   |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | QJS Ready                                      |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Mode":"On"}                 |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Beacon":"Off"}              |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Password":"***"}            |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Subscription stopping in [4] seconds    |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Mode":"Off"}                |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Password":"***"}            |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Mode":"On"}                 |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Password":"***"}            |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Subscription stopping in [3] seconds    |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Beacon":"Auto"}             |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Password":"***"}            |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Password":"***"}            |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Subscription stopping in [2] seconds    |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Mode":"Off"}                |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Beacon":"Off"}              |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Password":"***"}            |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Beacon":"Auto"}             |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Password":"***"}            |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Subscription stopping in [1] seconds    |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Mode":"On"}                 |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Password":"***"}            |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Mode":"Off"}                |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Changes: \{"Password":"***"}            |
            | HH:MM:SS   | xConfigs_Lesson-5_MacroPak_2-6-4 | Airplay Subscription stopped!                   |

<!-- ??? challenge "Challenge: Can you spot the Error?"

    In both the `xConfigs_Lesson-4_MacroPak_2-6-4` and `xConfigs_Lesson-5_MacroPak_2-6-4` macros, there is an error

    It's not an error in the syntax or format, but an error in the automation

    What do these macros continue to do if they are left active on a Codec that could be problematic?

    <a class="md-button md-button--primary" href="../challengeAnswers/" target="_blank" >
          Giving Up? Check out the Challenge Answers Page <i class="fa-solid fa-square-up-right"></i>
    </a> -->

## **Getting and Subscribing to xStatuses** ~({{config.cProps.rxp.sectionIds.macro}}.5)~

???+ lesson "Lesson: Get an xStatus Value ~({{config.cProps.rxp.sectionIds.macro}}.5.1)~"

    - **xAPI:** xStatus Audio Volume

    - **Task:**
        - Activate the ==xStatuses_Lesson-1_MacroPak_2-6-4== macro
        - Modify the `getStatusValue()` function by replacing the existing value of `targetStatus` with ==xStatus Audio Volume== written in Macro Syntax
        - Save your Macro and monitor the Macro Console as well as the Device to see if you had a successful response

        - When Complete, deactivate the ==xStatuses_Lesson-1_MacroPak_2-6-4== macro


    ??? "View Successful Macro Syntax and Log output"

        === "Macro"

            ``` javascript
            import xapi from 'xapi';

            /**
             * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#265-getting-and-subscribing-to-xstatuses
             * 
             * Lesson 1: Getting an xStatus Value
             */

            // Enter your solution below this line

            const getStatusValue = async function () {
              try {
                // Modify targetStatus below

                const targetStatus = await xapi.Status.Audio.Volume.get();

                // Don't go past this line
                console.log('Volume:', targetStatus)
              } catch (e) {
                console.error(e);
              };
            };

            getStatusValue();
            ```

        === "Log Output"

            | Timestamp | Source                                | Message                   |
            |-----------|---------------------------------------|---------------------------|
            | HH:MM:SS  | [system]                             | Runtime stopped!          |
            | HH:MM:SS  | [system]                             | Using XAPI transport: WebSocket |
            | HH:MM:SS  | [system]                             | Starting macros...        |
            | HH:MM:SS  | xStatuses_Lesson-1_MacroPak_2-6-4   | QJS Ready                 |
            | HH:MM:SS  | xStatuses_Lesson-1_MacroPak_2-6-4   | Volume: 50         |

??? lesson "Lesson: Get multiple xStatuses under a Common Node ~({{config.cProps.rxp.sectionIds.macro}}.5.2)~"

    - **xAPI:** xStatus Audio

    - **Task:**
        - Activate the ==xStatuses_Lesson-2_MacroPak_2-6-4== macro
        - Modify the `getStatusValue()` function by replacing the existing value of `targetStatus` with ==xStatus Audio== written in Macro Syntax
        - Save your Macro and monitor the Macro Console as well as the Device to see if you had a successful response

        - When Complete, deactivate the ==xStatuses_Lesson-2_MacroPak_2-6-4== macro


    ??? "View Successful Macro Syntax and Log output"

        === "Macro"

            ``` javascript
            import xapi from 'xapi';

            /**
             * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#265-getting-and-subscribing-to-xstatuses
             * 
             * Lesson 2: Getting an xStatus Value
             */

            // Enter your solution below this line

            const getStatusValue = async function () {
              try {
                // Modify targetStatus below

                const targetStatus = await xapi.Status.Audio.get();

                // Don't go past this line
                console.log(targetStatus)
              } catch (e) {
                console.error(e);
              };
            };

            getStatusValue();
            ```

        === "Log Output"

            | Timestamp | Source                                | Message                   |
            |-----------|---------------------------------------|---------------------------|
            | HH:MM:SS  | [system]                             | Runtime stopped!          |
            | HH:MM:SS  | [system]                             | Using XAPI transport: WebSocket |
            | HH:MM:SS  | [system]                             | Starting macros...        |
            | HH:MM:SS  | xStatuses_Lesson-2_MacroPak_2-6-4   | QJS Ready                 |
            | HH:MM:SS  | xStatuses_Lesson-2_MacroPak_2-6-4   | `{ "Devices": { "Bluetooth": { "ActiveProfile": "None" }, "HandsetUSB": { "ConnectionStatus": "NotConnected", "Cradle": "OnHook" }, "HeadsetUSB": { "ConnectionStatus": "NotConnected", "Description": "", "Manufacturer": "" } }, "Input": { "Connectors": { "HDMI": [ { "Mute": "On", "id": "1" } ], "Microphone": [ { "ConnectionStatus": "Connected", "id": "1" }, { "ConnectionStatus": "NotConnected", "id": "2" }, { "ConnectionStatus": "NotConnected", "id": "3" } ], "USBC": [ { "Mute": "On", "id": "1" } ] } } }{..."And the List Goes On"}`         |

??? lesson "Lesson: Subscribe and Unsubscribe to an xStatus ~({{config.cProps.rxp.sectionIds.macro}}.5.3)~"

    - **xAPI:** xStatus Audio Volume

    - **Task**:
        - Activate the ==xStatuses_Lesson-3_MacroPak_2-6-5== macro
        - Modify the `subscribeToVolume` object by replacing it's value with ==xStatus Audio Volume== written in Macro Syntax using the `.on()` method
            - In order to unsubscribe, we need to assign our xAPI subscription to an object, so we can later call it, which will end it's subscription
            - For example, after you assign the ==subscribeToVolume== properly, running ==subscribeToVolume=={++()++} will stop your active subscription
        - Save your Macro, raise and lower the volume on your Codec and monitor the Macro Console to see if you had a successful response

            - NOTE: This macro will automatically unsubscribe for you. Review those steps, to get a better understand as to how we unsubscribe.

        - When Complete, deactivate the ==xStatuses_Lesson-3_MacroPak_2-6-5== macro

    ??? success "View Successful Macro Syntax and Log output"

        === "Macro"

            ``` javascript
            import xapi from 'xapi';

            /**
             * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#265-getting-and-subscribing-to-xstatuses
             * 
             * Lesson 3: Subscribe and Unsubscribe to an xStatus
            */

            const delay_in_seconds = 10;

            // Edit this Object to include your xStatus Subscription
            const subscribeToVolume = xapi.Status.Audio.Volume.on(vol => {
              console.log('Volume:', vol)
            });

            // Do not edit past this line, but feel free to review what's going on :)

            // Here, we use JS Timeouts to set an action to run after X seconds. Timeouts use milliseconds, hence why we multiply by 1000
            setTimeout(() => {

              subscribeToVolume(); //<-- By calling the Object we assigned our Subscription too as a function(), we will unsubscribe from it

              console.warn("Volume Subscription stopped!");

            }, delay_in_seconds * 1000)


            // This countdown is used to help you visualize when the process will complete it's course
            // We use console.warn to have this countdown print in another color in the Macro Console
            function countdown(startNumber) {
              let currentNumber = startNumber;

              console.warn(`Volume Subscription stopping in [${currentNumber}] seconds`);

              const interval = setInterval(() => {
                currentNumber--;
                if (currentNumber > 0) {
                  console.warn(`Volume Subscription stopping in [${currentNumber}] seconds`);
                }

                if (currentNumber < 1) {
                  clearInterval(interval);
                }
              }, 1000);
            }

            function init() {
              countdown(delay_in_seconds);
            }

            init();
            ```

        === "Log Output"

            | Time       | Source                                   | Message                                      |
            |------------|------------------------------------------|----------------------------------------------|
            | HH:MM:SS  | [system]                                 | Using XAPI transport: WebSocket              |
            | HH:MM:SS  | [system]                                 | Starting macros...                           |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume Subscription stopping in [10] seconds |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | QJS Ready                                    |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume Subscription stopping in [9] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume Subscription stopping in [8] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume Subscription stopping in [7] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume: 80                                   |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume: 85                                   |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume Subscription stopping in [6] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume: 90                                   |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume Subscription stopping in [5] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume: 85                                   |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume Subscription stopping in [4] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume: 80                                   |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume Subscription stopping in [3] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume: 75                                   |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume: 70                                   |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume Subscription stopping in [2] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume: 65                                   |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume Subscription stopping in [1] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume: 60                                   |
            | HH:MM:SS  | xStatuses_Lesson-3_MacroPak_2-6-5      | Volume Subscription stopped!                  |


??? lesson "Lesson: Subscribe and Unsubscribe to Multiple xStatuses under a Common Node ~({{config.cProps.rxp.sectionIds.macro}}.5.4)~"

    - **xAPI:** xStatus Cameras Camera[N] Position

    - **Task**:
        - Activate the ==xStatuses_Lesson-4_MacroPak_2-6-5== macro
        - Modify the `subscribeToCameraPositions` object by replacing it's value with ==xStatus Cameras Camera[N] Position== written in Macro Syntax using the `.on()` method
            - In order to unsubscribe, we need to assign our xAPI subscription to an object, so we can later call it, which will end it's subscription
            - For example, after you assign the ==subscribeToCameraPositions== properly, running ==subscribeToCameraPositions=={++()++} will stop your active subscription
        - Save your Macro, and perform the following steps
            - Access the Codec's Control Panel on it's touch interface
            - Select Cameras
            - Select Manual
            - Then use the Control Wheel, Zoom In (+) and and Zoom out (-) buttons and observe your Macro Log output

            - NOTE: This macro will automatically unsubscribe for you. Review those steps, to get a better understand as to how we unsubscribe.

        - When Complete, deactivate the ==xStatuses_Lesson-4_MacroPak_2-6-5== macro

    ??? gif "Accessing the Camera Menu"

        <figure markdown>
          ![Navigate to Camera Control Menu GIF](./images/2-2-4_CameraMenuAccess.gif){ width="600" }
        </figure>

    ??? success "View Successful Macro Syntax and Log output"

        === "Macro"

            ``` javascript
            import xapi from 'xapi';

            /**
             * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#265-getting-and-subscribing-to-xstatuses
             * 
             * Lesson 4: Subscribe and Unsubscribe to Multiple xStatuses under a Common Node
            */

            const delay_in_seconds = 10;

            // Edit this Object to include your xStatus Subscription
            const subscribeToCameraPositions = xapi.Status.Cameras.Camera.Position.on(event => {
              console.log(event)
            });

            // Do not edit past this line, but feel free to review what's going on :)

            // Here, we use JS Timeouts to set an action to run after X seconds. Timeouts use milliseconds, hence why we multiply by 1000
            setTimeout(() => {

              subscribeToCameraPositions(); //<-- By calling the Object we assigned our Subscription too as a function(), we will unsubscribe from it

              console.warn("CameraPositions Subscription stopped!");

            }, delay_in_seconds * 1000)


            // This countdown is used to help you visualize when the process will complete it's course
            // We use console.warn to have this countdown print in another color in the Macro Console
            function countdown(startNumber) {
              let currentNumber = startNumber;

              console.warn(`CameraPositions Subscription stopping in [${currentNumber}] seconds`);

              const interval = setInterval(() => {
                currentNumber--;
                if (currentNumber > 0) {
                  console.warn(`CameraPositions Subscription stopping in [${currentNumber}] seconds`);
                }

                if (currentNumber < 1) {
                  clearInterval(interval);
                }
              }, 1000);
            }

            function init() {
              countdown(delay_in_seconds);
            }

            init();
            ```

        === "Log Output"

            | Time       | Source                                   | Message                                      |
            |------------|------------------------------------------|----------------------------------------------|
            | HH:MM:SS  | [system]                                 | Runtime stopped!                             |
            | HH:MM:SS  | [system]                                 | Using XAPI transport: WebSocket              |
            | HH:MM:SS  | [system]                                 | Starting macros...                           |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | CameraPositions Subscription stopping in [10] seconds |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | QJS Ready                                    |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | {"Zoom":"4295"}                             |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | CameraPositions Subscription stopping in [9] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | {"Zoom":"5662"}                             |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | CameraPositions Subscription stopping in [8] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | {"Pan":"-65"}                               |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | CameraPositions Subscription stopping in [7] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | {"Pan":"-64","Tilt":"123"}                  |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | CameraPositions Subscription stopping in [6] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | {"Pan":"-61","Tilt":"-20"}                  |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | {"Pan":"-24","Tilt":"-19"}                  |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | CameraPositions Subscription stopping in [5] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | {"Tilt":"47"}                               |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | CameraPositions Subscription stopping in [4] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | {"Zoom":"4384"}                             |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | CameraPositions Subscription stopping in [3] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | {"Tilt":"-14"}                              |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | CameraPositions Subscription stopping in [2] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | {"Pan":"14"}                                |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | CameraPositions Subscription stopping in [1] seconds  |
            | HH:MM:SS  | xStatuses_Lesson-4_MacroPak_2-6-5      | CameraPositions Subscription stopped!        |


## **Subscribing to xEvents** ~({{config.cProps.rxp.sectionIds.macro}}.6)~

???+ lesson "Lesson: Subscribe and Unsubscribe to an xEvent ~({{config.cProps.rxp.sectionIds.macro}}.6.1)~"

    - **xAPI:** xEvent UserInterface Extensions Widget Action

    - **Task**:
        - Activate the ==xEvents_Lesson-1_MacroPak_2-6-6== macro
        - Modify the `subscribeToWidgetActions` object by replacing it's value with ==xEvent UserInterface Widget Action== written in Macro Syntax using the `.on()` method
            - In order to unsubscribe, we need to assign our xAPI subscription to an object, so we can later call it, which will end it's subscription
            - For example, after you assign the ==subscribeToWidgetActions== properly, running ==subscribeToWidgetActions=={++()++} will stop your active subscription
        - Save your Macro, open the ==MultiLine Command [2.6.6]== Panel on your Codec's touch interface, press one or more of the buttons and observe the Macro Log Output

            - NOTE: This macro will automatically unsubscribe for you. Review those steps, to get a better understand as to how we unsubscribe.

        - When Complete, deactivate the ==xEvents_Lesson-1_MacroPak_2-6-6== macro

    ??? gif "Open the **MultiLine Command [2.6.6]** Panel"

        <figure markdown>
          ![Open the MultiLine Command [2.6.6] Panel](./images/2-6-6_Get-xEvent-WidgetActions.gif){ width="600" }
        </figure>

    ??? success "View Successful Macro Syntax and Log output"

        === "Macro"

            ``` javascript
            import xapi from 'xapi';

            /**
             * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#266-subscribing-to-xevents
             * 
             * Lesson 1: Subscribe and Unsubscribe to an xEvent
            */

            const delay_in_seconds = 10;

            // Edit this Object to include your xEvent Subscription
            const subscribeToWidgetActions = xapi.Event.UserInterface.Extensions.Widget.Action.on(event => {
              console.log(event)
            });

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
                <Name>MultiLine Command [2.6.6]</Name>
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
            ```

        === "Log Output"

            | Time       | Source                                   | Message                                      |
            |------------|------------------------------------------|----------------------------------------------|
            | HH:MM:SS  | [system]                                 | Runtime stopped!                             |
            | HH:MM:SS  | [system]                                 | Using XAPI transport: WebSocket              |
            | HH:MM:SS  | [system]                                 | Starting macros...                           |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | QJS Ready                                    |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | WidgetActions Subscription stopping in [10] seconds |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"pressed","Value":"GroupButton_A","WidgetId":"wx1_GroupButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"released","Value":"GroupButton_A","WidgetId":"wx1_GroupButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"pressed","Value":"GroupButton_B","WidgetId":"wx1_GroupButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | WidgetActions Subscription stopping in [9] seconds |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | Panel [wx1_lab_multilineCommand] saved to the codec |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"released","Value":"GroupButton_B","WidgetId":"wx1_GroupButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"pressed","Value":"GroupButton_C","WidgetId":"wx1_GroupButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"released","Value":"GroupButton_C","WidgetId":"wx1_GroupButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | WidgetActions Subscription stopping in [8] seconds |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"pressed","Value":"","WidgetId":"wx1_TextButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"released","Value":"","WidgetId":"wx1_TextButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"clicked","Value":"","WidgetId":"wx1_TextButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"pressed","Value":"","WidgetId":"wx1_IconButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | WidgetActions Subscription stopping in [7] seconds |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"released","Value":"","WidgetId":"wx1_IconButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"clicked","Value":"","WidgetId":"wx1_IconButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"pressed","Value":"decrement","WidgetId":"wx1_SpinnerButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | WidgetActions Subscription stopping in [6] seconds |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"released","Value":"decrement","WidgetId":"wx1_SpinnerButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"clicked","Value":"decrement","WidgetId":"wx1_SpinnerButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | WidgetActions Subscription stopping in [5] seconds |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"pressed","Value":"increment","WidgetId":"wx1_SpinnerButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"released","Value":"increment","WidgetId":"wx1_SpinnerButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"clicked","Value":"increment","WidgetId":"wx1_SpinnerButton","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | WidgetActions Subscription stopping in [4] seconds |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"pressed","Value":"up","WidgetId":"wx1_ControlWheel","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"released","Value":"up","WidgetId":"wx1_ControlWheel","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"clicked","Value":"up","WidgetId":"wx1_ControlWheel","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"pressed","Value":"left","WidgetId":"wx1_ControlWheel","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | WidgetActions Subscription stopping in [3] seconds |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"released","Value":"left","WidgetId":"wx1_ControlWheel","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"clicked","Value":"left","WidgetId":"wx1_ControlWheel","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | WidgetActions Subscription stopping in [2] seconds |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"pressed","Value":"center","WidgetId":"wx1_ControlWheel","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"released","Value":"center","WidgetId":"wx1_ControlWheel","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"clicked","Value":"center","WidgetId":"wx1_ControlWheel","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | WidgetActions Subscription stopping in [1] seconds |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | {"Type":"changed","Value":"off","WidgetId":"wx1_Toggle","id":"1"} |
            | HH:MM:SS  | xEvents_Lesson-1_MacroPak_2-6-6        | WidgetActions Subscription stopped!        |


??? lesson "Lesson: Subscribe and Unsubscribe to Multiple xEvents under a Common Node ~({{config.cProps.rxp.sectionIds.macro}}.6.2)~"

    - **xAPI:** xEvent UserInterface Extensions

    - **Task**:
        - Activate the ==xEvents_Lesson-1_MacroPak_2-6-6== macro
        - Modify the `subscribeToAllExtensions` object by replacing it's value with ==xEvent UserInterface== written in Macro Syntax using the `.on()` method
            - In order to unsubscribe, we need to assign our xAPI subscription to an object, so we can later call it, which will end it's subscription
            - For example, after you assign the ==subscribeToAllExtensions== properly, running ==subscribeToAllExtensions=={++()++} will stop your active subscription
        - Save your Macro, open the ==MultiLine Command [2.6.6]== Panel on your Codec's touch interface, press one or more of the buttons and observe the Macro Log Output

            - NOTE: This macro will automatically unsubscribe for you. Review those steps, to get a better understand as to how we unsubscribe.

        - When Complete, deactivate the ==xEvents_Lesson-1_MacroPak_2-6-6== macro

    ??? gif "Open the **MultiLine Command [2.6.6]** Panel"

        <figure markdown>
          ![Open the MultiLine Command [2.6.6] Panel](./images/2-6-6_Get-xEvent-WidgetActions.gif){ width="600" }
        </figure>

    ??? success "View Successful Macro Syntax and Log output"

        === "Macro"

            ``` javascript
            import xapi from 'xapi';

            /**
             * Lab Guide: https://webexcc-sa.github.io/LAB-1451/wx1_1451_part_2/#266-subscribing-to-xevents
             * 
             * Lesson 2: Subscribe and Unsubscribe to Multiple xEvents under a Common Node
            */

            const delay_in_seconds = 10;

            // Edit this Object to include your xEvent Subscription
            const subscribeToAllExtensions = xapi.Event.UserInterface.Extensions.on(event => {
              console.log(event)
            });

            // Do not edit past this line, but feel free to review what's going on :)

            // Here, we use JS Timeouts to set an action to run after X seconds. Timeouts use milliseconds, hence why we multiply by 1000
            setTimeout(() => {

              subscribeToAllExtensions(); //<-- By calling the Object we assigned our Subscription too as a function(), we will unsubscribe from it

              console.warn("AllExtensions Subscription stopped!");

            }, delay_in_seconds * 1000)


            // This countdown is used to help you visualize when the process will complete it's course
            // We use console.warn to have this countdown print in another color in the Macro Console
            function countdown(startNumber) {
              let currentNumber = startNumber;

              console.warn(`AllExtensions Subscription stopping in [${currentNumber}] seconds`);

              const interval = setInterval(() => {
                currentNumber--;
                if (currentNumber > 0) {
                  console.warn(`AllExtensions Subscription stopping in [${currentNumber}] seconds`);
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
                <Color>#FF6F20</Color>
                <Name>MultiLine Command [2.6.6]</Name>
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
            ```

        === "Log Output"

            | Time     | Source                                      | Message                                                                                     |
            |----------|---------------------------------------------|---------------------------------------------------------------------------------------------|
            | HH:MM:SS | [system]                                   | Runtime stopped!                                                                           |
            | HH:MM:SS | [system]                                   | Using XAPI transport: WebSocket                                                             |
            | HH:MM:SS | [system]                                   | Starting macros...                                                                          |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | AllExtensions Subscription stopping in [10] seconds                                         |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | QJS Ready                                                                                   |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | Panel [wx1_lab_multilineCommand] saved to the codec                                        |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"LayoutUpdated":{"id":"1"},"id":"1"},"id":"1"}                                 |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Panel":{"Clicked":{"PanelId":"wx1_lab_multilineCommand","id":"1"},"id":"1"},"id":"1"}  |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | AllExtensions Subscription stopping in [9] seconds                                          |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | AllExtensions Subscription stopping in [8] seconds                                          |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Pressed":{"Signal":"wx1_GroupButton:GroupButton_A","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"pressed","Value":"GroupButton_A","WidgetId":"wx1_GroupButton","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Released":{"Signal":"wx1_GroupButton:GroupButton_A","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"released","Value":"GroupButton_A","WidgetId":"wx1_GroupButton","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | AllExtensions Subscription stopping in [7] seconds                                          |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Pressed":{"Signal":"wx1_IconButton","id":"1"},"id":"1"},"id":"1"}               |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"pressed","Value":"","WidgetId":"wx1_IconButton","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Released":{"Signal":"wx1_IconButton","id":"1"},"id":"1"},"id":"1"}              |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"released","Value":"","WidgetId":"wx1_IconButton","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Clicked":{"Signal":"wx1_IconButton","id":"1"},"id":"1"},"id":"1"}               |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"clicked","Value":"","WidgetId":"wx1_IconButton","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | AllExtensions Subscription stopping in [6] seconds                                          |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Pressed":{"Signal":"wx1_ControlWheel:center","id":"1"},"id":"1"},"id":"1"}     |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"pressed","Value":"center","WidgetId":"wx1_ControlWheel","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Released":{"Signal":"wx1_ControlWheel:center","id":"1"},"id":"1"},"id":"1"}   |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"released","Value":"center","WidgetId":"wx1_ControlWheel","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Clicked":{"Signal":"wx1_ControlWheel:center","id":"1"},"id":"1"},"id":"1"}   |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"clicked","Value":"center","WidgetId":"wx1_ControlWheel","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | AllExtensions Subscription stopping in [5] seconds                                          |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | AllExtensions Subscription stopping in [4] seconds                                          |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Pressed":{"Signal":"wx1_Slider:188","id":"1"},"id":"1"},"id":"1"}            |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"pressed","Value":"188","WidgetId":"wx1_Slider","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Changed":{"Signal":"wx1_Slider:98","id":"1"},"id":"1"},"id":"1"}              |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"changed","Value":"98","WidgetId":"wx1_Slider","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Changed":{"Signal":"wx1_Slider:98","id":"1"},"id":"1"},"id":"1"}              |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"changed","Value":"98","WidgetId":"wx1_Slider","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Released":{"Signal":"wx1_Slider:98","id":"1"},"id":"1"},"id":"1"}            |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"released","Value":"98","WidgetId":"wx1_Slider","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | AllExtensions Subscription stopping in [3] seconds                                          |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Changed":{"Signal":"wx1_Toggle:on","id":"1"},"id":"1"},"id":"1"}             |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"changed","Value":"on","WidgetId":"wx1_Toggle","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | AllExtensions Subscription stopping in [2] seconds                                          |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Pressed":{"Signal":"wx1_SpinnerButton:decrement","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"pressed","Value":"decrement","WidgetId":"wx1_SpinnerButton","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | AllExtensions Subscription stopping in [1] seconds                                          |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Released":{"Signal":"wx1_SpinnerButton:decrement","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"released","Value":"decrement","WidgetId":"wx1_SpinnerButton","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Event":{"Clicked":{"Signal":"wx1_SpinnerButton:decrement","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | {"Widget":{"Action":{"Type":"clicked","Value":"decrement","WidgetId":"wx1_SpinnerButton","id":"1"},"id":"1"},"id":"1"} |
            | HH:MM:SS | xEvents_Lesson-2_MacroPak_2-6-6           | AllExtensions Subscription stopped!                                                         |
