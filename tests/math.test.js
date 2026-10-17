import test from 'node:test';
import assert from 'node:assert/strict';
import { kitePosition, angleKind, angleArms } from '../src/math.js';
import { lessons } from '../src/lessons.js';
test('changing the angle preserves exactly the same taut string length', () => {
  for (let a = 0; a <= 90; a++) { const p = kitePosition(a, 30); assert.ok(Math.abs(Math.hypot(p.x - 140, p.y - 366) - 300) < 1e-9); }
});
test('height increases from horizontal to vertical, with correct endpoints', () => {
  assert.equal(kitePosition(0, 30).height, 0);
  assert.ok(Math.abs(kitePosition(30, 30).height - 15) < 1e-9);
  assert.equal(kitePosition(90, 30).height, 30);
  for (let a = 1; a <= 90; a++) assert.ok(kitePosition(a, 30).height > kitePosition(a-1, 30).height);
});
test('angle category boundaries and lesson answers', () => {
  assert.equal(angleKind(89), '锐角'); assert.equal(angleKind(90), '直角'); assert.equal(angleKind(91), '钝角'); assert.equal(angleKind(180), '平角');
  for (const l of lessons) assert.ok(l.answer >= 0 && l.answer < l.options.length && l.steps.length > 0);
});

test('changing drawn side length and magnification preserves the measured angle', () => {
  for (const angle of [0, 30, 50, 90, 120, 180]) {
    for (const length of [85, 140, 250]) {
      for (const zoom of [1, 1.5, 2, 2.4]) {
        const { horizontal: p, slanted: q } = angleArms(angle, length, zoom);
        const dot = p.x * q.x + p.y * q.y;
        const cosine = dot / (Math.hypot(p.x, p.y) * Math.hypot(q.x, q.y));
        const measured = Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
        assert.ok(Math.abs(measured - angle) < 1e-6, `Angle changed at ${angle}°, length ${length}, zoom ${zoom}`);
        assert.ok(Math.abs(Math.hypot(q.x, q.y) - length * zoom) < 1e-9);
      }
    }
  }
});
