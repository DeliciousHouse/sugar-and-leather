import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);

function read(path) {
  try {
    return readFileSync(new URL(path, root), "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

test("repository declares Node 24 consistently", () => {
  const dockerfile = read("Dockerfile");
  const packageJson = JSON.parse(read("package.json"));

  assert.deepEqual(
    {
      dockerBuildMajor: /^FROM node:(\d+)-alpine AS build$/m.exec(dockerfile)?.[1] ?? null,
      nvmrc: read(".nvmrc")?.trim() ?? null,
      packageEngine: packageJson.engines?.node ?? null,
    },
    {
      dockerBuildMajor: "24",
      nvmrc: "24",
      packageEngine: ">=24",
    },
  );
});
