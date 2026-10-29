import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files={'/':'index.html','/app.js':'app.js','/math.js':'math.js','/style.css':'style.css'};
http.createServer(async(req,res)=>{const file=files[req.url.split('?')[0]];if(!file){res.writeHead(404).end();return;}try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html; charset=utf-8');res.end(await readFile(new URL(file,import.meta.url)));}catch{res.writeHead(500).end();}}).listen(5173,'127.0.0.1',()=>console.log('Formscape: http://127.0.0.1:5173'));
