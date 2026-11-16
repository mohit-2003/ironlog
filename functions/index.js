const {onSchedule}=require("firebase-functions/v2/scheduler");
const admin=require("firebase-admin");admin.initializeApp();
const db=admin.firestore();
const mins=t=>{const[h,m]=t.split(":").map(Number);return h*60+m};

// Runs every 15 minutes, checks each user's local time, sends due reminders.
exports.reminders=onSchedule("every 15 minutes",async()=>{
 const snap=await db.collection("users").get(),now=new Date();
 await Promise.all(snap.docs.map(async d=>{
  const p=d.data(),tokens=p.tokens||[];if(!tokens.length)return;
  const tz=p.tz||"UTC",date=now.toLocaleDateString("en-CA",{timeZone:tz});
  const[h,m]=now.toLocaleTimeString("en-GB",{timeZone:tz,hour:"2-digit",minute:"2-digit"}).split(":").map(Number);
  const cur=h*60+m,due=t=>t&&cur-mins(t)>=0&&cur-mins(t)<15,out=[];
  if(p.rp&&due(p.rpt||"20:00")){
   const s=await d.ref.collection("protein").where("date","==",date).get();
   const t=s.docs.reduce((a,x)=>a+x.data().g,0),g=p.pg||140;
   if(t<g)out.push({title:"Protein check-in",body:`${t} of ${g} g so far. ${g-t} g to go.`});}
  if(p.rg&&due(p.rgt||"18:00")){
   const s=await d.ref.collection("sets").where("date","==",date).limit(1).get();
   if(s.empty)out.push({title:"Gym time",body:"Log your first set when you're done."});}
  if(p.wOn&&p.rw&&cur>=540&&cur<=1260&&(cur-540)%120<15){
   const s=await d.ref.collection("water").doc(date).get(),ml=s.exists?s.data().ml:0,g=p.wg||3000;
   if(ml<g)out.push({title:"Drink some water",body:`${ml} of ${g} ml today.`});}
  for(const x of out){
   const r=await admin.messaging().sendEachForMulticast({tokens,data:x});
   const bad=tokens.filter((_,i)=>!r.responses[i].success&&/not-registered|invalid/.test(r.responses[i].error?.code||""));
   if(bad.length)await d.ref.update({tokens:admin.firestore.FieldValue.arrayRemove(...bad)});}
 }));
});
