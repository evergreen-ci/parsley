# Navigate the User Interface

Interface

The Parsley log viewer consists of a few major components listed below:

![interface](https://user-images.githubusercontent.com/624531/207629901-f8939ce3-2073-4c86-87d1-5708e7258a7e.jpg)

**Search bar:** The dropdown provides three modes: search, filter, and highlight. You can write a regex expression in the text input and press enter to apply the search, filter, or highlight.

**Side Panel:** The side panel is where you can manage your filters, expanded lines, and highlighted terms. The side panel is collapsible. Hovering over the collapsed side panel will expand it temporarily.

**Bookmark Pane:** The bookmark pane contains your bookmarks and share line. Click on any of the line numbers to automatically jump to that log line.

**Log Pane:** The log pane contains the log text. You can interact with the pane by double clicking any log line, which adds the log line to your bookmarks, or by clicking the link icons, which designates that log line as a line to share in the URL.

**Details menu:** The menu provides a variety of togglable settings which can affect the log view as well as the functionality of searching and filtering. These settings will be discussed in detail in further sections. The menu also provides external links to the raw and HTML logs.

Each component is also covered in detail in further sections. 

The task page link above the log links to the task page on Spruce. 

![task page](https://user-images.githubusercontent.com/624531/207638552-0119b374-2e16-490b-80a2-e1cdab1dd21d.png)

Raw and HTML buttons in the details menu links to the raw and HTML versions of the current log. 

![raw and html](https://user-images.githubusercontent.com/624531/207638591-69a596d4-9578-40b3-8dbf-3fc84230040a.png)

Job Logs Page

Resmoke.py – the test runner for mongodb-mongo-* tests – has a concept of a 'job' for organizing groups of tests to run. mongodb-mongo* logs include a “Job Logs” button that allows you to view all logs within a single job.  

The Job Logs button links to the Jobs Log page on Spruce for the current test.

![job logs](https://user-images.githubusercontent.com/624531/207638619-4eaf1c55-c71d-47ad-97f1-5826c38cc4f9.png)
