import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readRange,autoRange,migrateRanges} from './ranges.js';
test('范围支持数学表达式并拒绝无效边界',()=>{assert.deepEqual(readRange('-pi','pi'),[-Math.PI,Math.PI]);for(const r of [['2','1'],['0','1/0'],['a','5']])assert.throws(()=>readRange(...r));});
test('自动适配保留边距并过滤非有限值',()=>{assert.deepEqual(autoRange([0,10,NaN,Infinity]),[-.8,10.8]);const [lo,hi]=autoRange([5,5]);assert.ok(lo<5&&hi>5);assert.deepEqual(autoRange([]),[-1,1]);});
test('极端值不会压扁主体曲线',()=>{const data=Array.from({length:1000},(_,i)=>Math.sin(i));const result=autoRange([...data,1e10,-1e10]);assert.ok(result[0]>-2&&result[1]<2);});
test('旧项目迁移保留原自变量和参数范围',()=>{const s=migrateRanges({min:'-3',max:'8'});assert.equal(s.axes.x.min,'-3');assert.equal(s.domains.t.max,'8');assert.equal(s.axes.y.auto,true);assert.equal(s.axes.z.auto,true);});
