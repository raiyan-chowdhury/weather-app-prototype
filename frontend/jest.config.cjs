module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest",
      "^.+\\.vue$": "@vue/vue3-jest",
      ".+\\.(css|scss|png|jpg|svg)$": "jest-transform-stub",
    },
    testEnvironment: "jsdom",
    testEnvironmentOptions: {
      customExportConditions: ["node", "node-addons"],
    },
    setupFilesAfterEnv: ["<rootDir>/node_modules/jest-fetch-mock"],
};
