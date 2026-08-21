{{ config.cProps.acronyms }}
# Lab Setup

???+ tool "Setup: Prepare the Device"

    ??? important "Skip this step unless otherwise directed by the lab proctor"

        !!! example "Please Follow Each Step"

            === "1. Factory Reset(Optional)"

                <figure markdown>
                    ![Factory Reset](images%2F4-1-1.png){ width="600" }
                </figure>

            === "2. Setup Device Defaults and Admin Account"

                === "2.1"
                
                    <figure markdown>
                        ![Defaults](images%2F4-1-2a.png){ width="600" }
                    </figure>

                === "2.2"

                    <figure markdown>
                        ![Network](images%2F4-1-2b.png){ width="600" }
                    </figure>

                === "2.3"

                    <figure markdown>
                        ![Registration](images%2F4-1-2e.png){ width="600" }
                    </figure>
                
                === "2.4"

                    <figure markdown>
                        ![Complete](images%2F4-1-2d.png){ width="600" }
                    </figure>


            === "3 Register to Webex"

                === "3.1"
                
                    <figure markdown>
                        ![Enter Device Home Page](images%2F4-1-3a.png){ width="600" }
                    </figure>

                === "3.2"

                    <figure markdown>
                        ![Register To Webex](images%2F4-1-3b.png){ width="600" }
                    </figure>

??? tool "Download Device Pod Assignment Sheet"

    <figure markdown="span">
          [![Download the Device Pod Assignment Sheet](../GlobalImages/cisco-logo-transparent.png){ width="200" }](../DownloadContent/WbxOne2025PodDetails.xlsx)
        <figcaption>Device Pod Assignment Sheet</figcaption>
    </figure>

    !!! important "Record Your Pod Details"

        Open the assignment sheet and record the values for your pod before continuing:

        | `Value` | `Why you need it` |
        |---------|-------------------|
        | Pod number | Used in your tag, template, organization, and local username |
        | Device name and model | Confirms that you are changing the correct endpoint |
        | Control Hub credentials | Used in the Control Hub and CE-Deploy OAuth lessons |

        You will retrieve the device IP address from its touchscreen or paired Room Navigator in
        the first CE-Deploy lesson. Keep these values handy throughout the module.


??? tool "Install Ce-Deploy"

    !!! important "CE-Deploy Install"

        Before we begin our lab you will need to download and install CE-Deploy 16 (v16.3.1 or later) using the links below:

        - <a target="_blank" href="https://github.com/voipnorm/CE-Deploy/releases/download/v16.3.1/CE-Deploy-Installer.16.3.1.exe">Windows Installer <i class="fa-solid fa-square-arrow-up-right"></i></a>

        - <a target="_blank" href="https://github.com/voipnorm/CE-Deploy/releases/download/v16.3.1/CE-Deploy-16.3.1-universal.dmg">Mac Installer <i class="fa-solid fa-square-arrow-up-right"></i></a>

        If this is your first time opening CE-Deploy 16, don't worry about signing in yet — the
        "Connect Your Organization" lesson coming up walks you through it. The old token-download
        flow has been replaced with an Organizations screen.
