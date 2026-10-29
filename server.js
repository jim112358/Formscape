import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {watch} from 'node:fs';
const files={'/':'index.html','/app.js':'app.js','/math.js':'math.js','/ranges.js':'ranges.js','/parameters.js':'parameters.js','/style.css':'style.css'};
const clients=new Set();
const watched=new Set(Object.values(files));
const liveScript=`<script>
(() => {
  const events = new EventSource('/__dev/events');
  events.addEventListener('reload', () => location.reload());
  // A new server instance also refreshes pages after a server restart.
  const key = 'formscape-dev-instance';
  events.addEventListener('instance', event => {
    const previous = sessionStorage.getItem(key);
    sessionStorage.setItem(key, event.data);
    if (previous && previous !== event.data) location.reload();
  });
  window.addEventListener('pagehide', () => events.close());
})();
</script>`;
const instance=String(Date.now());
let debounce;
watch(new URL('.',import.meta.url),(_event,name)=>{
  if(!watched.has(String(name)))return;
  clearTimeout(debounce);
  debounce=setTimeout(()=>{
    for(const client of clients)client.write('event: reload\ndata: changed\n\n');
    console.log('Source changed; refreshing browser.');
  },150);
});
const heartbeat=setInterval(()=>{for(const client of clients)client.write(': keepalive\n\n');},15000);
heartbeat.unref();
http.createServer(async(req,res)=>{
  const path=req.url.split('?')[0];
  if(path==='/__dev/events'){
    res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});
    res.write(`event: instance\ndata: ${instance}\n\n`);
    clients.add(res);
    res.on('close',()=>clients.delete(res));
    return;
  }
  const file=files[path];
  if(!file){res.writeHead(404).end();return;}
  try{
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html; charset=utf-8');
    const content=await readFile(new URL(file,import.meta.url));
    res.end(file==='index.html'?content.toString().replace('</body>',liveScript+'</body>'):content);
  }catch{res.writeHead(500).end();}
}).listen(5173,'127.0.0.1',()=>console.log('Formscape: http://127.0.0.1:5173 (live reload enabled)'));
