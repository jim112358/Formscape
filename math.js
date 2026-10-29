const funcs={sin:Math.sin,cos:Math.cos,tan:Math.tan,sqrt:Math.sqrt,abs:Math.abs,ln:Math.log,log:Math.log10,exp:Math.exp,asin:Math.asin,acos:Math.acos,atan:Math.atan,floor:Math.floor,ceil:Math.ceil};
export function compile(source){
 const s=source.replaceAll('π','pi').replaceAll('²','^2').replaceAll('³','^3');
 const tokens=s.match(/(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?|[a-zA-Z]+|[()+*/^,-]/g)||[];
 if(tokens.join('')!==s.replace(/\s/g,''))throw Error('包含无法识别的字符');
 let i=0;const peek=()=>tokens[i];
 function atom(){const t=tokens[i++];if(t==='('){const a=expr();if(tokens[i++]!==')')throw Error('缺少右括号');return a;}if(/^\d|^\./.test(t||''))return()=>Number(t);if(/^[a-z]+$/i.test(t||'')){if(funcs[t]){if(tokens[i++]!=='(')throw Error(`${t} 后需要括号`);const a=expr();if(tokens[i++]!==')')throw Error('缺少右括号');return v=>funcs[t](a(v));}return v=>{if(t==='pi')return Math.PI;if(t==='e')return Math.E;if(!(t in v))throw Error(`未知变量 ${t}`);return v[t];};}throw Error('表达式不完整');}
 function power(){let a=atom();if(peek()==='^'){i++;const b=unary();const p=a;a=v=>p(v)**b(v);}return a;}
 function unary(){if(peek()==='-'){i++;const a=unary();return v=>-a(v);}if(peek()==='+'){i++;return unary();}return power();}
 function term(){let a=unary();while(peek()==='*'||peek()==='/'||/^(?:[a-zA-Z]|\(|\d|\.)/.test(peek()||'')){const op=peek()==='*'||peek()==='/'?tokens[i++]:'*';const b=unary(),p=a;a=v=>op==='*'?p(v)*b(v):p(v)/b(v);}return a;}
 function expr(){let a=term();while(peek()==='+'||peek()==='-'){const op=tokens[i++],b=term(),p=a;a=v=>op==='+'?p(v)+b(v):p(v)-b(v);}return a;}
 const result=expr();if(i!==tokens.length)throw Error('请检查公式');return result;
}
