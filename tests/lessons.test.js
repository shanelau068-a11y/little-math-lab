import test from 'node:test';
import assert from 'node:assert/strict';
import { defineLessons, questionIdFromHash, stateForStep } from '../src/lesson-model.js';
import { lessons } from '../src/lessons.js';

test('new questions can reuse a scene and have a different number of steps', () => {
  const next = { ...lessons[0], id: 'new-kite-question', steps: [...lessons[0].steps, { title: '抬到最高', text: '线与水平线成直角。', b: 90 }] };
  const catalog = defineLessons([...lessons, next]);
  const result = stateForStep(catalog.at(-1), 3);
  assert.equal(result.a, 30);
  assert.equal(result.b, 90);
  assert.equal(catalog.at(-1).scene, 'kite');
});

test('a catalog cannot publish duplicate IDs, unmatched scenes or impossible angles', () => {
  assert.throws(() => defineLessons([lessons[0], lessons[0]]), /编号/);
  assert.throws(() => defineLessons([{ ...lessons[0], scene: 'unimplemented' }]), /场景/);
  assert.throws(() => defineLessons([{ ...lessons[0], quizState: { a: 120 } }]), /角度/);
  assert.throws(() => defineLessons([{ ...lessons[0], answer: 99 }]), /答案/);
});

test('question links survive refresh under the GitHub Pages path', () => {
  const link = new URL('https://shanelau068-a11y.github.io/little-math-lab/#/question/new-kite-question');
  assert.equal(questionIdFromHash(link.hash), 'new-kite-question');
  assert.equal(questionIdFromHash('#/'), null);
  assert.equal(questionIdFromHash('#/question/../../other'), null);
});

test('length and magnifier lessons keep the original 50 degree opening through all steps', () => {
  for (const id of ['length', 'magnifier']) {
    const lesson = lessons.find(item => item.id === id);
    for (let index = 0; index < lesson.steps.length; index++) assert.equal(stateForStep(lesson, index).a, 50);
  }
  const lens = lessons.find(item => item.id === 'magnifier');
  assert.equal(stateForStep(lens, 1).zoom, 2);
  assert.equal(stateForStep(lens, 2).zoom, 2.4);
  assert.equal(stateForStep(lens, lens.steps.length - 1).zoom, 1);
  const side = lessons.find(item => item.id === 'length');
  assert.ok(side.steps.some(step => step.length === 100) && side.steps.some(step => step.length === 250));
});

test('unrenderable zoom and broken related question links prevent publication', () => {
  const lens = lessons.find(item => item.id === 'magnifier');
  assert.throws(() => defineLessons([...lessons, { ...lens, id: 'invalid-zoom', quizState: { a: 50, zoom: 0 } }]), /放大倍数/);
  assert.throws(() => defineLessons([...lessons, { ...lens, id: 'broken-link', related: ['missing-question'] }]), /关联题目/);
});
