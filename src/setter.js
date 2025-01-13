// Returns a setter function for the given property name.
export const setter = (setState, propertyName) => (value) =>
  setState((state) => ({
    ...state,
    [propertyName]: value,
  }));
