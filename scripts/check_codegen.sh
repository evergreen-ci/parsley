# This is a script which checks the result of yarn codegen. It used by the check_codegen task.

types_file="src/gql/generated/types.ts" # path to generated types
BEFORE=$(git status --porcelain | grep "$types_file")
yarn codegen || {
  echo "yarn codegen failed to run"
  exit 1
}
AFTER=$(git status --porcelain | grep "$types_file")

if [ "$BEFORE" != "$AFTER" ]; then
  echo "$types_file is not up to date"
  echo "did you forget to run 'yarn codegen'?"
  if [ -d "bin" ]
  then
      echo "Directory /bin already exists."
  else
      mkdir bin
  fi
  git diff $types_file >> bin/codegen.diff
  exit 1
else
  echo "$types_file is up to date"
fi
