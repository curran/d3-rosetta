export const one = (selection, tagName, className) =>
  className
    ? selection
        .selectAll(`${tagName}.${className}`)
        .data([null])
        .join(tagName)
        .attr('class', className)
    : selection
        .selectAll(tagName)
        .data([null])
        .join(tagName);
