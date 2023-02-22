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
A filter expression is a special string that represents some boolean values representing filter state followed by url encoded regular expression representing the filter.

An example filter looks like this
```ts
const filter = `100someFilter`
```
The below is a breakdown of the above filter
* `filter[0]` - This represent the visibility state for a specific filter. If a filter it "visible" it will be applied to the current log. `1` represents visible and `0` represents not visible.
* `filter[1]` - This represents the caseSensitivity of a filter. Think of this as the `i` pattern modifier in a regular expression. `1` for case sensitive and `0` for insensitive.
* `filter[2]` - This represents the match type if the filter should perform an exact match or inverse match. An inverse match will match on any line that does not match the filter. `1` for inverse match and `0` for exact match.
* `rest of filter` - The rest of the filter is the URI encoded regular expression string. When generating these filters ensure you are only passing in the regular expression string and not including any pattern modifiers. 

<!-- This is an optional element. Feel free to remove. -->
## More Information
Note:

**Parsley is a Javascript application and thus only supports Regular Expressions written in the Javascript flavor if you are unsure you can test your regular expressions [here](https://regex101.com/) or on the Parsley application.**
