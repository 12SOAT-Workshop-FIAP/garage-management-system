import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!src/**/tests/**', '!src/**/dtos/**'],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov'],
  setupFilesAfterEnv: [],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
