const prompts = require("prompts");
const { exec } = require("child_process");

const localDeployScript =
  "yarn build:production && env-cmd -e production yarn deploy:do-not-use && env-cmd -e production ./scripts/email.sh";

const main = async () => {
  // Print all commits between the last tag and the current commit
  const commitMessages = await getCommitMessages();
  let shouldDeployLocal = false;
  if (commitMessages.length > 0) {
    console.log("Commit messages:");
    console.log(commitMessages);
  } else {
    // If there are no commit messages, ask the user if they want to deploy anyway
    const response = await prompts({
      type: "confirm",
      name: "value",
      message: "No new commits. Do you want to deploy anyway?",
      initial: false,
    });
    shouldDeployLocal = response.value;
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

const getCommitMessages = () =>
  new Promise((resolve, reject) => {
    exec(
      "git log $(git describe --tags --abbrev=0)..HEAD --oneline",
      (err, stdout) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(stdout);
      }
    );
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

main();