import kite from './lessons/kite.js';
import angle from './lessons/angle.js';
import length from './lessons/length.js';
import magnifier from './lessons/magnifier.js';
import { defineLessons } from './lesson-model.js';

// 新题独立放在 lessons/，导入并加入这里后就会出现在首页。
export const lessons = defineLessons([kite, angle, length, magnifier]);
