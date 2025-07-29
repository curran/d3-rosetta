export const unidirectionalDataFlow = (container, main) => {
  let state = {};
  const setState = (next) => {
    state = next(state);
    main(container, { state, setState });
  };
  main(container, { state, setState });
};
