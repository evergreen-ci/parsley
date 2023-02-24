# Query Parameters in Parsley URLs

* status: accepted
* date: 2023-02-22
* authors: Mohamed Khelif

## Context and Problem Statement

 Parsley URLs often contain query parameters that specify how the data should be displayed in the application. These query parameters allow for a reproducible view which enables engineers to share Parsley links with others.


## Decision Outcome
Query parameters are appended to a URL using a question mark (`?`) followed by key-value pairs separated by ampersands (`&`). In general, Parsley URLs may contain a large number of query parameters, and their meanings can vary depending on the context.

It is important to include query parameters when sharing Parsley links. For example, if a user wants to share a Parsley link with someone else, they should include any relevant query parameters so that the other person can see the same content on the page.

Here is an example of a Parsley link with query parameters. The query parameters follow the `?` character:
```bash
https://parsley.mongodb.com/resmoke/8e85450ab4fbfcc846a9625d20b146b7/test/17460c1313810cec48a0deccd4c21f74?bookmarks=0,76099&filterLogic=and&filters=100network&highlights=job0,NETWORK&lower=1&shareLine=0&upper=50
```

In this URL, the query parameters are:

* `bookmarks`: A comma-separated list of integers representing bookmarked lines.
* `filters`: A comma-separated list of URI encoded regular expressions representing filters. [Read more about filter expressions](#filter-expressions).
* `filterLogic`: A string value representing the boolean logic to apply to filter parameters. It has two possible values: `and` and `or`.
* `highlights`: A comma-separated list of URI encoded regular expressions representing highlighted terms.
* `shareLine`: An integer value that indicates a line to automatically scroll to.
* `upper`: An integer value that specifies the upper limit of the lines to search.
* `lower`: An integer value that specifies the lower limit of the lines to search.

### Filter Expressions
Every filter expression is prefixed by a `0/1` string of length 3, which represents the visibility, case sensitivity, and match type.

An example filter looks like this:
```ts
const filter = `100someFilter`
```
Below is a breakdown of the filter:
* `filter[0]` - This character represents visibility. `1` represents visible and `0` represents not visible. If a filter is visible, that essentially means that it is active and will be used to collapse unmatching lines in the current log.
* `filter[1]` - This character represents case sensitivity. `1` represents case sensitive and `0` represents case insensitive. If a filter is case insensitive, that essentially means that we append the `i` pattern modifier to the regular expression. 
* `filter[2]` - This character represents match type. `1` represents inverse match and `0` represents exact match. An inverse match will output all lines that do <i>not</i> match the filter. 
* `filter[3:]` - The rest of the filter is a URI encoded string containing the regular expression. When generating these filters, ensure that you are only passing in the regular expression string and not including any regex pattern modifiers. 

<!-- This is an optional element. Feel free to remove. -->
## More Information
Note:

Parsley is a Javascript application and thus only supports regular expressions written in the Javascript flavor. If you are unsure, you can test your regular expressions [here](https://regex101.com/) or on the Parsley application.
