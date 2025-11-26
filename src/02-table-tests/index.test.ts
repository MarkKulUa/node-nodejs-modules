import {  simpleCalculator, Action } from './index';

const testCases = [
    { a: 1, b: 2, action: Action.Add, expected: 3 },
    { a: 2, b: 2, action: Action.Add, expected: 4 },
    { a: 3, b: 2, action: Action.Add, expected: 5 },
    { a: 4, b: 2, action: Action.Subtract, expected: 2 },
    { a: 4, b: 2, action: Action.Multiply, expected: 8 },
    { a: 4, b: 2, action: Action.Divide, expected: 2 },
    { a: 4, b: 2, action: Action.Exponentiate, expected: 16 },
    { a: 4, b: 2, action: 'invalid', expected: null },
    { a: 'a', b: 2, action: Action.Exponentiate, expected: null },
];

describe('simpleCalculator', () => {
    test.each(testCases)(
        'should return $expected for $a $action $b',
        ({ a, b, action, expected }) => {
            const input = { a, b, action };
            expect(simpleCalculator(input)).toBe(expected);
        }
    );
});
