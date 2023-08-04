const prompts = require("prompts");
const { exec } = require("child_process");

const localDeployScript =
  "yarn build:prod && env-cmd -e production yarn deploy:do-not-use && env-cmd -e production ./scripts/email.sh";

const main = async () => {
  if (!(await isOnMainBranch())) {
    console.log("You must be on the main branch to deploy!");
    return;
  }
  if (!(await isWorkingDirectoryClean())) {
    console.log("You must have a clean working directory to deploy");
    return;
  }

  const currentlyDeployedCommit = await getCurrentlyDeployedCommit();
  console.log(`Currently Deployed Commit: ${currentlyDeployedCommit}`);

  // Print all commits between the last tag and the current commit
  const commitMessages = await getCommitMessages(currentlyDeployedCommit);

  let shouldDeployLocal = false;
  if (commitMessages.length === 0) {
    // If there are no commit messages, ask the user if they want to deploy anyway
    const response = await prompts({
      type: "confirm",
      name: "value",
      message: "No new commits. Do you want to deploy anyway?",
      initial: false,
    });
    shouldDeployLocal = response.value;
    if (!shouldDeployLocal) {
      return;
    }
  } else {
    console.log("Changes to deploy:");
    console.log(commitMessages);
  }

  const response = await prompts({
    type: "confirm",
    name: "value",
    message: "Are you sure you want to deploy to production?",
  });

  if (response.value) {
    if (shouldDeployLocal) {
      try {
        const localDeployOutput = await runLocalDeploy();
        console.log(localDeployOutput);
      } catch (err) {
        console.log(err);
        console.log("Local deploy failed. Aborting.");
      }
    } else {
      try {
        const createTagOutput = await createNewTag();
        console.log(createTagOutput);
        console.log("Pushed to remote. Should be deploying soon...");
        console.log(
          "Track deploy progress at https://spruce.mongodb.com/commits/parsley?requester=git_tag_request"
        );
      } catch (err) {
        console.log(err);
        console.log("Creating tag failed. Aborting.");
      }
    }
  }
};

const createNewTag = () =>
  new Promise((resolve, reject) => {
    exec("yarn version --new-version patch", (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout);
    });
  });

const getCommitMessages = (currentlyDeployedCommit) =>
  new Promise((resolve, reject) => {
    exec(
      `git log ${currentlyDeployedCommit}..HEAD --oneline`,
      (err, stdout) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(stdout);
      }
    );
  });

const getCurrentlyDeployedCommit = () =>
  new Promise((resolve, reject) => {
    exec("bash scripts/get-current-deployed-commit.sh", (err, stdout) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      console.log(stdout);
      // Regex for githash
      const githashRegex = /[a-z0-9]{40}/gm;
      // Regex for git tag
      const gitTagRegex = /v[0-9]+\.[0-9]+\.[0-9]+/gm;
      const githash = stdout.match(githashRegex);
      const gitTag = stdout.match(gitTagRegex);
      if (githash) {
        resolve(githash[0]);
      } else if (gitTag) {
        resolve(gitTag[0]);
      } else {
        reject(
          new Error(
            "Could not find a githash or git tag in the output of get-current-deployed-commit.sh"
          )
        );
      }
    });
  });

const runLocalDeploy = () =>
  new Promise((resolve, reject) => {
    exec(localDeployScript, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout);
    });
  });

const isOnMainBranch = () =>
  new Promise((resolve, reject) => {
    exec("git branch --show-current", (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout.trim() === "main");
    });
  });

const isWorkingDirectoryClean = () =>
  new Promise((resolve, reject) => {
    exec("git status --porcelain", (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout.trim() === "");
    });
  });

main();
