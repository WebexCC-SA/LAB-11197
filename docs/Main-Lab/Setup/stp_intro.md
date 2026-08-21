{{ config.cProps.devNotice }}
{{ config.cProps.acronyms }}

!!! important "Access your Pod Information"
    - Your Device Pod # is located on the bottom left had corder of the display
    - Download this CSV file, open and locate your Pod Information

    <figure markdown="span">
          [![Lab Pod Details](../GlobalImages/cisco-logo-transparent.png){ width="200" }](https://raw.githubusercontent.com/WebexCC-SA/LAB-1451/main/docs/Main-Lab/DownloadContent/WbxOne2025PodDetails.xlsx)
        <figcaption>Device Pod Assignment Sheet</figcaption>
    </figure>

    - Fill in the information for your RoomOS Device below

!!! example "Cache your lab credentials :smiley:"
    !!! note inline end

        This information is saved in the browser session storage area. Closing the page or opening the lab in a new tab will not carry this information over. You will need to re-fill this information or manually type this in as you go should it be cleared

    This lab will have you sign into several devices and services, to make the content a bit easier to follow, this lab can dynamically replace key pieces of information for you.

    If you have, or have been given the following information for the services services below, please take this time to fill in this information and click the <highlight_5> Update Lab Guide</highlight_5> button below

    !!! challenge ""

        <form id="info">

          <label for="ipAddress">RoomOS Device IP Address:</label>
          <input type="text" id="ipAddress" name="ipAddress"><br>
          

          <label for="username">RoomOS Device Username:</label>
          <input type="text" id="username" name="username"><br>

          <label for="password">RoomOS Device Password:</label>
          <input type="text" id="password" name="password"><br>

          <!-- <label for="webexToken">Webex Developer Token:</label>
          <input type="text" id="webexToken" name="webexToken"><br> -->

          <button id="setLabValues" onclick="setValues()">Update Lab Guide</button>

          <!-- <div id="setValue-notification-container"></div> -->
        </form>