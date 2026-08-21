{{ config.cProps.devNotice }}
{{ config.cProps.acronyms }}
# Features ~(section\ {{ config.cProps.rxp.sectionIds.ui.features }})~

Features are UI elements that come as apart of RoomOS

Not all can be manipulated, but many can be, though it is limited in scope but vast in quantity. With that, we'll only review a few here


!!! important

    In the next few lessons, you'll again use SSH to explore these interfaces

    If you haven't completed RoomOS xAPI > SSH ^({{config.cProps.rxp.sectionIds.ssh}})^, please review that material before moving on, or jump to the next section

???+ lesson "Lesson: Hide a few things ~({{ config.cProps.rxp.sectionIds.ui.features }}.1)~"

    - **xAPI**: xConfiguration UserInterface Features Call Start

    - **Task**:

        - First, take a mental note of the UI elements on your Devices HomeScreen, then run this Config change

        ``` shell title="Type into terminal and press Enter"
        xConfiguration UserInterface Features Call Start: Hidden
        ```

        - The Call button should be hidden, now run the following

        ``` shell title="Type into terminal and press Enter"
        xConfiguration UserInterface Features Whiteboard Start: Hidden
        xConfiguration UserInterface Features Call JoinZoom: Hidden
        xConfiguration UserInterface Features Call JoinGoogleMeet: Hidden
        xConfiguration UserInterface Features Call JoinMicrosoftTeamsCVI: Hidden
        xConfiguration UserInterface Features Call JoinMicrosoftTeamsDirectGuestJoin: Hidden
        ```

        - Now Webex should be the only user accessible call option

        - This demonstrate not only how you could simplify the # of choices for you used, but whereas these are all accessible be the RoomOS xAPI, you could automate these flows for any use case you can dream of

        - Let's be a bit fair to our calling cousins and bring them back

        ``` shell title="Type into terminal and press Enter"
        xConfiguration UserInterface Features Call Start: Auto
        xConfiguration UserInterface Features Whiteboard Start: Auto
        xConfiguration UserInterface Features Call JoinZoom: Auto
        xConfiguration UserInterface Features Call JoinGoogleMeet: Auto
        xConfiguration UserInterface Features Call JoinMicrosoftTeamsCVI: Auto
        xConfiguration UserInterface Features Call JoinMicrosoftTeamsDirectGuestJoin: Auto
        ```
  
???+ lesson "Lesson: Hide everything ~({{ config.cProps.rxp.sectionIds.ui.features }}.2)~"

    - **xAPI**: xConfiguration UserInterface Features Call Start

    - **Task**:

        - First, take a mental note of the UI elements on your Devices HomeScreen, then run this Config change

        ``` shell title="Type into terminal and press Enter"
        xConfiguration UserInterface Features HideAll: True
        ```

        - Now all RoomOS homescreen buttons should have disappeared
        - And let's bring them back

        ``` shell title="Type into terminal and press Enter"
        xConfiguration UserInterface Features HideAll: False
        ```

Something to note, we only have the capacity to hide RoomOS features, we can't change their position on the OSD/Controller

To learn more of the available features you can manipulate, click the link below

<roomosfind>UserInterface Features</roomosfind>