const convertKBToMB = (kb: number) => Math.round(kb / 1024);

const convertBytesToUnitString = (bytes: number) => {
  if (bytes > 1024) {
    return `${convertKBToMB(bytes)}MB`;
  }
  return `${bytes}KB`;
};

export { convertBytesToUnitString };
