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

test("development, Docker, and CI use Node 24 consistently", () => {
  const dockerfile = read("Dockerfile");
  const feedbackDockerfile = read("server/feedback/Dockerfile");
  const feedbackServer = read("server/feedback/index.mjs");
  const deployWorkflow = read(".github/workflows/deploy.yml");
  const ciWorkflow = read(".github/workflows/ci.yml");
  const packageJson = JSON.parse(read("package.json"));
  const packageLock = JSON.parse(read("package-lock.json"));

  function workflowNodeMajors(workflow) {
    return workflow
      ? [...workflow.matchAll(/node-version:\s*["']?(\d+)["']?/g)].map(
          (match) => match[1],
        )
      : [];
  }

  assert.deepEqual(
    {
      runtimeMajor: process.versions.node.split(".")[0],
      dockerBuildMajor:
        /^FROM node:(\d+)-alpine AS build$/m.exec(dockerfile)?.[1] ?? null,
      feedbackDockerMajor:
        /^FROM node:(\d+)-alpine$/m.exec(feedbackDockerfile)?.[1] ?? null,
      feedbackDocumentedMajor:
        /Node (\d+) has fetch/.exec(feedbackServer)?.[1] ?? null,
      nvmrc: read(".nvmrc")?.trim() ?? null,
      packageEngine: packageJson.engines?.node ?? null,
      lockfileEngine: packageLock.packages?.[""]?.engines?.node ?? null,
      deployWorkflowNodeMajors: workflowNodeMajors(deployWorkflow),
      ciWorkflowNodeMajors: workflowNodeMajors(ciWorkflow),
      ciRunsOnPullRequests: /^\s*pull_request:\s*$/m.test(ciWorkflow ?? ""),
      ciRunsVerify: /^\s*-\s+run:\s+npm run verify\s*$/m.test(
        ciWorkflow ?? "",
      ),
    },
    {
      runtimeMajor: "24",
      dockerBuildMajor: "24",
      feedbackDockerMajor: "24",
      feedbackDocumentedMajor: "24",
      nvmrc: "24",
      packageEngine: ">=24 <25",
      lockfileEngine: ">=24 <25",
      deployWorkflowNodeMajors: ["24"],
      ciWorkflowNodeMajors: ["24"],
      ciRunsOnPullRequests: true,
      ciRunsVerify: true,
    },
  );
});
