const C='ironlog-v2',X=['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com','cdn.jsdelivr.net'];
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url),same=u.origin===location.origin;
 if(r.method!=='GET'||!(same||X.includes(u.hostname)))return;
 const net=same&&!u.pathname.endsWith('exercises.json'); // app files: network first, so updates show at once
 e.respondWith(caches.open(C).then(async c=>{const m=await c.match(r,{ignoreSearch:true});
  const n=()=>fetch(r).then(x=>{if(x.ok||x.type==='opaque')c.put(r,x.clone());return x});
  return net?n().catch(()=>m):(m||n())}))});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch{}
 const x=d.data||d.notification||{};
 e.waitUntil(self.registration.showNotification(x.title||'Ironlog',{body:x.body||'',icon:'icon-192.png',badge:'icon-192.png'}))});
self.addEventListener('notificationclick',e=>{e.notification.close();
 e.waitUntil(clients.matchAll({type:'window'}).then(l=>l[0]?l[0].focus():clients.openWindow('./')))});
