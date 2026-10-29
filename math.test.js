import {test} from 'node:test';
import assert from 'node:assert/strict';
import {compile} from './math.js';
test('数学表达式与隐式乘法',()=>{assert.equal(compile('2x+sin(pi/2)')({x:3}),7);assert.equal(compile('-2^2')({}),-4);assert.equal(compile('2^3^2')({}),512);assert.equal(compile('sqrt(x²+y²)')({x:3,y:4}),5);});
test('拒绝代码与未知变量',()=>{assert.throws(()=>compile('globalThis.alert(1)'));assert.throws(()=>compile('x+z')({x:1}));assert.throws(()=>compile('sin('));});
