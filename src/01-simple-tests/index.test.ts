// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
      const input = {
          a: 4,
          b: 2,
          action: Action.Add,
      };

      expect(simpleCalculator(input)).toBe(input.a + input.b);
  });

  test('should subtract two numbers', () => {
      const input = {
          a: 4,
          b: 2,
          action: Action.Subtract,
      };

      expect(simpleCalculator(input)).toBe(input.a - input.b);
  });

  test('should multiply two numbers', () => {
      const input = {
          a: 4,
          b: 2,
          action: Action.Multiply,
      };

      expect(simpleCalculator(input)).toBe(input.a * input.b);
  });

  test('should divide two numbers', () => {
      const input = {
          a: 4,
          b: 2,
          action: Action.Divide,
      };

      expect(simpleCalculator(input)).toBe(input.a / input.b);
  });

  test('should exponentiate two numbers', () => {
      const input = {
          a: 4,
          b: 2,
          action: Action.Exponentiate,
      };

      expect(simpleCalculator(input)).toBe(input.a ** input.b);
  });

  test('should return null for invalid action', () => {
      const input = {
          a: 1,
          b: 2,
          action: 'invalid',
      };

      expect(simpleCalculator(input)).toBeNull();
  });

  test('should return null for invalid arguments', () => {
      const input = {
          a: 'a',
          b: 2,
          action: Action.Exponentiate,
      };

      expect(simpleCalculator(input)).toBeNull();
  });
});
