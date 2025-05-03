module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  globalSetup: "jest-preset-angular/global-setup",
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
  coverageDirectory: "./coverage",
  coverageReporters: ["html", "lcov", "text-summary"],
  collectCoverageFrom: [
    "projects/**/*.ts",
    "!projects/**/*.module.ts",
    "!projects/main.ts",
    "!projects/environments/*.ts",
    "!projects/**/*.stories.ts",
    "!projects/**/*.spec.ts"
  ]
}
