module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  moduleNameMapper: {
    axios: "axios/dist/node/axios.cjs",
  },
  // testMatch: ["**/tests/unit/*.spec.ts"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,js,vue}"],
  coveragePathIgnorePatterns: [
    "!src/main.ts",
    "!src/router.ts",
    "!src/plugins/*",
    "!src/types/*",
    "!src/model/*",
    "!*.d.ts",
  ],
  // moduleFileExtensions: ["js", "ts", "vue"],
};
