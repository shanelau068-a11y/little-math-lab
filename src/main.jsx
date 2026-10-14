import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { animate, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowLeft, Play, Pause, RotateCcw, Volume2, Sparkles, FlaskConical, BookOpen, Check, X, ChevronRight, Lightbulb, Send, SlidersHorizontal, Wind, Maximize2 } from 'lucide-react';
import { lessons } from './lessons';
import { kitePosition, angleKind } from './math';
import './style.css';

const colors = { a: '#e97d42', b: '#318eaa' };
function stepValues(s) { return Object.fromEntries(['a', 'b', 'length'].filter(k=>s[k]!==undefined).map(k=>[k,s[k]])); }
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
function KiteScene({ a, b, length, guides }) {
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
      {!same && <g><line x1={p.x} y1={p.y} x2={p.x} y2="366" stroke={colors.a} strokeWidth="2" strokeDasharray="5 5"/><text x={p.x+10} y={(p.y+366)/2} fill={colors.a} className="svg-bold">{p.height.toFixed(1)} m</text><path d={`M${p.x-8} 366 v-8 h8`} fill="none" stroke={colors.a}/></g>}
      <g><line x1={q.x} y1={q.y} x2={q.x} y2="366" stroke={colors.b} strokeWidth="2" strokeDasharray="5 5"/><text x={q.x+10} y={(q.y+366)/2+10} fill={colors.b} className="svg-bold">{q.height.toFixed(1)} m</text><path d={`M${q.x-8} 366 v-8 h8`} fill="none" stroke={colors.b}/></g>
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
function AngleScene({ angle, length, isLength }) {
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
function Slider({ label, value, unit='°', min=0, max=90, color, onChange, disabled }) {
  return <div className="slider-row"><label><span>{color && <i style={{background:color}}/>}{label}</span><b style={{color}}>{Math.round(value)}{unit}</b></label><input aria-label={label} type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))} disabled={disabled} style={{accentColor:color||'#557c64'}}/><div className="range-ticks"><span>{min}{unit}</span><span>{max}{unit}</span></div></div>;
}
function App() {
  const [id,setId]=useState('kite'), [target,setTarget]=useState({a:30,b:30,length:160}), [values,setValues]=useState(target), [step,setStep]=useState(0), [playing,setPlaying]=useState(false), [guides,setGuides]=useState(true), [choice,setChoice]=useState(null), [tab,setTab]=useState('watch'), [questionOpen,setQuestionOpen]=useState(false), [draft,setDraft]=useState(''), [notice,setNotice]=useState('');
  const timers=useRef([]), current=useRef(values), animation=useRef(null), reduceMotion=useReducedMotion();
  const lesson=lessons.find(l=>l.id===id), kite=id==='kite', lengthLesson=id==='length', fixedLength=30;
  const progress=lesson.steps[step];
  useEffect(()=>{ const start={...current.current}; animation.current=animate(0,1,{duration:reduceMotion?0:1.8,ease:'easeInOut',onUpdate:t=>{const v={};for(const k of ['a','b','length'])v[k]=start[k]+(target[k]-start[k])*t;current.current=v;setValues(v);}}); return ()=>animation.current?.stop(); },[target,reduceMotion]);
  useEffect(()=>()=>{timers.current.forEach(clearTimeout); window.speechSynthesis?.cancel();},[]);
  useEffect(()=>{try {setDraft(localStorage.getItem('math-question-draft')||'');}catch{}},[]);
  const stop=()=>{timers.current.forEach(clearTimeout);timers.current=[];setPlaying(false);animation.current?.stop();window.speechSynthesis?.cancel();};
  const goStep=(n)=>{stop();setStep(n);setTarget(t=>({...t,...stepValues(lesson.steps[n])}));setTab('watch');};
  const play=()=>{if(playing){stop();return;}stop();setPlaying(true);setTab('watch');setStep(0);setTarget(t=>({...t,...stepValues(lesson.steps[0])}));for(let i=1;i<3;i++)timers.current.push(setTimeout(()=>{setStep(i);setTarget(t=>({...t,...stepValues(lesson.steps[i])}));},i*4300));timers.current.push(setTimeout(()=>setPlaying(false),12900));};
  const chooseLesson=(next)=>{stop();setId(next);setStep(0);setChoice(null);setTab('watch');const l=lessons.find(v=>v.id===next);setTarget({a:30,b:60,length:160,...stepValues(l.steps[0])});};
  const change=(key,value)=>{stop();setTarget({...current.current,[key]:value});};
  const enterQuiz=()=>{stop();setTarget(t=>({...t,...lesson.quizState}));setTab('quiz');};
  const reset=()=>{stop();setStep(0);setChoice(null);setTarget({a:30,b:60,length:160,...stepValues(lesson.steps[0])});};
  const speak=()=>{if(!('speechSynthesis' in window)){setNotice('这个浏览器暂不支持朗读，可以直接阅读下方讲解。');return;}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(progress.text);u.lang='zh-CN';u.rate=.85;window.speechSynthesis.speak(u);};
  const saveDraft=(value)=>{setDraft(value);try{localStorage.setItem('math-question-draft',value);}catch{}};
  const copyQuestion=async()=>{const text=`请把下面这道四年级数学题加入小小数学实验室，制作交互动画、分步讲解和小练习，并更新已有网址。\n题目：${draft}`;try{await navigator.clipboard.writeText(text);setNotice('已复制。回到我们的聊天中粘贴，我就能继续制作。');}catch{setNotice('复制不可用，请直接选中题目文字，复制到我们的聊天中。');}};
  const heightA=kitePosition(values.a,fixedLength).height,heightB=kitePosition(values.b,fixedLength).height;
  return <div className="app">
    <header className="header"><a className="brand" href="#" onClick={e=>{e.preventDefault();chooseLesson('kite');}}><span className="brand-icon"><FlaskConical size={24}/></span><span>小小数学实验室<small>让每一个“为什么”，都看得见</small></span></a><div className="header-right"><span className="grade">四年级 · 角的探索</span><button className="question-button" onClick={()=>{setQuestionOpen(true);setNotice('');}}><Send size={16}/> 下一个问题</button></div></header>
    <main className="layout"><aside className="sidebar"><div className="sidebar-title"><BookOpen size={17}/> 我的动画课</div><p className="sidebar-sub">从生活出发，动手发现数学</p><div className="lesson-list">{lessons.map((l,i)=><button key={l.id} className={`lesson-link ${id===l.id?'active':''}`} onClick={()=>chooseLesson(l.id)}><span className="lesson-number">0{i+1}</span><span><strong>{l.short}</strong><small>{l.tag}</small></span>{id===l.id && <ChevronRight size={16}/>}</button>)}</div><div className="sidebar-note"><span className="note-doodle">✦</span><b>数学，不只是算答案。</b><p>看见变化，自己试一试，<br/>你也能发现其中的道理。</p></div><div className="side-footer"><span className="live-dot"/> 3 个可以动手的小实验</div></aside>
    <section className="workspace"><div className="breadcrumb">数学探索 <ChevronRight size={13}/> 角 <ChevronRight size={13}/> {lesson.tag}</div><div className="lesson-heading"><div><span className="eyebrow"><Sparkles size={13}/> 今日的小发现</span><h1>{lesson.title}</h1><p>{lesson.intro}</p></div><div className="chapter-badge"><span>CHAPTER</span><b>0{lessons.indexOf(lesson)+1}</b></div></div>
    <div className="mode-tabs" role="tablist" aria-label="学习方式"><button role="tab" aria-selected={tab==='watch'} className={tab==='watch'?'selected':''} onClick={()=>setTab('watch')}><Play size={15}/> 看动画</button><button role="tab" aria-selected={tab==='try'} className={tab==='try'?'selected':''} onClick={()=>{stop();setTab('try');}}><SlidersHorizontal size={15}/> 自己试一试</button><button role="tab" aria-selected={tab==='quiz'} className={tab==='quiz'?'selected':''} onClick={enterQuiz}><Lightbulb size={15}/> 我懂了吗？</button></div>
    <div className="experiment-grid"><div className="experiment"><div className="scene-toolbar"><span><span className="live-dot"/> {kite?'风筝小实验':'角的小实验'}</span><span className="scene-hint">{tab==='try'?'拖动右侧滑块，观察变化':'点击播放，跟着动画一起看'}</span></div>
    {kite?<KiteScene a={values.a} b={values.b} length={fixedLength} guides={guides}/>:<AngleScene angle={values.a} length={lengthLesson?values.length:230} isLength={lengthLesson}/>}
    <div className="playback"><button className="primary" onClick={play}>{playing?<Pause size={16}/>:<Play size={16}/>} {playing?'暂停动画':'播放讲解'}</button><button className="icon-button" onClick={reset} aria-label="重新开始" title="重新开始"><RotateCcw size={17}/></button><div className="step-dots">{lesson.steps.map((s,i)=><button key={s.title} aria-label={`第${i+1}步：${s.title}`} className={step===i?'current':''} onClick={()=>goStep(i)}/>)}</div><span className="step-count">{step+1} / 3 步</span></div><div className="scene-caption">{kite?'模型条件：线拉直、等长，握线处等高；夹角为线与水平线的夹角（0°～90°）。虚线高度从握线处算起。':'这是帮助理解角的几何示意图。角度用 ° 表示，读作“度”。'}</div></div>
    <aside className="controls"><div className="controls-title"><SlidersHorizontal size={16}/><b>动手小实验</b></div><p>{kite?'保持线长不变，改变角度。':lengthLesson?'试试改变边长，再改变角度。':'把角慢慢张开，观察名称变化。'}</p>
    <Slider label={kite?'橙色风筝的角度':'张开的角度'} value={Math.round(target.a)} color={colors.a} max={kite?90:180} onChange={v=>{setTab('try');change('a',v);}}/>
    {kite?<><Slider label="蓝色风筝的角度" value={Math.round(target.b)} color={colors.b} onChange={v=>{setTab('try');change('b',v);}}/><div className="fixed-line"><Wind size={16}/><span>两根线始终都是 <b>30 米</b></span><Check size={14}/></div><label className="toggle"><input type="checkbox" checked={guides} onChange={e=>setGuides(e.target.checked)}/><span>显示竖直高度线</span></label><div className="height-comparison"><span>比握线处高多少？</span><div><span>橙色</span><b style={{color:colors.a}}>{heightA.toFixed(1)}<small> 米</small></b></div><div><span>蓝色</span><b style={{color:colors.b}}>{heightB.toFixed(1)}<small> 米</small></b></div><p>{Math.abs(heightA-heightB)<.1?'现在两只风筝一样高。':heightA>heightB?'现在橙色风筝更高。':'现在蓝色风筝更高。'}</p></div></>:<>{lengthLesson && <Slider label="画出的边长" value={Math.round(target.length)} unit="" min={100} max={270} onChange={v=>{setTab('try');change('length',v);}}/>}<div className="angle-presets">{[30,90,120,180].map(a=><button key={a} onClick={()=>{setTab('try');change('a',a);}}>{a}°</button>)}</div><div className="concept-card"><Maximize2 size={21}/><b>{angleKind(Math.round(values.a))}</b><p>{lengthLesson?'伸长边，不会改变角的大小。':'看看角张开到哪里了。'}</p></div></>}
    </aside></div>
    {tab==='quiz'?<motion.section key={`quiz-${id}`} initial={{opacity:0,y:7}} animate={{opacity:1,y:0}} className="quiz-card"><div className="quiz-icon"><Lightbulb size={23}/></div><div className="quiz-content"><span className="eyebrow">不用急着答，先想一想</span><h2>{lesson.question}</h2><div className="answers">{lesson.options.map((s,i)=><button key={s} className={choice===i?(i===lesson.answer?'correct':'incorrect'):''} onClick={()=>setChoice(i)}>{String.fromCharCode(65+i)}<span>{s}</span>{choice===i && (i===lesson.answer?<Check size={17}/>:<X size={17}/>)}</button>)}</div><div className="feedback" aria-live="polite">{choice===null?'你可以先回到动画里试一试。':choice===lesson.answer?lesson.explanation:'再观察一次：看角张开的程度，以及竖直方向的高度。你可以重新选择。'}</div></div></motion.section>:<section className="explanation"><div className="step-icon">0{step+1}</div><div className="explanation-copy"><span className="eyebrow">{tab==='try'?'探索提示':'一步一步看明白'}</span><h2>{tab==='try'?'拖一拖，你发现了什么？':progress.title}</h2><p>{tab==='try'?(kite?'把蓝色风筝调到 30°，再调到 60°。线的长度变了吗？竖直的虚线变长了吗？':lengthLesson?'先固定角度，只改变边长；再固定边长，只改变角度。看看哪种变化真的改变了角。':'依次试试 30°、90° 和 120°，再找一找：什么时候两条边变成一条直线？'):progress.text}</p></div><div className="explanation-actions"><button className="text-button" onClick={speak} aria-label="朗读当前讲解"><Volume2 size={16}/> 听讲解</button><div className="step-nav"><button className="icon-button" disabled={step===0} onClick={()=>goStep(step-1)} aria-label="上一步"><ArrowLeft size={17}/></button><button className="icon-button" disabled={step===2} onClick={()=>goStep(step+1)} aria-label="下一步"><ArrowRight size={17}/></button></div></div></section>}
    <div className="learning-footer"><span><Check size={15}/> 今天学会：{lesson.goal}</span><button onClick={()=>{if(tab==='quiz'){stop();setTab('try');}else enterQuiz();}}>{tab==='quiz'?'再去试一试':'做一道小练习'}<ArrowRight size={15}/></button></div>
    <footer className="footer">小小数学实验室 <span>·</span> 每次理解一点点，就会进步一点点。<a href="https://github.com/motiondivision/motion" target="_blank" rel="noreferrer">开源动画：Motion</a></footer></section></main>
    {notice && !questionOpen && <div className="toast" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="关闭提示"><X size={16}/></button></div>}
    {questionOpen && <div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)setQuestionOpen(false);}}><section className="question-modal" role="dialog" aria-modal="true" aria-labelledby="question-title"><button className="modal-close icon-button" onClick={()=>setQuestionOpen(false)} aria-label="关闭"><X size={20}/></button><span className="eyebrow"><Send size={14}/> 留给下一次探索</span><h2 id="question-title">下一道题，也可以动起来。</h2><p>把题目文字或照片发到我们原来的 Codex 聊天里。我会为这道题制作动画，加入这个实验室，再更新同一个网址。</p><label htmlFor="question-draft">先记下孩子没理解的题目</label><textarea id="question-draft" placeholder="例如：两条直线相交，已知一个角是 40°，另外几个角是多少？" value={draft} onChange={e=>saveDraft(e.target.value)} autoFocus/><small>草稿仅保存在当前浏览器。这一页不会自动识题或发送给 AI。</small><button className="primary" disabled={!draft.trim()} onClick={copyQuestion}><Send size={16}/> 复制题目，回聊天发送</button><p role="status" className="modal-notice">{notice}</p></section></div>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
