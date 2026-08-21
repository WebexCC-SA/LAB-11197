{{ config.cProps.acronyms }}
# Fleet Intelligence: Inventory & Config Auditor

!!! abstract

    You've spent this module configuring one device by hand and by the fleet-load. Time to check
    the fleet's health. Inventory gives you a quick data pull across every device in the org.
    **Config Auditor** goes further: capture a device's configuration as a golden baseline, prove
    that the unchanged device is compliant, deliberately introduce an Audio configuration change,
    and then watch the auditor detect it. Macros are audited separately by Macro Drift Detection.

<div class="grid cards" markdown>

-   <i class="fa-solid fa-location-dot"></i> **Where**

    ---

    ==Apps== → Fleet Management → Inventory & Config Auditor

-   <i class="fa-solid fa-clock"></i> **Time**

    ---

    About 8 minutes

-   <i class="fa-solid fa-bullseye"></i> **Goal**

    ---

    Pull fleet inventory data and audit the whole lab fleet against your own device

</div>

??? lesson "{{config.cProps.dep.sectionIds.cD}}.7 Lab"

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.7.1</highlight_1> Open CE-Deploy. Use the organization switcher at the top of the
    window (or the ==Organizations== screen in the left sidebar) to activate your ==Cloud==
    organization from "Connect CE-Deploy to Your Organization," the first CE-Deploy lesson of this
    module.

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.7.2</highlight_1> In the left sidebar, select ==Apps==. This opens a dashboard of
    feature cards grouped into categories. Under the ==Fleet Management== category, click the
    ==Inventory== card. CE-Deploy first opens the ==Inventory Options== modal; select ==Org Id==,
    confirm that the lab organization ID is populated, check ==Video Devices Only==, and click
    ==Start Inventory==. Unlike the earlier write operations that targeted only your pod tag, this
    read-only inventory intentionally uses ==Org Id== so you can inspect the whole lab fleet. The
    Inventory window opens after CE-Deploy resolves the target devices.

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.7.3</highlight_1> Explore the device data available — serial numbers, model, software
    version, and registration status for every device in the lab organization. Export to CSV or JSON
    if you'd like to keep a copy.

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.7.4</highlight_1> Close the Inventory window. Back on the ==Apps== dashboard, still
    under ==Fleet Management==, click the ==Config Auditor== card (green clipboard icon).

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.7.5</highlight_1> Config Auditor opens in its own window. Click ==New Baseline==. Set
    the Source Device to your pod device — the one you've been configuring all module — and leave
    the Baseline Name as-is. Set the ==Config Key Filter== to `Audio*` so the comparison stays
    focused on the configuration you deployed earlier, then click ==Capture==.

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.7.6</highlight_1> With your new baseline selected, choose your device from the
    ==Single Device== dropdown and click ==Run Comparison==. Since you just captured this baseline
    from this same device, you should see 100% compliance — a good sanity check that the feature
    works as expected.

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.7.7</highlight_1> Leave Config Auditor open and return to the main CE-Deploy window.
    Select ==xAPI== and replace the command card contents with the command below. Choose a random
    whole number from 20 through 80, but **do not use 60**, and substitute it for `<value>`.

    ```text
    xConfiguration Audio DefaultVolume: <value>
    ```

    Click ==Next: Select Devices==, target your ==podXX== tag, check ==Video Devices Only==, then
    click ==Next: Schedule== and ==Continue== with ==Run Now== selected. This deliberately changes
    only your pod device; do not use the Org Id target for this command.

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.7.8</highlight_1> Return to Config Auditor. With the same baseline and pod device
    selected, click ==Run Comparison== again. Compliance should now be below 100%, and the results
    should identify `Audio DefaultVolume` as drifted from the baseline value of 60 to the random
    value you selected.

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.7.9</highlight_1> Now click ==Audit Fleet (N)== (the number matches how many devices
    fit your current filters) to compare the fleet, including your pod, against your baseline. Watch the
    progress bar as it queries the fleet in parallel, then review the three result tabs: ==Summary==
    (fleet-wide compliance stats, a Most Common Drifts list, and Compliance by Category bars),
    ==By Device== (per-device compliance with expandable diffs), and ==By Config== (which devices
    drift on each individual setting).

    <figure markdown="span">
      ![Config Auditor Summary tab showing devices audited, compliance stats, a Most Common Drifts list, and Compliance by Category bars](images/dep-2-7-config-auditor-summary.png){ width="650" }
      <figcaption>The Summary tab after an Audit Fleet run — your own numbers will differ, since this example baseline came from a different device model than the fleet it's auditing</figcaption>
    </figure>

    Your own device should appear as drifted because of the change you just made. Other pods may
    remain compliant if they completed the same Control Hub template steps, while different device
    models can also expose different supported Audio settings. A result that differs from the
    screenshot is therefore expected; inspect the individual configuration differences rather than
    trying to match its percentages.

    <highlight_1>{{config.cProps.dep.sectionIds.cD}}.7.10</highlight_1> Return to the main CE-Deploy window and restore your pod's
    baseline value. In ==xAPI==, run the following command against your ==podXX== tag with
    ==Video Devices Only== checked:

    ```text
    xConfiguration Audio DefaultVolume: 60
    ```

    Optionally run one final Config Auditor comparison to confirm your device has returned to 100%
    compliance.

    !!! Success

        You've just audited the entire lab fleet's Audio configuration against your own device in
        seconds. Scale that up to a real deployment of thousands of endpoints and you're catching
        configuration drift long before it becomes a support ticket.

    ??? cedeploy "Worth exploring after class: Environmental Intelligence"

        CE-Deploy 16's flagship new feature is **Environmental Intelligence** (Apps > Fleet
        Management > Environmental Intelligence): real-time temperature, humidity, noise, and
        occupancy monitoring with anomaly detection across your fleet. It's genuinely powerful, but
        its health scores need several days of baseline data to mean anything, so in a single lab
        session you'll mostly see rooms sitting in a "Forming…" state. Take a look at the Health
        Cards and Grid views to get a feel for the UI, then revisit it with a real fleet once it's
        had time to learn your rooms' baselines.

    ??? challenge "Save This as a Template"

        You've now run several multi-step deployments in this module. Next time you open Deployment
        Options for one of them, look for ==Save as Template== — it captures the deployment type,
        form data, and target so you can re-run it with one click from the Apps dashboard next time,
        no re-entry required.
