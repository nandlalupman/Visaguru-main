import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const isWindows = process.platform === "win32";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    shell: isWindows,
    encoding: "utf8",
    stdio: "pipe",
    ...options,
  });

  if (result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }

  return result;
}

const executeUrl = process.env.DB_EXECUTE_URL ?? "file:./prisma/dev.db";

function resolveSqlitePath(fileUrl) {
  if (!fileUrl.startsWith("file:")) return null;
  const rawPath = fileUrl.slice("file:".length);
  if (!rawPath) return null;
  if (rawPath.startsWith("./") || rawPath.startsWith(".\\")) {
    return path.resolve(process.cwd(), rawPath);
  }
  if (/^[A-Za-z]:[\\/]/.test(rawPath)) {
    return rawPath;
  }
  if (rawPath.startsWith("/")) {
    return rawPath;
  }
  return path.resolve(process.cwd(), rawPath);
}

const dbPath = resolveSqlitePath(executeUrl);
if (dbPath && fs.existsSync(dbPath)) {
  const size = fs.statSync(dbPath).size;
  if (size > 0) {
    process.stdout.write(`Database already initialized at ${executeUrl}\n`);
    process.exit(0);
  }
}

const diff = run("npx", [
  "prisma",
  "migrate",
  "diff",
  "--from-empty",
  "--to-schema-datamodel",
  "prisma/schema.prisma",
  "--script",
]);

run(
  "npx",
  ["prisma", "db", "execute", "--stdin", "--url", executeUrl],
  { input: diff.stdout },
);

process.stdout.write(`Database initialized with schema at ${executeUrl}\n`);
