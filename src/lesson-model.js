export const sceneTypes = ['kite', 'angle', 'length'];
const stateKeys = ['a', 'b', 'length'];
const defaultState = { a: 30, b: 30, length: 160 };

function pickState(value) {
  return Object.fromEntries(stateKeys.filter(key => value[key] !== undefined).map(key => [key, value[key]]));
}

export function stateForStep(lesson, index) {
  return Object.assign({}, defaultState, ...lesson.steps.slice(0, index + 1).map(pickState));
}

export function questionIdFromHash(hash) {
  const match = /^#\/question\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(hash);
  return match ? match[1] : null;
}

// 发布前核对每道题，避免新增题目时显示了不匹配的动画或错误的初始值。
export function defineLessons(entries) {
  const ids = new Set();
  for (const lesson of entries) {
    const fail = message => { throw new Error(`题目 ${lesson.id || '(无编号)'}：${message}`); };
    if (typeof lesson.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(lesson.id) || ids.has(lesson.id)) fail('编号必须唯一且适合网址');
    ids.add(lesson.id);
    if (!sceneTypes.includes(lesson.scene)) fail('缺少匹配的动画场景');
    for (const key of ['title', 'intro', 'tag', 'exploreText', 'question', 'explanation']) {
      if (typeof lesson[key] !== 'string' || !lesson[key].trim()) fail(`缺少 ${key}`);
    }
    if (!Array.isArray(lesson.steps) || !lesson.steps.length) fail('至少需要一个讲解步骤');
    if (!lesson.quizState || !Array.isArray(lesson.options) || lesson.options.length < 2 || lesson.options.some(v => typeof v !== 'string' || !v.trim()) || !Number.isInteger(lesson.answer) || lesson.answer < 0 || lesson.answer >= lesson.options.length) fail('练习题或答案不完整');
    const checkState = state => {
      for (const [key, value] of Object.entries(pickState(state))) {
        if (!Number.isFinite(value)) fail('动画参数必须是有限数值');
        if ((key === 'a' || key === 'b') && (value < 0 || value > (lesson.scene === 'kite' ? 90 : 180))) fail('角度超出场景范围');
        if (key === 'length' && (value < 100 || value > 270)) fail('画出的边长超出画布范围');
      }
    };
    lesson.steps.forEach(step => {
      if (!step.title?.trim() || !step.text?.trim()) fail('每一步需要标题和讲解');
      checkState(step);
    });
    checkState(lesson.quizState);
    if (lesson.scene === 'kite' && (!(lesson.sceneOptions?.lineLength > 0) || lesson.sceneOptions.lineLength > 30)) fail('风筝线长必须在场景支持的范围内');
  }
  return entries;
}
