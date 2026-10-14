export function kitePosition(angle, length, anchor = { x: 140, y: 366 }, scale = 10) {
  const radians = angle * Math.PI / 180;
  return { x: anchor.x + length * scale * Math.cos(radians), y: anchor.y - length * scale * Math.sin(radians), height: length * Math.sin(radians) };
}
export function angleKind(angle) {
  if (angle === 0) return '两条边重合';
  if (angle < 90) return '锐角';
  if (angle === 90) return '直角';
  if (angle < 180) return '钝角';
  return '平角';
}
