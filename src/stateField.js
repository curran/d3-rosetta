export const stateField =
  ({ state, setState }) =>
  (field, defaultValue) => [
    state[field] === undefined
      ? defaultValue
      : state[field],
    (value) =>
      setState((state) => ({ ...state, [field]: value })),
  ];
