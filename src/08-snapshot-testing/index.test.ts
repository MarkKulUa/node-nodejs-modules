import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const values = [1];
    const res = { value: values[0], next: { value: null, next: null } };

      expect(generateLinkedList(values)).toStrictEqual(res)
  });

  test('should generate linked list from values 2', () => {
      const values = [1, 2, 3];
      const result = generateLinkedList(values);

      expect(result).toMatchSnapshot();
  });
});
