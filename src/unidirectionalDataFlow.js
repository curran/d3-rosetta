export const unidirectionalDataFlow = (container, viz) => {
  let state = {};
  const setState = (next) => {
    state = next(state);
    viz(container, state, setState);
  };
  viz(container, state, setState);
};
