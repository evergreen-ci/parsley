# URL Patterns for Parsley Application

* status: accepted 
* date: 2023-02-22
* authors: Mohamed Khelif

## Context and Problem Statement

The Parsley application is a web-based tool used for viewing and analyzing log files. The log files can originate from Evergreen, or they can be manually uploaded by a user. Parsley has several pages, and each page has a unique URL pattern.

## Decision Outcome
We decided to use the following URL patterns in Parsley:

* `/` - Root page. This auto redirects to `/upload`.
* `/upload` - Upload page.
* `/evergreen/:taskId/:execution/:origin` - Evergreen task logs page.
* `/test/:taskId/:execution/:testId` - Evergreen test logs page.
* `/resmoke/:buildId/test/:testId` - Resmoke logs page for a specific test.
* `/resmoke/:buildId/all` - Resmoke logs page for all tests in a build.

We use slugs to capture parameters in the URLs. All slugs are dynamic and user-supplied with the exception of `:origin`, which can be one of `agent`, `system`, `task`, or `all`.

## Consequences
Using a consistent URL pattern across Parsley makes it easier for users to navigate the application. It also allows for more straightforward integration with other tools that may need to interact with Parsley.

## More Information
In addition to the URL paths, query parameters are an important part of Parsley URLs. Query parameters can be used to pass additional information, such as filters or bookmarks that should be applied to the log. Parsley's query parameters are documented [here](0001-query-parameters.md).