const C='ironlog-v1',H=['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
 if(e.request.method!=='GET'||!(u.origin===location.origin||H.includes(u.hostname)))return;
 e.respondWith(caches.open(C).then(async c=>{const m=await c.match(e.request,{ignoreSearch:true});
  const n=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>m);
  return m||n}))});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch{}
 const x=d.data||d.notification||{};
 e.waitUntil(self.registration.showNotification(x.title||'Ironlog',{body:x.body||'',icon:'icon-192.png',badge:'icon-192.png'}))});
self.addEventListener('notificationclick',e=>{e.notification.close();
 e.waitUntil(clients.matchAll({type:'window'}).then(l=>l[0]?l[0].focus():clients.openWindow('./')))});
