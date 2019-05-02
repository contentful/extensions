module.exports = {
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/test/testSetup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules'
  }
};
