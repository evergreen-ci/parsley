# Query Parameters in Parsley URLs

* status: accepted
* date: 2023-02-22
* authors: Mohamed Khelif

## Context and Problem Statement

 Parsley URLs often contain query parameters that provide additional information about the applications functionality or specify what data should be displayed. These query parameters allow for a reproducable view that enables engineers to share pages and see the same content.

<!-- This is an optional element. Feel free to remove. -->
## Considered Options

## Decision Outcome
Query parameters are an important component of Parsley URLs and should be documented. Query parameters are appended to a URL using a ? character followed by key-value pairs separated by &. In general, Parsley URLs may contain a large number of query parameters, and their meanings can vary depending on the context.

It is important to include query parameters when linking to a Parsley URL. For example, if a user is sharing a link to a page on Parsley with a colleague, they should include any necessary query parameters so that the colleague sees the same view of the data.

Here is an example Parsley URL with query parameters:
```bash
https://parsley.mongodb.com/resmoke/8e85450ab4fbfcc846a9625d20b146b7/test/17460c1313810cec48a0deccd4c21f74?bookmarks=0,76099&filterLogic=and&filters=100network&highlights=job0,NETWORK&lower=1&shareLine=0&upper=50
```

In this URL, the query parameters are:

* `bookmarks`: A comma-separated list of bookmarks that should be displayed on the page.
* `filters`: A comma-seperated list of filter expressions that is used to collapse lines on the screen. See [Filter Expressions below](#filter-expressions).
* `filterLogic`: A string value of one of the two following strings representing the boolean logic to apply to filter parameters `and`, `or`
* `highlights`: A comma-separated list of url encoded regular expressions representing highlight terms that should be displayed on the page.
* `shareLine`: An integer value that indicates a line to automatically scroll to.
* `upper`: An integer value that specifies the upper limit of the lines to search.
* `lower`: An integer value that specifies the lower limit of the lines to search

### Filter Expressions

<!-- This is an optional element. Feel free to remove. -->
## More Information