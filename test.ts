import { assertEquals } from "@std/assert";
import { updateVersion } from "./index.ts";

const writeConfig = () => {};

Deno.test("updates empty version", () => {
  const readConfig = () => "{}";
  const context = { readConfig, writeConfig };

  assertEquals(
    updateVersion("patch", context),
    "0.0.1",
  );
  assertEquals(
    updateVersion("minor", context),
    "0.1.0",
  );
  assertEquals(
    updateVersion("major", context),
    "1.0.0",
  );
});

Deno.test("updates version", () => {
  const readConfig = () => '{"version": "1.2.3"}';
  const context = { readConfig, writeConfig };

  assertEquals(
    updateVersion("patch", context),
    "1.2.4",
  );
  assertEquals(
    updateVersion("minor", context),
    "1.3.0",
  );
  assertEquals(
    updateVersion("major", context),
    "2.0.0",
  );
});
