module.exports = {
    testEnvironment: "jsdom", // Ensures React tests run in a browser-like environment
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mocks CSS imports
    },
  };
  