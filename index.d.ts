import { Selection, BaseType } from 'd3-selection';

// Common types for state management
export type SetState<S> = (
  updater: (prevState: S) => S,
) => void;

export type VizFunction<S> = (
  container: HTMLDivElement,
  options: {
    state: S;
    setState: SetState<S>;
  },
) => void;

// Type for the tuple returned by stateField
export type StateField<S, K extends keyof S> = [
  S[K], // value
  (value: S[K]) => void, // setter for the specific property
];

// Type for the function returned by createStateField
export type CreateStateFieldFunction<S> = <
  K extends keyof S,
>(
  propertyName: K,
) => StateField<S, K>;

// Type for the memoize function returned by createMemoize
export type MemoizeFunction = <T>(
  callback: () => T,
  dependencies: any[],
) => T;

// Function declarations

/**
 * Manages a single DOM element within a D3 selection, ensuring only one instance exists.
 *
 * @param selection The D3 selection to operate on.
 * @param tagName The tag name of the element to manage (e.g., 'g', 'div').
 * @param className Optional class name to apply to the element for disambiguation.
 * @returns A D3 selection containing the single managed element.
 */
export function one<
  GElement extends BaseType,
  Datum,
  PElement extends BaseType,
  PDatum,
>(
  selection: Selection<GElement, Datum, PElement, PDatum>,
  tagName: string,
  className?: string,
): Selection<Element, null, GElement, Datum>;

/**
 * Creates a memoize function that stores memoized values on a given node (typically a DOM element or an object).
 *
 * @param node The object (e.g., DOM element) on which memoized values will be stored.
 * @returns A memoize function.
 */
export function createMemoize(
  node: object,
): MemoizeFunction;

/**
 * Establishes and manages a unidirectional data flow pattern for a visualization.
 *
 * @param container A DOM element or object where the visualization will be rendered or attached.
 * @param viz A function that encapsulates the rendering logic of the visualization.
 */
export function unidirectionalDataFlow<S>(
  container: HTMLDivElement,
  viz: VizFunction<S>,
): void;

/**
 * Creates a function that provides a convenient way to get and set individual properties of a state object.
 *
 * @param state The current state object.
 * @param setState The function used to update the state.
 * @returns A function that, when given a property name, returns a [value, setter] tuple for that property.
 */
export function createStateField<S>(
  state: S,
  setState: SetState<S>,
): CreateStateFieldFunction<S>;
