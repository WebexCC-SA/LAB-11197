{{ config.cProps.devNotice }}
{{ config.cProps.acronyms }}
# What are RoomOS UserInterfaces

In regards to the RoomOS xAPI, RoomOS UserInterfaces are interfaces you can offer to the user whether they be built in an apart of RoomOS software or custom interfaces you can bubble up using the RoomOS xAPI

In this section, we'll be focusing on 4 of the major branches of the the UserInterface node in the xAPI, and those are

- - -

## Features
<figure markdown="span">
    ![Device Login](../images/roomNav.png){ width="600" }
    <figcaption>Room Navigator HomeScreen (RoomOS 11)</figcaption>
</figure>
- <pre><code>x[Path] UserInterface Features...</code></pre>
- The Features path governs mainly the visibility of built-in RoomOS interfaces. Such as the Call button, any of the Platform Buttons, Settings Menu Access and more

- - -

## Extensions
<figure markdown="span">
    ![Device Login](../images/3-2_UI_Editor.png){ width="800" }
    <figcaption>UI Extensions Editor</figcaption>
</figure>
- <pre><code>x[Path] UserInterface Extensions...</code></pre>
- The Extensions path enables you to create new interfaces, whether they be panels, pages, or widgets, and subscribe to their associated events
- Extensions are built using XML and can either be assembled using the xAPI or the UI Extensions Editor, located on the WebUI of the Codec
- These enable you a surface to offer to your users and build our all new solutions

- - -

## Messages
<figure markdown="span">
    ![Device Login](../images/3-2_UI_Messages.png){ width="800" }
    <figcaption>All Message Interfaces and Locations</figcaption>
</figure>
- <pre><code>x[Path] UserInterface Messages...</code></pre>
- The Messages Branch offers OSD and Touch Controller messaging, offering new interfaces that are akin to extensions.
- They can offer you alerts, text input prompts, ratings interfaces a a few others

- - -

## WebContent
<figure markdown="span">
    ![Device Login](../images/3-2_UI_WebContent.png){ width="800" }
    <figcaption>Various WebContent Examples</figcaption>
</figure>
- There isn't a "WebContent" branch in our API, but it's still a very important topic to touch upon
- WebContent exists in many forms in RoomOS such as Web Apps or WebViews and they are all driven by the WebEngine built into RoomOS
- The Web Engine is built upon the QT WebEngine and it allows you to pull in Web Based content such as a YouTube video or something custom you've built
- Some of the xAPI is readily available for Booking solutions, though more robust integrations would rely on our NodeJS JSXAPI Module
