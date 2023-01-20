memlab is an end-to-end testing and analysis framework for identifying JavaScript memory leaks and optimization opportunities.

Read more [here](https://github.com/facebook/memlab)


### Investigating a heap snapshot using the interactive cli

1. Generate a `.heapsnapshot` file either by running a memlab scenario or downloading one from Chrome devtools.
2. Run `yarn memlab view-heap --snapshot <path_to_.heapsnapshot>
3. Utilizing the interactive cli to identify if any particular stage is utilizing more memory than you would expect. 