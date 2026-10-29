import {test} from 'node:test';
import assert from 'node:assert/strict';
import {compile} from './math.js';
test('数学表达式与隐式乘法',()=>{assert.equal(compile('2x+sin(pi/2)')({x:3}),7);assert.equal(compile('-2^2')({}),-4);assert.equal(compile('2^3^2')({}),512);assert.equal(compile('sqrt(x²+y²)')({x:3,y:4}),5);});
test('拒绝代码与未知变量',()=>{assert.throws(()=>compile('globalThis.alert(1)'));assert.throws(()=>compile('x+z')({x:1}));assert.throws(()=>compile('sin('));});
test('分段函数支持边界、默认值和惰性计算',()=>{const f=compile('piecewise(x<0,x^2,sin(x))');assert.equal(f({x:-2}),4);assert.equal(f({x:0}),0);assert.equal(f({x:Math.PI/2}),1);assert.notEqual(f.segment({x:-1}),f.segment({x:1}));assert.ok(Number.isNaN(compile('piecewise(x>0,ln(x))')({x:-1})));assert.equal(compile('piecewise(x<0,missing,3)')({x:1}),3);});
test('多段条件、嵌套与参数识别',()=>{const f=compile('piecewise(x<0,-a,x>=0&&x<2,b,0)');assert.equal(f({x:-1,a:2,b:5}),-2);assert.equal(f({x:1,a:2,b:5}),5);assert.equal(f({x:2,a:2,b:5}),0);assert.deepEqual(f.variables,['x','a','b']);assert.equal(compile('piecewise(x<0||x>2,1,piecewise(x==1,2,3))')({x:1}),2);assert.throws(()=>compile('piecewise(x<0)'));});
