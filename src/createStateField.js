export const createStateField =
  (state, setState) => (propertyName) => [
    state[propertyName],
    (value) => {
      setState((state) => ({
        ...state,
        [propertyName]: value,
      }));
    },
  ];
