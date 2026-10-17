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

// 同一顶点的两条边始终使用相同的缩放比例；等比例放大不能改变夹角。
export function angleArms(angle, length, zoom = 1) {
  const radians = angle * Math.PI / 180;
  const scaledLength = length * zoom;
  return {
    horizontal: { x: scaledLength, y: 0 },
    slanted: { x: scaledLength * Math.cos(radians), y: -scaledLength * Math.sin(radians) },
  };
}
