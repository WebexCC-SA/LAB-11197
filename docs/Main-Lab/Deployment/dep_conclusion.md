{{ config.cProps.acronyms }}

!!! important "Conclusion"

    You have completed an end-to-end device deployment workflow: targeting a device with a tag,
    applying a Control Hub template, running xAPI commands, deploying personalization and custom
    code, establishing direct on-premises access, collecting support files, and detecting
    configuration drift.

    The final Config Auditor step restored `Audio DefaultVolume` to 60. Unless your proctor asks
    you to clean up further, leave the remaining lab artifacts in place so they can be reviewed:

    - Your `podXX` tag and `LabTemplateXX` Control Hub template
    - The QR-code personalization
    - The `LaunchHalfwake` macro and `halfwake` UI extension
    - Your `adminUserXX` local account
    - Your CE-Deploy Cloud and On-Premise organization entries

    If the lab environment must be reset for another student, follow the proctor's cleanup
    instructions rather than deleting shared-organization resources yourself. Keep the lab URL
    handy for future reference.

