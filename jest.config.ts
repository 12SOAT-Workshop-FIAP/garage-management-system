export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  testEnvironment: 'node',
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!src/**/tests/**', '!src/**/dtos/**'],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov'],
  setupFilesAfterEnv: [],
};
