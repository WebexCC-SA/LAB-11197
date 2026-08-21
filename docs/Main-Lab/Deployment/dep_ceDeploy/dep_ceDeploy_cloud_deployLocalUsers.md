{{ config.cProps.acronyms }}
# Device Users & On-Premise Access

!!! abstract

    A local admin account gets you into the device directly, no need to go through Control Hub or
    the cloud xAPI at all. Some tasks just aren't available from the cloud, so a local admin account
    is essential for on-prem work. Trouble is, a newly-added cloud device usually has its local
    admin accounts stripped out, leaving the web portal reachable only through Control Hub. In this
    lab you'll add one back via the cloud, then use it to confirm access through the On-Premise
    organization you set up earlier.

<div class="grid cards" markdown>

-   <i class="fa-solid fa-location-dot"></i> **Where**

    ---

    ==Users== in the left sidebar, then ==Organizations==

-   <i class="fa-solid fa-clock"></i> **Time**

    ---

    About 8 minutes

-   <i class="fa-solid fa-bullseye"></i> **Goal**

    ---

    Add a local admin account and confirm it works via your On-Premise organization

</div>

??? lesson "{{config.cProps.dep.sectionIds.cD}}.5 Lab"

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.5.1</highlight_1> Open CE-Deploy. Check the organization switcher at the top of the
    window and confirm your Cloud organization (added in "Connect CE-Deploy to Your Organization")
    is active. In the left sidebar, select ==Users== (its page header reads "Device Users" once
    you're on it — same feature, just a shorter label in the sidebar itself).

    !!! Tip "Device Users"

        This feature lets you add, modify, and delete local user accounts via the cloud xAPI. If
        you're doing integrations with 3rd parties, setting configurations, or running device
        backups, having a local admin account may be critical for day-to-day operations.

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.5.2</highlight_1> In the ==User Management== card, use the ==Action== dropdown to
    select ==Add User==, then set the following:

    | `Setting`     | <!-- --> |
    |---------------|----------|
    | `Username`    | adminUserXX, replacing XX with your two-digit pod number (for example, adminUser01) |
    | `Passphrase`  | Cisco12345 |
    | `Role`        | Admin |

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.5.3</highlight_1> Click ==Next: Select Devices== at the bottom of the page. In the
    Deployment Options modal, select ==Tags== as the target and enter your pod tag, then check
    ==Video Devices Only==. Click ==Next: Schedule==, leave ==Run Now== selected in the Deployment
    Scheduler modal, and click ==Continue==.

    !!! challenge "Discover the Same IP Through xAPI"

        Earlier, you found the endpoint IP address from the device's touchscreen or Room Navigator
        so you could create the On-Premise organization. Now use the ==xAPI== tab in CE-Deploy to
        retrieve that same address programmatically:

        ```text
        xStatus Network[1] IPv4 Address
        ```

        Compare the returned value with the address you recorded earlier. This is a discovery
        exercise, not a prerequisite for continuing: it demonstrates how the same information can
        be collected remotely instead of by walking up to every device.

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.5.4</highlight_1> Use the organization switcher at the top of the window to activate
    your ==On-Premise== organization (created in "Connect CE-Deploy to Your Organization," the first
    CE-Deploy lesson of this module). If you'd rather use the card view, go to ==Organizations== in
    the left sidebar and click ==Activate== on the On-Premise card. Either way, once it's active,
    open that same card's ⋮ menu and select ==Edit On-Premise Settings==. Confirm its IP address
    matches both the address you recorded at the device and, if you completed the challenge, the
    xAPI result. Then enter the local admin username/passphrase you just created above.

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.5.5</highlight_1> In the left sidebar, select ==xAPI== (you're now looking at the same
    Command Builder from the "Bulk xAPI Commands" lesson, just targeting your On-Premise
    organization instead of Cloud). In the command card, enter:

    ```text
    xCommand time datetime get
    ```

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.5.6</highlight_1> Click ==Next: Select Devices==, then ==Next: Schedule== in the
    Deployment Options modal, then leave ==Run Now== selected and click ==Continue== in the
    Deployment Scheduler modal. The message console should return the device's current time,
    confirming your local admin account works and your On-Premise organization is correctly
    configured.

    !!! Success

        All done. You've now got both cloud and direct on-premise access to your pod device, and
        you've seen the most commonly used deployment functions in CE-Deploy. Keep your On-Premise
        organization active; next up is the on-prem-only toolkit: backups, logs, and the SSH
        terminal.
