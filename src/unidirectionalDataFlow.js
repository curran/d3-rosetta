export const unidirectionalDataFlow = (container) => {
  let state = {};
  let currentViz = () => {}; // no-op

  const setState = (next) => {
    state = next(state);
    currentViz({ container, state, setState });
  };

  return {
    render: (viz) => {
      currentViz = viz;
      currentViz({ container, state, setState });
    },
  };
};
