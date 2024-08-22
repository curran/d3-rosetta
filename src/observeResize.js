import { StateField } from './StateField';
export const observeResize = (container, options) => {
  const [dimensions, setDimensions] =
    StateField(options)('dimensions');
  if (!dimensions) {
    new ResizeObserver((entries) => {
      setDimensions(entries[0].contentRect);
    }).observe(container);
  }
  return dimensions;
};
