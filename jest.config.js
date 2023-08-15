module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  moduleNameMapper: {
    axios: "axios/dist/node/axios.cjs",
  },
  // testMatch: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.ts?(x)"],
  collectCoverage: true,
  // collectCoverageFrom: ["src/**/*.{ts,js,vue}"],
  moduleFileExtensions: ["js", "ts", "vue"],
};
