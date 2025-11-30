jest.mock('axios');

import axios from 'axios';
import {THROTTLE_TIME, throttledGetDataFromApi} from './index';

describe('throttledGetDataFromApi', () => {

  beforeAll(() => {
      jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
      jest.advanceTimersByTime(THROTTLE_TIME);
  });

  test('should create instance with provided base url', async () => {
      const mockData = { userId: 1, id: 1, title: 'Test' };
      const mockGet = jest.fn().mockResolvedValue({ data: mockData });

      (axios.create as jest.Mock).mockReturnValue({
          get: mockGet
      });

      await throttledGetDataFromApi('/posts');

      expect(axios.create).toHaveBeenCalledWith({
          baseURL: 'https://jsonplaceholder.typicode.com'
      });
  });

  test('should perform request to correct provided url', async () => {
      const mockData = { userId: 1, id: 1, title: 'Test' };
      const mockGet = jest.fn().mockResolvedValue({ data: mockData });

      (axios.create as jest.Mock).mockReturnValue({
          get: mockGet
      });

      await throttledGetDataFromApi('/posts');

      expect(mockGet).toHaveBeenCalledWith('/posts');
  });

  test('should return response data', async () => {
      const mockData = { userId: 1, id: 1, title: 'Test' };
      const mockGet = jest.fn().mockResolvedValue({ data: mockData });

      (axios.create as jest.Mock).mockReturnValue({
          get: mockGet
      });

      const result = await throttledGetDataFromApi('/posts');

      expect(result).toEqual(mockData);
  });
});
