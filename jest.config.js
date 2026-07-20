const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  testPathIgnorePatterns: [
    '<rootDir>[/\\\\](node_modules|.next|cypress|.history)[/\\\\]',
  ],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/contexts/(.*)$': '<rootDir>/contexts/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/test/(.*)$': '<rootDir>/test/$1',
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
}

module.exports = createJestConfig(customJestConfig)
