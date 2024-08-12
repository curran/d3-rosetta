import { expect, test } from 'vitest';
import { select } from 'd3-selection';
import { one } from './one.js';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

test('selection.one(name) manages a single element', () => {
  const dom = new JSDOM("<div id='container'></div>");
  const container =
    dom.window.document.querySelector('#container');
  const s = select(container);
  const div = one(s, 'div');

  expect(div._groups[0][0].tagName).toBe('DIV');
});

test('selection.one(name, class) elements by class', () => {
  const dom = new JSDOM("<div id='container'></div>");
  const container =
    dom.window.document.querySelector('#container');
  const s = select(container);

  const a = one(s, 'div', 'a');
  const b = one(s, 'div', 'b');

  expect(a._groups[0][0].tagName).toBe('DIV');
  expect(a._groups[0][0].className).toBe('a');
  expect(b._groups[0][0].tagName).toBe('DIV');
  expect(b._groups[0][0].className).toBe('b');
});
