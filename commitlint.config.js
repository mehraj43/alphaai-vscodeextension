const fs = require("fs");
const path = require("path");

module.exports = {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "package-json-version-match": async () => {
          const packageJsonPath = path.resolve(process.cwd(), "package.json");
          const packageLockJsonPath = path.resolve(
            process.cwd(),
            "package-lock.json",
          );

          if (!fs.existsSync(packageLockJsonPath)) {
            return [false, "package-lock.json not found"];
          }

          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, "utf-8"),
          );
          const packageLockJson = JSON.parse(
            fs.readFileSync(packageLockJsonPath, "utf-8"),
          );

          // Check if versions match
          if (packageJson.version !== packageLockJson.version) {
            return [
              false,
              `Version mismatch between package.json (${packageJson.version}) and package-lock.json (${packageLockJson.version})`,
            ];
          }

          return [true];
        },
      },
    },
  ],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "scope-empty": [2, "never"],
    "scope-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
    "header-max-length": [2, "always", 72],
    "package-json-version-match": [2, "always"],
  },
};
