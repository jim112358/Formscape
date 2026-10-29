import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parameterNames,syncParameters} from './parameters.js';
import {compile} from './math.js';
test('识别偏移参数并正确计算',()=>{assert.deepEqual(parameterNames([{type:0,expr:['sin(a*x)+b']}]),['a','b']);assert.equal(compile('sin(a*x)+b')({a:1,x:0,b:3}),3);});
test('按图形类型排除自变量并共享参数',()=>{assert.deepEqual(parameterNames([{type:4,expr:['R*cos(u)','R*sin(u)','b*v']},{type:3,expr:['cos(t)','sin(t)','b*t']}]),['R','b']);assert.deepEqual(parameterNames([{type:0,expr:['1e-3*x+pi']}]),[]);});
test('清理废弃参数，面板只显示当前模式的可见图形参数',()=>{
 const s={mode:2,parameters:{a:2,b:3,c:4},items:[{type:0,expr:['a*x'],visible:true},{type:2,expr:['c*x*y'],visible:true}]};
 assert.deepEqual(syncParameters(s),['a']);assert.deepEqual(s.parameters,{a:2,c:4});
 s.items[0].expr=['x'];assert.deepEqual(syncParameters(s),[]);assert.deepEqual(s.parameters,{c:4});
 s.mode=3;assert.deepEqual(syncParameters(s),['c']);assert.equal(s.parameters.c,4);
 s.items[1].visible=false;assert.deepEqual(syncParameters(s),[]);assert.equal(s.parameters.c,4);
 s.items=[];syncParameters(s);assert.deepEqual(s.parameters,{});
});
