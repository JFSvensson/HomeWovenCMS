/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.ts$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: "tests/tsconfig.test.json",
      useESM: true,
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverage: true,
  coverageReporters: ['html'],
  transformIgnorePatterns: [
    "node_modules/(?!(module-that-needs-transpiling)/)" 
  ],
  reporters: [
    "default",
    ["jest-html-reporter", {
      pageTitle: "Test Report",
      outputPath: "./test-results/report.html"
    }]
  ],
  setupFiles: [
    "./tests/test-setup.ts"
]
}
