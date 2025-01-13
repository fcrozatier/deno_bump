# Bump

Bumps the `deno.json` "version" field using semver, then commit all files with the corresponding version tag

## Usage

Add the following `task` to your `deno.json`:

```json
{
  ...
  "task": {
    "bump": "deno run --allow-read --allow-write --allow-run jsr:@fcrozatier/bump",
  }
}
```

Then to bump you're project's version run one of the following commands in the folder containing the `deno.json` config

```sh
deno task bump major
deno task bump minor
deno task bump patch
```
depending on the type of bump you want to make
