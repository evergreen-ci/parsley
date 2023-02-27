# 2023-02-22 Migrating Parsley Virtualization to react-virtuoso

* status: proposed
* date: 2023-02-22
* authors: Mohamed Khelif

## Context and Problem Statement

Parsley currently uses the [react-virtualized](https://github.com/bvaughn/react-virtualized) library to render log files. We chose this library because it was the only library that could support a virtualized view of over 800k lines, which is often the case with large log files. Unfortunately it has many problems, some of which include:

* It is no longer maintained by its owner.
* It is unable to maintain the scroll position when scrolling to previously unvisited lines. This is due to faulty scroll position compensation logic, which is also the reason why it can render so many lines in the first place. This causes the log file to "jump" dramatically in scroll position.
* It needs to maintain a cache of the sizes of each log line.
  * Performing any operations that resize the log lines such as wrapping or pretty printing force the cache to invalidate. 
  * The cache sometimes gets garbage collected which causes logs to be corrupted.

[React Virtuoso](https://github.com/petyosi/react-virtuoso) is a modern virtualization library that is more actively maintained. It is feature rich and does not depend on a cache to save log sizes, instead opting to calculate them on the fly. In our experiments, we've noticed that it does not suffer from the scroll jumping issues observed with react-virtualized. React Virtuoso was initially evaluated as part of the initial Parsley scope and technical design but was passed over due to its limitations when it comes to rendering large log files.

As we have received feedback on Parsley, we have come to realize that the scrolling issues present in the current library have been a huge pain point for users. We have started investigating if we can migrate to react-virtuoso without preventing users from accessing larger log files or compromising the user experience.


## Considered Options
We have come up with a hybrid paginated virtualized view that combines aspects of pagination and virtualization to (hopefully) provide a seamless log viewing experience. 

Pagination will allow us to split a log into manageable subsections that are renderable using react-virtuoso. As users reach the end of the subsection, we will "paginate" the currently visible subsection and perform some scroll hacking to render new rows in the view and reset the scrolled position so that the user can continue to scroll down without interruption. 

Here is a POC of what this would potentially look like: https://07sw2q.csb.app/


## Decision Outcome

This section will be updated following the completion of this change. 