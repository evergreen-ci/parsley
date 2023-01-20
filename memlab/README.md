memlab is an end-to-end testing and analysis framework for identifying JavaScript memory leaks and optimization opportunities.

Read more [here](https://github.com/facebook/memlab)

#### How it works

1. Specify a scenario in `memlab/scenarios`. 
2. Create a non-minified build of parsley. 
3. Run the preview server at port 4173
4. Memlab will run the scenario and look at the memory utilization throughout each stage and log it.
5. If the memory usage between the initial stage and final stage differs by a threshold (Currently 20%) it indicates a potential memory leak. 
6. Task should fail and alert a developer to investigate the memory leak. 
7. Memlab generates several artificats and heap snapshots that can be used to investigate a memory leak locally using the memlab cli


#### What is a scenario?
A Scenario is a piece of functionality that you would like to test for memory leaks. 
It consists of the following components 

- `name` - The readable name of the scenario 
- `url` - The route the scenario should test
- `action` - A series of interactions that perform the action you want to test. These utilize the `puppeteer` syntax for performing these actions. 
- `back` - The interactions that would be required to reset the application to its state before performing the action. 

#### Why use a non minified build?
Memlab uses the non minified build to provide readable stack traces and object references. This makes debugging easier because objects will retain the same names we specify in our codebase.

### Investigating a heap snapshot using the interactive cli

1. Generate a `.heapsnapshot` file either by running a memlab scenario or downloading one from Chrome devtools.
2. Run `yarn memlab view-heap --snapshot <path_to_.heapsnapshot>
3. Utilizing the interactive cli to identify if any particular stage is utilizing more memory than you would expect. 