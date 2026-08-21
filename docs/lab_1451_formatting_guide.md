# Lab 1451 Formatting Guide

## File Location & Naming

### File Locations

> All Lab related files are under `docs > Main-Lab`

- Each Major Lab section is enclosed in their own folder

- Current Major Sections

|Name|Location (Path)|Description|
|:--|:--|:--|
|Setup| `docs > Main-Lab > Setup` | Covers any Hardware/Software Setup needed for each major part of the Lab |
|RoomOS xAPI and Extensions| `docs > Main-Lab > RoomOS` | Lab Content demonstrating use of RoomOS device xAPI and UI Extensions |
|PhoneOS xAPI| `docs > Main-Lab > PhoneOS` | Lab Content demonstrating use of RoomOS device xAPI |
|Deployment| `docs > Main-Lab > Deployment` | Lab Content demonstrating customization deployment via Control Hub and CE-Deploy |
|Resources| `docs > Main-Lab > Deployment` | Helpful resources for trainees to enable extended learning |

### File Naming

> It's best to keep Files short for maintainability, so keep each topic within a Major Section contained in their own markdown

| Formal Content Name | File Prefix                  | File Content descriptor                                | Example(s)                                                                           |
|:-------------------|:----------------------------|--------------------------------------------------------|--------------------------------------------------------------------------------------|
| Setup      | <highlight_0>stp</highlight_0> | <highlight_2>Custom Field - Defined by Lab Content Developer</highlight_2> | <highlight_0>stp</highlight_0>\_<highlight_2>intro</highlight_2>.md                                       |
| RoomOS             | <highlight_0>rxp</highlight_0> | <highlight_2>Custom Field - Defined by Lab Content Developer</highlight_2> | <highlight_0>rxp</highlight_0>\_<highlight_2>xapi_intro</highlight_2>.md<br><highlight_0>rxp</highlight_0>\_<highlight_2>ui_conclusion</highlight_2>.md |
| PhoneOS            | <highlight_0>pxp</highlight_0> | <highlight_2>Custom Field - Defined by Lab Content Developer</highlight_2> | <highlight_0>pxp</highlight_0>\_<highlight_2>intro</highlight_2>.md                                       |
| Deployment         | <highlight_0>dep</highlight_0> | <highlight_2>Custom Field - Defined by Lab Content Developer</highlight_2> | <highlight_0>dep</highlight_0>\_<highlight_2>intro</highlight_2>.md                                       |
| Resources          | <highlight_0>res</highlight_0> | <highlight_2>Custom Field - Defined by Lab Content Developer</highlight_2> | <highlight_0>res</highlight_0>\_<highlight_2>guide</highlight_2>.md                                       |

# Section Numbering

| Formal Content Name           | Prefix               | Major Number             | Minor Number(s)                                   | Example                                                                     | How to Read                                                                                             |
|:-----------------------------|:---------------------|:------------------------:|---------------------------------------------------|-----------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| Setup                | <highlight_0>stp</highlight_0> | N/A                      | <highlight_2>Custom Field - Defined by Lab Content Developer</highlight_2> | <highlight_0>stp</highlight_0>-<highlight_1>1</highlight_1><highlight_2>.0.X</highlight_2> | <highlight_0>Setup</highlight_0>, <highlight_1>Section 1</highlight_1>, <highlight_2>SubSection 0, ...</highlight_2>              |
| RoomOS                       | <highlight_0>rxp</highlight_0> | <highlight_1>Any #</highlight_1> | <highlight_2>Custom Field - Defined by Lab Content Developer</highlight_2> | <highlight_0>rxp</highlight_0>-<highlight_1>1</highlight_1><highlight_2>.0.X</highlight_2> | <highlight_0>RoomOS xAPI and Extensions</highlight_0>, <highlight_1>Section 1</highlight_1>, <highlight_2>SubSection 0, ...</highlight_2> |
| PhoneOS                      | <highlight_0>pxp</highlight_0> | <highlight_1>Any #</highlight_1> | <highlight_2>Custom Field - Defined by Lab Content Developer</highlight_2> | <highlight_0>pxp</highlight_0>-<highlight_1>1</highlight_1><highlight_2>.0.X</highlight_2> | <highlight_0>PhoneOS xAPI</highlight_0>, <highlight_1>Section 1</highlight_1>, <highlight_2>SubSection 0, ...</highlight_2>               |
| Deployment                   | <highlight_0>dep</highlight_0> | <highlight_1>Any #</highlight_1> | <highlight_2>Custom Field - Defined by Lab Content Developer</highlight_2> | <highlight_0>dep</highlight_0>-<highlight_1>1</highlight_1><highlight_2>.0.X</highlight_2> | <highlight_0>Deployment</highlight_0>, <highlight_1>Section 1</highlight_1>, <highlight_2>SubSection 0, ...</highlight_2>                 |
| Resources                    | <highlight_0>res</highlight_0> | N/A                      | <highlight_2>Custom Field - Defined by Lab Content Developer</highlight_2> | <highlight_0>res</highlight_0>-<highlight_1>1</highlight_1><highlight_2>.0.X</highlight_2> | <highlight_0>Resources</highlight_0>, <highlight_1>Section 1</highlight_1>, <highlight_2>SubSection 0, ...</highlight_2>                  |

## How to Implement Section Numbering in your Lab

!!! blank "Major Section Heading 1"

    ```
    # Setup ~(stp-1)~
    ```

    !!! success "Rendered Result"

        # Setup ~(stp-1)~

!!! blank "Sub Section Headings 2"

    ```
    ## **RoomOS xAPI and Extensions Hardware Requirements** ~(stp-1)~
    ```

    !!! success "Rendered Result"

        ## **RoomOS xAPI and Extensions Hardware Requirements** ~(stp-1.1)~


!!! blank "Sub Section Lessons"

    ```
    ???+ lesson "Lesson: My RoomOS Lesson! ~(rxp-1.1.1)~"
        // Lesson Content...
    ```

    !!! success "Rendered Result"

        ???+ lesson "Lesson: My RoomOS Lesson! ~(rxp-1.1.1)~"
            // Lesson Content...

# RoomOS Doc Tags

-  A Custom tag has been implemented to handle placing a button for RoomOS xAPI Document References

- Provide the full Shell Path for an API wrapped the custom `<roomosdoc>` html tag

``` 
<roomosdoc>xCommand Audio Volume Set</roomosdoc> 
```

Output

<roomosdoc>xCommand Audio Volume Set</roomosdoc> 

# Custom Text highlighting Tags

> Added in more colors for text highlighting with a slight change to the styling

> The original MK Docs highlighting is still enabled as well

!!! blank "MK Docks Highlighting Syntax"

    <pre><code>
    To use MK Docs Highlighting, do the following with your text
    {\==For a simple highlight==}
    {\++To mark as an addition++}
    {\--To mark as a deletion--}
    </code></pre>

    !!! success "Rendered Results"

        To use MK Docs Highlighting, do the following with your text

        {==For a simple highlight==}<br>
        {++To mark as an addition++}<br>
        {--To mark as a deletion--}<br>

!!! blank "New Custom Highlighting"

    To use additional custom highlighting, do the following with your text

    <pre><code>
    &lt;highlight_0&gt;The highlight_0 tag mimics the original MK Docs Colors but matches the styling to the new highlights&lt;/highlight_0&gt;
    &lt;highlight_1&gt;highlight_1 introduces a new color for highlighting&lt;/highlight_1&gt;
    &lt;highlight_2&gt;highlight_2 introduces a new color for highlighting&lt;/highlight_2&gt;
    &lt;highlight_3&gt;highlight_3 introduces a new color for highlighting&lt;/highlight_3&gt;
    &lt;highlight_4&gt;highlight_4 introduces a new color for highlighting&lt;/highlight_4&gt;
    &lt;highlight_5&gt;highlight_5 introduces a new color for highlighting&lt;/highlight_5&gt;
    &lt;highlight_6&gt;highlight_6 introduces a new color for highlighting&lt;/highlight_6&gt;
    &lt;highlight_7&gt;highlight_7 introduces a new color for highlighting&lt;/highlight_7&gt;
    <br><\!-- Shorthand Versions of Each Tag added --><br>
    &lt;hl_0&gt;The hl_0 tag mimics the original MK Docs Colors but matches the styling to the new highlights&lt;/hl_0&gt;
    &lt;hl_1&gt;hl_1 introduces a new color for highlighting&lt;/hl_1&gt;
    &lt;hl_2&gt;hl_2 introduces a new color for highlighting&lt;/hl_2&gt;
    &lt;hl_3&gt;hl_3 introduces a new color for highlighting&lt;/hl_3&gt;
    &lt;hl_4&gt;hl_4 introduces a new color for highlighting&lt;/hl_4&gt;
    &lt;hl_5&gt;hl_5 introduces a new color for highlighting&lt;/hl_5&gt;
    &lt;hl_6&gt;hl_6 introduces a new color for highlighting&lt;/hl_6&gt;
    &lt;hl_7&gt;hl_7 introduces a new color for highlighting&lt;/hl_7&gt;
    </code></pre>

    !!! success "Rendered Results"

        To use additional custom highlighting, do the following with your text
        
        <highlight_0>The highlight_0 or hl_0 tag mimics the original MK Docs Colors but matches the styling to the new highlights</highlight_0><br>
        <highlight_1>highlight_1 or hl_1 introduces a new color for highlighting</highlight_1><br>
        <highlight_2>highlight_2 or hl_2 introduces a new color for highlighting</highlight_2><br>
        <highlight_3>highlight_3 or hl_3 introduces a new color for highlighting</highlight_3><br>
        <highlight_4>highlight_4 or hl_4 introduces a new color for highlighting</highlight_4><br>
        <highlight_5>highlight_5 or hl_5 introduces a new color for highlighting</highlight_5><br>
        <highlight_6>highlight_6 or hl_6 introduces a new color for highlighting</highlight_6><br>
        <highlight_7>highlight_7 or hl_7 introduces a new color for highlighting</highlight_7>