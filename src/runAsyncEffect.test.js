import { expect, test, vi } from 'vitest';
import { runAsyncEffect } from './runAsyncEffect.js';

test('runAsyncEffect should handle promise resolution', async () => {
  const setData = vi.fn();
  const getData = vi.fn(() => Promise.resolve('Success'));
  let data; // Initially undefined

  // Initial call
  runAsyncEffect({ data, setData, getData });

  // It should immediately set status to pending
  expect(setData).toHaveBeenCalledTimes(1);
  expect(setData).toHaveBeenCalledWith({ status: 'pending' });
  expect(getData).toHaveBeenCalledTimes(1);

  // Wait for the promise to resolve
  await new Promise(process.nextTick);

  // It should call setData again with the resolved value
  expect(setData).toHaveBeenCalledTimes(2);
  expect(setData).toHaveBeenCalledWith({
    status: 'resolved',
    value: 'Success',
  });

  // Subsequent call with populated data should do nothing
  data = { status: 'resolved', value: 'Success' };
  runAsyncEffect({ data, setData, getData });

  // No new calls should have been made
  expect(setData).toHaveBeenCalledTimes(2);
  expect(getData).toHaveBeenCalledTimes(1);
});

test('runAsyncEffect should handle promise rejection', async () => {
  const setData = vi.fn();
  const error = new Error('Failure');
  const getData = vi.fn(() => Promise.reject(error));
  let data; // Initially undefined

  // Initial call
  runAsyncEffect({ data, setData, getData });

  // It should immediately set status to pending
  expect(setData).toHaveBeenCalledTimes(1);
  expect(setData).toHaveBeenCalledWith({ status: 'pending' });
  expect(getData).toHaveBeenCalledTimes(1);

  // Wait for the promise to reject
  await new Promise(process.nextTick);

  // It should call setData again with the rejected error
  expect(setData).toHaveBeenCalledTimes(2);
  expect(setData).toHaveBeenCalledWith({
    status: 'rejected',
    error,
  });

  // Subsequent call with populated data should do nothing
  data = { status: 'rejected', error };
  runAsyncEffect({ data, setData, getData });

  // No new calls should have been made
  expect(setData).toHaveBeenCalledTimes(2);
  expect(getData).toHaveBeenCalledTimes(1);
});

test('runAsyncEffect should not run if data is already present', () => {
  const setData = vi.fn();
  const getData = vi.fn();
  const data = { status: 'pending' };

  runAsyncEffect({ data, setData, getData });

  expect(setData).not.toHaveBeenCalled();
  expect(getData).not.toHaveBeenCalled();
});
