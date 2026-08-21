{{ config.cProps.devNotice }}
{{ config.cProps.acronyms }}

# Messages ~(section\ {{ config.cProps.rxp.sectionIds.ui.messages }})~

Messages are one of those uniques interfaces that are ONLY accessible by leveraging the RoomOS xAPI

!!! important

    In the next few lessons, you'll again use SSH to explore these interfaces

    If you haven't completed RoomOS xAPI > SSH ^({{config.cProps.rxp.sectionIds.ssh}})^, please review that material before moving on, or jump to the next section

???+ lesson "Lesson: Prompt Display ~({{ config.cProps.rxp.sectionIds.ui.messages }}.1)~"

    - **xAPI**: xCommand UserInterface Message Prompt Display

    - **Task**:

        - First, setup a Prompt Subscription, this will let us see all the Prompt Events coming into the device
        - Keep on your terminal window for any events that fire

        ``` shell title="Type into terminal and press Enter"
        xFeedback Register Event/UserInterface/Message/Prompt
        ```
  
        - Now issue your First Prompt

        ``` shell title="Type into terminal and press Enter"
        xCommand UserInterface Message Prompt Display Duration: 10 FeedbackId: xyz "Option.1": 1 "Option.2": 2 "Option.3": 3 "Option.4": 4 "Option.5": 5 Text: World Title: Hello
        ```

        - Observe the change to your Codec's Display, you should see a prompt with 5 options, a title, text and will disappear after 10 seconds

        ``` shell title="Type into terminal and press Enter"
        xCommand UserInterface Message Prompt Display FeedbackId: xyz "Option.1": "It's the best" "Option.2": Yes Text: "Let us know about this Lab" Title: "How's the Lab?"
        ```

        - Observe the change to your Codec's Display, you should now see a slightly different Prompt, with less options and the prompt won't dismiss on it's own
        - Prompts can have up to 5 options, but not all are required
        - To dismiss, tap any option below ot outside the prompt and it will close

        - Alternatively you can close a prompt by running `xCommand UserInterface Message Prompt Clear`

        - Finish off this task deregistering your Subscription

        ```shell title="Type into terminal and press Enter"
        xFeedback DeregisterAll
        ```

        Learn more about Prompts

        <roomosfind>UserInterface Message Prompt</roomosfind>

??? lesson "Lesson: Alert Display ~({{ config.cProps.rxp.sectionIds.ui.messages }}.2)~"

    - **xAPI**: xCommand UserInterface Message Alert Display

    - **Task**:

        - First, setup a Alert Subscription, this will let us see all the Alert Events coming into the device
        - Keep on your terminal window for any events that fire

        ``` shell title="Type into terminal and press Enter"
        xFeedback Register Event/UserInterface/Message/Alert
        ```
  
        - Now issue your First Alert

        ``` shell title="Type into terminal and press Enter"
        xCommand UserInterface Message Alert Display Duration: 10 Text: World Title: Hello
        ```

        - Observe the change to your Codec's Display, you should see a Alert a title, text and will disappear after 10 seconds

        ``` shell title="Type into terminal and press Enter"
        xCommand UserInterface Message Alert Display Text: "Lab Reviews shouldn't contain all yes answers" Title: "Uh-Oh! ⚠️"
        ```

        - Observe the change to your Codec's Display
        - To dismiss, tap any option below ot outside the Alert and it will close

        - Alternatively you can close a Alert by running `xCommand UserInterface Message Alert Clear`

        - Finish off this task deregistering your Subscription

        ```shell title="Type into terminal and press Enter"
        xFeedback DeregisterAll
        ```

        Learn more about Alerts

        <roomosfind>UserInterface Message Alert</roomosfind>

??? lesson "Lesson: Rating Display ~({{ config.cProps.rxp.sectionIds.ui.messages }}.3)~"

    - **xAPI**: xCommand UserInterface Message Rating Display

    - **Task**:

        - First, setup a Rating Subscription, this will let us see all the Rating Events coming into the device
        - Keep on your terminal window for any events that fire

        ``` shell title="Type into terminal and press Enter"
        xFeedback Register Event/UserInterface/Message/Rating
        ```
  
        - Now issue your First Rating

        ``` shell title="Type into terminal and press Enter"
        xCommand UserInterface Message Rating Display Duration: 10 FeedbackId: xyz SubmitReceiptText: "Receipt Text" SubmitReceiptTitle: "Receipt Title" Text: "World" Title: "Hello"
        ```

        - Observe the change to your Codec's Display, you should see a Rating with a Choice of 5 stars

        ``` shell title="Type into terminal and press Enter"
        xCommand UserInterface Message Rating Display Duration: 10 FeedbackId: xyz SubmitReceiptText: "Ok, this is a bit more fair of a rating than prompts" SubmitReceiptTitle: "Thanks Text: "Rate this lab below" Title: "How's the Lab?"
        ```

        - Ratings give you a different style of prompting, that's a bit more quantitative that qualitative when compared to Ratings
        - To dismiss, tap any option below ot outside the Rating and it will close

        - Alternatively you can close a Rating by running `xCommand UserInterface Message Rating Clear`

        - Finish off this task deregistering your Subscription

        ```shell title="Type into terminal and press Enter"
        xFeedback DeregisterAll
        ```

        Learn more about Ratings

        <roomosfind>UserInterface Message Rating</roomosfind>

??? challenge "Challenge: Explore More Messages"

    As you've probably noticed, the structure is similar

    Rather than a full lesson, we challenge you to subscribe, execute and interact with TextInput and TextLine

    When done, move onto the next section

    <roomosfind>UserInterface Message TextInput</roomosfind>

    <roomosfind>UserInterface Message TextLine</roomosfind>