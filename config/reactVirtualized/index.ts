import fs from "fs";
import path from "path";

// Manually perform dead code removal on react-virtualized
// https://github.com/bvaughn/react-virtualized/issues/1632
// vite does not automatically eliminate dead code so we need to do it manually.
const DEAD_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js"`;
export default () => {
  return {
    name: "my:react-virtualized",
    configResolved() {
      const file = require
        .resolve("react-virtualized")
        .replace(
          path.join("dist", "commonjs", "index.js"),
          path.join("dist", "es", "WindowScroller", "utils", "onScroll.js")
        );
      const code = fs.readFileSync(file, "utf-8");
      const modified = code.replace(DEAD_CODE, "");
      fs.writeFileSync(file, modified);
    },
  };
};
