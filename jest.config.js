module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.steps.ts'],
    setupFiles: ['dotenv/config'],
    verbose: true,
    detectOpenHandles: true,
    forceExit: true,
  };