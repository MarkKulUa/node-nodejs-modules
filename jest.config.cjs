module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testPathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],

    moduleNameMapper: {
        '^axios$': require.resolve('axios'),
        '^uuid$': '<rootDir>/src/crud-api/tests/__mocks__/uuid.ts',
    },

    restoreMocks: true,
    resetMocks: true,
    moduleDirectories: ['node_modules', '<rootDir>/src'],

    transform: {
        '^.+\\.ts$': ['ts-jest', {
            useESM: false,
        }],
    },

    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.test.ts',
        '!src/**/*.spec.ts',
    ],

    transformIgnorePatterns: [
        'node_modules/(?!uuid)',
    ],
};
