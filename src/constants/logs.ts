const LOG_FILE_SIZE_LIMIT = 1024 * 1024 * 1024 * 2.5; // 2.5 GB
const LOG_LINE_SIZE_LIMIT = 1024 * 1024 * 5; // 5 MB This should be enough to accommodate most lines, but not so large that it will cause performance issues.

export { LOG_FILE_SIZE_LIMIT, LOG_LINE_SIZE_LIMIT };
