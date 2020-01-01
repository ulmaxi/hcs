module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['@eagle/generated'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  moduleNameMapper: {
    '^@eagle/authentication': '<rootDir>/libs/authentication/src/index.ts',
    '^@eagle/server-shared': '<rootDir>/libs/server-shared/src/index.ts',
    '^@eagle/users-admininistration': '<rootDir>/libs/users-admininistration/src/index.ts',
    '^@eagle/sip': '<rootDir>/libs/sip/src/index.ts',
    '^@eagle/testing': '<rootDir>/libs/testing/src/index.ts',
    '^@eagle/ehr': '<rootDir>/libs/ehr/src/index.ts',
    '^@eagle/general-public': '<rootDir>/libs/general-public/src/index.ts',
  },
  // until Sip module until it's plugged back in
  coveragePathIgnorePatterns: ['<rootDir>/libs/testing', '<rootDir>/libs/sip']
};
