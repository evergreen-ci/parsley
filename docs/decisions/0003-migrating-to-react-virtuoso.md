# Migrating Parsley Virtualization to react-virtuoso

* status: proposed
* date: 2022-02-22
* authors: Mohamed Khelif

## Context and Problem Statement

Parsley currently uses the [react-virtualized](https://github.com/bvaughn/react-virtualized) library to render log files. This library was the only library we could find that can support a continuous virtualized view capable of rendering over 800k lines, which is often the case with some log files. Unfortunately it has many problems, some of which include:

* It is no longer maintained by its owner.
* It is unable to maintain a scroll position when scrolling to previously unvisited lines due to some buggy scroll position compensation logic. (Which ironically is probably the thing that lets it render so many lines). This causes the log file to "jump" dramatically.
  * It needs to maintain a cache of the sizes of each log line.
  * Performing any operations that resize the log lines such as wrapping or pretty printing force the cache to invalidate. 
The cache sometimes gets garbage collected which causes logs to be corrupted.
[React Virtuoso](https://github.com/petyosi/react-virtuoso) is a far more modern library that is more actively maintained. It is far more feature rich and does not depend on a cache to save log sizes and instead calculates them on the fly. In our experimentation, it does not have the same scroll jumping issues observed with react-virtualized. This library was initially evaluated as part of the initial Parsley scope and technical design but was passed over due to its limitations when it came to rendering large log files.
—
As we have received feedback on Parsley, we have come to realize that the scrolling issues present in the current library have been a huge pain point for users. We have started investigating if we can migrate to react-virtuoso without compromising the user experience and preventing users from accessing larger log files.


## Considered Options
In order to solve this issue, we have come up with a hybrid paginated virtualized view that combines aspects of pagination and virtualization to (hopefully) provide a seamless log viewing experience. 

The pagination allows us to split a log into manageable subsections that are renderable using the new virtualization library. As users reach the end of the subsection, we will "paginate" the currently visible subsection and perform some scroll hacking to render new rows in the view while resetting the scrolled position so that the user can continue to scroll down without interruption. 

Here is a POC of what this would potentially look like: https://07sw2q.csb.app/


## Decision Outcome

This section will be updated following the completion of this change. 