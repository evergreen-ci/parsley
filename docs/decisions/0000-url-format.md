# URL Patterns for Parsley Application

* status: accepted 
* date: 2023-02-22
* authors: Mohamed Khelif

## Context and Problem Statement

The Parsley application is a web-based tool used for viewing and analyzing logs files from both Evergreen and user uploaded logs. The application has several pages, and each page has its unique URL pattern.

## Decision Outcome
We decided to use the following URL patterns for the pages in the Parsley application:

* `/` - root page. This auto redirects to `/upload` 
* `/upload` - upload page
* `/evergreen/:taskId/:execution/:origin` - Evergreen task logs page
* `/test/:taskId/:execution/:testId` - Evergreen Test logs page
* `/resmoke/:buildId/test/:testId` - Resmoke logs page for a specific test
* `/resmoke/:buildId/all` - Resmoke logs page for all tests in a build

We are using the slugs to capture the dynamic parameters in the URLs:

All slugs are dynamic and user supplied with the exception of `:origin`
`origin` can be one of the following
`agent`, `system`, `task`, `all`

## Consequences
Using a consistent URL pattern across the application makes it easier for users to navigate and use the tool. It also allows for more straightforward integration with other tools that may need to interact with the Parsley application.

## More Information
In addition to the URL paths, query parameters are an important part of Parsley URLs. Query parameters can be used to pass additional information to the pages, such as filter parameters for logs. Our query parameters can be found [here](0001-query-parameters.md)