module.exports = {
  roots: ['<rootDir>/test'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/test/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  preset: 'ts-jest'
};
