import React from 'react';
import { AngleScene, KiteScene, Slider, colors } from './Scenes';
import { angleKind, kitePosition } from '../math';
import { MagnifierScene } from './MagnifierScene';

const scenes = {
  kite: ({ lesson, values, guides }) => <KiteScene a={values.a} b={values.b} length={lesson.sceneOptions.lineLength} guides={guides} />,
  angle: ({ values }) => <AngleScene angle={values.a} length={230} isLength={false} />,
  length: ({ values }) => <AngleScene angle={values.a} length={values.length} isLength />,
  magnifier: ({ values }) => <MagnifierScene angle={values.a} zoom={values.zoom} />,
};

export function LessonScene(props) {
  const Scene = scenes[props.lesson.scene];
  if (!Scene) throw new Error(`没有匹配的动画：${props.lesson.scene}`);
  return <Scene {...props} />;
}

export function SceneControls({ lesson, values, guides, setGuides, change }) {
  const kite = lesson.scene === 'kite';
  return <div className="scene-controls">
    <p className="muted">{lesson.exploreText}</p>
    <div className="slider-grid">
      <Slider label={kite ? '橙色风筝的角度' : '张开的角度'} value={Math.round(values.a)} color={colors.a} max={kite ? 90 : 180} onChange={v => change('a', v)} />
      {kite && <Slider label="蓝色风筝的角度" value={Math.round(values.b)} color={colors.b} onChange={v => change('b', v)} />}
      {lesson.scene === 'length' && <Slider label="画出的边长" value={Math.round(values.length)} unit="" min={100} max={270} onChange={v => change('length', v)} />}
      {lesson.scene === 'magnifier' && <Slider label="放大倍数" value={values.zoom} unit=" 倍" min={1} max={2.4} step={0.1} color="#5a8b75" onChange={v => change('zoom', v)} />}
    </div>
    {kite ? <>
      <label className="guide-toggle"><input type="checkbox" checked={guides} onChange={e => setGuides(e.target.checked)} />显示竖直高度线</label>
      <p className="control-readout">线长都是 {lesson.sceneOptions.lineLength} 米。比握线处高：<span style={{ color: colors.a }}>橙色 {kitePosition(values.a, lesson.sceneOptions.lineLength).height.toFixed(1)} 米</span>，<span style={{ color: colors.b }}>蓝色 {kitePosition(values.b, lesson.sceneOptions.lineLength).height.toFixed(1)} 米</span>。</p>
    </> : <>
      <div className="angle-presets">{[30, 90, 120, 180].map(angle => <button key={angle} onClick={() => change('a', angle)}>{angle}°</button>)}</div>
      <p className="control-readout">现在是 {Math.round(values.a)}°，{angleKind(Math.round(values.a))}。{lesson.scene === 'magnifier' && `放大 ${Number(values.zoom.toFixed(1))} 倍后，角度仍是 ${Math.round(values.a)}°。`}</p>
    </>}
  </div>;
}
