# {2023-04-18} Use Streams to Download Logs

* status: accepted
* date: 2023-04-18
* authors: Mohamed Khelif

## Context and Problem Statement

When downloading a log file, we currently download the entire file in one go. We then use fetches `response.text()` method to convert the response to a string. This is a problem because it can cause the browser to crash if the log file is too large. Browsers have a limit on the amount of memory they can allocate to a single string. This limit is as low as 1GB on some browsers. This means that if a log file is larger than 1GB, the browser will fail when trying to convert the response to a string. 
We also encounter a scenario where parsley will not load a log file if the request is killed by the server due to a timeout. This is because the browser will not receive a response and will not be able to convert the response to a string.

We should instead use streams to download the log file. This will allow us to download the log file in chunks and process each chunk as it is received. This will allow us to download log files of any size without crashing the browser.


## Decision Outcome

We have implemented a `fetchLogFile` function that uses streams to download log files. This function is used in the `useLogDownloader` hook. It downloads the log file in chunks and processes each chunk as it is received. It handles splitting the log file into multiple lines as each chunk is received. It also handles the case where a chunk is received that contains multiple lines.
We have also included logic to not error out if the request is killed by the server due to a timeout. This is done by checking if the response has returned any data. If it has, we will continue to process the data as it is received. If it has not, we will throw an error.
Now that we can download log files of any size, we need to introduce artificial limits to avoid hitting overarching browser memory limitations. 
The current limit is 2.5GB per log file. This is a very large log file and should be sufficient for most use cases. We can increase this limit if we encounter a use case that requires it. The limit was chosen by taking the largest 99th percentile log file size from the logs we've observed downloaded over a 30 day period and multiplying it by 5. This should give us a buffer to account for the fact that the 99th percentile is not the largest log file size we have seen.
