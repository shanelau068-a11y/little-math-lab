import React, { useId } from 'react';
import { AngleArc, colors } from './Scenes';
import { angleArms } from '../math';

function Diagram({ angle, zoom = 1, faint = false }) {
  const arms = angleArms(angle, 85, zoom);
  return <g opacity={faint ? 0.16 : 1}>
    <AngleArc angle={angle} x={0} y={0} radius={30 * zoom} color={colors.a} strokeWidth={1.5 * zoom} />
    <path d={`M${arms.horizontal.x} ${arms.horizontal.y} L0 0 L${arms.slanted.x} ${arms.slanted.y}`} fill="none" stroke={colors.a} strokeWidth={4 * zoom} strokeLinecap="round" strokeLinejoin="round" />
    <circle r={4 * zoom} fill="#516c5b" />
  </g>;
}

export function MagnifierScene({ angle, zoom }) {
  const clipId = useId();
  const degrees = Math.round(angle);
  const factor = Number(zoom.toFixed(1));
  return <svg className="scene magnifier-scene" viewBox="0 0 700 430" role="img" aria-label={`原来的角是${degrees}度，放大镜放大${factor}倍后仍然是${degrees}度。图形变大，张开的程度不变。`}>
    <defs><clipPath id={clipId}><circle cx="480" cy="214" r="132" /></clipPath></defs>
    <rect width="700" height="430" rx="22" fill="#f3f7f1" />
    <text x="30" y="38" className="svg-small" fill="#7c8e79">看一看：图形变大了，角变了吗？</text>
    <text x="110" y="131" textAnchor="middle" className="svg-bold" fill="#6c8266">原来的角</text>
    <g transform="translate(110 284)"><Diagram angle={angle} /></g>
    <text x="145" y="332" textAnchor="middle" className="svg-big" fill={colors.a}>{degrees}°</text>
    <path d="M243 223 H311 M300 213 l11 10 -11 10" fill="none" stroke="#a9b8a0" strokeWidth="2.5" strokeLinecap="round" />
    <text x="278" y="254" textAnchor="middle" className="svg-small" fill="#8a9c82">放大看</text>
    <path d="M580 315 L644 379" fill="none" stroke="#718e7c" strokeWidth="22" strokeLinecap="round" />
    <circle cx="480" cy="214" r="138" fill="white" stroke="#789581" strokeWidth="6" />
    <g clipPath={`url(#${clipId})`}>
      <circle cx="480" cy="214" r="132" fill="#eff7f6" />
      <g transform="translate(420 276)"><Diagram angle={angle} faint /><Diagram angle={angle} zoom={zoom} /></g>
    </g>
    <text x="480" y="67" textAnchor="middle" className="svg-bold" fill="#5a7d6a">放大镜 × {factor.toFixed(1)}</text>
    <text x="480" y="383" textAnchor="middle" className="svg-big" fill={colors.a}>仍然是 {degrees}°</text>
    <text x="350" y="414" textAnchor="middle" className="svg-small" fill="#6f8668">两条边一起等比例放大，张开的程度不变</text>
  </svg>;
}
