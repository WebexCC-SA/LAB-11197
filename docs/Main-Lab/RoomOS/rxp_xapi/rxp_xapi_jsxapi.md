{{ config.cProps.devNotice }}
{{ config.cProps.acronyms }}

# Access RoomOS xAPI with JSXAPI ~(section\ {{ config.cProps.rxp.sectionIds.jsxapi }})~

!!! abstract

    JSXAPI is Cisco's JavaScript SDK for accessing the RoomOS xAPI from an external Node.js application. The application runs on your laptop or another computer that can reach the RoomOS device.

    JSXAPI and macros use the same `xapi.Command`, `xapi.Config`, `xapi.Status`, and `xapi.Event` object model. This section therefore follows the same concepts, Lesson titles, xAPI targets, and order as the Macro Integration Method. JSXAPI adds only the external connection needed to receive the familiar `xapi` object.

    You will translate familiar terminal xAPI forms into JSXAPI. Each Lesson gives you a bounded scaffold, but keeps the completed assessed expression inside a collapsed **Successful Syntax and Log Output** disclosure. The examples use Cisco's direct `connect` → `ready` pattern without prescribing how you should structure a larger JavaScript application.

    Like the direct HTTP API, JSXAPI authenticates with a local RoomOS user and communicates directly with the RoomOS device. The difference is the session: HTTP sends independent requests, while JSXAPI authenticates as it opens a persistent WebSocket or SSH connection and then uses that connection for xAPI calls and feedback.

    !!! curious "Click the Tabs Below to compare HTTP API and JSXAPI communication"

        === "HTTP API"

            === "Get Requests [xStatuses/xConfigs]"

                ``` mermaid
                %%{init: {'theme':'dark'}}%%
                sequenceDiagram
                  participant My Customization
                  participant Target Codec
                  My Customization->>+Target Codec: xStatus/xConfig Get Request
                  Note over My Customization,Target Codec: If Device Online
                  Target Codec->>- My Customization: Responds 200 OK
                ```

            === "Post Requests [xCommands/xConfigs]"

                ``` mermaid
                %%{init: {'theme':'dark'}}%%
                sequenceDiagram
                  participant My Customization
                  participant Target Codec
                  My Customization->>+Target Codec: xCommand/xConfig Post Request
                  Note over My Customization,Target Codec: If Device Online
                  Target Codec->>- My Customization: Responds 200 OK
                ```

            === "Subscriptions [HTTPFeedback]"

                ``` mermaid
                %%{init: {'theme':'dark'}}%%
                sequenceDiagram
                  participant My Customization
                  participant Target Codec
                  activate Target Codec
                  Note over My Customization, Target Codec: WebHook Offered by My Customization<br>Configured in Target Codec
                  Target Codec -->>+ My Customization: Forwards Subscription Traffic
                  Note over My Customization,Target Codec: On Subscription callBack from Target Codec
                  deactivate Target Codec
                  activate My Customization
                  Target Codec->>+ My Customization: Ex. xEvent UserInterface Extension Panel Clicked (QuickDial)
                  activate Target Codec
                  My Customization->>+Target Codec: Responds with xCommand Dial Post Request
                  deactivate My Customization
                  Target Codec->>- My Customization: Responds 200 OK
                ```

        === "JSXAPI"

            === "Get [xStatuses/xConfigurations]"

                ``` mermaid
                %%{init: {'theme':'dark'}}%%
                sequenceDiagram
                  participant App as Node.js Application
                  participant SDK as JSXAPI SDK
                  participant Device as RoomOS Device
                  App->>+SDK: connect(wss://device, credentials)
                  SDK->>+Device: Open connection and authenticate
                  Device-->>-SDK: Authenticated xAPI session
                  SDK-->>-App: ready(xapi)
                  App->>+SDK: xapi.Status...get()<br>or xapi.Config...get()
                  SDK->>+Device: Get through the open connection
                  Device-->>-SDK: Current xAPI value
                  SDK-->>-App: Promise resolves with the value
                ```

                The `ready` event provides the authenticated `xapi` object; `.get()` reads use that open connection.

            === "Execute/Set [xCommands/xConfigurations]"

                ``` mermaid
                %%{init: {'theme':'dark'}}%%
                sequenceDiagram
                  participant App as Node.js Application
                  participant SDK as JSXAPI SDK
                  participant Device as RoomOS Device
                  App->>+SDK: connect(wss://device, credentials)
                  SDK->>+Device: Open connection and authenticate
                  Device-->>-SDK: Authenticated xAPI session
                  SDK-->>-App: ready(xapi)
                  App->>+SDK: xapi.Command...()<br>or xapi.Config...set(value)
                  SDK->>+Device: Execute through the open connection
                  Device-->>-SDK: xAPI response
                  SDK-->>-App: Promise resolves with the result
                ```

                xCommands and configuration changes use the same connected `xapi` object and return Promise results.

            === "Subscriptions [xConfigurations/xStatuses/xEvents]"

                ``` mermaid
                %%{init: {'theme':'dark'}}%%
                sequenceDiagram
                  participant App as Node.js Application
                  participant SDK as JSXAPI SDK
                  participant Device as RoomOS Device
                  App->>+SDK: connect(wss://device, credentials)
                  SDK->>+Device: Open connection and authenticate
                  Device-->>-SDK: Authenticated xAPI session
                  SDK-->>-App: ready(xapi)
                  App->>+SDK: xapi.Config, Status, or Event...on(callback)
                  SDK->>+Device: Register feedback on the open connection
                  Device-->>-SDK: xAPI change or event feedback
                  SDK-->>-App: Run the subscribed callback
                ```

                `.on()` subscriptions deliver xConfiguration, xStatus, and xEvent feedback through the same persistent connection; no separate webhook is required.

## Section {{ config.cProps.rxp.sectionIds.jsxapi }} Requirements

!!! important "Previous Sections"

    Complete these sections before beginning:

    - SSH ^{{ config.cProps.rxp.sectionIds.ssh }}^
    - Macros ^{{ config.cProps.rxp.sectionIds.macro }}^

    SSH establishes the terminal form used throughout this section. Macros establish the JavaScript xAPI object model that JSXAPI reuses.

!!! important "Hardware, Software, and Credentials"

    - A laptop with network access to the RoomOS device
    - A Cisco Desk, Board, or Room Series RoomOS device
    - A current Node.js Long Term Support release and npm
    - A text editor
    - A terminal application
    - RoomOS device: {{ config.cProps.auth.roomosIp }}
    - Username: {{ config.cProps.auth.roomosUser }}
    - Password: {{ config.cProps.auth.roomosPass }}

!!! important "RoomOS Service Prerequisites"

    The lab's default `wss` connection requires a reachable RoomOS WebSocket service and an enabled HTTP service. The optional `ssh` transport requires the RoomOS SSH service. These services are enabled by default, but an institution may disable them as part of its standard environment.

    Before the lab, confirm the RoomOS device reports an enabled WebSocket service or one that follows an enabled HTTP service.

    ```shell title="Verify in a RoomOS SSH session"
    xConfiguration NetworkServices Websocket
    xConfiguration NetworkServices HTTP Mode
    xConfiguration NetworkServices SSH Mode
    ```

    For `wss`, confirm WebSocket is enabled directly or follows an enabled HTTP service. For `ssh`, confirm SSH Mode is enabled. If the required service is disabled by policy, work with the device administrator or lab instructor before continuing. Do not change an institution's network-service policy without authorization.

!!! warning

    The examples use encrypted WebSockets (`wss`) first. In `jsxapi@6.0.0`, the Node.js WebSocket transport does not validate the RoomOS device certificate. Treat that as a lab convenience, not a production certificate-trust pattern. JSXAPI's SSH transport is available as the alternate direct connection.

## **Create and Connect the JSXAPI Project** ~({{ config.cProps.rxp.sectionIds.jsxapi }}.1)~

!!! abstract

    JSXAPI uses <hl_0>user-based authentication</hl_0> against the RoomOS device. It does not use a Webex access token or send requests through Webex Cloud. The application must be able to reach the device and must provide credentials for a local RoomOS user with permission to access the required xAPI paths.

    A macro receives the `xapi` object from the RoomOS Macro Runtime. An external JSXAPI application receives the same object after `jsxapi.connect()` opens and authenticates a persistent connection.

    | Concern | Macro | JSXAPI |
    |:--|:--|:--|
    | JavaScript runtime | RoomOS device | External Node.js process |
    | `xapi` object | Imported from `xapi` | Supplied by the `ready` event |
    | Connection | Managed by RoomOS | Established by `jsxapi.connect()` |
    | Subscription lifetime | Until stopped or unsubscribed | Until unsubscribed or the connection closes |

    | Terminal branch | JSXAPI object | Common operations |
    |:--|:--|:--|
    | <hl_1>xCommand</hl_1> | `xapi.Command` | Call the command as a function |
    | <hl_2>xConfiguration</hl_2> | `xapi.Config` | `.get()`, `.set(value)`, `.on(callback)`, `.once(callback)` |
    | <hl_5>xStatus</hl_5> | `xapi.Status` | `.get()`, `.on(callback)`, `.once(callback)` |
    | <hl_3>xEvent</hl_3> | `xapi.Event` | `.on(callback)`, `.once(callback)` |

???+ lesson "Lesson: Verify Node.js and npm ~({{ config.cProps.rxp.sectionIds.jsxapi }}.1.1)~"

    - Open a terminal on your laptop.
    - Check Node.js and npm.

    ```shell title="Run in your laptop terminal"
    node --version
    npm --version
    ```

    Both commands must return version numbers. If either command is missing, install a current Node.js Long Term Support release before continuing.

??? lesson "Lesson: Create the JSXAPI Project ~({{ config.cProps.rxp.sectionIds.jsxapi }}.1.2)~"

    - Create an empty project folder and enter it.

    === "macOS or Linux"

        ```shell
        mkdir roomos-jsxapi-lab
        cd roomos-jsxapi-lab
        ```

    === "Windows PowerShell"

        ```powershell
        New-Item -ItemType Directory roomos-jsxapi-lab
        Set-Location roomos-jsxapi-lab
        ```

    - Initialize the project and install the connection and environment-file packages.

    ```shell title="Run inside roomos-jsxapi-lab"
    npm init -y
    npm install jsxapi@6.0.0 dotenv
    ```

    - Confirm `package.json`, `package-lock.json`, and `node_modules` now exist.

??? lesson "Lesson: Set Temporary Connection Environment Variables ~({{ config.cProps.rxp.sectionIds.jsxapi }}.1.3)~"

    Shell environment variables are useful for a quick connection check because credentials stay out of source code. They are ephemeral: these values normally disappear when the terminal closes, and they do not survive a restart unless your operating system is configured to persist them.

    - Set the four values for this terminal session.

    === "macOS or Linux"

        ```shell
        export ROOMOS_PROTOCOL='wss'
        export ROOMOS_IP='[ROOMOS_IP_ADDRESS]'
        export ROOMOS_USERNAME='[ROOMOS_USERNAME]'
        export ROOMOS_PASSWORD='[ROOMOS_PASSWORD]'
        ```

    === "Windows PowerShell"

        ```powershell
        $env:ROOMOS_PROTOCOL='wss'
        $env:ROOMOS_IP='[ROOMOS_IP_ADDRESS]'
        $env:ROOMOS_USERNAME='[ROOMOS_USERNAME]'
        $env:ROOMOS_PASSWORD='[ROOMOS_PASSWORD]'
        ```

    - Print only the non-secret settings to confirm they are available.

    === "macOS or Linux"

        ```shell
        printf '%s://%s\n' "$ROOMOS_PROTOCOL" "$ROOMOS_IP"
        ```

    === "Windows PowerShell"

        ```powershell
        "$($env:ROOMOS_PROTOCOL)://$($env:ROOMOS_IP)"
        ```

    !!! warning

        Do not print the password, save it in shell history, or commit it to source control. The next Lesson moves these settings into an ignored project-local file that loads whenever the application starts.

??? lesson "Lesson: Create a Persistent Project Environment File ~({{ config.cProps.rxp.sectionIds.jsxapi }}.1.4)~"

    The `.env` file persists with this lab project and is loaded by `dotenv` on each run. It is convenient for a lab, but a production integration should use an approved secret manager.

    - Create `.gitignore` inside `roomos-jsxapi-lab`.

    ```text title=".gitignore"
    node_modules/
    .env
    ```

    - Create a secret-free example that can safely be shared.

    ```text title=".env.example"
    ROOMOS_PROTOCOL=wss
    ROOMOS_IP=
    ROOMOS_USERNAME=
    ROOMOS_PASSWORD=
    ```

    - Create `.env` and replace the bracketed values with your pod information.

    ```text title=".env"
    ROOMOS_PROTOCOL=wss
    ROOMOS_IP=[ROOMOS_IP_ADDRESS]
    ROOMOS_USERNAME=[ROOMOS_USERNAME]
    ROOMOS_PASSWORD=[ROOMOS_PASSWORD]
    ```

    - To use JSXAPI's SSH transport instead, change only this line for the lab:

    ```text title="Use the SSH transport in .env"
    ROOMOS_PROTOCOL=ssh
    ```

??? lesson "Lesson: Create and Run the JSXAPI Connection ~({{ config.cProps.rxp.sectionIds.jsxapi }}.1.5)~"

    The connection is prerequisite syntax, so you may copy it directly. This uses Cisco's direct JSXAPI connection pattern without adding a helper module or application wrapper.

    `jsxapi.connect()` returns the connection object immediately. Each chained `.on()` registers a function for a connection event and returns that same connection object.

    | Event handler | When it runs | Use it to |
    |:--|:--|:--|
    | `.on('ready', (xapi) => { ... })` | The transport is open and authentication is complete | Begin xAPI work with the supplied `xapi` object |
    | `.on('error', (error) => { ... })` | The connection or transport reports a failure | Record the failure and decide whether to stop or reconnect |
    | `.on('close', () => { ... })` | The underlying connection ends | Record an expected shutdown or detect a lost session |

    - Create `lesson.js`.

    ```javascript title="lesson.js"
    require('dotenv').config();
    const jsxapi = require('jsxapi');

    jsxapi
      .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
        username: process.env.ROOMOS_USERNAME,
        password: process.env.ROOMOS_PASSWORD
      })
      .on('error', (error) => {
        console.error('The JSXAPI connection failed:', error);
      })
      .on('close', () => {
        console.log('The JSXAPI connection is closed.');
      })
      .on('ready', (xapi) => {
        console.log(`JSXAPI ${xapi.version} is ready.`);
        xapi.close();
      });
    ```

    - Run the connection check.

    ```shell title="Run in your laptop terminal"
    node lesson.js
    ```

    ??? success "Successful Connection and Log Output"

        === "JSXAPI"

            ```javascript title="lesson.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', (error) => {
                console.error('The JSXAPI connection failed:', error);
              })
              .on('close', () => {
                console.log('The JSXAPI connection is closed.');
              })
              .on('ready', (xapi) => {
                console.log(`JSXAPI ${xapi.version} is ready.`);
                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `JSXAPI 6.0.0 is ready.` |
            | `stdout` | `The JSXAPI connection is closed.` |

    Begin xAPI work only inside <hl_1>ready</hl_1>. The <hl_7>error</hl_7> event reports connection failures; it does not catch a rejected command, `.get()`, or `.set()` Promise.

    `xapi.close()` closes only this application's transport. The one-time Lessons close after their awaited operation. Subscription Lessons unsubscribe before closing. A persistent application keeps the connection open while it still needs feedback and closes it during intentional shutdown.

    ``` mermaid
    %%{init: {'theme':'dark'}}%%
    sequenceDiagram
      participant App as Node.js Application
      participant SDK as JSXAPI SDK
      participant Device as RoomOS Device
      App->>SDK: jsxapi.connect(...)
      SDK->>Device: Open transport and authenticate
      alt Connection succeeds
        Device-->>SDK: Authenticated session
        SDK-->>App: ready(xapi)
        App->>SDK: Use the connected xapi object
      else Connection or transport fails
        SDK-->>App: error(error)
      end
      opt Application ends the session
        App->>SDK: xapi.close()
        SDK->>Device: Close the transport
        SDK-->>App: close
      end
    ```

    JSXAPI does not reconnect automatically. After the connection closes, create a new connection with `jsxapi.connect()` rather than trying to reuse the closed `xapi` object.

## **Executing xCommands** ~({{ config.cProps.rxp.sectionIds.jsxapi }}.2)~

!!! abstract

    A JSXAPI command follows the same path as its terminal form. Remove the leading `x`, convert path spaces to dot notation after `xapi.Command`, and pass named arguments in a JavaScript object. Await the returned Promise when later work depends on completion.

???+ lesson "Lesson: Execute an xCommand ~({{ config.cProps.rxp.sectionIds.jsxapi }}.2.1)~"

    Once the `ready` event supplies the connected `xapi` object, the terminal command path maps directly to JSXAPI dot notation.

    !!! example "Click on the tabs to see how Terminal Syntax relates to JSXAPI Syntax"

        === "Terminal Syntax"

            ```shell
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

        === "JSXAPI Syntax"

            ```javascript title="lesson.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                const time = await xapi.Command.Time.DateTime.Get();
                console.log(time);
                xapi.close();
              });

            /* Log Output
            {
              "Day": "24",
              "Hour": "0",
              "Minute": "47",
              "Month": "9",
              "Second": "1",
              "Year": "2024",
              "status": "OK"
            }
            */
            ```

    - **xAPI:** `xCommand Video Selfview Set`

    ```shell title="Terminal xAPI form"
    xCommand Video Selfview Set Mode: On FullscreenMode: On OnMonitorRole: First
    ```

    - Identify the `Video Selfview Set` path and its three named arguments.
    - Replace the marked line in `lesson.js` with the JSXAPI expression derived from the terminal form.

    ```javascript title="Scaffold — replace the marked line"
    require('dotenv').config();
    const jsxapi = require('jsxapi');

    jsxapi
      .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
        username: process.env.ROOMOS_USERNAME,
        password: process.env.ROOMOS_PASSWORD
      })
      .on('error', console.error)
      .on('ready', async (xapi) => {
        // Replace this comment with the awaited JSXAPI command.
        console.log('Selfview command completed.');
        xapi.close();
      });
    ```

    - Run `node lesson.js`.
    - Confirm <hl_0>full-screen selfview</hl_0> appears on the RoomOS User Interface.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="lesson.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                await xapi.Command.Video.Selfview.Set({
                  Mode: 'On',
                  FullscreenMode: 'On',
                  OnMonitorRole: 'First'
                });

                console.log('Selfview command completed.');
                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Selfview command completed.` |

    [Open xCommand Video Selfview Set](https://roomos.cisco.com/xapi/Command.Video.Selfview.Set/){ .md-button .md-button--primary target="_blank" }

??? lesson "Lesson: Execute an xCommand with multiple arguments with the same name ~({{ config.cProps.rxp.sectionIds.jsxapi }}.2.2)~"

    When a terminal command repeats an argument name, represent its values as a JavaScript array instead of repeating an object key.

    - **xAPI:** `xCommand Video Input SetMainVideoSource`

    ```shell title="Terminal xAPI form"
    xCommand Video Input SetMainVideoSource ConnectorId: 1 ConnectorId: 1 Layout: Equal
    ```

    - Translate the command path to dot notation.
    - Represent both `ConnectorId` values in one array.
    - Replace the marked line and run the file.

    ```javascript title="Scaffold — replace the marked line"
    .on('ready', async (xapi) => {
      // Replace this comment with the awaited JSXAPI command.
      console.log('Main video source command completed.');
      xapi.close();
    });
    ```

    - Confirm the RoomOS device composes the two connector references with the <hl_0>Equal layout</hl_0>.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="lesson.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                await xapi.Command.Video.Input.SetMainVideoSource({
                  ConnectorId: [1, 1],
                  Layout: 'Equal'
                });

                console.log('Main video source command completed.');
                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Main video source command completed.` |

    [Open xCommand Video Input SetMainVideoSource](https://roomos.cisco.com/xapi/Command.Video.Input.SetMainVideoSource/){ .md-button .md-button--primary target="_blank" }

??? lesson "Lesson: Execute an xCommand with a multiline argument ~({{ config.cProps.rxp.sectionIds.jsxapi }}.2.3)~"

    JSXAPI passes command arguments as the first function parameter and multiline content as the second. The multiline XML below is input data, so you may copy it before constructing the assessed command call.

    - **xAPI:** `xCommand UserInterface Extensions Panel Save`

    ```shell title="Terminal xAPI form"
    xCommand UserInterface Extensions Panel Save PanelId: wx1_lab_multilineCommand
    <Extensions>
      <Panel>
        <Order>1</Order>
        <PanelId>wx1_lab_multilineCommand</PanelId>
        <Location>HomeScreen</Location>
        <Icon>Info</Icon>
        <Color>#00FFFF</Color>
        <Name>MultiLine Command [rxp-7]</Name>
        <ActivityType>Custom</ActivityType>
      </Panel>
    </Extensions>
    .
    ```

    - Replace `lesson.js` with the scaffold.
    - Construct only the marked `Panel.Save` call.

    ```javascript title="Scaffold — construct the command at the marked line"
    require('dotenv').config();
    const jsxapi = require('jsxapi');

    const panelId = 'wx1_lab_multilineCommand';
    const panelXml = `<Extensions>
      <Panel>
        <Order>1</Order>
        <PanelId>wx1_lab_multilineCommand</PanelId>
        <Location>HomeScreen</Location>
        <Icon>Info</Icon>
        <Color>#00FFFF</Color>
        <Name>MultiLine Command [rxp-7]</Name>
        <ActivityType>Custom</ActivityType>
      </Panel>
    </Extensions>`;

    jsxapi
      .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
        username: process.env.ROOMOS_USERNAME,
        password: process.env.ROOMOS_PASSWORD
      })
      .on('error', console.error)
      .on('ready', async (xapi) => {
        // Replace this comment with the awaited JSXAPI command.
        console.log(`Panel ${panelId} saved.`);
        xapi.close();
      });
    ```

    - Run `node lesson.js`.
    - Confirm <hl_0>MultiLine Command [rxp-7]</hl_0> appears on the RoomOS User Interface.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="lesson.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            const panelId = 'wx1_lab_multilineCommand';
            const panelXml = `<Extensions>
              <Panel>
                <Order>1</Order>
                <PanelId>wx1_lab_multilineCommand</PanelId>
                <Location>HomeScreen</Location>
                <Icon>Info</Icon>
                <Color>#00FFFF</Color>
                <Name>MultiLine Command [rxp-7]</Name>
                <ActivityType>Custom</ActivityType>
              </Panel>
            </Extensions>`;

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                await xapi.Command.UserInterface.Extensions.Panel.Save(
                  { PanelId: panelId },
                  panelXml
                );

                console.log(`Panel ${panelId} saved.`);
                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Panel wx1_lab_multilineCommand saved.` |

    [Open xCommand UserInterface Extensions Panel Save](https://roomos.cisco.com/xapi/Command.UserInterface.Extensions.Panel.Save/){ .md-button .md-button--primary target="_blank" }

??? lesson "Lesson: Execute an xCommand which generates data and responds ~({{ config.cProps.rxp.sectionIds.jsxapi }}.2.4)~"

    - **xAPI:** `xCommand UserInterface Extensions List`

    ```shell title="Terminal xAPI form"
    xCommand UserInterface Extensions List
    ```

    - Translate the path to JSXAPI.
    - Await the command and assign its response to `extensions`.
    - Replace the marked expression, run the file, and inspect the returned data.

    ```javascript title="Scaffold — replace the marked expression"
    .on('ready', async (xapi) => {
      const extensions =
        /* Replace with the awaited JSXAPI expression */;

      console.log(JSON.stringify(extensions, null, 2));
      xapi.close();
    });
    ```

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="lesson.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                const extensions =
                  await xapi.Command.UserInterface.Extensions.List();

                console.log(JSON.stringify(extensions, null, 2));
                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `{"Extensions":{"Panel":[{"PanelId":"wx1_lab_multilineCommand","Name":"MultiLine Command [rxp-7]"}]}}` |

        The exact response includes the UI Extensions installed on your RoomOS device.

    [Open xCommand UserInterface Extensions List](https://roomos.cisco.com/xapi/Command.UserInterface.Extensions.List/){ .md-button .md-button--primary target="_blank" }

## **Setting, Getting and Subscribing to xConfigurations** ~({{ config.cProps.rxp.sectionIds.jsxapi }}.3)~

!!! abstract

    Use `.get()` to read a configuration, `.set(value)` to change it, `.on(callback)` to observe every matching update, and `.once(callback)` to observe only the next update. The function returned by `.on()` or `.once()` removes that targeted Feedback Subscription.

???+ lesson "Lesson: Get an xConfiguration Value ~({{ config.cProps.rxp.sectionIds.jsxapi }}.3.1)~"

    - **xAPI:** `xConfiguration Audio DefaultVolume`

    ```shell title="Terminal xAPI form"
    xConfiguration Audio DefaultVolume
    ```

    - Derive the `xapi.Config` path and append the appropriate read method.
    - Replace the marked expression and run `node lesson.js`.

    ```javascript title="Scaffold — replace the marked expression"
    .on('ready', async (xapi) => {
      const targetConfig =
        /* Replace with the awaited JSXAPI expression */;

      console.log('DefaultVolume:', targetConfig);
      xapi.close();
    });
    ```

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="lesson.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                const targetConfig =
                  await xapi.Config.Audio.DefaultVolume.get();

                console.log('DefaultVolume:', targetConfig);
                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `DefaultVolume: 50` |

        Your value may be different.

    [Open xConfiguration Audio DefaultVolume](https://roomos.cisco.com/xapi/Configuration.Audio.DefaultVolume/){ .md-button .md-button--primary target="_blank" }

??? lesson "Lesson: Set a new xConfiguration Value ~({{ config.cProps.rxp.sectionIds.jsxapi }}.3.2)~"

    - **xAPI:** `xConfiguration Audio DefaultVolume`

    ```shell title="Terminal xAPI form"
    xConfiguration Audio DefaultVolume: 70
    ```

    - Derive the same `xapi.Config` path.
    - Append the write method and pass `70` as its value.

    ```javascript title="Scaffold — replace the marked expression"
    .on('ready', async (xapi) => {
      // Replace this comment with the awaited JSXAPI expression.
      console.log('DefaultVolume set to: 70');
      xapi.close();
    });
    ```

    - Run the file.
    - Press the <hl_5>Subscription Assistant Button</hl_5> on the RoomOS device's Touch Interface.
        - Under the <hl_2>xConfigurations</hl_2> page, confirm the slider labeled <hl_0>Audio DefaultVolume</hl_0> is set to <hl_1>70</hl_1>.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="lesson.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                await xapi.Config.Audio.DefaultVolume.set(70);
                console.log('DefaultVolume set to: 70');
                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `DefaultVolume set to: 70` |

    [Open xConfiguration Audio DefaultVolume](https://roomos.cisco.com/xapi/Configuration.Audio.DefaultVolume/){ .md-button .md-button--primary target="_blank" }

??? lesson "Lesson: Get multiple xConfigurations under a Common Node ~({{ config.cProps.rxp.sectionIds.jsxapi }}.3.3)~"

    - **xAPI:** `xConfiguration Audio`

    ```shell title="Terminal xAPI form"
    xConfiguration Audio
    ```

    - Stop the path at the `Audio` common node and apply the read method.
    - Replace the marked expression and inspect the returned object.

    ```javascript title="Scaffold — replace the marked expression"
    .on('ready', async (xapi) => {
      const audioConfigurations =
        /* Replace with the awaited JSXAPI expression */;

      console.log(JSON.stringify(audioConfigurations, null, 2));
      xapi.close();
    });
    ```

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="lesson.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                const audioConfigurations =
                  await xapi.Config.Audio.get();

                console.log(JSON.stringify(audioConfigurations, null, 2));
                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `{"DefaultVolume":"70","Input":{"...":"Additional Audio configuration nodes"}}` |

    [Search the RoomOS xAPI Reference for xConfiguration Audio](https://roomos.cisco.com/xapi/search?search=Configuration+Audio){ .md-button .md-button--primary target="_blank" }

??? lesson "Lesson: Subscribe and Unsubscribe to an xConfiguration ~({{ config.cProps.rxp.sectionIds.jsxapi }}.3.4)~"

    - **xAPI:** `xConfiguration Audio DefaultVolume`

    ```shell title="Terminal xAPI form"
    xFeedback Register Configuration/Audio/DefaultVolume
    ```

    - Create `subscription.js` from the scaffold.
    - Replace the marked expression with a JSXAPI `.on()` subscription.
    - Store the returned unsubscribe function in `unsubscribe`.

    ```javascript title="subscription.js — replace the marked expression"
    .on('ready', (xapi) => {
      const unsubscribe =
        /* Subscribe to Audio DefaultVolume and log each value */;

      console.log('Listening for 20 seconds...');

      setTimeout(() => {
        unsubscribe();
        xapi.close();
        console.log('DefaultVolume subscription stopped.');
      }, 20000);
    });
    ```

    - Run `node subscription.js` in the <hl_6>Laptop Terminal</hl_6>.
    - Press the <hl_5>Subscription Assistant Button</hl_5> on the RoomOS device's Touch Interface.
        - Under the <hl_2>xConfigurations</hl_2> page, move the slider labeled <hl_0>Audio DefaultVolume</hl_0> to several positions.
        - Observe each change in the <hl_6>Laptop Terminal</hl_6>.
    - After `DefaultVolume subscription stopped.` appears, move the slider again and confirm no new values print.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="subscription.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', (xapi) => {
                const unsubscribe =
                  xapi.Config.Audio.DefaultVolume.on((value) => {
                    console.log('DefaultVolume:', value);
                  });

                console.log('Listening for 20 seconds...');

                setTimeout(() => {
                  unsubscribe();
                  xapi.close();
                  console.log('DefaultVolume subscription stopped.');
                }, 20000);
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Listening for 20 seconds...` |
            | `stdout` | `DefaultVolume: 55` |
            | `stdout` | `DefaultVolume: 65` |
            | `stdout` | `DefaultVolume subscription stopped.` |

    **Observe Only the Next xConfiguration with `.once()`**

    Use `.on()` when every matching update matters. Use `.once()` when only the <hl_0>next matching update</hl_0> matters; JSXAPI removes that Feedback Subscription after its callback runs once.

    - Keep the same terminal feedback path.
    - Replace the marked expression with a `.once()` subscription.

    ```javascript title="Replace the one-time subscription expression"
    const cancelPending =
      /* Observe only the next Audio DefaultVolume value */;
    ```

    - Run the file, then use the <hl_5>Subscription Assistant Button</hl_5> to move <hl_0>Audio DefaultVolume</hl_0> at least twice.
    - Confirm only the first change prints.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="subscription.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', (xapi) => {
                const cancelPending =
                  xapi.Config.Audio.DefaultVolume.once((value) => {
                    console.log('First DefaultVolume:', value);
                  });

                console.log('Waiting 20 seconds for the next DefaultVolume...');

                setTimeout(() => {
                  cancelPending();
                  xapi.close();
                  console.log('One-time observation ended.');
                }, 20000);
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Waiting 20 seconds for the next DefaultVolume...` |
            | `stdout` | `First DefaultVolume: 55` |
            | `stdout` | `One-time observation ended.` |

    The function returned by `.once()` can cancel the pending subscription before the first update arrives. Calling it after the callback has run is safe but unnecessary because `.once()` has already unsubscribed.

    !!! warning

        Do not call the generic `xapi.Config.off()`, `xapi.Status.off()`, or `xapi.Event.off()` methods. JSXAPI marks that form as deprecated and throws an error. Keep the targeted function returned by `.on()` or `.once()`, or place returned functions in a feedback group.

??? lesson "Lesson: Subscribe and Unsubscribe to Multiple xConfigurations under a Common Node ~({{ config.cProps.rxp.sectionIds.jsxapi }}.3.5)~"

    - **xAPI:** `xConfiguration Video Input AirPlay`

    ```shell title="Terminal xAPI form"
    xFeedback Register Configuration/Video/Input/AirPlay
    ```

    - Reuse `subscription.js`.
    - Replace the marked expression with a subscription at the `AirPlay` common node.
    - Log the returned object so changes beneath that node remain distinguishable.

    ```javascript title="Replace the subscription expression"
    const unsubscribe =
      /* Subscribe to the Video Input AirPlay common node */;
    ```

    - Run the file in the <hl_6>Laptop Terminal</hl_6>.
    - Press the <hl_5>Subscription Assistant Button</hl_5> on the RoomOS device's Touch Interface.
        - Under the <hl_2>xConfigurations</hl_2> page, use the toggles and buttons in the <hl_0>AirPlay</hl_0> row.
        - Observe the different AirPlay configuration objects in the <hl_6>Laptop Terminal</hl_6>.
    - After `AirPlay subscription stopped.` appears, use the controls again and confirm no new values print.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="subscription.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', (xapi) => {
                const unsubscribe =
                  xapi.Config.Video.Input.AirPlay.on((configuration) => {
                    console.log('AirPlay:', JSON.stringify(configuration));
                  });

                console.log('Listening for 20 seconds...');

                setTimeout(() => {
                  unsubscribe();
                  xapi.close();
                  console.log('AirPlay subscription stopped.');
                }, 20000);
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Listening for 20 seconds...` |
            | `stdout` | `AirPlay: {"Mode":"On"}` |
            | `stdout` | `AirPlay: {"Beacon":"Auto"}` |
            | `stdout` | `AirPlay subscription stopped.` |

    [Search the RoomOS xAPI Reference for AirPlay configurations](https://roomos.cisco.com/xapi/search?search=Configuration+Video+Input+AirPlay){ .md-button .md-button--primary target="_blank" }

## **Getting and Subscribing to xStatuses** ~({{ config.cProps.rxp.sectionIds.jsxapi }}.4)~

!!! abstract

    An xStatus describes current RoomOS state. Read it with `.get()`, observe every matching change with `.on(callback)`, or observe only the next change with `.once(callback)`. Store and call the returned function when you need to unsubscribe before the subscription ends.

???+ lesson "Lesson: Get an xStatus Value ~({{ config.cProps.rxp.sectionIds.jsxapi }}.4.1)~"

    - **xAPI:** `xStatus Audio Volume`

    ```shell title="Terminal xAPI form"
    xStatus Audio Volume
    ```

    - Translate the path beneath `xapi.Status` and append the read method.

    ```javascript title="Scaffold — replace the marked expression"
    .on('ready', async (xapi) => {
      const targetStatus =
        /* Replace with the awaited JSXAPI expression */;

      console.log('Volume:', targetStatus);
      xapi.close();
    });
    ```

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="lesson.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                const targetStatus =
                  await xapi.Status.Audio.Volume.get();

                console.log('Volume:', targetStatus);
                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Volume: 50` |

    [Open xStatus Audio Volume](https://roomos.cisco.com/xapi/Status.Audio.Volume/){ .md-button .md-button--primary target="_blank" }

??? lesson "Lesson: Get multiple xStatuses under a Common Node ~({{ config.cProps.rxp.sectionIds.jsxapi }}.4.2)~"

    - **xAPI:** `xStatus Audio`

    ```shell title="Terminal xAPI form"
    xStatus Audio
    ```

    - Stop the path at the `Audio` common node and return the full object beneath it.

    ```javascript title="Scaffold — replace the marked expression"
    .on('ready', async (xapi) => {
      const audioStatuses =
        /* Replace with the awaited JSXAPI expression */;

      console.log(JSON.stringify(audioStatuses, null, 2));
      xapi.close();
    });
    ```

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="lesson.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                const audioStatuses =
                  await xapi.Status.Audio.get();

                console.log(JSON.stringify(audioStatuses, null, 2));
                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `{"Volume":"50","Input":{"...":"Additional Audio status nodes"}}` |

    [Search the RoomOS xAPI Reference for xStatus Audio](https://roomos.cisco.com/xapi/search?search=Status+Audio){ .md-button .md-button--primary target="_blank" }

??? lesson "Lesson: Subscribe and Unsubscribe to an xStatus ~({{ config.cProps.rxp.sectionIds.jsxapi }}.4.3)~"

    - **xAPI:** `xStatus Audio Volume`

    ```shell title="Terminal xAPI form"
    xFeedback Register Status/Audio/Volume
    ```

    - Reuse `subscription.js`.
    - Replace the marked expression with an `Audio Volume` status subscription.

    ```javascript title="Replace the subscription expression"
    const unsubscribe =
      /* Subscribe to Audio Volume and log each value */;
    ```

    - Run the file in the <hl_6>Laptop Terminal</hl_6>.
    - Press the <hl_5>Subscription Assistant Button</hl_5> on the RoomOS device's Touch Interface.
        - Under the <hl_5>xStatuses</hl_5> page, move the slider labeled <hl_0>Adjust Volume</hl_0> to several positions.
        - Observe each volume change in the <hl_6>Laptop Terminal</hl_6>.
    - After `Volume subscription stopped.` appears, move the slider again and confirm no new values print.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="subscription.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', (xapi) => {
                const unsubscribe =
                  xapi.Status.Audio.Volume.on((volume) => {
                    console.log('Volume:', volume);
                  });

                console.log('Listening for 20 seconds...');

                setTimeout(() => {
                  unsubscribe();
                  xapi.close();
                  console.log('Volume subscription stopped.');
                }, 20000);
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Listening for 20 seconds...` |
            | `stdout` | `Volume: 55` |
            | `stdout` | `Volume: 60` |
            | `stdout` | `Volume subscription stopped.` |

    **Observe Only the Next xStatus with `.once()`**

    - Keep the `Status/Audio/Volume` terminal feedback path.
    - Replace the marked expression with a `.once()` subscription.

    ```javascript title="Replace the one-time subscription expression"
    const cancelPending =
      /* Observe only the next Audio Volume status */;
    ```

    - Run the file, then use the <hl_5>Subscription Assistant Button</hl_5> to move <hl_0>Adjust Volume</hl_0> at least twice.
    - Confirm only the first status update prints.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="subscription.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', (xapi) => {
                const cancelPending =
                  xapi.Status.Audio.Volume.once((volume) => {
                    console.log('First Volume:', volume);
                  });

                console.log('Waiting 20 seconds for the next Volume...');

                setTimeout(() => {
                  cancelPending();
                  xapi.close();
                  console.log('One-time observation ended.');
                }, 20000);
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Waiting 20 seconds for the next Volume...` |
            | `stdout` | `First Volume: 55` |
            | `stdout` | `One-time observation ended.` |

    `.once()` automatically unsubscribes after the first matching status. Call `cancelPending()` only when you need to stop waiting before that first update.

??? lesson "Lesson: Subscribe and Unsubscribe to Multiple xStatuses under a Common Node ~({{ config.cProps.rxp.sectionIds.jsxapi }}.4.4)~"

    - **xAPI:** `xStatus Cameras Camera[N] Position`

    ```shell title="Terminal xAPI form"
    xFeedback Register Status/Cameras/Camera/Position
    ```

    - Reuse `subscription.js`.
    - Subscribe at the `Camera Position` common node so Pan, Tilt, and Zoom changes can arrive through one callback.

    ```javascript title="Replace the subscription expression"
    const unsubscribe =
      /* Subscribe to all Camera Position values */;
    ```

    - Run the file in the <hl_6>Laptop Terminal</hl_6>.
    - Press the <hl_5>Subscription Assistant Button</hl_5> on the RoomOS device's Touch Interface.
        - Under the <hl_5>xStatuses</hl_5> page, use the controls in the <hl_1>Camera Control Wheel</hl_1> row.
        - Observe the Pan, Tilt, and Zoom changes in the <hl_6>Laptop Terminal</hl_6>.
    - After `Camera position subscription stopped.` appears, move the camera again and confirm no new values print.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="subscription.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', (xapi) => {
                const unsubscribe =
                  xapi.Status.Cameras.Camera.Position.on((position) => {
                    console.log('Camera position:', JSON.stringify(position));
                  });

                console.log('Listening for 20 seconds...');

                setTimeout(() => {
                  unsubscribe();
                  xapi.close();
                  console.log('Camera position subscription stopped.');
                }, 20000);
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Listening for 20 seconds...` |
            | `stdout` | `Camera position: {"Zoom":"4295"}` |
            | `stdout` | `Camera position: {"Pan":"-65","Tilt":"123"}` |
            | `stdout` | `Camera position subscription stopped.` |

    [Search the RoomOS xAPI Reference for Camera Position statuses](https://roomos.cisco.com/xapi/search?search=Status+Cameras+Camera+Position){ .md-button .md-button--primary target="_blank" }

## **Subscribing to xEvents** ~({{ config.cProps.rxp.sectionIds.jsxapi }}.5)~

!!! abstract

    An xEvent reports a discrete occurrence. Use `.on(callback)` for every matching event or `.once(callback)` for only the next one. Event paths do not use `.get()` because an event has no current value to retrieve.

???+ lesson "Lesson: Subscribe and Unsubscribe to an xEvent ~({{ config.cProps.rxp.sectionIds.jsxapi }}.5.1)~"

    - **xAPI:** `xEvent UserInterface Extensions Widget Action`

    ```shell title="Terminal xAPI form"
    xFeedback Register Event/UserInterface/Extensions/Widget/Action
    ```

    - Reuse `subscription.js`.
    - Replace the marked expression with a `Widget Action` event subscription.

    ```javascript title="Replace the subscription expression"
    const unsubscribe =
      /* Subscribe to Widget Action and log each event */;
    ```

    - Run the file in the <hl_6>Laptop Terminal</hl_6>.
    - Press the <hl_5>Subscription Assistant Button</hl_5> on the RoomOS device's Touch Interface.
        - Under the <hl_3>xEvents</hl_3> page, interact with one or more <hl_0>widgets</hl_0>.
        - Observe each Widget Action event in the <hl_6>Laptop Terminal</hl_6>.
    - After `Widget Action subscription stopped.` appears, use a widget again and confirm no new events print.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="subscription.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', (xapi) => {
                const unsubscribe =
                  xapi.Event.UserInterface.Extensions.Widget.Action.on((event) => {
                    console.log('Widget action:', JSON.stringify(event));
                  });

                console.log('Listening for 20 seconds...');

                setTimeout(() => {
                  unsubscribe();
                  xapi.close();
                  console.log('Widget Action subscription stopped.');
                }, 20000);
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Listening for 20 seconds...` |
            | `stdout` | `Widget action: {"Type":"clicked","Value":"","WidgetId":"example_widget"}` |
            | `stdout` | `Widget Action subscription stopped.` |

    **Observe Only the Next xEvent with `.once()`**

    - Keep the `Event/UserInterface/Extensions/Widget/Action` terminal feedback path.
    - Replace the marked expression with a `.once()` subscription.

    ```javascript title="Replace the one-time subscription expression"
    const cancelPending =
      /* Observe only the next Widget Action event */;
    ```

    - Run the file, then use the <hl_5>Subscription Assistant Button</hl_5> to interact with a <hl_0>widget</hl_0> at least twice.
    - Confirm only the first Widget Action event prints.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="subscription.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', (xapi) => {
                const cancelPending =
                  xapi.Event.UserInterface.Extensions.Widget.Action.once((event) => {
                    console.log('First Widget action:', JSON.stringify(event));
                  });

                console.log('Waiting 20 seconds for the next Widget Action...');

                setTimeout(() => {
                  cancelPending();
                  xapi.close();
                  console.log('One-time observation ended.');
                }, 20000);
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Waiting 20 seconds for the next Widget Action...` |
            | `stdout` | `First Widget action: {"Type":"clicked","Value":"","WidgetId":"example_widget"}` |
            | `stdout` | `One-time observation ended.` |

    `.once()` automatically unsubscribes after the first matching event. Call `cancelPending()` only when you need to stop waiting before that event occurs.

    [Open xEvent UserInterface Extensions Widget Action](https://roomos.cisco.com/xapi/Event.UserInterface.Extensions.Widget.Action/){ .md-button .md-button--primary target="_blank" }

??? lesson "Lesson: Subscribe and Unsubscribe to Multiple xEvents under a Common Node ~({{ config.cProps.rxp.sectionIds.jsxapi }}.5.2)~"

    - **xAPI:** `xEvent UserInterface Extensions`

    ```shell title="Terminal xAPI form"
    xFeedback Register Event/UserInterface/Extensions
    ```

    - Reuse `subscription.js`.
    - Subscribe at the `Extensions` common node so panel, page, and widget events can reach one callback.

    ```javascript title="Replace the subscription expression"
    const unsubscribe =
      /* Subscribe to all UserInterface Extensions events */;
    ```

    - Run the file in the <hl_6>Laptop Terminal</hl_6>.
    - Press the <hl_5>Subscription Assistant Button</hl_5> on the RoomOS device's Touch Interface.
        - Opening the panel generates a <hl_0>Panel Clicked</hl_0> event.
        - Under the <hl_3>xEvents</hl_3> page, open pages and interact with several widgets.
        - Compare the panel, page, and widget event shapes in the <hl_6>Laptop Terminal</hl_6>.
    - After `UI Extensions subscription stopped.` appears, continue using the panel and confirm no new events print.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="subscription.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', (xapi) => {
                const unsubscribe =
                  xapi.Event.UserInterface.Extensions.on((event) => {
                    console.log('UI Extension event:', JSON.stringify(event));
                  });

                console.log('Listening for 20 seconds...');

                setTimeout(() => {
                  unsubscribe();
                  xapi.close();
                  console.log('UI Extensions subscription stopped.');
                }, 20000);
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Listening for 20 seconds...` |
            | `stdout` | `UI Extension event: {"Panel":{"Clicked":{"PanelId":"wx1_lab_multilineCommand"}}}` |
            | `stdout` | `UI Extension event: {"Widget":{"Action":{"Type":"clicked","WidgetId":"example_widget"}}}` |
            | `stdout` | `UI Extensions subscription stopped.` |

    [Search the RoomOS xAPI Reference for UI Extension events](https://roomos.cisco.com/xapi/search?search=Event+UserInterface+Extensions){ .md-button .md-button--primary target="_blank" }

??? lesson "Lesson: Group and Unsubscribe Multiple Feedback Subscriptions ~({{ config.cProps.rxp.sectionIds.jsxapi }}.5.3)~"

    A common-node subscription uses one callback for everything beneath that node. A <hl_3>feedback group</hl_3> instead keeps the unsubscribe functions from several exact Feedback Subscriptions together so one `group.off()` call can stop the set.

    ```shell title="Terminal xAPI forms"
    xFeedback Register Event/UserInterface/Extensions/Panel/Clicked
    xFeedback Register Event/UserInterface/Extensions/Event/PageOpened
    xFeedback Register Event/UserInterface/Extensions/Widget/Action
    ```

    - Reuse `subscription.js`.
    - Replace the marked lines with three `.on()` subscriptions based on the terminal paths above.
    - Add each subscription to the array passed to `xapi.feedback.group()`.

    ```javascript title="Replace the grouped subscription expressions"
    const subscriptionGroup = xapi.feedback.group([
      /* Subscribe to Panel Clicked and log the event */,
      /* Subscribe to Event PageOpened and log the event */,
      /* Subscribe to Widget Action and log the event */
    ]);
    ```

    - Run the file in the <hl_6>Laptop Terminal</hl_6>.
    - Press the <hl_5>Subscription Assistant Button</hl_5> on the RoomOS device's Touch Interface.
        - Opening the panel generates a <hl_0>Panel Clicked</hl_0> event.
        - Open a page, then interact with a widget.
        - Confirm the <hl_6>Laptop Terminal</hl_6> identifies each exact event separately.
    - After `Feedback group stopped.` appears, continue using the panel and confirm none of the three callbacks print again.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="subscription.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', (xapi) => {
                const subscriptionGroup = xapi.feedback.group([
                  xapi.Event.UserInterface.Extensions.Panel.Clicked.on((event) => {
                    console.log('Panel clicked:', JSON.stringify(event));
                  }),
                  xapi.Event.UserInterface.Extensions.Event.PageOpened.on((event) => {
                    console.log('Page opened:', JSON.stringify(event));
                  }),
                  xapi.Event.UserInterface.Extensions.Widget.Action.on((event) => {
                    console.log('Widget action:', JSON.stringify(event));
                  })
                ]);

                console.log('Listening for 20 seconds...');

                setTimeout(() => {
                  subscriptionGroup.off();
                  xapi.close();
                  console.log('Feedback group stopped.');
                }, 20000);
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Listening for 20 seconds...` |
            | `stdout` | `Panel clicked: {"PanelId":"wx1_1451_pt2_labBuddy"}` |
            | `stdout` | `Page opened: {"PageId":"wx1_1451_lB~xEvents"}` |
            | `stdout` | `Widget action: {"Type":"clicked","Value":"","WidgetId":"wx1_1451_lB~xEvents~Button~TextButton"}` |
            | `stdout` | `Feedback group stopped.` |

    Each `.on()` call creates its own Feedback Subscription before the group receives its unsubscribe function. The group does not merge the three subscriptions into one RoomOS feedback path.

    `subscriptionGroup.add(unsubscribe)` can track a later unsubscribe function. `subscriptionGroup.remove(unsubscribe)` only removes that function from the group; it does not unsubscribe it.

## **Inspect xAPI Availability** ~({{ config.cProps.rxp.sectionIds.jsxapi }}.6)~

!!! abstract

    A path that is available on one RoomOS device may be unavailable on another model, software version, or user account. Use `xapi.doc(path)` as a <hl_0>capability preflight</hl_0> before your application executes, reads, writes, or subscribes to a path whose availability is uncertain.

    `xapi.doc()` returns the device's schema metadata, such as the path's description, access level, allowed values, and required role. It does not return the path's current value; use `.get()` for that.

???+ lesson "Lesson: Inspect an xAPI Path Before Use ~({{ config.cProps.rxp.sectionIds.jsxapi }}.6.1)~"

    Inspect the schema for the same `Audio Volume` xStatus used earlier in the lab.

    ```shell title="Equivalent terminal schema request"
    xDocument Format: JSON Path: Status/Audio/Volume Schema: True
    ```

    - Create `inspect.js` from the scaffold.
    - Replace the marked expression with the JSXAPI schema request for `Status/Audio/Volume`.

    ```javascript title="inspect.js — replace the marked expression"
    .on('ready', async (xapi) => {
      const schema =
        /* Inspect the Status/Audio/Volume schema */;

      console.log(JSON.stringify(schema));
      xapi.close();
    });
    ```

    - Run `node inspect.js`.
    - Identify the returned <hl_1>description</hl_1>, <hl_2>ValueSpace</hl_2>, <hl_3>access</hl_3>, and <hl_5>read</hl_5> fields.
    - Compare the schema with the current value returned earlier by `xapi.Status.Audio.Volume.get()`.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="inspect.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                const schema =
                  await xapi.doc('Status/Audio/Volume');

                console.log(JSON.stringify(schema));
                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `{"ValueSpace":{"type":"Integer"},"access":"public-api","description":"Shows the volume level (dB) of the loudspeaker output.","read":"Admin;Integrator;User"}` |

        Schema wording and fields can vary with the RoomOS release and device.

??? lesson "Lesson: Check Whether an xAPI Path Is Available ~({{ config.cProps.rxp.sectionIds.jsxapi }}.6.2)~"

    !!! warning "This xAPI path is deliberately fabricated"

        `Status/LAB1451/FabricatedCapability` <hl_7>does not exist in RoomOS</hl_7>. It is used only to make the unavailable-path result predictable. Do not search for or deploy this path.

    Use `xapi.doc()` to decide whether the fabricated path is available before attempting to read or subscribe to it.

    - Create `availability.js` from the scaffold.
    - Replace only the marked expression with the JSXAPI schema request for `path`.

    ```javascript title="availability.js — replace the marked expression"
    .on('ready', async (xapi) => {
      const path = 'Status/LAB1451/FabricatedCapability';

      try {
        const schema =
          /* Inspect the schema for path */;

        console.log(schema === undefined
          ? `Unavailable: ${path}`
          : `Available: ${path}`);
      } catch (error) {
        console.log(`Unavailable: ${path}`);
      } finally {
        xapi.close();
      }
    });
    ```

    - Run `node availability.js`.
    - Confirm the application identifies the path as unavailable and never calls `.get()`, `.on()`, or another xAPI operation against it.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="availability.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                const path = 'Status/LAB1451/FabricatedCapability';

                try {
                  const schema = await xapi.doc(path);

                  console.log(schema === undefined
                    ? `Unavailable: ${path}`
                    : `Available: ${path}`);
                } catch (error) {
                  console.log(`Unavailable: ${path}`);
                } finally {
                  xapi.close();
                }
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Unavailable: Status/LAB1451/FabricatedCapability` |

    A real integration can use the same preflight pattern for optional device capabilities. Proceed with the dependent xAPI operation only when the schema is returned.

## **Troubleshoot JSXAPI Connections and Operations** ~({{ config.cProps.rxp.sectionIds.jsxapi }}.7)~

!!! abstract

    The `loglevel` connection option controls JSXAPI's internal diagnostic output. Levels are cumulative: each level includes the messages from the levels above it in this table.

    | Level | JSXAPI output | When it is useful |
    |:--|:--|:--|
    | `silent` | No internal messages | An application supplies all required logging |
    | `error` | Internal errors only | Reduce noise while retaining serious library failures |
    | `warn` | Warnings and errors; the default | Normal operation |
    | `info` | Connection targets, Feedback Subscription paths, warnings, and errors | Confirm where JSXAPI is connecting and what it is registering |
    | `debug` | Resolved connection options, JSON-RPC requests and responses, transport traffic, and all lower-level messages | Investigate connection or xAPI-operation behavior in a controlled environment |
    | `trace` | Every enabled JSXAPI message | Maximum verbosity; JSXAPI 6.0.0 accepts this level but does not currently add trace-only messages beyond `debug` |

    !!! danger "Do not expose credentials in diagnostic logs"

        JSXAPI 6.0.0 includes the resolved connection options—and therefore the resolved <hl_7>password</hl_7>—in `debug` and `trace` output. It can also expose xAPI payload data. Do not use those levels with live credentials or share their raw logs. Use a controlled environment and redact secrets and sensitive payloads before retaining or sharing output.

    `loglevel` changes JSXAPI's named logger for the entire Node.js process. If one process opens multiple JSXAPI connections, the most recent connection can change the level used by all of them. Diagnostic logging also does not replace `.on('error')`; keep the connection error handler.

???+ lesson "Lesson: Enable Safe Connection Diagnostics ~({{ config.cProps.rxp.sectionIds.jsxapi }}.7.1)~"

    Use `info` to observe the connection without logging the resolved password.

    - Add the setting to the secret-free example.

    ```text title="Add to .env.example"
    JSXAPI_LOG_LEVEL=
    ```

    - Enable `info` in the project-local environment file.

    ```text title="Add to .env"
    JSXAPI_LOG_LEVEL=info
    ```

    - In `lesson.js`, replace the marked line with the connection option that reads `JSXAPI_LOG_LEVEL` and falls back to `warn`.

    ```javascript title="Connection options — replace the marked line"
    .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
      username: process.env.ROOMOS_USERNAME,
      password: process.env.ROOMOS_PASSWORD,
      /* Set loglevel from JSXAPI_LOG_LEVEL and fall back to warn */
    })
    ```

    - Run `node lesson.js`.
    - Confirm the JSXAPI connection target appears before the ready message.
    - Change `JSXAPI_LOG_LEVEL` back to `warn` when troubleshooting is complete.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="lesson.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD,
                loglevel: process.env.JSXAPI_LOG_LEVEL || 'warn'
              })
              .on('error', (error) => {
                console.error('The JSXAPI connection failed:', error);
              })
              .on('close', () => {
                console.log('The JSXAPI connection is closed.');
              })
              .on('ready', (xapi) => {
                console.log(`JSXAPI ${xapi.version} is ready.`);
                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `[jsxapi] connecting to wss://[ROOMOS_IP_ADDRESS]` |
            | `stdout` | `JSXAPI 6.0.0 is ready.` |
            | `stdout` | `The JSXAPI connection is closed.` |

    ??? info "Recognize sanitized debug and trace output"

        At `debug` or `trace`, JSXAPI begins by logging an object similar to this. The password is redacted here; JSXAPI does <hl_7>not</hl_7> redact it for you.

        ```text title="Sanitized example — do not copy as runnable output"
        [jsxapi] using options: {
          protocol: 'wss:',
          host: '[ROOMOS_IP_ADDRESS]',
          username: '[ROOMOS_USERNAME]',
          password: '[REDACTED]',
          loglevel: 'debug'
        }
        [jsxapi] connecting to wss://[ROOMOS_IP_ADDRESS]
        [jsxapi] ... JSON-RPC and transport details omitted ...
        ```

        Start with `info`. Move to `debug` or `trace` only when the extra protocol detail is necessary and the environment is safe for sensitive diagnostics.

## **Section {{ config.cProps.rxp.sectionIds.jsxapi }} Cleanup** ~({{ config.cProps.rxp.sectionIds.jsxapi }}.8)~

- Press ++ctrl+c++ in every terminal running a JSXAPI application.
- Confirm each Node.js process returns to the terminal prompt.
- Keep `.env` out of source control and delete the lab credential file when the project is no longer needed.
- Run the shared RoomOS Section Cleanup below.

{{ config.cProps.rxp.sectionCleanup }}
