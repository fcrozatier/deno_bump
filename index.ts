interface Context {
  readConfig: () => string;
  writeConfig: (data: string) => void;
}

const configPath = "./deno.json";

/**
 * Bumps the deno.json "version" field using semver
 */
export const updateVersion = (type: string, context: Context = {
  readConfig: () => Deno.readTextFileSync(configPath),
  writeConfig: (data: string) =>
    Deno.writeTextFileSync(configPath, JSON.stringify(data, null, 2)),
}): string => {
  const text = context.readConfig();
  const json = JSON.parse(text);
  const version = json["version"] || "0.0.0";

  const [major, minor, patch]: number[] = version.split(".").map(Number);

  let newVersion: string;

  switch (type) {
    case "major":
      newVersion = [major + 1, 0, 0].join(".");
      break;
    case "minor":
      newVersion = [major, minor + 1, 0].join(".");
      break;
    case "patch":
      newVersion = [major, minor, patch + 1].join(".");
      break;

    default:
      throw new Error(
        "Invalid version bump argument: major, minor or patch",
      );
  }

  json["version"] = newVersion;

  context.writeConfig(json);

  console.log(`version updated ${version} -> ${newVersion}`);
  return newVersion;
};

const runCommand = async (command: string[]) => {
  const process = new Deno.Command(command[0], {
    args: command.slice(1),
    stdout: "piped",
    stderr: "piped",
  });

  const { success, stderr, stdout } = await process.output();
  if (!success) {
    const error = new TextDecoder().decode(stderr);
    throw new Error(`Command ${command.join(" ")} failed:\n${error}`);
  }
  console.log(new TextDecoder().decode(stdout));
};

const commitAndTag = async (version: string) => {
  await runCommand(["git", "add", "."]);
  await runCommand(["git", "commit", "-m", `v${version}`]);
  await runCommand(["git", "tag", `v${version}`]);

  console.log(`Git commit and tag created: v${version} `);
};

if (import.meta.main) {
  const type = Deno.args[0];

  if (!type || !["major", "minor", "patch"].includes(type)) {
    console.error(
      "Usage: deno run --allow-read --allow-write --allow-run bump_version.ts <major|minor|patch>",
    );
    Deno.exit(1);
  }

  const newVersion = updateVersion(type);
  await commitAndTag(newVersion);
}
