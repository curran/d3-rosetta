export const StateField =
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
