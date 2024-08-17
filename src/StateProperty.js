export const StateProperty =
  ({ state, setState }) =>
  (propertyName) => [
    state[propertyName],
    (value) =>
      setState((state) => ({
        ...state,
        [propertyName]: value,
      })),
  ];
