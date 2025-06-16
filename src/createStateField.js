export const createStateField =
  (state, setState) => (propertyName) => [
    state[propertyName],
    (value) => {
      setState((previousState) => ({
        ...previousState,
        [propertyName]: value,
      }));
    },
  ];
