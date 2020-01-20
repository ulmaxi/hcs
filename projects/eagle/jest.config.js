module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['@ulmax/generated'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  moduleNameMapper: {
    '^@ulmax/authentication': '<rootDir>/libs/authentication/src/index.ts',
    '^@ulmax/server-shared': '<rootDir>/libs/server-shared/src/index.ts',
    '^@ulmax/users-admininistration': '<rootDir>/libs/users-admininistration/src/index.ts',
    '^@ulmax/sip': '<rootDir>/libs/sip/src/index.ts',
    '^@ulmax/testing': '<rootDir>/libs/testing/src/index.ts',
    '^@ulmax/ehr': '<rootDir>/libs/ehr/src/index.ts',
    '^@ulmax/general-public': '<rootDir>/libs/general-public/src/index.ts',
  },
  // until Sip module until it's plugged back in
  coveragePathIgnorePatterns: ['<rootDir>/libs/testing', '<rootDir>/libs/sip']
};
