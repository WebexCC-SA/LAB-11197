{{ config.cProps.devNotice }}
{{ config.cProps.acronyms }}

# **Accessing the xAPI via WebSockets ~(section\ {{config.cProps.rxp.sectionIds.websocket}})~**

!!! Abstract

    WebSockets offer a way to enable real time communication over HTTP/HTTPS but allows for persistent communication, unlike an HTTP Post or Get request which briefly opens a socket and closes

    It's akin to our SSH, but differs in format, execution, network port and protocol for communication

    <a class="md-button md-button--primary" href="https://www.cisco.com/c/dam/en/us/td/docs/telepresence/endpoint/api/collaboration-endpoint-software-api-transport.pdf" target="_blank" >
          Learn more about our <strong>WebSocket xAPI</strong> <i class="fa-solid fa-square-up-right"></i>
    </a>


## **WebSocket Authentication and Format** ~({{config.cProps.rxp.sectionIds.websocket}}.1)~

!!! blank ""

    ### URL Structure ~({{config.cProps.rxp.sectionIds.websocket}}.1.1)~

    The request URL for your Codec will change depending on whether you're making a WebSocket or Secure WebSocket Connection

    !!! example ""

        === "WebSocket [ws]"

            ==ws==://[YOUR_DEVICE_IP]/ws

        === "Secure WebSocket [wss]"

            ==wss==://[YOUR_DEVICE_IP]/ws


    - - -

    ### Authentication Format ~({{config.cProps.rxp.sectionIds.websocket}}.1.2)~

    The Codec uses basic authentication to accept incoming requests. This authentication is formatted in base64 with it's username and password concatenated as a single string separated by a colon ==:==

    !!! example "Click on the tabs below to see how an example Username and Password transitions to base64"

        === "Base Credentials >"

            **Username**: ==admin==
            <br>
            **Password**: ==admin1234==

        === "Decoded String >"

            ==admin:admin1234==
            <br>
            <br>

        === "Base64 Encoded String >"

            ==YWRtaW46YWRtaW4xMjM0==
            <br>
            <br>

        === "Authorization Request Header"

            "Authorization": "Basic ==YWRtaW46YWRtaW4xMjM0=="
            <br>
            <br>

        === "Sec-WebSocket-Protocol Request Header"

            "Sec-WebSocket-Protocol": "auth-==YWRtaW46YWRtaW4xMjM0=="
            <br>
            <br>

    - - -

    ### Request Headers ~({{config.cProps.rxp.sectionIds.websocket}}.1.3)~

    Your WebSockets will use either the `Authorization` or `Sec-WebSocket-Protocol` as it's sole header

    <table>
        <thead>
            <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Use Case</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="white-space: nowrap;"><code>Authorization</code></td>
                <td style="white-space: nowrap;"><code>Basic [YOUR_BASE64_ENCODED_AUTH]</code></td>
                <td>Focused on authentication, ensuring the client is allowed to connect.</td>
            </tr>
            <tr>
                <td style="white-space: nowrap;"><code>Sec-WebSocket-Protocol</code></td>
                <td style="white-space: nowrap;"><code>auth-[YOUR_BASE64_ENCODED_AUTH]</code></td>
                <td>Focused on defining the protocol for the communication after the connection is established. This method is required for browser-based clients.</td>
            </tr>
        </tbody>
    </table>


    - - -

    ### Body Format ~({{config.cProps.rxp.sectionIds.websocket}}.1.4)~

    All WebSocket messages are formatted in JSON. They require the following Objects to be successful

    | Object  | Value          | Description                                            | IsRequired |
    |---------|----------------|--------------------------------------------------------|------------|
    | jsonrpc | "2.0"          | The JSON RPC Version                                   | Yes        |
    | id      | String/Integer | An identifier of this request. The server must reply with the same value in the Response object.   | Yes        |
    | method  | String         | A String containing the name of the method to be invoked. For example "xGet", "xQuery", "xCommand/[Path]" or "xSet". | Yes        |
    | params  | Nest Objects   | An Object that holds the parameter values to be used during the invocation of the method. The Object must have member names that match the names that the server expects.     | Yes        |

    !!! important "Review WebSocket Message Structure Examples and Responses"

        === "xCommand/[Path]"

            xCommand Paths follow the ==xCommand== method in the `method` object, separated by forward slash ( ==/== )

            Parameters for the xCommand are defined as individual objects under the `params` object written in JSON format

            === "Request <i class="fa-solid fa-share"></i>"

                ```JSON
                {
                  "jsonrpc": "2.0",
                  "id": 111,
                  "method": "xCommand/Dial",
                  "params": {
                    "Number": "bobby@example.com",
                    "Protocol": "Spark"
                  }
                }
                ```
            
            === "Response <i class="fa-solid fa-reply"></i>"

                ```JSON
                {
                  "jsonrpc": "2.0",
                  "id": 111,
                  "result": { // <-- This is the Value for your request
                  "CallId": 2,
                  "ConferenceId": 1
                  }
                }
                ```

            === "Error Response <i class="fa-solid fa-triangle-exclamation"></i>"

                ```JSON
                {
                  "jsonrpc": "2.0",
                  "id": 111,
                  "error": {
                    "code": 1,
                      "data": {
                      "Cause": 21
                    },
                    "message": "Not paired with isdn link"
                  }
                }
                ```

        === "xGet [xStatus/xConfiguration]"

            `xStatus` and `xConfiguration` branches can make use of the ==xGet== method. Unlike Commands, the xAPI path is provided in the params object under a Path object and is structured as an Array

            === "Request <i class="fa-solid fa-share"></i>"

                ```JSON
                {
                  "jsonrpc": "2.0",
                  "id": 102,
                  "method": "xGet",
                  "params": {
                    "Path": ["Configuration", "SystemUnit", "Name"]
                  }
                }   
                ```
            
            === "Response <i class="fa-solid fa-reply"></i>"

                ```JSON
                {
                  "jsonrpc": "2.0",
                  "id": 102,
                  "result": "my-device" // <-- This is the Value for your request
                }
                ```

        === "xQuery [xStatus/xConfiguration]"

            `xStatus` and `xConfiguration` branches can make use of the ==xQuery== method. xQuery is formatted and functions largely like the xGet method

            !!! note "Note the difference between `xQuery` and `xGet`"

                - The response to xQuery always starts from the top node, i.e. "Status" or "Configuration".
                - The response to xGet starts relative to the path given in the "Query".
                - xQuery can also implement Wildcards (`**`) in it's path, which matches zero or more levels in the path.

            === "Request <i class="fa-solid fa-share"></i>"

                ```JSON
                {
                  "jsonrpc": "2.0",
                  "id": 105,
                  "method": "xQuery",
                  "params": {
                    "Query": ["Status", "**", "DisplayName"] 
                  }
                }
                ```
            
            === "Response <i class="fa-solid fa-reply"></i>"

                ```JSON
                {
                  "jsonrpc": "2.0",
                  "id": 105,
                  "result": { // <-- This is the Value for your request
                    "Status": {
                      "SIP": {
                        "CallForward": {
                          "DisplayName": "Room Bar Pro"
                        }
                      },
                      "SystemUnit": {
                        "Software": {
                          "DisplayName": "RoomOS 11.20..."
                        }
                      }
                    }
                  }
                }
                ```

        === "xSet [xConfiguration]"

            === "Request <i class="fa-solid fa-share"></i>"

                ```JSON
                {
                  "jsonrpc": "2.0",
                  "id": 110,
                  "method": "xSet",
                  "params": {
                    "Path": ["Configuration","SystemUnit","Name"],
                    "Value": "My New System Name"
                  }
                }
                ```
            
            === "Response <i class="fa-solid fa-reply"></i>"

                ```JSON
                {
                  "jsonrpc": "2.0",
                  "id": 110,
                  "result": true // <-- This is the Value for your request
                }
                ```

        === "xFeedback [xStatus/xConfiguration/xEvent]"

            xFeedback, or Subscriptions, have 2 Id objects within the life of it's process. When sending any message, you will assign an `id` and get an initial response containing that same `id`. But when you subscribe, it will contain an additional ==Id== in it's results object which corresponds to this specific subscription. All notifications after the initial response from this subscription will contain the Subscription ==Id== not the initial message `id`. This is important, as you may have multiple or similar subscriptions you may want to instantiate and handle separately as you develop your solution.

            === "Subscribe Request <i class="fa-solid fa-share"></i>"

                ```JSON
                {
                  "jsonrpc": "2.0",
                  "id": 113, // <-- This is the Message id
                  "method": "xFeedback/Subscribe",
                  "params": {
                    "Query": ["Status", "Video", "Selfview"],
                    "NotifyCurrentValue": true // <-- When true, will respond with additional notifications
                  }
                }
                ```
            
            === "Initial Response <i class="fa-solid fa-reply"></i>"

                ```JSON
                {
                  "jsonrpc": "2.0",
                  "id": 113,
                  "result": { // <-- This is the Value for your request
                    "Id": 1 // <-- This is the Subscription Id of the new feedback registration. Use this Subscription Id to map incoming notifications to the initial subscription request, or to unsubscribe from this data
                  }
                }
                ```

            === "Notification Response <i class="fa-solid fa-reply"></i>"

                ```JSON
                {
                  "jsonrpc": "2.0",
                  "method": "xFeedback/Event",
                  "params": {
                    "Id": 1, // <-- This is the Subscription Id of the feedback registration.
                    "Status": {
                      "Video": {
                        "Selfview": {
                          "FullscreenMode": "Off",
                          "Mode": "Off",
                          "OnMonitorRole": "First",
                          "PIPPosition": "CenterRight"
                        }
                      }
                    }
                  }
                }
                ```

            === "Unsubscribe Request <i class="fa-solid fa-share"></i>"

                ```JSON
                {
                  "jsonrpc": "2.0",
                  "id": 113, // <-- This is the Message id
                  "method": "xFeedback/Subscribe",
                  "params": {
                    "Id": 1, // <-- This is the Subscription Id of the initial feedback registration.
                  }
                }
                ```
            
            ??? curious "Subscription Visual Flow"

                ``` mermaid
                sequenceDiagram
                    participant My Customization
                    participant Target Codec
                    My Customization<<-->>Target Codec: WebSocket Connection
                    Note over My Customization,Target Codec: Register Subscription
                    My Customization->>+Target Codec: xFeedback/Subscribe [Message `id`#58; 101]
                    Target Codec ->> My Customization: Acknowledges Message `id`#58; 101<br>[Provides Subscription `Id`#58; 1]
                    Note over My Customization,Target Codec: Incoming Events
                    Target Codec -->>+ My Customization: <br> Event Payload. Contains [Subscription `Id`#58; 1]
                    Target Codec -->> My Customization: <br> Event Payload. [Subscription `Id`#58; 1]
                    Target Codec -->>- My Customization: <br> ........... [Subscription `Id`#58; 1]
                    Note over My Customization,Target Codec: Deregister Subscription
                    My Customization->>-Target Codec: xFeedback/Unsubscribe <br>Provide Subscription [`Id`#58; 1] NOT Message [`id`#58; 101] as param<br>[Subscription `Id`#58; 1]
                ```

    - - -

    ### Full WebSocket examples ~({{config.cProps.rxp.sectionIds.websocket}}.1.5)~

    ??? success "Click to view a Full Example of each written using NodeJs [Javascript Backend]"

        ``` javascript
        const WebSocket = require('ws');

        // Base64 encode your username and password for Basic Auth
        const username = 'admin';
        const password = 'admin1234';
        const ipAddress = 'X.X.X.X';
        const encoded_auth = Buffer.from(`${username}:${password}`).toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+/g, '');

        // Define the subprotocol including custom authentication
        const subprotocols = [`auth-${encoded_auth}`];

        // Create a WebSocket connection, requesting the subprotocols
        const socket = new WebSocket(`wss://${ipAddress}/ws`, subprotocols, {
          rejectUnauthorized: false
        });

        socket.on('open', () => {
          console.log('WebSocket established against Codec');

          // Structure your xAPI message to send
          const message = {
            "jsonrpc": "2.0",
            "id": "xStatus SystemUnit Uptime",
            "method": "xGet",
            "params": {
              "Path": ["Status", "SystemUnit", "Uptime"]
            }
          };

          // Send the JSON message as a string
          socket.send(JSON.stringify(message));
        });

        socket.on('message', (message) => {
          try {
            const data = JSON.parse(message);
            console.log('Parsed response:', data);

            socket.close();
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        });

        socket.on('error', (error) => {
          console.error('WebSocket error observed:', error);
          socket.close();
        });

        socket.on('close', (event) => {
          console.log('WebSocket connection closed:', event);
        });
        ```

    ??? success "Click to view a Full Example of each written using the Python WebSocket-client API"

        ``` Python
        import WebSocket
        import json
        import base64

        # Base64 encode your username and password for Basic Auth
        username = 'admin'
        password = 'admin1234'
        ip_address = 'X.X.X.X'  # Replace with your actual IP address
        encoded_auth = base64.b64encode(f"{username}:{password}".encode()).decode()
        encoded_auth = encoded_auth.replace('+', '-').replace('/', '_').replace('=', '')

        # Define the subprotocol including custom authentication
        subprotocols = f"auth-{encoded_auth}"

        # Define the WebSocket URL
        ws_url = f"wss://{ip_address}/ws"

        # Define the on_open event
        def on_open(ws):
            print("WebSocket established against Codec")

            # Structure your xAPI message to send
            message = {
                "jsonrpc": "2.0",
                "id": "xStatus Systemunit Uptime",
                "method": "xGet",
                "params": {
                    "Path": ["Status", "SystemUnit", "Uptime"]
                }
            }

            # Send the JSON message as a string
            ws.send(json.dumps(message))

        # Define the on_message event
        def on_message(ws, message):
            try:
                data = json.loads(message)
                print("Parsed response:", data)

                # Close the WebSocket after receiving the message
                ws.close()
            except json.JSONDecodeError as error:
                print("Error parsing JSON:", error)

        # Define the on_error event
        def on_error(ws, error):
            print("WebSocket error observed:", error)
            ws.close()

        # Define the on_close event
        def on_close(ws, close_status_code, close_msg):
            print("WebSocket connection closed:", close_msg)

        # Create the WebSocket application
        ws = WebSocket.WebSocketApp(ws_url,
                                    subprotocols=[subprotocols],
                                    on_open=on_open,
                                    on_message=on_message,
                                    on_error=on_error,
                                    on_close=on_close)

        # Allow self-signed certificates
        ws.run_forever(sslopt={"cert_reqs": 0})
        ```

## **Create and Configure Postman Collection**  ~({{config.cProps.rxp.sectionIds.websocket}}.2)~

!!! success ""

    Unfortunately, we can't provide a WebSocket collection in Postman for you, as WebSocket collection exports are not available in PostMan as of October 2024

    However, you can still use Postman to setup WebSocket requests. Use the guide below as an example to build a WebSocket collection and requests in Postman before moving into Section 2.4's lessons

    ???+ tool "Lesson Setup"

        === "1. Create First WebSocket Request"

            - In order to create a new Collection Folder, we need to instantiate a new Request first, then assign it to a new folder

            === "Select New"

                ![Select New](./images/2-4-CreatePostmanCollection/Select%20New.png)

            === "Select WebSocket"

                ![Select WebSocket](./images/2-4-CreatePostmanCollection/Select%20WebSocket.png)


        === "2. Save the Request and create a new Collection"

            - Once you have your new request made, select save, then assign a Name for the Request and creat a folder for this request

            - For this first request, assign the name {++Request Template++}

                - For each lesson, we'll duplicate/fork this request

            - Name the folder {++xAPI-WebSockets++}

            ![First WebSocket Request](./images/2-4-CreatePostmanCollection/Save%20Request%20and%20Make%20Collection.png)


        === "3. Configure your Collection Variables"

            - To simplify the process, assign variables to the entire collection

            - Select the new {++xAPI-WebSockets++} folder

            - Select variables and assign the following variables

                - `device_ipAddress`
                - `device_base64_encoded_auth`
            
            - In the Current Value Column, 
            
                - Set your Device IP Address for `device_ipAddress`
                - Set your device login credentials encoded in base64 for `device_base64_encoded_auth`

            ![Configure Variables](./images/2-4-CreatePostmanCollection/Add%20Variables.png)

        === "4. Assign your Request Template URL and Headers"

            - Select your ==Request Template== request

            - Use {++wss://{{device_ipAddress}}/ws++} as your URL

                - `{{device_ipAddress}}` will access your Device IP current value

            - Select the Headers Tab and assign the following headers

                | **Header**             | **Value**                             |
                |------------------------|---------------------------------------|
                | Authorization          | Basic  {{device_base64_encoded_auth}} |
                | Sec-WebSocket-Protocol | auth- {{device_base64_encoded_auth}}  |

            
            ![Assign URL and Headers](./images/2-4-CreatePostmanCollection/Configure%20Request.png)


        === "5. Assign Request Template Message Body"

            - Select the Message Tab and assign the following body template

            ``` JSON
            {
              "jsonrpc": "2.0",
              "id": "",
              "method": "",
              "params": {}
            }
            ```

            ![Message Body](./images/2-4-CreatePostmanCollection/Message%20Body.png)

!!! important

    For each lesson in section 2.4 do the following with your WebSocket ==Request Template==

    - Duplicate the ==Request Template==
    - Rename the Duplicate request to match the name of the lesson
    - Assign the Id value in the Message Body to the lesson name
    - Follow the lesson tasks

## **Executing xCommands**  ~({{config.cProps.rxp.sectionIds.websocket}}.3)~

???+ lesson "Lesson: Execute an xCommand ~({{config.cProps.rxp.sectionIds.websocket}}.3.1)~"

    !!! info inline end "Message Body Location"

        <figure markdown>
          ![Message body location](./images/2-4-3_Execute-xCommand-BodyLocation.png){ width="400" }
        </figure>

    - **xAPI:** xCommand Video Selfview Set

    - **Task:** 
        - Assign the correct ==Method== to the `method` object for xCommands
        - Fill in the `params` object using the following parameters
            - Mode: On
            - FullScreenMode: On
            - OnMonitorRole: First

    - Once the Message body has been updated
        - ==Save== the request
        - Select ==Connect== to establish the WebSocket connection to the Codec
        - select ==Send== and review the Postman Terminal's repsonse and observe any changes to your device
    
    - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? question "Need Help with the Syntax?"

        <a class="md-button md-button--primary" href="../cheatsheet" target="_blank" >
          Open the <strong>WebSocket Method and Parameter</strong> Table in the CheatSheet <i class="fa-solid fa-square-up-right"></i>
        </a>

    ??? success "View properly formatted Message and Successful Response"


        === "Message Body `JSON`"

              ``` { .json }
              {
                "jsonrpc": "2.0",
                "id": "Execute an xCommand",
                "method": "xCommand/Video/Selfview/Set",
                "params": {
                  "Mode": "On",
                  "FullScreenMode": "On",
                  "OnMonitorRole":"First"
                }
              }
              ```

        === "Response Body"

            ``` { .json , .no-copy }
            {
              "id": "Execute an xCommand",
              "jsonrpc": "2.0",
              "result": { // <-- This is the Value for your request
                "status": "OK"
              }
            }
            ```

??? lesson "Lesson: Execute an xCommand with multiple arguments with the same name"

    In cases where we need to declare multiple arguments of the same name, rather than duplicating and re-running the parameters, we instead leverage an Array in place of the value, containing all values we want to implement under that Parameter

    <a class="md-button md-button--primary" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" target="_blank" >
      Learn more about <strong>Arrays</strong> <i class="fa-solid fa-square-up-right"></i>
    </a>

    !!! example "Click on the tabs to see how Terminal Syntax relates to WebSocket Syntax"

        === "Terminal Syntax"

            ``` { .shell }
            xParent Child ChildParam_X: 1, ChildParam_X: 2
            ```
            

        === "WebSocket Syntax"

            ``` { .json , title="Body" }
            {
              "jsonrpc": "2.0",
              "id": "Example Syntax",
              "method": "xParent/Child",
              "params": {
                "ChildParam_X": [1, 1]
              }
            }
            ```

    - **xAPI:** xCommand Video Input SetMainVideoSource

    - **Task:** 
        - Assign the correct ==Method== to the `method` object for xCommands
        - Fill in the `params` object using the following parameters, but duplicate the ConnectorId
            - ConnectorId: 1
            - Layout: Equal

    - Once the Message body has been updated
        - ==Save== the request
        - Select ==Connect== to establish the WebSocket connection to the Codec
        - select ==Send== and review the Postman Terminal's repsonse and observe any changes to your device
    
    - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View Successful OSD Output"

        <figure markdown>
          ![Official API Doc](./images/2-2-3_SetMain-2xEqual.png){ width="400" }
        </figure>

    ??? success "View properly formatted Message and Successful Response"

        === "Message Body `JSON`"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Execute an xCommand with multiple arguments with the same name",
              "method": "xCommand/Video/Input/SetMainVideoSource",
              "params": {
                "ConnectorId": [1, 1],
                "Layout":"Equal"
              }
            }
            ```

        === "Response Body"

            ``` { .json , .no-copy }
            {
              "id": "Execute an xCommand with multiple arguments with the same name",
              "jsonrpc": "2.0",
              "result": { // <-- This is the Value for your request
                "status": "OK"
              }
            }
            ```

??? lesson "Lesson: Execute an xCommand with a multiline argument"

    !!! info

        Multiline Arguments can be placed into the `params` object as well. This specifically uses a `body` object which will contain your multi-line argument.

        The structure of a Multiline argument should look similar to the following

    !!! example "Click on the tabs to see how Terminal Syntax relates to WebSocket Syntax"

        === "Terminal Syntax"

            ``` { .shell }
            [xParent Child ChildParam_X: SomeValue]
            [Multi Line Content]
            .
            ```
            

        === "WebSocket Syntax"

            ``` { .json , title="Body" }
            {
              "jsonrpc": "2.0",
              "id": "Example Syntax",
              "method": "xParent/Child",
              "params": {
                "ChildParam_X": "SomeValue",
                "body": "Multi Line Content"
              }
            }
            ```

    !!! note

        Your Selfview may still be open

        Run the following in your terminal window to close selfview

        ``` shell
        xCommand Video Selfview Set Mode: Off
        ```

        ??? challenge "Challenge: Alter `Execute an xCommand` in your WebSocket Postman Collection"

              Rather than re-open your terminal session, you can go back to `Execute an xCommand` in your WebSocket Postman Collection, and update the `params` object to set the Mode parameter to Off

              <a class="md-button md-button--primary" href="../challengeAnswers/" target="_blank" >
                Giving Up? Check out the Challenge Answers Page <i class="fa-solid fa-square-up-right"></i>
              </a>


    - **xAPI:** xCommand UserInterface Extensions Panel Save

    - **Task:** 
        - Assign the correct ==Method== to the `method` object for xCommands
        - Fill in the `params` object using the following parameters
            - PanelId: wx1_lab_multilineCommand
            - body:
                  ```{ .xml , title="Your &lt;body&gt; Value" }
                  <Extensions>
                    <Panel>
                      <Order>1</Order>
                      <PanelId>wx1_lab_multilineCommand</PanelId>
                      <Location>HomeScreen</Location>
                      <Icon>Info</Icon>
                      <Color>#FF70CF</Color>
                      <Name>MultiLine Command [Section 2.4.3]</Name>
                      <ActivityType>Custom</ActivityType>
                    </Panel>
                  </Extensions>
                  ```

    - Once the Message body has been updated
        - ==Save== the request
        - Select ==Connect== to establish the WebSocket connection to the Codec
        - select ==Send== and review the Postman Terminal's repsonse and observe any changes to your device
    
    - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View Successful OSD Output"

        <figure markdown="span">
          ![OSD Output](./images/2-4-3_xCommand-MultiLineOSD-Success.png){ width="500" }
          <figcaption>What to expect on your OSD on a successful request</figcaption>
        </figure>

    ??? success "View properly formatted Message and Successful Response"

        === "Message Body `JSON`"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Execute an xCommand with a multiline argument",
              "method": "xCommand/UserInterface/Extensions/Panel/Save",
              "params": {
                "PanelId": "wx1_lab_multilineCommand",
                "body":"<Extensions> <Panel> <Order>1</Order> <PanelId>wx1_lab_multilineCommand</PanelId> <Location>HomeScreen</Location> <Icon>Info</Icon> <Color>#FFCC00</Color> <Name>MultiLine Command [Section 2.4.3]</Name> <ActivityType>Custom</ActivityType> </Panel> </Extensions>"
              }
            }
            ```

        === "Response Body"

            ``` { .json , .no-copy }
            {
              "id": "Execute an xCommand with a multiline argument",
              "jsonrpc": "2.0",
              "result": { // <-- This is the Value for your request
                "status": "OK"
              }
            }
            ```

??? lesson "Lesson: Execute an xCommand which generates data and responds"

    - **xAPI:** xCommand UserInterface Extensions List

    - **Task:** 
        - Assign the correct ==Method== to the `method` object for xCommands
        - Fill in the `params` object using the following parameters
            - ActivityType: Custom

    - Once the Message body has been updated
        - ==Save== the request
        - Select ==Connect== to establish the WebSocket connection to the Codec
        - select ==Send== and review the Postman Terminal's repsonse and observe any changes to your device
    
    - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View properly formatted Message and Successful Response"

        === "Message Body"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Execute an xCommand with a multiline argument",
              "method": "xCommand/UserInterface/Extensions/List",
              "params": {
                "ActivityType": "Custom"
              }
            }
            ```

        === "Response Body"

            ``` { .json , .no-copy }
            {
              "id": "Execute an xCommand with a multiline argument",
              "jsonrpc": "2.0",
              "result": { // <-- This is the Value for your request
                "Extensions": {
                  "Panel": [
                    {
                      "ActivityType": "Custom",
                      "Color": "#FFCC00",
                      "Icon": "Info",
                      "Location": "HomeScreen",
                      "Name": "MultiLine Command [Section 2.4.3]",
                      "Order": 1,
                      "Origin": "local",
                      "PanelId": "wx1_lab_multilineCommand",
                      "Visibility": "Auto",
                      "id": 1
                    }
                  ],
                  "Version": "1.11"
                },
                "status": "OK"
              }
            }
            ```

## **Getting, Setting and Subscribing to xConfigurations**  ~({{config.cProps.rxp.sectionIds.websocket}}.4)~

???+ lesson "Lesson: Set a new xConfiguration Value"

    !!! info inline end "Message Body Location"

        <figure markdown>
          ![Message Body Location](./images/2-4-3_Execute-xCommand-BodyLocation.png){ width="400" }
        </figure>

    - **xAPI:** xConfiguration Audio DefaultVolume

    - **Task:** 
    
        - Assign the correct ==Method== to the `method` object for setting xConfigurations
        - Within the `params` object, fill in the `Path` object using the xAPI above and place it's new Configuration Value in the `Value` object

        - Once the Message body has been updated
            - ==Save== the request
            - Select ==Connect== to establish the WebSocket connection to the Codec
            - select ==Send== and review the Postman Terminal's repsonse
    
    - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? question "Need Help with the Syntax?"

        <a class="md-button md-button--primary" href="../cheatsheet" target="_blank" >
          Open the <strong>WebSocket Method and Parameter</strong> Table in the CheatSheet <i class="fa-solid fa-square-up-right"></i>
        </a>

    ??? success "View properly formatted Message and Successful Response"

        === "Message Body `JSON`"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Set a new xConfiguration Value",
              "method": "xSet",
              "params": {
                "Path": ["Configuration", "Audio", "DefaultVolume"],
                "Value": 75
              }
            }
            ```

        === "Response Body"

            ``` { .json , .no-copy }
            {
              "id": "Set a new xConfiguration Value",
              "jsonrpc": "2.0",
              "result": true // <-- This is the Value for your request
            }
            ```

??? lesson "Lesson: Getting an xConfiguration Value"

    - **xAPI:** xConfiguration Audio DefaultVolume

    - **Task:** 
        - Assign the correct ==Method== to the `method` object for setting xConfigurations
        - Within the `params` object, fill in the `Path` object using the xAPI above

    - Once the Message body has been updated
        - ==Save== the request
        - Select ==Connect== to establish the WebSocket connection to the Codec
        - select ==Send== and review the Postman Terminal's repsonse
    
    - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View properly formatted Message and Successful Response"

        === "Message Body `JSON`"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Getting an xConfiguration Value",
              "method": "xGet",
              "params": {
                "Path": ["Configuration", "Audio", "DefaultVolume"]
              }
            }
            ```

        === "Response Body"

            ``` { .json , .no-copy }
            {
              "id": "Getting an xConfiguration Value",
              "jsonrpc": "2.0",
              "result": 75 // <-- This is the Value for your request
            }
            ```

??? lesson "Lesson: Get multiple xConfiguration Values under a Common Node"

    - **xAPI:** xConfiguration Audio

    - **Task:** 
        - Assign the correct ==Method== to the `method` object for setting xConfigurations
        - Within the `params` object, fill in the `Path` object using the xAPI above

    - Once the Message body has been updated
        - ==Save== the request
        - Select ==Connect== to establish the WebSocket connection to the Codec
        - select ==Send== and review the Postman Terminal's repsonse
    
    - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View properly formatted Message and Successful Response"

        === "Message Body `JSON`"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Get multiple xConfiguration Values under a Common Node",
              "method": "xGet",
              "params": {
                "Path": ["Configuration", "Audio"]
              }
            }
            ```

        === "Response Body"

            ``` { .json , .no-copy }
            {
              "id": "Get multiple xConfiguration Values under a Common Node",
              "jsonrpc": "2.0",
              "result": { // <-- This is the Value for your request
                "DefaultVolume": 75,
                "Input": {
                  "Microphone": [
                    {
                      "Mode": "On",
                      "Zone": 1,
                      "id": 1
                    },
                    {
                      "EchoControl": {
                        "Mode": "On",
                        "NoiseReduction": "On"
                      },
                      "Gain": 20,
                      "Mode": "On",
                      "Zone": 1,
                      "id": 2
                    },
                    {
                      "EchoControl": {
                        "Mode": "On",
                        "NoiseReduction": "On"
                      },
                      "Gain": 20,
                      "Mode": "On",
                      "Zone": 1,
                      "id": 3
                    }
                  ],
                  "USBC": [
                    {
                      "Gain": -5,
                      "Mode": "On",
                      "VideoAssociation": {
                        "MuteOnInactiveVideo": "On"
                      },
                      "id": 1
                    }
                  ],
                  "USBMicrophone": [
                    {
                      "EchoControl": {
                        "Mode": "On"
                      },
                      "Gain": 5,
                      "Zone": 1,
                      "id": 1
                    }
                  ]
                },
                "Microphones": {
                  "BeamMix": {
                    "Inputs": "Auto"
                  },
                  "Mute": {
                    "Enabled": "True"
                  },
                  "NearTalkerSector": {
                    "Mode": "Off"
                  },
                  "NoiseRemoval": {
                    "Mode": "Enabled"
                  },
                  "PhantomPower": "On",
                  "UsbPassthrough": {
                    "MuteButton": "Active"
                  },
                  "VoiceActivityDetector": {
                    "Mode": "Off"
                  }
                },
                "Output": {
                  "InternalSpeaker": {
                    "Mode": "On"
                  },
                  "Line": [
                    {
                      "Mode": "On",
                      "OutputType": "Loudspeaker",
                      "id": 1
                    }
                  ]
                },
                "Panning": {
                  "Mode": "Auto"
                },
                "Placement": "Wallmount",
                "SoundsAndAlerts": {
                  "RingTone": "Sunrise",
                  "RingVolume": 50
                },
              }
            }
            ```

??? lesson "Lesson: Query an xConfiguration Value"

    - **xAPI:** xConfiguration SystemUnit Name

    - **Task:** 
        - Assign the correct ==Method== to the `method` object for setting xConfigurations
        - Within the `params` object, fill in the `Query` object using the xAPI above

    - Once the Message body has been updated
        - ==Save== the request
        - Select ==Connect== to establish the WebSocket connection to the Codec
        - select ==Send== and review the Postman Terminal's repsonse
    
    - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View properly formatted Message and Successful Response"

        === "Message Body `JSON`"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Query an xConfiguration Value",
              "method": "xQuery",
              "params": {
                "Query": ["Configuration", "SystemUnit", "Name"]
              }
            }
            ```

        === "Response Body"

            ``` { .json , .no-copy }
            {
              "id": "Query an xConfiguration Value",
              "jsonrpc": "2.0",
              "result": { // <-- This is the Value for your request
                "Configuration": {
                  "SystemUnit": {
                    "Name": "Room Bar Pro"
                  }
                }
              }
            }
            ```

??? lesson "Lesson: Query an xConfiguration Value using a WildCard"

    !!! info

        When forming an xQuery Message, you can use `**` as a wildcard value within the path of the xAPI. This will return any matching nodes following `**` similar to the role of `//` in an SSH session.

    - **xAPI:** xConfiguration ** Name

    - **Task:** 
        - Assign the correct ==Method== to the `method` object for setting xConfigurations
        - Within the `params` object, fill in the `Query` object using the xAPI above. Be sure to treat `**` as a separate entity in the xAPI Path.

        - Once the Message body has been updated
            - ==Save== the request
            - Select ==Connect== to establish the WebSocket connection to the Codec
            - select ==Send== and review the Postman Terminal's repsonse
        
        - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View properly formatted Message and Successful Response"

        === "Message Body `JSON`"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Query an xConfiguration Value using a WildCard",
              "method": "xQuery",
              "params": {
                "Query": ["Configuration", "**", "Name"]
              }
            }
            ```

        === "Response Body"

            ``` { .json , .no-copy }
            {
              "id": "Query an xConfiguration Value using a WildCard",
              "jsonrpc": "2.0",
              "result": { // <-- This is the Value for your request
                "Configuration": {
                  "FacilityService": {
                    "Service": [
                      {
                        "Name": "Live Support",
                        "id": 1
                      },
                      {
                        "Name": "",
                        "id": 2
                      },
                      {
                        "Name": "",
                        "id": 3
                      },
                      {
                        "Name": "",
                        "id": 4
                      },
                      {
                        "Name": "",
                        "id": 5
                      }
                    ]
                  },
                  "Network": [
                    {
                      "DNS": {
                        "Domain": {
                          "Name": ""
                        }
                      },
                      "id": 1
                    }
                  ],
                  "SystemUnit": {
                    "Name": "Room Bar Pro"
                  },
                  "UserInterface": {
                    "Theme": {
                      "Name": "Night"
                    }
                  },
                  "Video": {
                    "Input": {
                      "Connector": [
                        {
                          "Name": "Camera",
                          "id": 1
                        },
                        {
                          "Name": "PC (HDMI)",
                          "id": 2
                        },
                        {
                          "Name": "PC (USB-C)",
                          "id": 3
                        }
                      ]
                    }
                  }
                }
              }
            }
            ```

??? lesson "Lesson: Subscribe and Unsubscribe to an xConfiguration"

    - **xAPI:** xConfiguration Audio DefaultVolume

    - **Task:** 

        - Subscribe

            - Assign the correct ==Method== to the `method` object in order to {++Subscribe++} to an xConfiguration
            - Within the `params` object, fill in the `Query` object using the xAPI above

            - Once the Message body has been updated
                - ==Save== the request
                - Select ==Connect== to establish the WebSocket connection to the Codec
                - Select ==Send==
                - Observe the Initial Response in the Postman Terminal
                    - Record the responses Result Id value ```result: {Id: ##}``` [This is your Subscription Id]
            
            - Press the `Subscription Assistant Button` on your Touch Interface
                - Under the xConfigurations Page, move the Slider labeled ==Audio DefaultVolume== to a new position and release
                - Observe your {++Postman Terminal++} output, you should see events for your Subscription fill the {++Postman Terminal++}
                    - ==Optional==: Move the slider a few more times to see more changes come in
          
          - Unsubscribe
              - Assign the correct ==Method== to the `method` object in order to {++Unsubscribe++} from an xConfiguration
              - Within the `params` object, fill in the `Query` object the Subscription Id you recorded

              - Once the Message body has been updated
                  - ==Save== the request
                  - Select ==Send==
                  - Observe the Initial Response in the Postman Terminal
              
              - Press the `Subscription Assistant Button` on your Touch Interface
                  - Under the xConfigurations Page, move the Slider labeled ==Audio DefaultVolume== to a new position and release
                  - Observe your {++Postman Terminal++} output, those responses you saw in the previous lesson should have stopped outputting in your {++Postman Terminal++}
                      - ==Optional==: Move the slider a few more times to see more changes come in

        - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

        ??? success "View properly formatted Message"

            === "Subscribe Message body"

                ``` { .json }
                {
                  "jsonrpc": "2.0",
                  "id": "Subscribing to an xConfiguration",
                  "method": "xFeedback/Subscribe",
                  "params": {
                    "Query": ["Configuration","Audio","DefaultVolume"],
                    "NotifyCurrentValue": true
                  }
                }
                ```

            === "Unsubscribe Message Body"

                ``` { .json , .no-copy }
                {
                  "jsonrpc": "2.0",
                  "id": "Unsubscribing to an xConfiguration",
                  "method": "xFeedback/Unsubscribe",
                  "params": {
                    "Id": 1 //<-- NOTE: You're Id may differ
                  }
                }
                ```

??? lesson "Lesson: Subscribe and Unsubscribe to Multiple xConfigurations under a Common Node"

    - **xAPI:** xConfiguration Airplay

    - **Task:** 
    
        - Assign the correct ==Method== to the `method` object in order to {++Subscribe++} to an xConfiguration
            - Within the `params` object, fill in the `Query` object using the xAPI above

            - Once the Message body has been updated
                - ==Save== the request
                - Select ==Connect== to establish the WebSocket connection to the Codec
                - Select ==Send==
                - Observe the Initial Response in the Postman Terminal
                    - Record the responses Result Id value ```result: {Id: ##}``` [This is your Subscription Id]
            
            - Press the `Subscription Assistant Button` on your Touch Interface
                - Under the xConfigurations Page, press the toggles and buttons in the ==Airplay== row
                - Observe your {++Postman Terminal++} output, you should see events for your Subscription fill the {++Postman Terminal++}
                    - ==Optional==: Move the slider a few more times to see more changes come in
          
          - Unsubscribe
              - Assign the correct ==Method== to the `method` object in order to {++Unsubscribe++} from an xConfiguration
              - Within the `params` object, fill in the `Query` object the Subscription Id you recorded

              - Once the Message body has been updated
                  - ==Save== the request
                  - Select ==Send==
                  - Observe the Initial Response in the Postman Terminal
              
              - Press the `Subscription Assistant Button` on your Touch Interface
                  - Under the xConfigurations Page, press the toggles and buttons in the ==Airplay== row
                  - Observe your {++Postman Terminal++} output, those responses you saw in the previous lesson should have stopped outputting in your {++Postman Terminal++}
                      - ==Optional==: Move the slider a few more times to see more changes come in
    
    - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View properly formatted Messages"

        === "Subscribe Message body"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Subscribe to Multiple xConfigurations under a Common Node",
              "method": "xFeedback/Subscribe",
              "params": {
                "Query": ["Configuration","Video","Input","Airplay"],
                "NotifyCurrentValue": true
              }
            }
            ```

        === "Unsubscribe Message Body"

            ``` { .json , .no-copy }
            {
              "jsonrpc": "2.0",
              "id": "Unsubscribing to an xConfiguration",
              "method": "xFeedback/Unsubscribe",
              "params": {
                "Id": 1 //<-- NOTE: You're Id may differ
              }
            }
            ```

## **Getting and Subscribing to xStatuses** ~({{config.cProps.rxp.sectionIds.websocket}}.5)~

???+ lesson "Lesson: Getting an xStatus Value"

    !!! info inline end "Message body location"

        <figure markdown>
          ![Message body location](./images/2-4-3_Execute-xCommand-BodyLocation.png){ width="400" }
        </figure>

    - **xAPI:** xStatus Audio Volume

    - **Task:** 
        - Assign the correct ==Method== to the `method` object for getting an xStatus
        - Within the `params` object, fill in the `Path` object using the xAPI above

        - Once the Message body has been updated
            - ==Save== the request
            - Select ==Connect== to establish the WebSocket connection to the Codec
            - select ==Send== and review the Postman Terminal's repsonse
        
        - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? question "Need Help with the Syntax?"

        <a class="md-button md-button--primary" href="../cheatsheet" target="_blank" >
          Open the <strong>WebSocket Method and Parameter</strong> Table in the CheatSheet <i class="fa-solid fa-square-up-right"></i>
        </a>

    ??? success "View properly formatted Message and Successful Response"

        === "Message Body `JSON`"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Getting an xStatus Value",
              "method": "xGet",
              "params": {
                "Path": ["Status", "Audio", "Volume"]
              }
            }
            ```

        === "Response Body"

            ``` { .json , .no-copy }
            {
              "id": "Getting an xStatus Value",
              "jsonrpc": "2.0",
              "result": 50 // <-- This is the Value for your request
            }
            ```

??? lesson "Lesson: Get multiple xStatuses Values under a Common Node"

    - **xAPI:** xStatus Audio

    - **Task:** 
        - Assign the correct ==Method== to the `method` object for getting an xStatus
        - Within the `params` object, fill in the `Path` object using the xAPI above

        - Once the Message body has been updated
            - ==Save== the request
            - Select ==Connect== to establish the WebSocket connection to the Codec
            - select ==Send== and review the Postman Terminal's repsonse
        
        - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View properly formatted Message and Successful Response"

        === "Message Body `JSON`"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Get multiple xStatuses Values under a Common Node",
              "method": "xGet",
              "params": {
                "Path": ["Status", "Audio"]
              }
            }
            ```

        === "Response Body"

            ``` { .json , .no-copy }
            {
              "id": "Get multiple xStatuses Values under a Common Node",
              "jsonrpc": "2.0",
              "result": {
                "Devices": {
                  "Bluetooth": {
                    "ActiveProfile": "None"
                  },
                  "HandsetUSB": {
                    "ConnectionStatus": "NotConnected",
                    "Cradle": "OnHook"
                  },
                  "HeadsetUSB": {
                    "ConnectionStatus": "NotConnected",
                    "Description": "",
                    "Manufacturer": ""
                  }
                },
                "Input": {
                  "Connectors": {
                    "HDMI": [
                      {
                        "Mute": "On",
                        "id": 1
                      }
                    ],
                    "Microphone": [
                      {
                        "ConnectionStatus": "Connected",
                        "id": 1
                      },
                      {
                        "ConnectionStatus": "NotConnected",
                        "id": 2
                      },
                      {
                        "ConnectionStatus": "NotConnected",
                        "id": 3
                      }
                    ],
                    "USBC": [
                      {
                        "Mute": "On",
                        "id": 1
                      }
                    ]
                  }
                },
                "Microphones": {
                  "MusicMode": "Off",
                  "Mute": "Off",
                  "NoiseRemoval": "On",
                  "VoiceActivityDetector": {
                    "Activity": "False"
                  }
                },
                "Output": {
                  "Connectors": {
                    "HDMI": [
                      {
                        "Mode": "DelayMeasurement",
                        "id": 1
                      }
                    ],
                    "InternalSpeaker": [
                      {
                        "DelayMs": 0,
                        "id": 1
                      }
                    ],
                    "Line": [
                      {
                        "ConnectionStatus": "NotConnected",
                        "DelayMs": 0,
                        "id": 1
                      }
                    ]
                  },
                  "MeasuredHdmiArcDelay": 0,
                  "MeasuredHdmiDelay": 0,
                  "ReportedHdmiCecDelay": 0
                },
                "SelectedDevice": "Internal",
                "Ultrasound": {
                  "Volume": 70
                },
                "Volume": 50,
                "VolumeHandsetUsb": 50,
                "VolumeHeadsetBluetooth": 50,
                "VolumeHeadsetUsb": 50,
                "VolumeInternal": 50,
                "VolumeMute": "Off"
              }
            }
            ```

??? lesson "Lesson: Query an xStatus Value"

    - **xAPI:** xStatus Video Input Airplay Status

    - **Task:** 
        - Assign the correct ==Method== to the `method` object for querying an xStatus
        - Within the `params` object, fill in the `Query` object using the xAPI above

        - Once the Message body has been updated
            - ==Save== the request
            - Select ==Connect== to establish the WebSocket connection to the Codec
            - select ==Send== and review the Postman Terminal's repsonse
        
        - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View properly formatted Message and Successful Response"

        === "Message Body `JSON`"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Query an xStatus Value",
              "method": "xQuery",
              "params": {
                "Query": ["Status", "Video", "Input", "Airplay", "Status"]
              }
            }
            ```

        === "Response Body"

            ``` { .json , .no-copy }
            {
              "id": "Query an xStatus Value",
              "jsonrpc": "2.0",
              "result": {
                "Status": {
                  "Video": {
                    "Input": {
                      "AirPlay": {
                        "Status": "Active"
                      }
                    }
                  }
                }
              }
            }
            ```

??? lesson "Lesson: Query an xStatus Value using a WildCard"

    - **xAPI:** xStatus ** Temperature

    - **Task:** 

        - Assign the correct ==Method== to the `method` object for getting an xStatus
        - Within the `params` object, fill in the `Query` object using the xAPI above. Be sure to treat `**` as a separate entity in the xAPI Path.

        - Once the Message body has been updated
            - ==Save== the request
            - Select ==Connect== to establish the WebSocket connection to the Codec
            - select ==Send== and review the Postman Terminal's repsonse
        
        - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View properly formatted Message and Successful Response"

        === "Message Body `JSON`"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Query an xStatus Value using a WildCard",
              "method": "xQuery",
              "params": {
                "Query": ["Status", "**", "Temperature"]
              }
            }
            ```

        === "Response Body"

            ``` { .json , .no-copy }
            {
              "id": "Query an xStatus Value using a WildCard",
              "jsonrpc": "2.0",
              "result": {
                "Status": {
                  "SystemUnit": {
                    "Hardware": {
                      "Monitoring": {
                        "Temperature": {
                          "Status": "Normal"
                        }
                      }
                    }
                  },
                  "Video": {
                    "Output": {
                      "Monitor": [
                        {
                          "Temperature": "Normal",
                          "id": 1
                        }
                      ]
                    }
                  }
                }
              }
            }
            ```

??? lesson "Lesson: Subscribe and Unsubscribe to an xStatus"

    - **xAPI:** xStatus Audio Volume

    - **Task:** 
    
        - Assign the correct ==Method== to the `method` object in order to {++Subscribe++} to an xStatus
            - Within the `params` object, fill in the `Query` object using the xAPI above

            - Once the Message body has been updated
                - ==Save== the request
                - Select ==Connect== to establish the WebSocket connection to the Codec
                - Select ==Send==
                - Observe the Initial Response in the Postman Terminal
                    - Record the responses Result Id value ```result: {Id: ##}``` [This is your Subscription Id]
            
            - Press the `Subscription Assistant Button` on your Touch Interface
            - Under the xStatuses Page, move the Slider labeled ==Adjust Volume,== to a new position and release
                - Alternatively, you can adjust the volume with the Codec's native volume control buttons
            - Observe your {++Postman Terminal++} output, you should see events for your Subscription fill the {++Postman Terminal++}
                - ==Optional==: Move the slider a few more times to see more changes come in
          
          - Unsubscribe
              - Assign the correct ==Method== to the `method` object in order to {++Unsubscribe++} from an xStatus
              - Within the `params` object, fill in the `Query` object the Subscription Id you recorded

              - Once the Message body has been updated
                  - ==Save== the request
                  - Select ==Send==
                  - Observe the Initial Response in the Postman Terminal
              
              - Press the `Subscription Assistant Button` on your Touch Interface
                  - Under the xStatuses Page, move the Slider labeled ==Adjust Volume,== to a new position and release
                      - Alternatively, you can adjust the volume with the Codec's native volume control buttons
                  - Observe your {++Postman Terminal++} output, those responses you saw in the previous lesson should have stopped outputting in your {++Postman Terminal++}
                      - ==Optional==: Move the slider a few more times to see more changes come in
    
    - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View properly formatted Messages"

        === "Subscribe Message body"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Subscribe to an xStatus",
              "method": "xFeedback/Subscribe",
              "params": {
                "Query": ["Status", "Audio", "Volume"],
                "NotifyCurrentValue": true
              }
            }
            ```

        === "Unsubscribe Message Body"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Unsubscribe to an xStatus",
              "method": "xFeedback/Unsubscribe",
              "params": {
                "Id": 1 //<-- NOTE: You're Id may differ
              }
            }
            ```
        
    ??? gif "View Subscription Assistant"
                
        <figure markdown>
          ![SubAssist Operation](./images/SubscriptionAssitantMacro-Operation.gif){ width="600" }
        </figure>

??? lesson "Lesson: Subscribe and Unsubscribe to Multiple xStatuses under a Common Node"

    - **xAPI:** xStatus Cameras Camera [N] Position

    - **Task:**
        
        - Assign the correct ==Method== to the `method` object in order to {++Subscribe++} to an xStatus
            - Within the `params` object, fill in the `Query` object using the xAPI above

            - Once the Message body has been updated
                - ==Save== the request
                - Select ==Connect== to establish the WebSocket connection to the Codec
                - Select ==Send==
                - Observe the Initial Response in the Postman Terminal
                    - Record the responses Result Id value ```result: {Id: ##}``` [This is your Subscription Id]
            
            - Press the `Subscription Assistant Button` on your Touch Interface
                - Under the xStatuses Page, click the button in the ==Camera Control Wheel== row
                    - Alternatively, you can adjust your cameras position through the native camera control interface
                - Observe your {++Postman Terminal++} output, you should see events for your Subscription fill the {++Postman Terminal++}
                    - ==Optional==: Continue pressing buttons to see more changes come in

        - Unsubscribe
              - Assign the correct ==Method== to the `method` object in order to {++Unsubscribe++} from an xStatus
              - Within the `params` object, fill in the `Query` object the Subscription Id you recorded

              - Once the Message body has been updated
                  - ==Save== the request
                  - Select ==Send==
                  - Observe the Initial Response in the Postman Terminal
              
              - Press the `Subscription Assistant Button` on your Touch Interface
                  - Under the xStatuses Page, click the button in the ==Camera Control Wheel== row
                      - Alternatively, you can adjust your cameras position through the native camera control interface
                  - Observe your {++Postman Terminal++} output, you should see events for your Subscription fill the {++Postman Terminal++}
                      - ==Optional==: Continue pressing buttons to see more changes come in
    
    - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View properly formatted Messages"

        === "Subscribe Message body"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Subscribe to Multiple xStatuses under a Common Node",
              "method": "xFeedback/Subscribe",
              "params": {
                "Query": ["Status", "Cameras", "Camera", "Position"],
                "NotifyCurrentValue": true
              }
            }
            ```

        === "Unsubscribe Message Body"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Unsubscribe to Multiple xStatuses under a Common Node",
              "method": "xFeedback/Unsubscribe",
              "params": {
                "Id": 1 //<-- NOTE: You're Id may differ
              }
            }
            ```

    ??? gif "View Subscription Assistant"
                
        <figure markdown>
          ![SubAssist Operation](./images/SubscriptionAssitantMacro-Operation.gif){ width="600" }
        </figure>

## **Subscribing to xEvents** ~({{config.cProps.rxp.sectionIds.websocket}}.6)~

???+ blank "Subscribe and Unsubscribe to an xEvent"

    !!! info inline end "XML Body Location"

        <figure markdown>
          ![Message body location](./images/2-4-3_Execute-xCommand-BodyLocation.png){ width="400" }
        </figure>

    - **xAPI:** xEvent UserInterface Message Prompt Response

    - **Task:** 
        - Assign the correct ==Method== to the `method` object in order to {++Subscribe++} to an xStatus
            - Within the `params` object, fill in the `Query` object using the xAPI above

            - Once the Message body has been updated
                - ==Save== the request
                - Select ==Connect== to establish the WebSocket connection to the Codec
                - Select ==Send==
                - Observe the Initial Response in the Postman Terminal
                    - Record the responses Result Id value ```result: {Id: ##}``` [This is your Subscription Id]
            
            - Press the `Subscription Assistant Button` on your Touch Interface
                - Under the xEvents Page, click the {++Prompt Button++} in the ==UserInterface Message== row
                    - This will create a Pop Up with 5 options
                    - Click on any of these 5 Options
                - Observe your {++Postman Terminal++} output, you should see events for your Subscription fill the {++Postman Terminal++}
                    - ==Optional==: Try each of the options under `Prompt` and continue to observe your {++Postman Terminal++}
                - Press click either the `TextInput`, the `Rating` or the `Alert` button and submit any accompanying actions in that interface
                - Observe your {++Postman Terminal++} output, you should see events for your Subscription fill the {++Postman Terminal++}
                    - Responses for `TextInput`, `Rating` or `Alert` shouldn't show since you're currently only subscribed to `Prompt`
          
          - Unsubscribe
              - Assign the correct ==Method== to the `method` object in order to {++Unsubscribe++} from an xStatus
              - Within the `params` object, fill in the `Query` object the Subscription Id you recorded

              - Once the Message body has been updated
                  - ==Save== the request
                  - Select ==Send==
                  - Observe the Initial Response in the Postman Terminal
              
              - Press the `Subscription Assistant Button` on your Touch Interface
                  - Under the xStatuses Page, move the Slider labeled ==Adjust Volume,== to a new position and release
                      - Alternatively, you can adjust the volume with the Codec's native volume control buttons
                  - Observe your {++Postman Terminal++} output, those responses you saw in the previous lesson should have stopped outputting in your {++Postman Terminal++}
                      - ==Optional==: Move the slider a few more times to see more changes come in
    
    - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? question "Need Help with the Syntax?"

        <a class="md-button md-button--primary" href="../cheatsheet" target="_blank" >
          Open the <strong>WebSocket Method and Parameter</strong> Table in the CheatSheet <i class="fa-solid fa-square-up-right"></i>
        </a>

    ??? success "View properly formatted Messages"

        === "Subscribe Message body"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Subscribe to an xEvent",
              "method": "xFeedback/Subscribe",
              "params": {
                "Query": ["Event", "UserInterface", "Message", "Prompt", "Response"]
              }
            }
            ```

        === "Unsubscribe Message Body"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Unsubscribe to an xEvent",
              "method": "xFeedback/Subscribe",
              "params": {
                "Id": 1 //<-- NOTE: You're Id may differ
              }
            }
            ```
    
    ??? gif "View Subscription Assistant"
                
        <figure markdown>
          ![SubAssist Operation](./images/SubscriptionAssitantMacro-Operation.gif){ width="600" }
        </figure>

??? lesson "Lesson: Subscribe and Unsubscribe to Multiple xEvents under a Common Node"

    - **xAPI:** xEvent UserInterface

    - **Task:** 

        - Assign the correct ==Method== to the `method` object in order to {++Subscribe++} to an xEvent
            - Within the `params` object, fill in the `Query` object using the xAPI above

            - Once the Message body has been updated
                - ==Save== the request
                - Select ==Connect== to establish the WebSocket connection to the Codec
                - Select ==Send==
                - Observe the Initial Response in the Postman Terminal
                    - Record the responses Result Id value ```result: {Id: ##}``` [This is your Subscription Id]
            
            - Press the `Subscription Assistant Button` on your Touch Interface
                - Under the xEvents Page, try any of the `Widgets` on this page, and submit any accompanying actions in that interface if any
                - Observe your {++Postman Terminal++} output, you should see events for your Subscription fill the {++Postman Terminal++}
                    - ==Optional==: Try all of the `Widget` on that page :smiley:

        - Unsubscribe
              - Assign the correct ==Method== to the `method` object in order to {++Unsubscribe++} from an xStatus
              - Within the `params` object, fill in the `Query` object the Subscription Id you recorded

              - Once the Message body has been updated
                  - ==Save== the request
                  - Select ==Send==
                  - Observe the Initial Response in the Postman Terminal
              
              - Press the `Subscription Assistant Button` on your Touch Interface
                  - Under the xEvents Page, try any of the `Widgets` on this page, and submit any accompanying actions in that interface if any
                  - Observe your {++Postman Terminal++} output, those responses you saw in the previous lesson should have stopped outputting in your {++Postman Terminal++}
                      - ==Optional==: Continue pressing buttons to see more changes come in
    
    - When you've finished this lesson, select ==Disconnect== to terminate the WebSocket connection

    ??? success "View properly formatted Messages"

        === "Subscribe Message body"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Subscribe to Multiple xEvents under a Common Node",
              "method": "xFeedback/Subscribe",
              "params": {
                "Query": ["Event", "UserInterface"]
              }
            }
            ```

        === "Unsubscribe Message Body"

            ``` { .json }
            {
              "jsonrpc": "2.0",
              "id": "Unsubscribe to Multiple xEvents under a Common Node",
              "method": "xFeedback/Subscribe",
              "params": {
                "Id": 1 //<-- NOTE: You're Id may differ
              }
            }
            ```

    ??? gif "View Subscription Assistant"
                
        <figure markdown>
          ![SubAssist Operation](./images/SubscriptionAssitantMacro-Operation.gif){ width="600" }
        </figure>

## **Section {{config.cProps.rxp.sectionIds.websocket}} Cleanup** ~({{config.cProps.rxp.sectionIds.websocket}}.8)~

!!! important

    - Press the `Subscription Assistant Button` on your Touch Interface
    - Under the ==Section Cleanup== Page, select the ==Run Section Cleanup?== button
    - Select ==Yes, Run the Cleanup Script==

    <figure markdown="span">
      ![Section cleanup](./images/SubscriptionAssitantMacro-ConfirmCleanup.png){ width="400" }
      <figcaption>Section Cleanup Confirmation</figcaption>
    </figure>

    This will reverse the changes we've made to the endpoint, and leave us ready for the next section


    ??? question "You can run the cleanup via the terminal as well"

        Copy the contents below into your terminal window and run them all at once

        ```shell title="Type into terminal and press Enter"
        xConfig Audio DefaultVolume: 50
        xCommand UserInterface Extensions Panel Remove PanelId: wx1_lab_multilineCommand
        xCommand Video Selfview Set Mode: Off FullscreenMode: Off
        xCommand Video Input SetMainVideoSource ConnectorId: 1
        xCommand Audio Volume SetToDefault Device: Internal
        xCommand HTTPFeedBack Deregister FeedbackSlot: 1 FeedbackSlot: 2 FeedbackSlot: 3 FeedbackSlot: 4
        ```