export const StateProperty =
  ({ state, setState }) =>
  (propertyName) => [
    state[propertyName],
    (value) =>
      setState((state) => ({
        ...state,
        [propertyName]:
          typeof value === 'function'
            ? value(state[propertyName])
            : value,
      })),
  ];
