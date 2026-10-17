import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { animate, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { lessons } from './lessons';
import { questionIdFromHash, stateForStep } from './lesson-model';
import { LessonScene, SceneControls } from './components/LessonScene';
import './style.css';

function Home() {
  return <main className="home">
    <div className="home-heading"><div><h1>我的题目</h1><p className="muted">点开一道题，慢慢看懂。</p></div><span className="question-count">{lessons.length} 道题</span></div>
    <ol className="question-list">
      {lessons.map((lesson, index) => <li key={lesson.id}>
        <a className="question-card" href={`#/question/${lesson.id}`}>
          <span className="question-number">{String(index + 1).padStart(2, '0')}</span>
          <div className="question-copy"><span className="topic">{lesson.tag}</span><h2>{lesson.title}</h2><p>{lesson.intro}</p></div>
          <ChevronRight className="card-arrow" size={20} />
        </a>
      </li>)}
    </ol>
    <details className="home-help"><summary>以后怎么加新错题？</summary><p>把完整题目和图形拍清楚，发到我们原来的聊天里，再说说孩子哪里没理解。我会继续制作动画，加入这个题目列表。以后仍然打开同一个网址。</p></details>
  </main>;
}

function Question({ lesson }) {
  const initial = stateForStep(lesson, 0);
  const [target, setTarget] = useState(initial);
  const [values, setValues] = useState(initial);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState('watch');
  const [guides, setGuides] = useState(true);
  const [choice, setChoice] = useState(null);
  const [notice, setNotice] = useState('');
  const current = useRef(initial);
  const animation = useRef(null);
  const reduceMotion = useReducedMotion();
  const lastStep = lesson.steps.length - 1;
  const progress = lesson.steps[step];

  useEffect(() => {
    const start = { ...current.current };
    animation.current = animate(0, 1, {
      duration: reduceMotion ? 0 : 1.5,
      ease: 'easeInOut',
      onUpdate: fraction => {
        const next = {};
        for (const key of ['a', 'b', 'length']) next[key] = start[key] + (target[key] - start[key]) * fraction;
        current.current = next;
        setValues(next);
      },
    });
    return () => animation.current?.stop();
  }, [target, reduceMotion]);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (step < lastStep) {
        setStep(step + 1);
        setTarget(stateForStep(lesson, step + 1));
      } else setPlaying(false);
    }, 4800);
    return () => clearTimeout(timer);
  }, [playing, step, lastStep, lesson]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function pause() {
    setPlaying(false);
    animation.current?.stop();
    window.speechSynthesis?.cancel();
  }

  function showStep(index) {
    pause();
    setMode('watch');
    setStep(index);
    setTarget(stateForStep(lesson, index));
  }

  function play() {
    if (playing) { pause(); return; }
    const startAt = mode !== 'watch' || step === lastStep ? 0 : step;
    setMode('watch');
    setStep(startAt);
    setTarget(stateForStep(lesson, startAt));
    setPlaying(true);
  }

  function change(key, value) {
    pause();
    setMode('try');
    const next = { ...current.current, [key]: value };
    current.current = next;
    setValues(next);
    setTarget(next);
  }

  function speak() {
    if (!('speechSynthesis' in window)) { setNotice('这个浏览器暂不支持朗读，可以看下方的文字讲解。'); return; }
    window.speechSynthesis.cancel();
    const text = mode === 'watch' ? progress.text : mode === 'try' ? lesson.exploreText : lesson.question;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'zh-CN';
    speech.rate = 0.85;
    window.speechSynthesis.speak(speech);
  }

  const caption = lesson.scene === 'kite'
    ? '线拉直、一样长，握线处一样高；角度是线与水平线的夹角（0°～90°），虚线高度从握线处算起。'
    : '角的大小用“度”表示，写作 °。';

  return <main className="question-page">
    <a className="back-link" href="#/"><ArrowLeft size={17} />返回题目列表</a>
    <div className="question-heading"><span className="topic">{lesson.tag}</span><h1>{lesson.title}</h1><p>{lesson.intro}</p></div>
    <section className="animation-card" aria-label="动画讲解">
      <LessonScene lesson={lesson} values={values} guides={guides} />
      <div className="playback"><button className="primary" onClick={play}>{playing ? <Pause size={17} /> : <Play size={17} />}{playing ? '暂停' : '播放动画'}</button><span className="step-readout">第 {step + 1} / {lesson.steps.length} 步</span><button className="quiet-button" onClick={() => showStep(0)}><RotateCcw size={16} />重来</button></div>
      <div className="explanation">
        <div className="explanation-heading"><h2>{mode === 'watch' ? progress.title : mode === 'try' ? '试一试，观察变化' : '先想一想'}</h2><button className="listen-button" onClick={speak} aria-label="朗读当前讲解"><Volume2 size={17} /><span>听讲解</span></button></div>
        <p>{mode === 'watch' ? progress.text : mode === 'try' ? lesson.exploreText : lesson.question}</p>
        <nav className="step-nav" aria-label="讲解步骤"><button disabled={step === 0} onClick={() => showStep(step - 1)}><ArrowLeft size={16} />上一步</button><button disabled={step === lastStep} onClick={() => showStep(step + 1)}>下一步<ArrowRight size={16} /></button></nav>
      </div>
      <p className="scene-caption">{caption}</p>
    </section>
    <details className="extra-panel" onToggle={event => { if (event.currentTarget.open) { pause(); setMode('try'); } }}>
      <summary>自己动手试一试</summary>
      <SceneControls lesson={lesson} values={values} guides={guides} setGuides={setGuides} change={change} />
    </details>
    <details className="extra-panel" onToggle={event => {
      if (event.currentTarget.open) { pause(); setMode('quiz'); setTarget({ ...initial, ...lesson.quizState }); }
    }}>
      <summary>做一道小练习</summary>
      <div className="quiz-content"><h2>{lesson.question}</h2><div className="answers">{lesson.options.map((option, index) => <button key={index} className={choice === index ? index === lesson.answer ? 'correct' : 'incorrect' : ''} onClick={() => setChoice(index)}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{choice === index && index === lesson.answer && <Check size={18} />}</button>)}</div><p className="feedback" role="status">{choice === null ? '先选一个答案，再看看解释。' : choice === lesson.answer ? lesson.explanation : '再想一想，也可以回到动画里试一试。'}</p></div>
    </details>
    {notice && <p className="notice" role="status">{notice}</p>}
    <a className="bottom-back back-link" href="#/"><ArrowLeft size={17} />返回题目列表</a>
  </main>;
}

function App() {
  const [id, setId] = useState(() => questionIdFromHash(window.location.hash));
  const lesson = lessons.find(item => item.id === id);
  useEffect(() => {
    const sync = () => { setId(questionIdFromHash(window.location.hash)); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  useEffect(() => { document.title = lesson ? `${lesson.title} · 数学错题本` : '数学错题本 · 一题一动画'; }, [lesson]);
  return <>
    <header className="site-header"><a className="brand" href="#/"><BookOpen size={22} /><span>数学错题本</span></a><span className="grade">四年级</span></header>
    {lesson ? <Question key={lesson.id} lesson={lesson} /> : id ? <main className="home"><h1>还没有这道题</h1><p className="muted">可以先从题目列表里选一道。</p><a className="back-link" href="#/">返回题目列表<ArrowRight size={17} /></a></main> : <Home />}
    <footer className="site-footer">一次看懂一道题。</footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
