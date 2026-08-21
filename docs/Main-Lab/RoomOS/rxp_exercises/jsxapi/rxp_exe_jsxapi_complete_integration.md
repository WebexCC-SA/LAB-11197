{{ config.cProps.devNotice }}
{{ config.cProps.acronyms }}

# Complete JSXAPI Integration ~(section\ rxe-j1)~

!!! abstract

    This Solution Exercise combines the atomic JSXAPI skills from section ^{{ config.cProps.rxp.sectionIds.jsxapi }}^ in one direct script. It connects to a RoomOS device, reads current state, displays a message, and observes status and event feedback.

    The script deliberately uses the same bare `connect` → `ready` pattern as the Integration Method. It demonstrates how the JSXAPI operations work together; it does not prescribe how you should structure a larger JavaScript application.

## Section rxe-j1 Requirements

!!! important

    - Complete **Access RoomOS xAPI with JSXAPI** ^{{ config.cProps.rxp.sectionIds.jsxapi }}^.
    - Keep the `roomos-jsxapi-lab` project and its ignored `.env` file.
    - Confirm the direct JSXAPI connection in `lesson.js` still succeeds.
    - Open Subscription Assistant on the RoomOS User Interface so you can produce visible status and event activity.

## Solution Outline

The finished script will:

1. connect directly with `jsxapi.connect()`;
2. get `xConfiguration Audio DefaultVolume`;
3. get `xStatus Audio Volume`;
4. execute `xCommand UserInterface Message Alert Display`;
5. subscribe to `xStatus Audio Volume`;
6. subscribe to `xEvent UserInterface Extensions Widget Action`; and
7. unsubscribe and close the connection after 60 seconds.

The 60-second timer gives the lab activity a clear end. It is not an application-design recommendation.

## **Create the Direct JSXAPI Scaffold** ~(rxe-j1.1)~

???+ lesson "Lesson: Create the Direct JSXAPI Script ~(rxe-j1.1.1)~"

    Connection and timer code are supplied because the assessed work is the RoomOS xAPI syntax.

    - Create `integration.js` in `roomos-jsxapi-lab`.
    - Copy the scaffold below.

    ```javascript title="integration.js"
    require('dotenv').config();
    const jsxapi = require('jsxapi');

    jsxapi
      .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
        username: process.env.ROOMOS_USERNAME,
        password: process.env.ROOMOS_PASSWORD
      })
      .on('error', console.error)
      .on('ready', async (xapi) => {
        // TODO 1: Get Audio DefaultVolume and log it.

        // TODO 2: Get Audio Volume and log it.

        // TODO 3: Display a five-second connection alert.

        const stopVolume =
          /* TODO 4: Construct the Audio Volume subscription */;

        const stopWidgetActions =
          /* TODO 5: Construct the Widget Action subscription */;

        console.log('Listening for 60 seconds...');

        setTimeout(() => {
          stopVolume();
          stopWidgetActions();
          xapi.close();
          console.log('Integration stopped.');
        }, 60000);
      });
    ```

    - Save the file.
    - Do not run it until the five TODOs are complete.

## **Compose the RoomOS xAPI Operations** ~(rxe-j1.2)~

???+ lesson "Lesson: Read the Initial Configuration and Status ~(rxe-j1.2.1)~"

    Use these familiar terminal forms:

    ```shell title="Terminal xAPI forms"
    xConfiguration Audio DefaultVolume
    xStatus Audio Volume
    ```

    - At **TODO 1**, get the configuration, assign it to `defaultVolume`, and log it.
    - At **TODO 2**, get the status, assign it to `currentVolume`, and log it.
    - Use `await` so each value is available before you log it.

    ```javascript title="Bounded scaffold"
    const defaultVolume =
      /* Construct the awaited xConfiguration expression */;
    console.log('Default volume:', defaultVolume);

    const currentVolume =
      /* Construct the awaited xStatus expression */;
    console.log('Current volume:', currentVolume);
    ```

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="integration.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                const defaultVolume =
                  await xapi.Config.Audio.DefaultVolume.get();
                console.log('Default volume:', defaultVolume);

                const currentVolume =
                  await xapi.Status.Audio.Volume.get();
                console.log('Current volume:', currentVolume);

                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Default volume: 50` |
            | `stdout` | `Current volume: 45` |

        Your values may be different.

??? lesson "Lesson: Add a Visible Connection Result ~(rxe-j1.2.2)~"

    Use this terminal form:

    ```shell title="Terminal xAPI form"
    xCommand UserInterface Message Alert Display Title: JSXAPI Text: Integration connected Duration: 5
    ```

    - At **TODO 3**, translate the path and all three arguments to JSXAPI.
    - Await the command, then confirm the alert appears on the RoomOS User Interface.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="integration.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                const defaultVolume =
                  await xapi.Config.Audio.DefaultVolume.get();
                console.log('Default volume:', defaultVolume);

                const currentVolume =
                  await xapi.Status.Audio.Volume.get();
                console.log('Current volume:', currentVolume);

                await xapi.Command.UserInterface.Message.Alert.Display({
                  Title: 'JSXAPI',
                  Text: 'Integration connected',
                  Duration: 5
                });

                xapi.close();
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Default volume: 50` |
            | `stdout` | `Current volume: 45` |

        The command is verified by the five-second alert on the RoomOS User Interface.

    [Open xCommand UserInterface Message Alert Display](https://roomos.cisco.com/xapi/Command.UserInterface.Message.Alert.Display/){ .md-button .md-button--primary target="_blank" }

??? lesson "Lesson: Add Status and Event Feedback ~(rxe-j1.2.3)~"

    Use these terminal forms:

    ```shell title="Terminal xAPI forms"
    xFeedback Register Status/Audio/Volume
    xFeedback Register Event/UserInterface/Extensions/Widget/Action
    ```

    - At **TODO 4**, subscribe to the volume status and assign the returned unsubscribe function to `stopVolume`.
    - At **TODO 5**, subscribe to widget actions and assign that unsubscribe function to `stopWidgetActions`.
    - Log enough information to distinguish the two feedback sources.

    ```javascript title="Bounded scaffold"
    const stopVolume =
      /* Construct the Audio Volume subscription */;

    const stopWidgetActions =
      /* Construct the Widget Action subscription */;
    ```

    - Run `node integration.js`.
    - Change the volume on the RoomOS User Interface.
    - Interact with a widget in Subscription Assistant.
    - Confirm both subscriptions and the connection stop after 60 seconds.

    ??? success "Successful Syntax and Log Output"

        === "JSXAPI"

            ```javascript title="integration.js"
            require('dotenv').config();
            const jsxapi = require('jsxapi');

            jsxapi
              .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
                username: process.env.ROOMOS_USERNAME,
                password: process.env.ROOMOS_PASSWORD
              })
              .on('error', console.error)
              .on('ready', async (xapi) => {
                const defaultVolume =
                  await xapi.Config.Audio.DefaultVolume.get();
                console.log('Default volume:', defaultVolume);

                const currentVolume =
                  await xapi.Status.Audio.Volume.get();
                console.log('Current volume:', currentVolume);

                await xapi.Command.UserInterface.Message.Alert.Display({
                  Title: 'JSXAPI',
                  Text: 'Integration connected',
                  Duration: 5
                });

                const stopVolume =
                  xapi.Status.Audio.Volume.on((volume) => {
                    console.log('Volume changed:', volume);
                  });

                const stopWidgetActions =
                  xapi.Event.UserInterface.Extensions.Widget.Action.on((event) => {
                    console.log('Widget action:', JSON.stringify(event));
                  });

                console.log('Listening for 60 seconds...');

                setTimeout(() => {
                  stopVolume();
                  stopWidgetActions();
                  xapi.close();
                  console.log('Integration stopped.');
                }, 60000);
              });
            ```

        === "Log Output"

            | Stream | Message |
            |:--|:--|
            | `stdout` | `Default volume: 50` |
            | `stdout` | `Current volume: 45` |
            | `stdout` | `Listening for 60 seconds...` |
            | `stdout` | `Volume changed: 50` |
            | `stdout` | `Volume changed: 55` |
            | `stdout` | `Widget action: {"Type":"clicked","Value":"","WidgetId":"example_widget"}` |
            | `stdout` | `Integration stopped.` |

## **Review the Complete Integration** ~(rxe-j1.3)~

??? success "Complete integration.js"

    Use the complete script for comparison and troubleshooting after attempting every TODO.

    === "JSXAPI"

        ```javascript title="integration.js"
        require('dotenv').config();
        const jsxapi = require('jsxapi');

        jsxapi
          .connect(`${process.env.ROOMOS_PROTOCOL}://${process.env.ROOMOS_IP}`, {
            username: process.env.ROOMOS_USERNAME,
            password: process.env.ROOMOS_PASSWORD
          })
          .on('error', console.error)
          .on('ready', async (xapi) => {
            const defaultVolume =
              await xapi.Config.Audio.DefaultVolume.get();
            console.log('Default volume:', defaultVolume);

            const currentVolume =
              await xapi.Status.Audio.Volume.get();
            console.log('Current volume:', currentVolume);

            await xapi.Command.UserInterface.Message.Alert.Display({
              Title: 'JSXAPI',
              Text: 'Integration connected',
              Duration: 5
            });

            const stopVolume =
              xapi.Status.Audio.Volume.on((volume) => {
                console.log('Volume changed:', volume);
              });

            const stopWidgetActions =
              xapi.Event.UserInterface.Extensions.Widget.Action.on((event) => {
                console.log('Widget action:', JSON.stringify(event));
              });

            console.log('Listening for 60 seconds...');

            setTimeout(() => {
              stopVolume();
              stopWidgetActions();
              xapi.close();
              console.log('Integration stopped.');
            }, 60000);
          });
        ```

    === "Log Output"

        | Stream | Message |
        |:--|:--|
        | `stdout` | `Default volume: 50` |
        | `stdout` | `Current volume: 45` |
        | `stdout` | `Listening for 60 seconds...` |
        | `stdout` | `Volume changed: 50` |
        | `stdout` | `Widget action: {"Type":"clicked","Value":"","WidgetId":"example_widget"}` |
        | `stdout` | `Integration stopped.` |

??? challenge "Challenge: Pair a Prompt Command with Its Response Event"

    Extend the integration so it asks the room user a question and processes the response.

    - Subscribe to `xEvent UserInterface Message Prompt Response` before displaying the prompt.
    - Store the returned unsubscribe function.
    - Execute `xCommand UserInterface Message Prompt Display` with a unique `FeedbackId`.
    - Log the selected option only when the response `FeedbackId` belongs to your script.
    - Call the prompt unsubscribe function inside the supplied 60-second timer.

    [Open xCommand UserInterface Message Prompt Display](https://roomos.cisco.com/xapi/Command.UserInterface.Message.Prompt.Display/){ .md-button .md-button--primary target="_blank" }

    [Open xEvent UserInterface Message Prompt Response](https://roomos.cisco.com/xapi/Event.UserInterface.Message.Prompt.Response/){ .md-button target="_blank" }

## **Section rxe-j1 Cleanup** ~(rxe-j1.4)~

- Wait for the script to print `Integration stopped.` or press ++ctrl+c++ to end it early.
- Confirm the Node.js process returns to the terminal prompt.
- Open **Subscription Assistant** on the RoomOS User Interface.
- Open **Section Cleanup**, select **Run Section Cleanup?**, and confirm the cleanup operation.

??? question "You can run the cleanup through SSH instead"

    ```shell title="Run in the RoomOS SSH session"
    xFeedback DeregisterAll
    xConfiguration Audio DefaultVolume: 50
    xCommand UserInterface Extensions Panel Remove PanelId: wx1_lab_multilineCommand
    xCommand Video SelfView Set Mode: Off FullscreenMode: Off
    xCommand Video Input SetMainVideoSource ConnectorId: 1
    xCommand Audio Volume SetToDefault Device: Internal
    ```

[Return to Access RoomOS xAPI with JSXAPI](../../rxp_xapi/rxp_xapi_jsxapi.md){ .md-button }
