import { execSync } from "child_process";

/**
 * `createNewTag` is a helper function that creates a new tag.
 * @param version - version indicates the type of upgrade of the new tag.
 */
const createNewTag = (version: "patch" | "minor" | "major") => {
  execSync(`yarn version --new-version ${version}`, {
    encoding: "utf-8",
    stdio: "inherit",
  });
};

/**
 * `getLatestTag` is a helper function that returns the latest tag.
 * @returns - the latest tag
 */
const getLatestTag = () => {
  const latestTag = execSync("git describe --tags --abbrev=0", {
    encoding: "utf-8",
  })
    .toString()
    .trim();
  return latestTag;
};

/**
 * `deleteTag` is a helper function that deletes a tag.
 * @param tag - the tag to delete
 */
const deleteTag = (tag: string) => {
  const deleteCommand = `git push --delete upstream ${tag}`;
  execSync(deleteCommand, { stdio: "inherit", encoding: "utf-8" });
};

/**
 * `pushTags` is a helper function that pushes tags to the remote.
 */
const pushTags = () => {
  execSync(`git push --tags upstream`, {
    stdio: "inherit",
    encoding: "utf-8",
  });
};

export { createNewTag, getLatestTag, deleteTag, pushTags };
