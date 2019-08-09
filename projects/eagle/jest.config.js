module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/libs/generated', '@eagle/generated'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  moduleNameMapper: {
    '^@eagle/generated': '<rootDir>/libs/generated/index.js',
    '^@eagle/authentication': '<rootDir>/libs/authentication/src/index.ts',
    '^@eagle/server-shared': '<rootDir>/libs/server-shared/src/index.ts',
  },
};
