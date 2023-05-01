const arrayBufferToStringArray = (buffer: ArrayBuffer): string[] => {
  const decoder = new TextDecoder();
  // dataView is used to read the array buffer byte by byte
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
  const view = new DataView(buffer);
  const lines: string[] = [];
  let line = "";

  for (let i = 0; i < view.byteLength; i++) {
    const charCode = view.getUint8(i);
    if (charCode === 10 || charCode === 13) {
      if (line) {
        lines.push(line);
        line = "";
      }
    } else {
      line += decoder.decode(new Uint8Array([charCode]));
    }
  }

  // If the last line doesn't end with a newline, we need to add it to the array
  if (line) {
    lines.push(line);
  }

  return lines;
};

export { arrayBufferToStringArray };
