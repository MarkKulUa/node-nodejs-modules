import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

jest.mock('path');
jest.mock('fs');
jest.mock('fs/promises');

import { join } from "path";
import { existsSync } from "fs";
import { readFile } from "fs/promises";

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
      const callback = jest.fn()

      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      doStuffByTimeout(callback, 1000);
      expect(setTimeoutSpy).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
      const callback = jest.fn()

      doStuffByTimeout(callback, 1000);
      expect(callback).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1000); //or jest.runAllTimers()
      expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
      const callback = jest.fn()
      const setTimeIntervalSpy = jest.spyOn(global, 'setInterval');
      doStuffByInterval(callback, 1000);
      expect(setTimeIntervalSpy).toHaveBeenCalledWith(callback, 1000)
  });

  test('should call callback multiple times after multiple intervals', () => {
      const callback = jest.fn()
      doStuffByInterval(callback, 1000);
      expect(callback).not.toHaveBeenCalled();
      jest.advanceTimersByTime(3000);
      expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
      const pathToFile = 'test.txt';

      (join as jest.Mock).mockReturnValue('/fake/path/test.txt');
      (existsSync as jest.Mock).mockReturnValue(false);

      await readFileAsynchronously(pathToFile);
      expect(join).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  test('should return null if file does not exist', async () => {
      const pathToFile = 'test.txt';
      (join as jest.Mock).mockReturnValue('/fake/path/test.txt');
      (existsSync as jest.Mock).mockReturnValue(false);

      expect(await readFileAsynchronously(pathToFile)).toBeNull();
  });

  test('should return file content if file exists', async () => {
      const pathToFile = 'test.txt';
      (join as jest.Mock).mockReturnValue('/fake/path/test.txt');
      (existsSync as jest.Mock).mockReturnValue(true);
      (readFile as jest.Mock).mockResolvedValue({ toString: () => 'string content' });

      expect(await readFileAsynchronously(pathToFile)).toBe('string content');
  });
});
