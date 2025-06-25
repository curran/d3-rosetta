export const runAsyncEffect = ({
  data,
  setData,
  getData,
}) => {
  // The effect should only run if it's the first time (`!data`).
  if (!data) {
    // Immediately set state to pending to trigger a re-render with the loading UI.
    setData({ status: 'pending' });

    // Execute the promise.
    getData()
      .then((value) => {
        // On success, update the state with the resolved value.
        setData({
          status: 'resolved',
          value,
        });
      })
      .catch((error) => {
        // On failure, update the state with the error.
        setData({
          status: 'rejected',
          error,
        });
      });
  }
};
