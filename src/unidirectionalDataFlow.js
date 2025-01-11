// A simple implementation of the unidirectional data flow pattern.
export const unidirectionalDataFlow = ({
  container,
  main,
}) => {
  let state = {};

  const render = () => {
    main(container, { state, setState });
  };

  const setState = (next) => {
    state = next(state);
    render();
  };

  render();

  return {
    hotReload: (newMain) => {
      main = newMain;
      render();
    },
  };
};
