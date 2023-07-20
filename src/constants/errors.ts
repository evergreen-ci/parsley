import { getBytesAsString } from "utils/string";
import { LOG_LINE_SIZE_LIMIT } from "./logs";

export const LOG_LINE_TOO_LARGE_WARNING = `Parsley was unable to process one or more lines due to performance reasons since they exceed the line size limit of ${getBytesAsString(
  LOG_LINE_SIZE_LIMIT
)}. They have been trimmed to fit the limit.`;
