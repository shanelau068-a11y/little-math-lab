import React from 'react';
import { kitePosition, angleKind } from '../math';

export const colors = { a: '#e97d42', b: '#318eaa' };
function Kite({ x, y, color }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M0 22 Q-16 35 0 44 Q15 51 4 60" fill="none" stroke={color} strokeWidth="2" />
    <path d="M-4 37 l9 4 -10 4 Z M0 52 l9 4 -10 4 Z" fill={color} opacity=".8" />
    <path d="M0 -25 L20 -3 L0 25 L-20 -3 Z" fill={color} stroke="white" strokeWidth="2"/>
    <path d="M0 -25 L0 25 M-20 -3 L20 -3" stroke="white" strokeWidth="1.5" opacity=".7"/>
    <path d="M0 -25 L20 -3 L0 -3 Z" fill="white" opacity=".23"/>
  </g>;
}
function Cloud({ x, y, scale = 1 }) { return <g transform={`translate(${x} ${y}) scale(${scale})`} fill="white" opacity=".82"><ellipse cx="0" cy="0" rx="40" ry="12"/><circle cx="-14" cy="-10" r="17"/><circle cx="11" cy="-16" r="22"/></g>; }
function AngleArc({ angle, x, y, radius, color }) {
  const r = angle * Math.PI / 180, endX = x+radius*Math.cos(r), endY=y-radius*Math.sin(r);
  return <path d={`M ${x+radius} ${y} A ${radius} ${radius} 0 0 0 ${endX} ${endY} L ${x} ${y} Z`} fill={color} fillOpacity=".13" stroke={color} strokeWidth="1.5"/>;
}
export function KiteScene({ a, b, length, guides }) {
  const anchor = { x: 130, y: 366 }, p = kitePosition(a, length, anchor, 9), q = kitePosition(b, length, anchor, 9);
  const same = Math.abs(a-b)<1;
  return <svg className="scene" viewBox="0 0 700 430" role="img" aria-label={`线长都是${length}米，橙色风筝${Math.round(a)}度，高${p.height.toFixed(1)}米，蓝色风筝${Math.round(b)}度，高${q.height.toFixed(1)}米。高度从握线处算起。`}>
    <defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#e9f5f5"/><stop offset="1" stopColor="#f3faf6"/></linearGradient><linearGradient id="grass" x2="0" y2="1"><stop stopColor="#dce9d0"/><stop offset="1" stopColor="#eaf0d9"/></linearGradient></defs>
    <rect width="700" height="430" rx="22" fill="url(#sky)"/>
    <circle cx="601" cy="63" r="25" fill="#f5db8b"/><circle cx="601" cy="63" r="36" fill="#f5db8b" opacity=".15"/>
    <Cloud x={91} y={64}/><Cloud x={397} y={42} scale={.72}/><Cloud x={550} y={118} scale={.52}/>
    <path d="M0 359 Q85 298 198 357 Q326 291 429 351 Q569 288 700 349 V430 H0Z" fill="#e0eddb"/>
    <path d="M0 380 Q178 349 376 381 Q565 345 700 375 V430 H0Z" fill="url(#grass)"/>
    <path d="M610 350 V390" stroke="#adbaa0" strokeWidth="7"/><ellipse cx="610" cy="328" rx="29" ry="39" fill="#b9d0ae"/><ellipse cx="628" cy="338" rx="18" ry="24" fill="#c5d9b8"/>
    <path d="M45 399 l3 -9 3 9 M565 408 l4 -11 4 11 M330 414 l3 -8 3 8" fill="none" stroke="#b0c49d" strokeWidth="2"/>
    <line x1="130" y1="366" x2="565" y2="366" stroke="#7c9c91" strokeDasharray="5 6" strokeWidth="1.3"/>
    <text x="440" y="389" className="svg-small" fill="#627c70">经过握线处的水平线</text>
    <g opacity=".7"><rect x="489" y="178" width="156" height="91" rx="14" fill="white"/><text x="506" y="204" className="svg-small" fill="#627c70">今天的小实验</text><text x="506" y="231" className="svg-bold" fill="#334b40">线长固定 {length} 米</text><text x="506" y="253" className="svg-small" fill="#627c70">只改变张开的角度</text></g>
    {guides && <>
      {!same && <g><line x1={p.x} y1={p.y} x2={p.x} y2="366" stroke={colors.a} strokeWidth="2" strokeDasharray="5 5"/><text x={p.x+10} y={(p.y+366)/2} fill={colors.a} className="svg-bold">高度</text><path d={`M${p.x-8} 366 v-8 h8`} fill="none" stroke={colors.a}/></g>}
      <g><line x1={q.x} y1={q.y} x2={q.x} y2="366" stroke={colors.b} strokeWidth="2" strokeDasharray="5 5"/><text x={q.x+10} y={(q.y+366)/2+10} fill={colors.b} className="svg-bold">高度</text><path d={`M${q.x-8} 366 v-8 h8`} fill="none" stroke={colors.b}/></g>
    </>}
    <AngleArc angle={a} x={130} y={366} radius={50} color={colors.a}/>
    <AngleArc angle={b} x={130} y={366} radius={73} color={colors.b}/>
    <line x1="130" y1="366" x2={p.x} y2={p.y} stroke={colors.a} strokeWidth="3"/>
    <line x1="130" y1="366" x2={q.x} y2={q.y} stroke={colors.b} strokeWidth="3"/>
    <text x="159" y="350" fill={colors.a} className="svg-small">{Math.round(a)}°</text>
    <text x="163" y="314" fill={colors.b} className="svg-small">{Math.round(b)}°</text>
    <Kite x={p.x} y={p.y} color={colors.a}/><Kite x={q.x} y={q.y} color={colors.b}/>
    <g><ellipse cx="121" cy="383" rx="16" ry="3" fill="#9eb391" opacity=".3"/><path d="M116 371 l-3 11 M124 371 l4 11" stroke="#536877" strokeWidth="4" strokeLinecap="round"/><path d="M111 363 Q119 354 128 363 L127 373 H112Z" fill="#efbd6b"/><circle cx="119" cy="349" r="8" fill="#edc7a4"/><path d="M111 348 Q110 337 121 340 Q128 340 127 347 L122 344Z" fill="#495b56"/><path d="M125 361 L130 366" stroke="#edc7a4" strokeWidth="4" strokeLinecap="round"/><circle cx="130" cy="366" r="3" fill="#495b56"/></g>
    <text x="63" y="405" fill="#627c70" className="svg-small">同一个握线位置</text>
    <g><circle cx="22" cy="23" r="4" fill={colors.a}/><text x="33" y="28" className="svg-small" fill="#4b6260">橙色风筝</text><circle cx="133" cy="23" r="4" fill={colors.b}/><text x="144" y="28" className="svg-small" fill="#4b6260">蓝色风筝</text></g>
  </svg>;
}
export function AngleScene({ angle, length, isLength }) {
  const x=350,y=323,r=angle*Math.PI/180, ex=x+length*Math.cos(r),ey=y-length*Math.sin(r);
  return <svg className="scene angle-scene" viewBox="0 0 700 430" role="img" aria-label={`${Math.round(angle)}度，${angleKind(Math.round(angle))}，${isLength?'两条边方向不变，边长不影响角度。':'转动上方的边，观察角的大小。'}`}>
    <defs><pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#dbe4db"/></pattern></defs>
    <rect width="700" height="430" rx="22" fill="#f4f7ef"/><rect width="700" height="430" fill="url(#grid)"/>
    <text x="30" y="37" fill="#6b7e73" className="svg-small">{isLength ? '观察中间的扇形：边长变了，张开程度呢？' : '一条边不动，另一条边慢慢转动。'}</text>
    <path d="M75 323 H650" stroke="#c4d3c6" strokeDasharray="4 6"/>
    <AngleArc angle={angle} x={x} y={y} radius={72} color={colors.a}/>
    <line x1={x} y1={y} x2={x+length} y2={y} stroke="#718d7e" strokeWidth="7" strokeLinecap="round"/>
    <line x1={x} y1={y} x2={ex} y2={ey} stroke={colors.a} strokeWidth="7" strokeLinecap="round"/>
    <circle cx={x} cy={y} r="7" fill="#3b594a"/><circle cx={ex} cy={ey} r="8" fill="white" stroke={colors.a} strokeWidth="3"/>
    {Math.abs(angle-90)<.1 && <path d={`M${x+20} ${y} v-20 h-20`} fill="none" stroke={colors.a} strokeWidth="2"/>}
    <text x={x+99*Math.cos(r/2)} y={y-99*Math.sin(r/2)} textAnchor="middle" fill={colors.a} className="svg-big">{Math.round(angle)}°</text>
    <rect x="271" y="59" width="158" height="54" rx="27" fill="white"/><text x="350" y="93" textAnchor="middle" fill="#3b594a" className="svg-big">{angleKind(Math.round(angle))}</text>
    <text x="350" y="383" textAnchor="middle" fill="#6b7e73" className="svg-small">{isLength ? '角的大小看“张开多少”，不看“边有多长”' : '小于 90° 是锐角 · 90° 是直角 · 大于 90° 且小于 180° 是钝角'}</text>
  </svg>;
}
export function Slider({ label, value, unit='°', min=0, max=90, color, onChange, disabled }) {
  return <div className="slider-row"><label><span>{color && <i style={{background:color}}/>}{label}</span><b style={{color}}>{Math.round(value)}{unit}</b></label><input aria-label={label} type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))} disabled={disabled} style={{accentColor:color||'#557c64'}}/><div className="range-ticks"><span>{min}{unit}</span><span>{max}{unit}</span></div></div>;
}
