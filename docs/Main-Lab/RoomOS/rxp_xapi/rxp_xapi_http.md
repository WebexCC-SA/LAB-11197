{{ config.cProps.devNotice }}
{{ config.cProps.acronyms }}
# Access RoomOS xAPI via HTTP ~(section\ {{config.cProps.rxp.sectionIds.http}})~

!!! abstract

    In this section, we'll dive into the various pieces of the RoomOS Device xAPI stack and how to make use of them in various ways over the Hypertext Transfer Protocol (HTTP) using local authentication on a Cisco RoomOS Device.

    Here, we'll see the relationships between HTTP and SSH on how to structure an xConfiguration, xCommand, xStatus and xEvents to a Cisco RoomOS device

    !!! curious "Click the Tabs Below to see how HTTP xAPI calls communicate"

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


## Section {{config.cProps.rxp.sectionIds.http}} Requirements

!!! important ""

    !!! note inline end

        This lab assumes you have access to a Cisco RoomOS Device that is already setup and ready for use. If your device is not registered and online, please do so before beginning

    **Hardware**

    - A Laptop
    - A Cisco Desk, Board or Room Series Device running the most recent On Premise or Cloud Stable software
        - A Touch Controller is required when working on a Room Series Device. Either Room navigator or 3rd part touch display
        - Preferred Device: Cisco Desk Pro
    - A minimum of 1 camera (Either Integrated or External)

    **Software**

    - Laptop
        - Recommended Browser: Chrome or Firefox
        - Postman
        - Section {{config.cProps.rxp.sectionIds.http}} Postman Collection
        - Webhook.site

    - RoomOS Device
        - Either the current On Premise or Cloud Stable release


## Section {{config.cProps.rxp.sectionIds.http}} Setup

!!! important ""

    - If joining from a Lab at WebexOne, Postman should be installed on your loaner laptop already, if not, please install the application now using the link below
    
    - In addition to the Postman application, please download the Postman Collection listed below

    - We'll also be leveraging a Webhook testing site, click the link below to open this is site in a new tab

    <div class="grid cards" markdown>

    -   <i class="fa-solid fa-download"></i> __Click the icon below for the Postman Download Page__

        ---

        <a href="https://www.Postman.com/downloads/" target="_blank">
          <figure markdown="span">
              ![Postman Download](https://voyager.postman.com/logo/postman-logo-icon-orange.svg){ width="75" }
          </figure>
        </a>
    
    -   <i class="fa-solid fa-download"></i> __Click the icon below for the Section {{config.cProps.rxp.sectionIds.http}} Postman Collection__

        ---

        <a href="https://github.com/WebexCC-SA/LAB-1451/raw/refs/heads/main/docs/Main-Lab/DownloadContent/PostMan%20Collections/WX1-Lab-1451-HTTP-PostMan-Collection.postman_collection.json.zip" target="_blank">
          <figure markdown="span">
              ![Postman Collection](https://voyager.postman.com/logo/postman-logo-icon-orange.svg){ width="75" }
          </figure>
        </a>

    -   <i class="fa-solid fa-globe"></i> __Click the icon below for the WebHook Site__ <br><br>

        ---
        <a href="https://webhook.site/" target="_blank">
          <figure markdown="span">
            ![Webhook.site](https://cdn.webhook.site/icon.png){ width="75" }
          </figure>
        </a>

    </div>

## **HTTP Authentication and Format** ~({{config.cProps.rxp.sectionIds.http}}.1)~
 
!!! blank ""

    <h4>URL Structure ~({{config.cProps.rxp.sectionIds.http}}.1.1)~</h4>

    The request URL for your Codec will change depending on whether you're making a Get or Post Call

    Click the tabs below to see an example of each URL structure

    !!! example ""

        === "Get URL"

            https://[YOUR_DEVICE_IP]/<hl_0>getxml?location=[YOUR_XAPI_PATH_BODY]</hl_0>

        === "Post URL"

            https://[YOUR_DEVICE_IP]/<hl_0>putxml</hl_0>


    - - -

    <h4>Authentication Format ~({{config.cProps.rxp.sectionIds.http}}.1.2)~</h4>

    When using HTTP to talk to a Cisco RoomOS Device locally, the device uses basic authentication to accept those requests. This authentication is formatted in base64 with it's username and password concatenated as a single string separated by a colon <hl_4>**:**</hl_4>

    !!! example "Click on the tabs below to see how a Username and Password transitions to an encoded base64 string"

        === "Device Credentials >"

            **Username**: <hl_0>admin</hl_0>
            <br>
            **Password**: <hl_7>admin1234</hl_7>

        === "Decoded String >"

            <hl_0>admin</hl_0><hl_4>**:**</hl_4><hl_7>admin1234</hl_7>
            <br>
            <br>

        === "Encoded Base64 String >"

            <hl_5>YWRtaW46YWRtaW4xMjM0</hl_5>
            <br>
            <br>

        === "Authorization Request Header"

            "Authorization": "Basic <hl_5>YWRtaW46YWRtaW4xMjM0</hl_5>"
            <br>
            <br>

    - - -

    <h4>Request Headers ~({{config.cProps.rxp.sectionIds.http}}.1.3)~</h4>

    HTTP Requests have a myriad of headers that could be used, and this is usually defined by the device or service you're communicating with. For Cisco RoomOS devices using local authentication your requests will use the following headers

    Your Get and Post requests will use this Authorization in one of its 2 headers

    | Key                         | Value                             |
    | :---------------------------| :---------------------------------|
    | `Content-Type`              | `text/xml`                        |
    | `Authorization`             | `Basic [YOUR_BASE64_ENCODED_AUTH]` |

    - - -

    <h4>URL Parameter Format ~({{config.cProps.rxp.sectionIds.http}}.1.4)~</h4>

    When retrieving xStatus or xConfiguration information, you'll perform an HTTP Get request. Get requests using HTTP and local authentication will target this base url

    <pre><code>https://<hl_0>[YOUR_DEVICE_IP]</hl_0>/getxml</code></pre>

    The xAPI path you want to target is then defined as a URL parameter

    This xAPI path is separated by a <hl_3>/</hl_3> and is placed behind the parameter <hl_6>?location=</hl_6> the prefix <hl_7>x</hl_7> is removed from that start of the xAPI Path

    ??? "Click here to see the difference between a shell path and a Local HTTP Get Path"

        === "Shell Path"
            <pre class="no-copy-code-button"><code> <hl_7>x</hl_7><hl_1>Path Bookings Current Id</hl_1> </code></pre>

        === "Local HTTP GET Path"
            <pre class="no-copy-code-button"><code>https://<hl_0>[YOUR_DEVICE_IP]</hl_0>/getxml?location=<hl_1>Status</hl_1><hl_3>/</hl_3><hl_1>Bookings</hl_1><hl_3>/</hl_3><hl_1>Current</hl_1><hl_3>/</hl_3><hl_1>Id</hl_1></code></pre>

    !!! example ""

        === "xConfiguration Example"

            xAPI: xConfiguration SystemUnit Name

            URL: https://<hl_0>[YOUR_DEVICE_IP]</hl_0>/getxml?location\=<hl_1>Configuration</hl_1><hl_3>/</hl_3><hl_1>SystemUnit</hl_1><hl_3>/</hl_3><hl_1>Name</hl_1>

        === "xStatus Example"

            xAPI: xStatus Logging ExtendedLogging Mode

            URL: https://<hl_0>[YOUR_DEVICE_IP]</hl_0>/getxml?location\=<hl_1>Status</hl_1><hl_3>/</hl_3><hl_1>Logging</hl_1><hl_3>/</hl_3><hl_1>ExtendedLogging</hl_1><hl_3>/</hl_3><hl_1>Mode</hl_1>

    <h4>Body Format ~({{config.cProps.rxp.sectionIds.http}}.1.5)~</h4>

    When issuing a change to an xConfig or issuing an xCommand, you'll perform an HTTP POST request. POST requests using HTTP and local authentication will target this base url

    <pre><code>https://<hl_0>[YOUR_DEVICE_IP]</hl_0>/putxml</code></pre>
    
    The xAPI path you want to target is then defined in the body of the request
    
    The body is structured as XML and is formatted as a string. The entire xAPI path, parameters and any values are defined within this XML string.

    !!! example ""

        URL: https://[YOUR_DEVICE_IP]/putxml

        Click the tabs below to see an example xConfiguration and xCommand body structured as XML

        !!! important ""

            === "xConfiguration Example"

                - <{--x--}{++Configuration++}></{--x--}{++Configuration++}>
                - <{--x--}{++Command++}></{--x--}{++Configuration++}>
                - <{--x--}{++Status++}></{--x--}{++Configuration++}>

                ``` { .xml , title="Example XML Structure" } 
                <Parent>
                  <Child>
                    <ChildParameter>Value<ChildParameter>
                  </Child>
                <Parent>
                ```
                
            === "xCommand Example"
            
                - <{--x--}{++Configuration++}></{--x--}{++Configuration++}>
                - <{--x--}{++Command++}></{--x--}{++Configuration++}>
                - <{--x--}{++Status++}></{--x--}{++Configuration++}>

                ``` { .xml , title="Example XML Structure" } 
                <Parent>
                  <Child>
                    <ChildParameter>Value<ChildParameter>
                  </Child>
                <Parent>
                ```

    - - -

    ??? tip inline end "Take advantage of your Code Language"

        Many languages have built in function to help process data

        For instance, when working in ES6 or newer Javascript Environments, you can leverage the `btoa()` and `atob()` functions that are built into that language to quickly encode and decode strings to/from base64. Ex: `btoa('admin:admin1234')` = ==YWRtaW46YWRtaW4xMjM0\====

    <h4>Full HTTP Get and Post examples ~({{config.cProps.rxp.sectionIds.http}}.1.5)~</h4>

    ??? success "Click to view a Full Example of each written using the JavaScript Fetch API ~({{config.cProps.rxp.sectionIds.http}}.1.5.a)~"

        === "Get"

            ``` JavaScript
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "text/xml");
            myHeaders.append("Authorization", "Basic [YOUR_BASE64_ENCODED_AUTH]");

            const requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow"
            };

            fetch("https://[YOUR_DEVICE_IP]/getxml?location=Configuration/SystemUnit/Name", requestOptions)
              .then((response) => response.text())
              .then((result) => console.log(result))
              .catch((error) => console.error(error));
            
            /* Below is the Response Body after making a Successful Request

            <?xml version="1.0"?>
            <Configuration product="Cisco Codec" version="ce11.20.1.7.913a6c7c769" apiVersion="4">
                <SystemUnit>
                    <Name valueSpaceRef="/Valuespace/STR_0_50_NoFilt"> My Room Bar Pro</Name>
                </SystemUnit>
            </Configuration>
            */
            ```

        === "Post"

            ``` JavaScript
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "text/xml");
            myHeaders.append("Authorization", "Basic [YOUR_BASE64_ENCODED_AUTH]");

            const raw = "<Configuration><SystemUnit><Name>My New System Name</Name></SystemUnit></Configuration>";

            const requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
              redirect: "follow"
            };

            fetch("https://[YOUR_DEVICE_IP]/putxml", requestOptions)
              .then((response) => response.text())
              .then((result) => console.log(result))
              .catch((error) => console.error(error));

            /* Below is the Response Body after making a Successful Request

            <?xml version="1.0"?>
            <Configuration>
                <Success/>
            </Configuration>
            */
            ```
    ??? success "Click to view a Full Example of each written using the Macro Editor [ES6 JS] and your codec's HTTPClient xAPIs ~({{config.cProps.rxp.sectionIds.http}}.1.5.b)~"

        === "Get"

            ```javascript
            import xapi from 'xapi';

            const destinationIp = '[YOUR_DEVICE_IP]';
            const headers = ['Content-Type: text/xml', `Authorization: Basic ${btoa('[YOUR_AUTH]')}`];


            async function getPath(path){
              const destinationUrl = `https://${destinationIp}/getxml?location=${path}`;

              try {
                const request = await xapi.Command.HttpClient.Get({
                  Url: destinationUrl,
                  Header: headers,
                  AllowInsecureHTTPS: 'True'
                })
                console.debug(request);
                return request
              } catch (e) {
                let err = {
                  Context: `Failed Get Request to [${destinationUrl}]`,
                  ...e
                }
                throw new Error(e)
              }
            }

            getPath('Configuration/SystemUnit/Name');
            ```
        
        === "Post"

            ```javascript
            import xapi from 'xapi';

            const destinationIp = '[YOUR_DEVICE_IP]';
            const headers = ['Content-Type: text/xml', `Authorization: Basic ${btoa('[YOUR_AUTH]')}`];


            async function setPath(body){
              const destinationUrl = `https://${destinationIp}/putxml`;

              try {
                const request = await xapi.Command.HttpClient.Post({
                  Url: destinationUrl,
                  Header: headers,
                  AllowInsecureHTTPS: 'True'
                }, body)
                console.debug(request);
                return request
              } catch (e) {
                let err = {
                  Context: `Failed Post Request to [${destinationUrl}]`,
                  ...e
                }
                throw new Error(e)
              }
            }

            setPath('<Configuration><SystemUnit><Name>My New System Name</Name></SystemUnit></Configuration>');
            ```

        <a class="md-button md-button--primary" href="https://roomos.cisco.com/xapi/Command.HttpClient.Get/?search=HTTPClient" target="_blank" >
              Learn more about <strong>Device HTTPClient xAPIs</strong> <i class="fa-solid fa-square-up-right"></i>
        </a>

        ??? curious ":thinking: Hey, what's up with that `...e` in your caught error?"

            Again, knowing you language has it's benefits

            `...` is called a ==Spread Operator== and it's very useful when playing with data in ES6 JS

            We're using it here to pass the original error the xAPI produced into an ==err== object as well as some context to help us troubleshoot our macro in the future.

            <a class="md-button md-button--primary" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax" target="_blank" >
                  Learn more about <strong>Spread Operators</strong> <i class="fa-solid fa-square-up-right"></i>
            </a>


    ??? success "Click to view a Full Example of each written using the Python Requests API ~({{config.cProps.rxp.sectionIds.http}}.1.5.c)~"

        === "Get"

            ``` Python
            import requests

            url = "https://[YOUR_DEVICE_IP]/getxml?location=Configuration/SystemUnit/Name"

            payload = ""
            headers = {
              'Content-Type': 'text/xml',
              'Authorization': 'Basic [YOUR_BASE64_ENCODED_AUTH]'
            }

            response = requests.request("GET", url, headers=headers, data=payload)

            print(response.text)

            # Below is the Response Body after making a Successful Request

            # <?xml version="1.0"?>
            # <Configuration>
            #     <Success/>
            # </Configuration>
            ```

        === "Post"

            ``` Python
            import requests

            url = "https://[YOUR_DEVICE_IP]/putxml"

            payload = "<Configuration><SystemUnit><Name>My New System Name</Name></SystemUnit></Configuration>"
            headers = {
              'Content-Type': 'text/xml',
              'Authorization': 'Basic [YOUR_BASE64_ENCODED_AUTH]'
            }

            response = requests.request("POST", url, headers=headers, data=payload)

            print(response.text)
            
            # Below is the Response Body after making a Successful Request

            # <?xml version="1.0"?>
            # <Configuration product="Cisco Codec" version="ce11.20.1.7.913a6c7c769" apiVersion="4">
            #     <SystemUnit>
            #         <Name valueSpaceRef="/Valuespace/STR_0_50_NoFilt"> My Room Bar Pro</Name>
            #     </SystemUnit>
            # </Configuration>
            ```
    


## **Import and Configure the section {{config.cProps.rxp.sectionIds.http}}.1 Postman Collection** ~({{config.cProps.rxp.sectionIds.http}}.2)~

Whereas we'll be using Postman, this tool will automatically take our basic auth and structure as an with Header for us and convert that string into base64

This collection has most pieces structured as we'd need it to and will be used through sections {{config.cProps.rxp.sectionIds.http}}.3 through {{config.cProps.rxp.sectionIds.http}}.5

- - -

<h4>Import Collection</h4>

- With Postman open, in a new or existing workspace select ==import==
- Select File
- Locate the ==WX1-Lab:1451-HTTP-Postman-Collection.Postman_collection.json== and Open it
- You should now have the Postman Collection installed for this lab

??? gif "View Import Postman Collection"

    <figure markdown>
      ![Import Lab Postman Collection](./images/2-3-2_Import-PostmanCollection.gif){ width="600" }
    </figure>

- - -

<h4>Configure Postman Collection for sections {{config.cProps.rxp.sectionIds.http}}.3 through {{config.cProps.rxp.sectionIds.http}}.5</h4>

- Click on the ==WX1-Lab:1451-HTTP-Postman-Collection== root folder
- Select Variables
- Add the following information for your codec in both the `Initial Value` and `Current Value` fields
    - device_username
    - device_password
    - device_ipAddress
- Select Save (or one of the keyboard shortcuts for your computer)
    - ++control+s++ for Windows
    - ++command+s++ for Mac

??? gif "View Configure Postman Collection for sections {{config.cProps.rxp.sectionIds.http}}.3 through {{config.cProps.rxp.sectionIds.http}}.5"

    <figure markdown>
      ![Import Lab Postman Collection](./images/2-3-2_Configure-PostmanCollection.gif){ width="600" }
    </figure>

## **Executing xCommands** ~({{config.cProps.rxp.sectionIds.http}}.3)~

!!! Abstract

   Throughout section {{config.cProps.rxp.sectionIds.http}}.3, you'll learn how to format and execute xCommands via HTTP using Postman.

   The techniques outlined here will correspond to the methods needed for setting new xConfiguration Values in section {{config.cProps.rxp.sectionIds.http}}.4

???+ lesson "Lesson: Execute an xCommand ~({{config.cProps.rxp.sectionIds.http}}.3.1)~"

    !!! info inline end "XML Body Location"

        <figure markdown>
          ![XML Body Location](./images/2-3-3_Execute-xCommand-BodyLocation.png){ width="400" }
        </figure>

    - **xAPI:** xCommand Video Selfview Set

    - **Task:** Structure the xAPI command above into an XML format then place this into the Body of the ==Execute an xCommand== request in your Postman collection. Include the following Parameters and Values
        - Mode: On
        - FullScreenMode: On
        - OnMonitorRole: First

    Once the Postman Request has been updated, ==Save== the request, select ==Send== and review the Postman Terminal's response and observe any changes to your device

    - - -

    ??? success "View properly formatted XML and Successful Response"

        ![Successful HTTP Response](./images/2-3-3_Execute-xCommand-Success.png){ width="600", align=right }

        ``` { .xml }
        <Command>
          <Video>
            <Selfview>
              <Set>
                <Mode>On</Mode>
                <FullScreenMode>On</FullScreenMode>
                <OnMonitorRole>First</OnMonitorRole>
              </Set>
            </Selfview>
          </Video>
        </Command>
        ```

    ??? failure "View Failed Response"

        If you have a failed response, review the errors as it will point out how to resolve your particular issue in your XML payload and try again

        <figure markdown>
          ![Failed HTTP Response](./images/2-3-3_Execute-xCommand-AllFailure.png){ width="600" }
        </figure>

??? lesson "Lesson: Execute multiple xCommands in a single request ~({{config.cProps.rxp.sectionIds.http}}.3.2)~"

    !!! info

        You can structure your XML to allow for multiple xAPI calls under a single Parent Path, in this case the Parent Path is xCommand

        So long as the paths you're running are under their appropriate Common Path Nodes, then they will be considered. Should those Common Path Nodes deviate, then you must structure the XML to match

    - **xAPI(s):**
        - ==xCommand== Video Selfview Set
        - ==xCommand UserInterface== WebView Display
        - ==xCommand UserInterface== Message Rating Display

    - **Task:** `xCommand Video Selfview Set` and `xCommand UserInterface WebView Display` have already be set in your collection under their appropriate Common Node Path. We've highlighted the Common Node Paths above for you to see. Structure the XML for {++xCommand UserInterface Message Rating Display++} and place it as the next xCommand in the XML structure given to you. Include the following Parameters and Values
        - Title: Rate this Site
        - Text: From 0 to 5 stars, rate this Website
        - Duration: 45

    Once the Postman Request has been updated, ==Save== the request, select ==Send== and review the Postman Terminal's response and observe any changes to your device

    ??? success "View Successful OSD Output"

        <figure markdown="span">
          ![OSD Output](./images/2-3-3_Execute-xCommand-MultipleCommands-OSD.png){ width="500" }
          <figcaption>What to expect on your OSD on a successful request</figcaption>
        </figure>

    ??? success "View properly formatted XML and Successful Response"

        ![Successful HTTP Response](./images/2-3-3_Execute-xCommand-MultipleCommands-Success.png){ width="500", align=right }

        === "Message Rating Display XML"

            ``` { .xml }
            <Command>
              <UserInterface>
                <Message>
                  <Rating>
                    <Display>
                      <Title>Rate this Site</Title>
                      <Text>From 0 to 5 stars, rate this Website</Text>
                      <Duration>45</Duration>
                    </Display>
                  </Rating>
                </Message>
              </UserInterface>
            </Command>
            ```

        === "Full XML body"

            ``` { .xml }
            <Command>
              <Video>
                <Selfview>
                  <Set>
                    <Mode>Off</Mode>
                  </Set>
                </Selfview>
              </Video>
              <UserInterface>
                <WebView>
                  <Display>
                    <Mode>Modal</Mode>
                    <Url>https://roomos.cisco.com</Url>
                  </Display>
                </WebView>
                <!-- Message Rating Display Should Start Here -->
                <Message>
                  <Rating>
                    <Display>
                      <Title>Rate this Site</Title>
                      <Text>From 0 to 5 stars, rate this Website</Text>
                      <Duration>45</Duration>
                    </Display>
                  </Rating>
                </Message>
                <!-- Message Rating Display Should End Here -->
              </UserInterface>
            </Command>
            ```

    ??? failure "View Failed Response"

        If you have a failed response, review the errors as it will point out how to resolve your particular issue in your XML payload and try again

        <figure markdown>
          ![Failed HTTP Response](./images/2-3-3_Execute-xCommand-AllFailure.png){ width="600" }
        </figure>

??? lesson "Lesson: Execute an xCommand with multiple arguments with the same name  ~({{config.cProps.rxp.sectionIds.http}}.3.3)~"

    !!! info

        We can structure the XML payload for HTTP to include multiple parameters under the same name

        Simply duplicate the Parameter that's capable of being duplicated and add that into your XML body. Be sure to include the Opening and Closing XML tags for that parameter as well

    - **xAPI(s):**
        - xCommand UserInterface WebView Clear
        - xCommand UserInterface Message Rating Clear
        - xCommand Video Selfview Set
        - xCommand Video Input SetMainVideoSource
    
    - **Task:** We'll be running multiple commands in conjunction to having multiple parameters in this lesson.
        - To clean up from the previous lesson, we'll send an xCommand to clear by replacing the Display Tags for both with Clear and deleting any parameters they had
            - `xCommand UserInterface WebView {--Display--}{++Clear++}`
            - `xCommand UserInterface Message Rating {--Display--}{++Clear++}`
        - Then we'll set selfview back on in Full Screen
        - The above tasks will come preloaded in the Postman collection, your task is to structure the XML for {++xCommand Video Input SetMainVideoSource++} and place it as the next xCommand in the XML structure given to you and **duplicate** the `ConnectorId` parameter. Include the following Parameters and Values
            - ConnectorId: 1
            - Layout: Prominent

    Once the Postman Request has been updated, ==Save== the request, select ==Send== and review the Postman Terminal's response and observe any changes to your device

    ??? success "View Successful OSD Output"

        <figure markdown="span">
          ![OSD Output](./images/2-3-3_Execute-xCommand-MultipleSameNameParameter-OSD.png){ width="500" }
          <figcaption>What to expect on your OSD on a successful request</figcaption>
        </figure>
    
    ??? success "View properly formatted XML and Successful Response"

        ![Successful HTTP Response](./images/2-3-3_Execute-xCommand-MultipleSameNameParameter-Success.png){ width="500", align=right }

        === "Video Input SetMainVideoSource XML"

            ``` { .xml }
            <Command>
              <Video>
                <Input>
                  <SetMainVideoSource>
                    <ConnectorId>1</ConnectorId>
                    <!-- Your Duplicate ConnectorId Parameter Should Start Here  -->
                    <ConnectorId>1</ConnectorId>
                    <!-- Your Duplicate ConnectorId Parameter Should End Here  -->
                    <Layout>Prominent</Layout>
                  </SetMainVideoSource>
                </Input>
              </Video>
            </Command>
            ```

        === "Full XML body"

            ``` { .xml }
            <Command>
              <UserInterface>
                <WebView>
                  <Clear></Clear>
                </WebView>
                <Message>
                  <Rating>
                    <Clear></Clear>
                  </Rating>
                </Message>
              </UserInterface>
              <Video>
                <Selfview>
                  <Set>
                    <Mode>On</Mode>
                    <FullScreenMode>On</FullScreenMode>
                    <OnMonitorRole>First</OnMonitorRole>
                  </Set>
                </Selfview>
                <Input>
                  <SetMainVideoSource>
                    <ConnectorId>1</ConnectorId>
                    <!-- Your Duplicate ConnectorId Parameter Should Start Here  -->
                    <ConnectorId>1</ConnectorId>
                    <!-- Your Duplicate ConnectorId Parameter Should End Here  -->
                    <Layout>Prominent</Layout>
                  </SetMainVideoSource>
                </Input>
              </Video>
            </Command>
            ```

    ??? failure "View Failed Response"

        If you have a failed response, review the errors as it will point out how to resolve your particular issue in your XML payload and try again

        <figure markdown>
          ![Failed HTTP Response](./images/2-3-3_Execute-xCommand-AllFailure.png){ width="600" }
        </figure> 

??? lesson "Lesson: Execute an xCommand with a multiline argument  ~({{config.cProps.rxp.sectionIds.http}}.3.4)~"

    !!! info

        Multiline Arguments can be placed into the body of the XML as well. This specifically uses a `<body>` which isn't explicitly highlighted in the path of the API.

        The structure of a Multiline argument should look similar to the following

        ``` { .xml , .no=copy, title="Example XML Structure with Multiline Argument" }
        <Parent>
          <Child>
            <ChildParameter>Value<ChildParameter>
            <body>[MY_MULTILINE_ARGUMENT]</body>
          </Child>
        <Parent>
        ```

    - **xAPI(s):**
        - xCommand Video Selfview Set
        - xCommand Video Input SetMainVideoSource
        - xCommand UserInterface Extensions Panel Save
    
    - **Task:** We'll be running multiple commands in conjunction to having a multiline argument.
        - We'll start by correcting our Camera View from the previous lesson, which will come pre-loaded in the Postman Collection
        - Your task is to structure the XML for {++xCommand UserInterface Extensions Panel Save++} and place it as the next xCommand in the XML structure given. Include the following Parameters and Values
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
                    <Name>MultiLine Command [Section {{config.cProps.rxp.sectionIds.http}}.3]</Name>
                    <ActivityType>Custom</ActivityType>
                  </Panel>
                </Extensions>
                ```

    Once the Postman Request has been updated, ==Save== the request, select ==Send== and review the Postman Terminal's response and observe any changes to your device
    
    ???+ warning "You're Wrapping XML around XML!"

        **Note:** Not all multiline arguments are in XML format; for example, {++xCommand UserInterface Extensions Panel Save++} is. It’s important to remember that any data placed within a `<body>` tag should always be written as a `String`. If your integration automatically injects this information, additional processing may be necessary.

        The xAPI will have a hard time deciphering your Body's XML value vs the xAPI XML Payload

        You'll want to "Stringify" the XML body by replacing all instances of `<` characters with {++&amp;lt;++} and all instances of `>` characters with {++&amp;gt;++} &gt;

        - These aren't the only characters that are impacted, and that will largely depend on your XML body value

        Luckily, you can use the **Stringify XML Body** on the Tools Page to do this for you

        <a class="md-button md-button--primary" href="../../../Resources/res_tools/" target="_blank" >
          Open **Tools** <i class="fa-solid fa-gear"></i> Page <i class="fa-solid fa-square-up-right"></i>
        </a>

    ??? success "View Successful OSD Output"

        <figure markdown="span">
          ![OSD Output](./images/2-3-3_Execute-xCommand-MultiLine-OSD.png){ width="500" }
          <figcaption>What to expect on your OSD on a successful request</figcaption>
        </figure>

    ??? success "View properly formatted XML and Successful Response"

        ![Successful HTTP Response](./images/2-3-3_Execute-xCommand-MultiLine-Success.png){ width="500", align=right }

        === "UserInterface Extensions Panel Save XML"

            ``` { .xml }
            <Command>
              <UserInterface>
                <Extensions>
                  <Panel>
                    <Save>
                      <PanelId>wx1_lab_multilineCommand</PanelId>
                      <body>&lt;Extensions&gt; &lt;Panel&gt; &lt;Order&gt;1&lt;/Order&gt; &lt;PanelId&gt;wx1_lab_multilineCommand&lt;/PanelId&gt; &lt;Location&gt;HomeScreen&lt;/Location&gt; &lt;Icon&gt;Info&lt;/Icon&gt; &lt;Color&gt;#FF70CF&lt;/Color&gt; &lt;Name&gt;MultiLine Command [Section {{config.cProps.rxp.sectionIds.http}}.3]&lt;/Name&gt; &lt;ActivityType&gt;Custom&lt;/ActivityType&gt; &lt;/Panel&gt; &lt;/Extensions&gt;
                      </body>
                    </Save>
                  </Panel>
                </Extensions>
              </UserInterface>
            </Command>
            ```

        === "Full XML body"

            ``` { .xml }
            <Command>
              <Video>
                <Selfview>
                  <Set>
                    <Mode>Off</Mode>
                  </Set>
                </Selfview>
                <Input>
                  <SetMainVideoSource>
                    <ConnectorId>1</ConnectorId>
                    <Layout>Equal</Layout>
                  </SetMainVideoSource>
                </Input>
              </Video>
              <!-- Your UserInterface Extensions Panel Save XML Should Start Here  -->
              <UserInterface>
                <Extensions>
                  <Panel>
                    <Save>
                      <PanelId>wx1_lab_multilineCommand</PanelId>
                      <body>&lt;Extensions&gt; &lt;Panel&gt; &lt;Order&gt;1&lt;/Order&gt; &lt;PanelId&gt;wx1_lab_multilineCommand&lt;/PanelId&gt; &lt;Location&gt;HomeScreen&lt;/Location&gt; &lt;Icon&gt;Info&lt;/Icon&gt; &lt;Color&gt;#FF70CF&lt;/Color&gt; &lt;Name&gt;MultiLine Command [Section {{config.cProps.rxp.sectionIds.http}}.3]&lt;/Name&gt; &lt;ActivityType&gt;Custom&lt;/ActivityType&gt; &lt;/Panel&gt; &lt;/Extensions&gt;
                      </body>
                    </Save>
                  </Panel>
                </Extensions>
              </UserInterface>
              <!-- Your UserInterface Extensions Panel Save XML Should Start Here  -->
            </Command>
            ```

    ??? failure "View Failed Response"

        If you have a failed response, review the errors as it will point out how to resolve your particular issue in your XML payload and try again

        <figure markdown>
          ![Failed HTTP Response](./images/2-3-3_Execute-xCommand-AllFailure.png){ width="600" }
        </figure> 

??? lesson "Lesson: Execute an xCommand which generates data and responds ~({{config.cProps.rxp.sectionIds.http}}.3.5)~"

    !!! info

        Some commands will generate data and output a response of that data. All commands will respond with an "OK" or "Error" but other can provide data.

        Whereas we just made a UI extension with the API, we can now pull a list of our custom extensions using the API

    - **xAPI:** xCommand UserInterface Extensions List

    - **Task:** Structure the xAPI command above into an XML format then place this into the Body of the ==Execute an xCommand which generates data and responds== request in your Postman collection. Include the following Parameters and Values
        - ActivityType: Custom

    Once the Postman Request has been updated, ==Save== the request, select ==Send== and review the Postman Terminal's response and observe any changes to your device

    ??? success "View properly formatted XML and Successful Response"

        ![Successful HTTP Response](./images/2-3-3_Execute-xCommandWithResponse-Success.png){ width="700", align=right }

        ``` { .xml }
        <Command>
          <UserInterface>
            <Extensions>
              <List>
                <ActivityType>Custom</ActivityType>
              </List>
            </Extensions>
          </UserInterface>
        </Command>
        ```

    ??? failure "View Failed Response"

        If you have a failed response, review the errors as it will point out how to resolve your particular issue in your XML payload and try again

        <figure markdown>
          ![Failed HTTP Response](./images/2-3-3_Execute-xCommand-AllFailure.png){ width="600" }
        </figure>

<!-- ??? challenge "Challenge: Open a Text Input Prompt!"

    - Duplicate the ==Execute an xCommand== request in Postman
    - Replace the body of this request with a new body that implements <a href="https://roomos.cisco.com/xapi/Command.UserInterface.Message.TextInput.Display/" target="_blank">xCommand UserInterface Message TextInput Display</a>
    - Set the Following Parameters [Keep them Safe for Work :pray:]
        - Title
        - Text
        - Duration: [Set any value between 15 and 45]
    - Save and Execute
    - Look at your Touch Controller, it should have a Text Input field :smiley:

    ??? success "View a Successful Touch Controller ScreenShot"

        <figure markdown>
          ![Successful Text Input Pop Up](./images/2-3-3_Challenge-TextInput.png){ width="800" }
        </figure>

        <a class="md-button md-button--primary" href="../challengeAnswers/" target="_blank" >
          Giving Up? Check out the Challenge Answers Page <i class="fa-solid fa-square-up-right"></i>
        </a> -->

## **Setting and Getting xConfigurations** ~({{config.cProps.rxp.sectionIds.http}}.4)~

!!! Abstract

   Throughout section {{config.cProps.rxp.sectionIds.http}}.4, you'll continue to learn how to format XML payloads as you work to set new xConfigurations against the codec

   Unlike xCommands, you can then pull back the value of xConfigurations using a Get Request.

   The techniques outlined here will correspond to the methods needed for Getting xStatus Values in section {{config.cProps.rxp.sectionIds.http}}.5

???+ lesson "Lesson: Set a new xConfiguration Value ~({{config.cProps.rxp.sectionIds.http}}.4.1)~"

    - **xAPI:** xConfiguration Audio DefaultVolume

    - **Task:** Structure the xAPI command above into an XML format then place this into the Body of the ==Set a new xConfiguration Value== request in your Postman collection. Set DefaultVolume to `75`

    ??? success "View properly formatted XML and Successful Response"

        ![Successful HTTP Response](./images/2-3-4_Set-xConfig_Single-Success.png){ width="700", align=right }

        ``` { .xml }
        <Configuration>
          <Audio>
            <DefaultVolume>75</DefaultVolume>
          </Audio>
        </Configuration>
        ```

    ??? failure "View Failed Response"

        If you have a failed response, review the errors as it will point out how to resolve your particular issue in your XML payload and try again

        <figure markdown>
          ![Failed HTTP Response](./images/2-3-3_Execute-xCommand-AllFailure.png){ width="600" }
        </figure>


??? lesson "Lesson: Set multiple xConfiguration Values in a single Request ~({{config.cProps.rxp.sectionIds.http}}.4.2)~"

    - **xAPI(s):** 
        - xConfiguration Audio DefaultVolume
        - xConfiguration SystemUnit Name

    - **Task:** 
        - We'll set the DefaultVolume back to 50, which will be preloaded into the Postman collection
        - Your task is to structure the XML for {++xConfiguration SystemUnit Name++} and place it as the next xCommand in the XML structure given. Set the Name to `Codec_X` where X is the # of your workstation pod or your name

    ??? success "View properly formatted XML and Successful Response"

        ![Successful HTTP Response](./images/2-3-4_Set-xConfig_Multi-Success.png){ width="500", align=right }

        === "SystemUnit Name XML"

            ``` { .xml }
            <Configuration>
              <SystemUnit>
                <Name>Pod_X</Name>
              </SystemUnit>
            </Configuration>
            ```
        
        === "Full XML Body"

            ``` { .xml }
            <Configuration>
              <Audio>
                <DefaultVolume>50</DefaultVolume>
              </Audio>
              <!-- SystemUnit Name Should Start Here -->
              <SystemUnit>
                <Name>Pod_X</Name>
              </SystemUnit>
              <!-- SystemUnit Name Should End Here -->
            </Configuration>
            ```

    ??? failure "View Failed Response"

        If you have a failed response, review the errors as it will point out how to resolve your particular issue in your XML payload and try again

        <figure markdown>
          ![Failed HTTP Response](./images/2-3-3_Execute-xCommand-AllFailure.png){ width="600" }
        </figure>

??? lesson "Lesson: Getting an xConfiguration Value ~({{config.cProps.rxp.sectionIds.http}}.4.3)~"

    !!! info

        Up until this point, you've been making Post requests with an xAPI path provided as a part of the Post body written in XML format

        Whereas, we're pivoting to a Get rest, the format of the request changes. We no longer need a body, but we need to define the xAPI path as apart of the URL under it's location tag

        Refer to section {{config.cProps.rxp.sectionIds.http}}.2 for a refresher on this syntax

    - **xAPI:** xConfiguration Audio DefaultVolume

    - Structure the xAPI command above into the URL under the ==Getting an xConfiguration Value== request in your Postman collection. This path should rest behind the ==?location== and separated by a `/`

    ??? success "View properly formatted URL and Successful Response"

        ![Successful HTTP Response](./images/2-3-4_Get-xConfig_Single-Success.png){ width="500", align=right }

        === "Audio DefaultVolume URL"

            https://{{device_ipAddress}}/getxml?location\===Configuration/Audio/DefaultVolume==
        
    ??? failure "View Failed Response"

        Something to note on xConfig Get Requests, is you'll still get a 200 OK if your auth and IP are correct when talking to the Codec

        But a lack of response information can tell you that you may have a fault in your xAPI path in the URL

        <figure markdown>
          ![Failed HTTP Response](./images/2-3-4_Get-xConfig-WrongPath.png){ width="600" }
          <figcaption>What to expect for a bad path</figcaption>
        </figure>

         <figure markdown>
          ![Failed HTTP Response](./images/2-3-4_Get-xConfig-MissingPath.png){ width="600" }
          <figcaption>What to expect for a missing path</figcaption>
        </figure>

??? lesson "Lesson: Get multiple xConfiguration Values under a Common Node ~({{config.cProps.rxp.sectionIds.http}}.4.4)~"

    !!! info

        You can pull more information if you move up to a Common Node

        By dropping `DefaultVolume` from xConfiguration Audio {--DefaultVolume--} we can grab all the Configuration Setting under the Audio Branch from the codec

    - **xAPI:** xConfiguration Audio

    - Structure the xAPI command above into the URL under the ==Getting multiple xConfiguration Values under a Common Node== request in your Postman collection.

    ??? success "View properly formatted URL and Successful Response"

        === "Audio DefaultVolume URL"

            https://{{device_ipAddress}}/getxml?location\===Configuration/Audio==

        ??? info "View Successful HTTP Response"

            ``` { .xml }
            <?xml version="1.0"?>
            <Configuration product="Cisco Codec" version="ce11.20.1.7.913a6c7c769" apiVersion="4">
              <Audio>
                <DefaultVolume valueSpaceRef="/Valuespace/INT_0_100">75</DefaultVolume>
                <Ethernet>
                  <Encryption valueSpaceRef="/Valuespace/TTPAR_RequiredOptional">Required</Encryption>
                  <SAPDiscovery>
                    <Address valueSpaceRef="/Valuespace/STR_0_64_IPv4AdminMcast">239.255.255.255</Address>
                    <Mode valueSpaceRef="/Valuespace/TTPAR_OnOff">Off</Mode>
                  </SAPDiscovery>
                </Ethernet>
                <!-- And the List Goes On... -->
              </Audio>
            </Configuration>
            ```
        
    ??? failure "View Failed Response"

        Something to note on xConfig Get Requests, is you'll still get a 200 OK if your auth and IP are correct when talking to the Codec

        But a lack of response information can tell you that you may have a fault in your xAPI path in the URL

        <figure markdown>
          ![Failed HTTP Response](./images/2-3-4_Get-xConfig-WrongPath.png){ width="600" }
          <figcaption>What to expect for a bad path</figcaption>
        </figure>

         <figure markdown>
          ![Failed HTTP Response](./images/2-3-4_Get-xConfig-MissingPath.png){ width="600" }
          <figcaption>What to expect for a missing path</figcaption>
        </figure>

??? curious  ":thinking: What about Subscribing to an xConfiguration?"
    
    Subscriptions via HTTP are possible, but require a process outside of using HTTP Post/Get commands. We'll need to leverage the HTTPFeedback feature of the codec and a tool that can receive a WebHook

    So we'll save HTTPFeedback for the end of section {{config.cProps.rxp.sectionIds.http}} and handle all HTTP based subscriptions there

## **Getting xStatuses** ~({{config.cProps.rxp.sectionIds.http}}.5)~

???+ lesson "Lesson: Getting an xStatus Value ~({{config.cProps.rxp.sectionIds.http}}.5.1)~"

    - **xAPI:** xStatus Audio Volume

    - Structure the xAPI command above into the URL under the ==Getting an xStatus== request in your Postman collection.

    ??? success "View properly formatted URL and Successful Response"

        ![Successful HTTP Response](./images/2-3-5_Get-xStatus_Single-Success.png){ width="500", align=right }

        === "Audio DefaultVolume URL"

            https://{{device_ipAddress}}/getxml?location\===Status/Audio/Volume==
        
    ??? failure "View Failed Response"

        Something to note on xStatus Get Requests, is you'll still get a 200 OK if your auth and IP are correct when talking to the Codec

        But a lack of response information can tell you that you may have a fault in your xAPI path in the URL

        <figure markdown>
          ![Failed HTTP Response](./images/2-3-4_Get-xConfig-WrongPath.png){ width="600" }
          <figcaption>What to expect for a bad path</figcaption>
        </figure>

         <figure markdown>
          ![Failed HTTP Response](./images/2-3-4_Get-xConfig-MissingPath.png){ width="600" }
          <figcaption>What to expect for a missing path</figcaption>
        </figure>

??? lesson "Lesson: Get multiple xStatus Values under a Common Node ~({{config.cProps.rxp.sectionIds.http}}.5.2)~"

    - **xAPI:** xStatus Audio

    - Structure the xAPI command above into the URL under the ==Getting multiple xStatus Values under a Common Node== request in your Postman collection.

    ??? success "View properly formatted URL and Successful Response"

        === "Audio DefaultVolume URL"

            https://{{device_ipAddress}}/getxml?location\===Status/Audio==

        ??? info "View Successful HTTP Response"

            ``` { .xml }
            <?xml version="1.0"?>
            <Status product="Cisco Codec" version="ce11.20.1.7.913a6c7c769" apiVersion="4">
              <Audio>
                <Devices>
                  <Bluetooth>
                    <ActiveProfile>None</ActiveProfile>
                  </Bluetooth>
                  <HandsetUSB>
                    <ConnectionStatus>NotConnected</ConnectionStatus>
                    <Cradle>OnHook</Cradle>
                  </HandsetUSB>
                  <HeadsetUSB>
                    <ConnectionStatus>NotConnected</ConnectionStatus>
                    <Description></Description>
                    <Manufacturer></Manufacturer>
                  <!-- And the List Goes On... -->
              </Audio>
            </Status>
            ```
        
    ??? failure "View Failed Response"

        Something to note on xStatus Get Requests, is you'll still get a 200 OK if your auth and IP are correct when talking to the Codec

        But a lack of response information can tell you that you may have a fault in your xAPI path in the URL

        <figure markdown>
          ![Failed HTTP Response](./images/2-3-4_Get-xConfig-WrongPath.png){ width="600" }
          <figcaption>What to expect for a bad path</figcaption>
        </figure>

         <figure markdown>
          ![Failed HTTP Response](./images/2-3-4_Get-xConfig-MissingPath.png){ width="600" }
          <figcaption>What to expect for a missing path</figcaption>
        </figure>

## **Using WebHooks to subscribe to xConfigurations, xStatuses and xEvents** ~({{config.cProps.rxp.sectionIds.http}}.6)~

!!! important

    Your codec has a limit of 4 HTTPFeedback Slots with up to 15 xAPI paths expressions in the same command

    ??? tip  "xCommand References for Section: {{config.cProps.rxp.sectionIds.http}}.6"

        <div class="grid cards" markdown>

        -   <i class="fa-solid fa-terminal"> </i> __xCommand HttpFeedback Register__

            ---

            Register the device to an HTTP(S) server to return XML feedback over HTTP(S) to specific URLs.

            ---

            Parameters:

              <table>
                <tr>
                    <td>ServerUrl ==[Required]== </td>
                    <td>FeedbackSlot ==[Required]== </td>
                </tr>
                <tr>
                    <td>Expression</td>
                    <td>Format</td>
                </tr>
              </table>

            <a class="md-button md-button--primary" href="https://roomos.cisco.com/xapi/Command.HttpFeedback.Register" target="_blank">
              Reference for <strong>xCommand HttpFeedback Register</strong> <i class="fa-solid fa-square-up-right"></i>
            </a>

        -   <i class="fa-solid fa-terminal"></i> __xCommand HttpFeedback Deregister__

            ---

            Deregister the HTTP feedback over HTTP(S).

            ---

            Parameters:

              <table>
                <tr>
                    <td>FeedbackSlot ==[Required]== </td>
                </tr>
              </table>

            <a class="md-button md-button--primary" href="https://roomos.cisco.com/xapi/Command.HttpFeedback.Deregister" target="_blank">
              Reference for <strong>xCommand HttpFeedback Deregister</strong> <i class="fa-solid fa-square-up-right"></i>
            </a>

        -   <i class="fa-solid fa-terminal"></i> __xCommand HttpFeedback Enable__

            ---

            Re-enables a previously registered feedback slot after it has failed and become deactivated.

            ---

            Parameters:

              <table>
                <tr>
                    <td>FeedbackSlot ==[Required]== </td>
                </tr>
              </table>

            <a class="md-button md-button--primary" href="https://roomos.cisco.com/xapi/Command.HttpFeedback.Enable" target="_blank">
              Reference for <strong>xCommand HttpFeedback Enable</strong> <i class="fa-solid fa-square-up-right"></i>
            </a>

        </div>

???+ gif "Locate and Configure your Unique URL from Webhook.Site"

    - Go to <a href="https://webhook.site" target="_blank">https://webhook.site</a>
    - Copy your Unique URL
    - Open Postman
        - Click on the ==WX1-Lab:1451-HTTP-Postman-Collection== root folder
        - Select Variables
        - Pase your unique URL into `Initial Value` and `Current Value` fields for ==WebhookSite_Unique_Url==
        - Select Save (or one of the keyboard shortcuts for your computer)
            - ++control+s++ for Windows
            - ++command+s++ for Mac

    <figure markdown>
      ![Locate and Configure your Unique URL from Webhook.Site](./images/2-3-6_ConfigureWebHookPostman.gif){ width="600" }
    </figure>


!!! info

    For all Webhook Examples below, we'll need to register HTTPFeedback slot by first running

    `xCommand HTTPFeedback Register`

    These have been preformatted for you in the Postman collection

    ??? question "View Example WebHook.site output"

        <figure markdown>
          ![Webhook.Site Output Example](./images/2-3-6_WebHookSite_Output.png){ width="600" }
        </figure>

??? lesson "Lesson: Subscribe to the full xConfiguration Branch ~({{config.cProps.rxp.sectionIds.http}}.6.1)~"

    - **Task:**
        - In your Postman Collection under HTTP > Section: ({{config.cProps.rxp.sectionIds.http}}.6)
        - Select the ==Subscribe to the full xConfiguration Branch== request
        - View how the body is Structured in the XML body
        - Select Send
        - Press the `Subscription Assistant Button` on your Touch Interface
            - Under the xConfigurations Page, press any of the buttons on this page
            - Observe your {++Webhook.Site Terminal++} output, those responses you saw in the previous lesson should have stopped outputting in your {++Webhook.Site Terminal++}
                - ==Optional==: Press those buttons and switches a few times to see more changes come in


??? lesson "Lesson: Subscribe to the full xStatus Branch ~({{config.cProps.rxp.sectionIds.http}}.6.2)~"

    - **Task:**
        - In your Postman Collection under HTTP > Section: {{config.cProps.rxp.sectionIds.http}}.6
        - Select the ==Subscribe to the full xStatus Branch== request
        - View how the body is Structured in the XML body
        - Then select Send and Monitor the output on the Webhook.Site terminal
            - Your device will forward an event in the status branch soon
        - Press the `Subscription Assistant Button` on your Touch Interface
            - Under the xStatuses Page, press any of the buttons on this page
            - Observe your {++Webhook.Site Terminal++} output, those responses you saw in the previous lesson should have stopped outputting in your {++Webhook.Site Terminal++}

??? lesson "Lesson: Subscribe to the full xEvent Branch ~({{config.cProps.rxp.sectionIds.http}}.6.3)~"

    - **Task:**
        - In your Postman Collection under HTTP > Section: ({{config.cProps.rxp.sectionIds.http}}.6)
        - Select the ==Subscribe to the full xEvent Branch== request
        - View how the body is Structured in the XML body
        - Then select Send and Monitor the output on the Webhook.Site terminal
            - Your device will forward an event in the event branch soon
        - Press the `Subscription Assistant Button` on your Touch Interface
            - Under the xEvents Page, press any of the buttons on this page
            - Observe your {++Webhook.Site Terminal++} output, those responses you saw in the previous lesson should have stopped outputting in your {++Webhook.Site Terminal++}

??? lesson "Lesson: Subscribe to Specific Expressions on any Branch ~({{config.cProps.rxp.sectionIds.http}}.6.4)~"

    - **Task:**
        - In your Postman Collection under HTTP > Section: ({{config.cProps.rxp.sectionIds.http}}.6)
        - Select the ==Subscribe to Specific Expressions on any Branch== request
        - View how the body is Structured in the XML body
            - Take Note, we've changed our Expression Parameter
            - Rather than subscribing to All States, we instead narrow down what we're interested in
            - For each expression we want to listen too, we will declare a new Expression Parameter
            - We can have up to 15 Expressions defined in a single feedback slot
        - Then select Send and Monitor the output on the Webhook.Site terminal
            - You will need to interact with the system Volume and press the MultiLine Command [Section {{config.cProps.rxp.sectionIds.http}}.3] Panel to see events pour into the WebHook.site terminal
        - Press the `Subscription Assistant Button` on your Touch Interface
            - Clicking on the `Subscription Assistant Button` will fire a Panel Event
            - Under the xStatuses, move the ==Adjust Volume== slider to generate events
                - Other buttons under xStatus won't take any effect
            - Under the xEvents Page, press any of the buttons on this page
            - Observe your {++Webhook.Site Terminal++} output, those responses you saw in the previous lesson should have stopped outputting in your {++Webhook.Site Terminal++}

## **Section {{config.cProps.rxp.sectionIds.http}} Cleanup** ~({{config.cProps.rxp.sectionIds.http}}).7~

{{config.cProps.rxp.sectionCleanup}}
