import { StateField } from 'd3-rosetta';

export const observeResize = (container, options) => {
  const [dimensions, setDimensions] =
    StateField(options)('dimensions');
  if (dimensions) return dimensions;
  const getDimensions = () => ({
    width: container.clientWidth,
    height: container.clientHeight,
  });

  let isFirstCall = true;
  new ResizeObserver(() => {
    if (isFirstCall) {
      isFirstCall = false;
      return;
    }
    setDimensions(getDimensions());
  }).observe(container);

  return getDimensions();
};
