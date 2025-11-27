import {getBankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError} from '.';
jest.mock('lodash');
import { random } from 'lodash';


describe('BankAccount', () => {
  test('should create account with initial balance', () => {
      const initialBalance = 50;
      const bankAccount = getBankAccount(initialBalance);
      expect(bankAccount.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
      const initialBalance = 50;
      const bankAccount = getBankAccount(initialBalance);
      expect(() => bankAccount.withdraw(100)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
      const initialBalance = 50;
      const bankAccount = getBankAccount(initialBalance);
      const bankAccount2 = getBankAccount(initialBalance);
      expect(() => bankAccount.transfer(100, bankAccount2)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
      const initialBalance = 50;
      const bankAccount = getBankAccount(initialBalance);
      expect(() => bankAccount.transfer(100, bankAccount)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
      const initialBalance = 50;
      const bankAccount = getBankAccount(initialBalance);
      bankAccount.deposit(initialBalance)
      expect(bankAccount.getBalance()).toBe(initialBalance + initialBalance);
  });

  test('should withdraw money', () => {
      const initialBalance = 50;
      const bankAccount = getBankAccount(initialBalance);
      bankAccount.withdraw(initialBalance)
      expect(bankAccount.getBalance()).toBe(0);
  });

  test('should transfer money', () => {
      const initialBalance = 50;
      const bankAccount = getBankAccount(initialBalance);
      const bankAccount2 = getBankAccount(initialBalance);
      bankAccount.transfer(initialBalance, bankAccount2);
      expect(bankAccount2.getBalance()).toBe(initialBalance + initialBalance);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
      const initialBalance = 50;
      const bankAccount = getBankAccount(initialBalance);

      (random as jest.Mock).mockReturnValueOnce(initialBalance).mockReturnValueOnce(1);

      const result = await bankAccount.fetchBalance();
      expect(result).toBe(initialBalance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
      const initialBalance = 50;
      const bankAccount = getBankAccount(initialBalance);

      (random as jest.Mock).mockReturnValueOnce(initialBalance).mockReturnValueOnce(1);
      await bankAccount.synchronizeBalance();

      expect(bankAccount.getBalance()).toBe(initialBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
      const initialBalance = 50;
      const bankAccount = getBankAccount(initialBalance);

      (random as jest.Mock).mockReturnValueOnce(initialBalance).mockReturnValueOnce(0);

      await expect(bankAccount.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
  });
});
