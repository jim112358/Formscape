import {compile} from './math.js';
export function parameterNames(items){const names=new Set();for(const it of items){const coordinates=it.type===0?['x']:it.type===2?['x','y']:it.type===4?['u','v']:['t'];for(const expression of it.expr){try{for(const name of compile(expression).variables)if(!coordinates.includes(name))names.add(name);}catch{}}}return [...names].sort();}
export function syncParameters(state){
 const used=parameterNames(state.items);
 const previous=state.parameters??{a:state.a};
 state.parameters=Object.fromEntries(used.map(name=>[name,Object.hasOwn(previous,name)?previous[name]:1]));
 return parameterNames(state.items.filter(it=>it.visible&&(it.type<2?2:3)===state.mode));
}
