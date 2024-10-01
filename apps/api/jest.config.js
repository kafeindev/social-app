const baseConfig = require("../../packages/config-jest/nest");

module.exports = {
  ...baseConfig,
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
};
