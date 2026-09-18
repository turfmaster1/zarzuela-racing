import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $ = id => document.getElementById(id);
const screens = [...document.querySelectorAll('.screen')];
const show = id => { screens.forEach(s => s.classList.toggle('active', s.id === id)); window.scrollTo(0, 0); };

const SPECIALTY = {
  sprinter:{label:'Sprinter',center:1200,width:360},
  miler:{label:'Miler',center:1600,width:430},
  intermediate:{label:'Intermedio',center:2050,width:520},
  stayer:{label:'Fondista',center:2525,width:700}
};

const JOCKEYS = [
  'V. Janáček','R. Sousa','J. Gelabert','B. Fayos','A. Gutiérrez V.',
  'G. Trolley de Prévaux','J. L. Martínez','E. Corallo','J. Grosjean',
  'R. N. Valle','N. de Julián','I. Melgarejo','A. Werlé','C. Cadel',
  'J. Gómez','D. Sikorova','R. Ramos','J. L. Borrego'
];

const horses = [
  ['safaga','Safaga','Asoc. La Toledana–Becares','G. Trolley de Prévaux','intermediate',92,93,95,1900,2450,0x3b241d,'#111111','#20c9c3','cross'],
  ['estraunza','Estraunza','Becares','A. Gutiérrez V.','stayer',92,98,93,2250,2850,0x6b351f,'#f05a18','#1746b8','diagonal'],
  ['sirjan','Sirjan','Cum Laude Racing','J. Gelabert','stayer',92,99,91,2300,3100,0x281811,'#17633f','#f7f7f2','band'],
  ['fortun','Fortun','La Toledana','B. Fayos','intermediate',94,94,92,1800,2450,0x7a3f24,'#101214','#39c8ca','cross'],
  ['entrecopas','Entre Copas','Cuadra África','J. L. Martínez','stayer',89,100,86,2400,4000,0x8a4b2b,'#aa2431','#f2d66a','band'],
  ['amedeo','Amedeo Modigliani','Yeguada Rocío','V. Janáček','miler',98,84,97,1450,1800,0x4b2b20,'#f5f5ef','#0d5c3d','stars'],
  ['frine','Friné','Duque de Alburquerque','J. Grosjean','stayer',94,97,94,2200,2700,0x9a9992,'#ededeb','#722338','band'],
  ['espoir','Espoir Avenir (FR)','Alain Maubert','E. Corallo','stayer',95,97,94,2300,2850,0x7b736c,'#235a9d','#d53838','diagonal'],
  ['warofdance','War of Dance','Peques','R. N. Valle','stayer',94,96,93,2300,2650,0x3d241c,'#f07b26','#12a4a4','quarters'],
  ['coetzee','Coetzee','Alex y Sofía','R. N. Valle','stayer',93,96,92,2300,2750,0x543126,'#203d87','#eadc61','band'],
  ['naranco','Naranco','Yeguada Rocío','V. Janáček','stayer',91,95,90,2200,2650,0x35231d,'#f5f5ef','#0d5c3d','stars'],
  ['tetuan','Tetuan','Yeguada Rocío','V. Janáček','stayer',90,96,89,2200,2850,0x2e201b,'#f5f5ef','#0d5c3d','stars'],
  ['shackleton','Shackleton','Yeguada Rocío','I. Melgarejo','stayer',90,97,87,2300,3000,0x563624,'#f5f5ef','#0d5c3d','stars'],
  ['pamplona','Pamplona','Yeguada Rocío','V. Janáček','stayer',91,95,90,2200,2850,0x4b2e24,'#f5f5ef','#0d5c3d','stars'],
  ['ifnotnow','If Not Now','Yeguada Rocío','V. Janáček','intermediate',93,92,93,1850,2350,0x8c5132,'#f5f5ef','#0d5c3d','stars'],
  ['thegame','The Game','Cielo de Madrid','R. Sousa','stayer',93,95,92,2150,2650,0x452a22,'#72c9d7','#11181a','quarters'],
  ['mediastorm','Media Storm','Best Horse','B. Fayos','stayer',92,96,90,2300,2750,0x6a3c28,'#17307e','#ffffff','band'],
  ['elcaney','El Caney','Santa Bárbara','A. Gutiérrez V.','stayer',91,96,90,2250,2850,0x37231c,'#f2d64e','#168154','diagonal'],
  ['kingjungle','King of Jungle','Yeguada Rocío','V. Janáček','sprinter',99,78,99,1000,1400,0x9a9992,'#f5f5ef','#0d5c3d','stars'],
  ['samedi','Samedi Rien','Yeguada Rocío','V. Janáček','miler',97,85,96,1400,1800,0x603627,'#f5f5ef','#0d5c3d','stars']
].map((x,i)=>({
  id:x[0],name:x[1],stable:x[2],preferredJockey:x[3],specialty:x[4],
  speed:x[5],stamina:x[6],accel:x[7],best:[x[8],x[9]],coat:x[10],
  silk:x[11],accent:x[12],pattern:x[13],catalogNumber:i+1
}));

const races = [
  ['gpm','Gran Premio de Madrid',2500,'Hipódromo de La Zarzuela · Madrid','Fondistas'],
  ['copaoro','Copa de Oro de San Sebastián',2400,'Hipódromo de San Sebastián · Lasarte','Fondistas'],
  ['carudel','Gran Premio Claudio Carudel',1600,'Hipódromo de La Zarzuela · Madrid','Milers'],
  ['roman','Gran Premio Román Martín',2000,'Hipódromo de La Zarzuela · Madrid','Intermedios'],
  ['memorial','Memorial Duque de Toledo',2400,'Hipódromo de La Zarzuela · Madrid','Fondistas'],
  ['hispanidad','Gran Premio de la Hispanidad',1600,'Hipódromo de La Zarzuela · Madrid','Milers'],
  ['villapadierna','Gran Premio Villapadierna · Derby',2400,'Hipódromo de La Zarzuela · Madrid','Fondistas'],
  ['beamonte','Gran Premio Beamonte · Oaks',2400,'Hipódromo de La Zarzuela · Madrid','Fondistas']
].map(x=>({id:x[0],name:x[1],distance:x[2],venue:x[3],favors:x[4]}));

const state={mode:'free',selectedRace:null,selected:new Set(),lastField:[],raceSpeed:1,cameraMode:0,paused:false};

function distanceFit(h,d){
  const s=SPECIALTY[h.specialty];
  const bell=Math.exp(-Math.pow((d-s.center)/s.width,2));
  let f=.947+bell*.053;
  if(d>=h.best[0]&&d<=h.best[1])f+=.008;
  const gap=d<h.best[0]?h.best[0]-d:d>h.best[1]?d-h.best[1]:0;
  f-=Math.min(.052,gap/15000);
  if(h.specialty==='sprinter'&&d>=2200)f-=.035;
  if(h.specialty==='stayer'&&d<=1400)f-=.026;
  return THREE.MathUtils.clamp(f,.89,1.015);
}
function ability(h,d){const long=THREE.MathUtils.clamp((d-1200)/1800,0,1);return h.speed*(.48-.12*long)+h.stamina*(.26+.20*long)+h.accel*.26;}
function rating(h,d){return ability(h,d)*distanceFit(h,d);}
function currentRace(){return state.mode==='champ'?state.selectedRace:{id:'free',name:'Carrera Libre',distance:+$('freeDistance').value,venue:'Hipódromo de La Zarzuela · Madrid',favors:'Variable'};}

function silkPreview(h){const bg=h.pattern==='stars'?`radial-gradient(circle at 30% 30%,${h.accent} 0 2px,transparent 2.5px),radial-gradient(circle at 72% 68%,${h.accent} 0 2px,transparent 2.5px),${h.silk}`:`linear-gradient(135deg,${h.silk} 0 43%,${h.accent} 44% 60%,${h.silk} 61%)`;return `<div style="width:30px;height:30px;border-radius:50%;border:2px solid ${h.accent};background:${bg}"></div>`;}
function renderRaces(){$('raceGrid').innerHTML=races.map(r=>`<article class="race-card ${state.selectedRace?.id===r.id?'selected':''}" data-race="${r.id}"><div class="eyebrow">${r.distance.toLocaleString('es-ES')} m</div><h3>${r.name}</h3><p>${r.venue}</p><div class="race-meta"><span class="pill gold">Favorece ${r.favors}</span></div></article>`).join('');document.querySelectorAll('[data-race]').forEach(c=>c.onclick=()=>{state.selectedRace=races.find(r=>r.id===c.dataset.race);$('chooseRaceBtn').disabled=false;renderRaces();});}
function renderHorses(){const d=currentRace().distance;$('horseGrid').innerHTML=horses.map(h=>{const sel=state.selected.has(h.id),fit=Math.round(distanceFit(h,d)*100);return `<article class="horse-card ${sel?'selected':''}" data-horse="${h.id}"><div class="select-mark">${sel?'✓':'+'}</div><div style="display:flex;gap:10px;align-items:center">${silkPreview(h)}<div><div class="horse-number">Nº ${h.catalogNumber} · ${SPECIALTY[h.specialty].label}</div><h3>${h.name}</h3></div></div><div class="horse-sub">${h.stable}<br>${h.preferredJockey}</div><div class="fitbar"><span style="width:${Math.min(100,fit)}%"></span></div><div class="stats"><div>Velocidad<b>${h.speed}</b></div><div>Resistencia<b>${h.stamina}</b></div><div>Aceleración<b>${h.accel}</b></div></div></article>`;}).join('');document.querySelectorAll('[data-horse]').forEach(c=>c.onclick=()=>{const id=c.dataset.horse;if(state.selected.has(id))state.selected.delete(id);else if(state.selected.size<12)state.selected.add(id);renderHorses();});renderSummary();}
function renderSummary(){const r=currentRace();$('selectedCount').textContent=state.selected.size;$('confirmBtn').disabled=state.selected.size<6;$('raceSummary').innerHTML=`<b>${r.name}</b><br>${r.distance.toLocaleString('es-ES')} m`;$('selectedList').innerHTML=horses.filter(h=>state.selected.has(h.id)).map(h=>`<div class="selected-item"><b>${h.catalogNumber}. ${h.name}</b><span>${SPECIALTY[h.specialty].label}</span></div>`).join('');}
function openSelection(mode){state.mode=mode;state.selected.clear();$('selectionModeLabel').textContent=mode==='champ'?'Modo Campeonato':'Carrera Libre';$('freeDistanceControl').style.display=mode==='free'?'flex':'none';renderHorses();show('selectionScreen');}
$('freeBtn').onclick=()=>openSelection('free');
$('champBtn').onclick=()=>{state.mode='champ';state.selectedRace=null;$('chooseRaceBtn').disabled=true;renderRaces();show('championshipMenu');};
$('chooseRaceBtn').onclick=()=>openSelection('champ');
document.querySelectorAll('[data-go="mainMenu"]').forEach(b=>b.onclick=()=>show('mainMenu'));
$('selectionBack').onclick=()=>show(state.mode==='champ'?'championshipMenu':'mainMenu');
$('freeDistance').onchange=renderHorses;
$('randomBtn').onclick=()=>{state.selected.clear();[...horses].sort(()=>Math.random()-.5).slice(0,8).forEach(h=>state.selected.add(h.id));renderHorses();};
$('bestBtn').onclick=()=>{const d=currentRace().distance;state.selected.clear();[...horses].sort((a,b)=>rating(b,d)-rating(a,d)).slice(0,10).forEach(h=>state.selected.add(h.id));renderHorses();};

// ============================================================
// ESCENA: geometría basada en la versión La Zarzuela aportada
// ============================================================
let scene,camera,renderer,orbitControls,horseTemplate,horseClips={},worldBuilt=false;
let race=null,runners=[],route=null,gateGroup=null,raf=0,last=0,startTime=0,elapsed=0,running=false,finished=false,finishOrder=[],snapshot='',fieldAbility=0;
const loader=new GLTFLoader();
const host=$('webglHost');
const TRACK_WIDTH=30,TRACK_LENGTH=1000,FINISH_X=205,START_X=FINISH_X-TRACK_LENGTH,PARDO_JOIN_X=START_X+400;
const BOTTOM_Z=-95.49296,TRACK_START_EXTENSION=START_X-260,TRACK_END_EXTENSION=FINISH_X+35;
const RAIL_OFFSET=TRACK_WIDTH/2+2,RAIL_Z_INNER=BOTTOM_Z-RAIL_OFFSET,RAIL_Z_OUTER=BOTTOM_Z+RAIL_OFFSET;
const LONG_START_TARGETS={1400:new THREE.Vector3(-65,0,BOTTOM_Z-192),1600:new THREE.Vector3(135,0,BOTTOM_Z-191)};

function createGrassTexture(base='#315f2f'){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,256,256);for(let i=0;i<6000;i++){const px=Math.random()*256,py=Math.random()*256,g=48+Math.floor(Math.random()*48),r=12+Math.floor(Math.random()*18),b=12+Math.floor(Math.random()*18),a=.05+Math.random()*.16;x.fillStyle=`rgba(${r},${g},${b},${a})`;x.fillRect(px,py,1,1);}for(let i=0;i<650;i++){const px=Math.random()*256,py=Math.random()*256,h=1+Math.random()*4;x.strokeStyle=`rgba(68,105,52,${.11+Math.random()*.15})`;x.lineWidth=.45;x.beginPath();x.moveTo(px,py);x.lineTo(px+(Math.random()-.5),py-h);x.stroke();}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;}
function createDirtTexture(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#9b8060';x.fillRect(0,0,256,256);for(let i=0;i<5000;i++){const px=Math.random()*256,py=Math.random()*256,r=105+Math.floor(Math.random()*45),g=82+Math.floor(Math.random()*38),b=55+Math.floor(Math.random()*28),a=.06+Math.random()*.15;x.fillStyle=`rgba(${r},${g},${b},${a})`;x.fillRect(px,py,1,1);}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;}

function mainCourseControlPoints(){return [
  [TRACK_END_EXTENSION,BOTTOM_Z],[258,BOTTOM_Z-2],[274,BOTTOM_Z-9],[287,BOTTOM_Z-21],[297,BOTTOM_Z-39],[303,BOTTOM_Z-62],[304,BOTTOM_Z-88],[299,BOTTOM_Z-115],[289,BOTTOM_Z-137],[274,BOTTOM_Z-157],[253,BOTTOM_Z-173],[225,BOTTOM_Z-184],[185,BOTTOM_Z-190],[110,BOTTOM_Z-192],[20,BOTTOM_Z-192],[-70,BOTTOM_Z-192],[-160,BOTTOM_Z-192],[-250,BOTTOM_Z-192],[-320,BOTTOM_Z-190],[-365,BOTTOM_Z-184],[-398,BOTTOM_Z-174],[-425,BOTTOM_Z-158],[-445,BOTTOM_Z-137],[-457,BOTTOM_Z-112],[-460,BOTTOM_Z-85],[-455,BOTTOM_Z-61],[-444,BOTTOM_Z-40],[-430,BOTTOM_Z-23],[-414,BOTTOM_Z-11],[PARDO_JOIN_X-8,BOTTOM_Z-3],[PARDO_JOIN_X,BOTTOM_Z],[PARDO_JOIN_X+30,BOTTOM_Z],[PARDO_JOIN_X+55,BOTTOM_Z]
].map(([x,z])=>new THREE.Vector3(x,.02,z));}
const mainCourseCurve=new THREE.CatmullRomCurve3(mainCourseControlPoints(),false,'centripetal',.5);
const mainCourseLength=mainCourseCurve.getLength();
function findClosestU(curve,target,samples=1400){let best=0,dist=Infinity;for(let i=0;i<=samples;i++){const u=i/samples,d=curve.getPointAt(u).distanceToSquared(target);if(d<dist){dist=d;best=u;}}return best;}
const PARDO_JOIN_U=findClosestU(mainCourseCurve,new THREE.Vector3(PARDO_JOIN_X,0,BOTTOM_Z));
const LONG_START_U={1400:findClosestU(mainCourseCurve,LONG_START_TARGETS[1400]),1600:findClosestU(mainCourseCurve,LONG_START_TARGETS[1600])};

function createTrackRibbon(curve,width,material){const seg=300,pos=[],uv=[],ind=[],p=new THREE.Vector3(),tan=new THREE.Vector3(),side=new THREE.Vector3();for(let i=0;i<=seg;i++){const u=i/seg;p.copy(curve.getPointAt(u));tan.copy(curve.getTangentAt(u)).normalize();side.set(tan.z,0,-tan.x).normalize();const l=p.clone().addScaledVector(side,width/2),r=p.clone().addScaledVector(side,-width/2);pos.push(l.x,.015,l.z,r.x,.015,r.z);const tu=u*Math.max(1,mainCourseLength/20);uv.push(tu,0,tu,4);}for(let i=0;i<seg;i++){const a=i*2,b=a+1,c=a+2,d=a+3;ind.push(a,c,b,c,d,b);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ind);g.computeVertexNormals();return new THREE.Mesh(g,material);}

function createStraightRailSection(x1,x2,z,mat){if(x2<=x1)return;const group=new THREE.Group(),len=x2-x1,geom=new THREE.CylinderGeometry(.06,.06,len,4);for(const y of [.44,.94]){const beam=new THREE.Mesh(geom,mat);beam.rotation.z=Math.PI/2;beam.position.set((x1+x2)/2,y,z);group.add(beam);}for(let x=x1;x<=x2;x+=12){const post=new THREE.Mesh(new THREE.BoxGeometry(.15,1.08,.15),mat);post.position.set(x,.54,z);group.add(post);}scene.add(group);}
function createOffsetRailCurve(offset,startU,endU,mat){if(endU<=startU)return;for(const y of [.44,.94]){const pts=[];for(let i=0;i<=140;i++){const u=THREE.MathUtils.lerp(startU,endU,i/140),p=mainCourseCurve.getPointAt(u),t=mainCourseCurve.getTangentAt(u).normalize(),s=new THREE.Vector3(t.z,0,-t.x).normalize();pts.push(p.clone().addScaledVector(s,offset).setY(y));}scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,false,'centripetal'),140,.06,4,false),mat));}const visible=mainCourseLength*(endU-startU),count=Math.max(2,Math.floor(visible/12));for(let i=0;i<=count;i++){const u=THREE.MathUtils.lerp(startU,endU,i/count),p=mainCourseCurve.getPointAt(u),t=mainCourseCurve.getTangentAt(u).normalize(),s=new THREE.Vector3(t.z,0,-t.x).normalize();p.addScaledVector(s,offset);const post=new THREE.Mesh(new THREE.BoxGeometry(.15,1.08,.15),mat);post.position.set(p.x,.54,p.z);scene.add(post);}}

function markerTexture(text){const c=document.createElement('canvas');c.width=160;c.height=256;const x=c.getContext('2d');x.fillStyle='#f5f5f2';x.fillRect(0,0,160,256);x.strokeStyle='#202020';x.lineWidth=6;x.strokeRect(3,3,154,250);x.fillStyle='#111';x.textAlign='center';x.textBaseline='middle';x.font='bold 64px Arial';x.fillText(text,80,128);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function createDistanceMarker(x,text){const g=new THREE.Group(),mat=new THREE.MeshLambertMaterial({color:0xf2f2ed});const post=new THREE.Mesh(new THREE.BoxGeometry(.10,1.45,.10),mat);post.position.y=.725;g.add(post);const board=new THREE.Mesh(new THREE.PlaneGeometry(.70,1),new THREE.MeshBasicMaterial({map:markerTexture(text),side:THREE.DoubleSide}));board.position.y=1.34;g.add(board);g.position.set(x,0,RAIL_Z_INNER-1.15);scene.add(g);}
function finishTextTexture(){const c=document.createElement('canvas');c.width=768;c.height=270;const x=c.getContext('2d');x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';x.font='bold 54px Arial';x.fillText('HIPÓDROMO DE LA',384,84);x.font='bold 80px Arial';x.fillText('ZARZUELA',384,162);x.font='bold 27px Arial';x.fillText('MADRID',384,225);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function createFinishHorseshoe(){const group=new THREE.Group(),black=new THREE.MeshLambertMaterial({color:0x111214}),white=new THREE.MeshLambertMaterial({color:0xffffff}),green=new THREE.MeshLambertMaterial({color:0x0b6c50}),fx=FINISH_X+.10,fz=RAIL_Z_INNER-.82;const pts=[[-4.7,.1],[-4.7,2.1],[-4.2,3.55],[-3.1,4.85],[-1.55,5.7],[0,6],[1.55,5.7],[3.1,4.85],[4.2,3.55],[4.7,2.1],[4.7,.1]].map(([x,y])=>new THREE.Vector3(fx+x,y,fz));group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,false,'centripetal'),44,.58,7,false),black));const inner=[[-3.75,.75],[-3.72,2.3],[-3.15,3.52],[-2.05,4.48],[-.85,4.98],[0,5.08],[.85,4.98],[2.05,4.48],[3.15,3.52],[3.72,2.3],[3.75,.75]].map(([x,y])=>new THREE.Vector3(fx+x,y,fz-.42));group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(inner,false,'centripetal'),34,.045,4,false),white));const logo=new THREE.Mesh(new THREE.PlaneGeometry(3.15,1.10),new THREE.MeshBasicMaterial({map:finishTextTexture(),transparent:true,side:THREE.DoubleSide,depthWrite:false}));logo.position.set(fx,5.43,fz-.68);group.add(logo);const lp=new THREE.Mesh(new THREE.BoxGeometry(.1,2.35,.1),green);lp.position.set(fx-.27,1.18,fz+.12);group.add(lp);const rp=lp.clone();rp.position.x=fx+.27;group.add(rp);const top=new THREE.Mesh(new THREE.BoxGeometry(.66,.1,.1),green);top.position.set(fx,2.3,fz+.12);group.add(top);const base=new THREE.Mesh(new THREE.BoxGeometry(3.05,.82,.92),black);base.position.set(fx,.41,fz-.02);group.add(base);scene.add(group);}

function createGrandstand(){const g=new THREE.Group();g.position.set(60,0,BOTTOM_Z+72);const concrete=new THREE.MeshLambertMaterial({color:0xdad8d0}),dark=new THREE.MeshLambertMaterial({color:0x4b504d}),seat=new THREE.MeshLambertMaterial({color:0x65716b});for(let m=-2;m<=1;m++){const bx=m*76;for(let i=0;i<8;i++){const step=new THREE.Mesh(new THREE.BoxGeometry(70,1.1,4.6),seat);step.position.set(bx,.55+i*.82,i*3.8);g.add(step);}const back=new THREE.Mesh(new THREE.BoxGeometry(72,15,2),concrete);back.position.set(bx,8,31);g.add(back);const roof=new THREE.Mesh(new THREE.BoxGeometry(76,.7,25),concrete);roof.position.set(bx,18,22);roof.rotation.x=.12;g.add(roof);for(let c=-2;c<=2;c++){const support=new THREE.Mesh(new THREE.CylinderGeometry(.28,.4,16,10),dark);support.position.set(bx+c*14,9,30);support.rotation.z=.12;g.add(support);}}scene.add(g);}

function createTree(x,z,scale=1){
  const g=new THREE.Group();
  const trunkMat=new THREE.MeshLambertMaterial({color:0x6b4b31});
  const darkLeaf=new THREE.MeshLambertMaterial({color:0x235c35});
  const lightLeaf=new THREE.MeshLambertMaterial({color:0x347743});
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.28*scale,.42*scale,3.8*scale,7),trunkMat);
  trunk.position.y=1.9*scale;g.add(trunk);
  [[0,5.0,0,2.1,darkLeaf],[1.15,4.15,.35,1.45,lightLeaf],[-1.1,4.2,-.3,1.5,darkLeaf],[.25,6.0,-.15,1.25,lightLeaf]].forEach(v=>{
    const crown=new THREE.Mesh(new THREE.SphereGeometry(v[3]*scale,12,9),v[4]);
    crown.position.set(v[0]*scale,v[1]*scale,v[2]*scale);g.add(crown);
  });
  g.position.set(x,0,z);scene.add(g);
}
function addOppositeStraightTrees(){
  for(let i=0;i<21;i++)createTree(-570+i*55,BOTTOM_Z-350+(i%2)*9,1.55+(i%3)*.12);
  for(let i=0;i<18;i++)createTree(-535+i*64,BOTTOM_Z-398+(i%2)*8,1.42+((i+1)%3)*.11);
  for(let i=0;i<11;i++)createTree(-565-(i%2)*13,BOTTOM_Z-115-i*25,1.48+(i%3)*.1);
}
function addInnerSandCourse(dirt){
  const sandMat=new THREE.MeshLambertMaterial({map:dirt,color:0xc2ad8b,side:THREE.DoubleSide});
  const ring=new THREE.Mesh(new THREE.RingGeometry(25,35,128,1),sandMat);
  ring.rotation.x=-Math.PI/2;
  ring.scale.set(3.65,1.05,1);
  ring.position.set(-82,.012,BOTTOM_Z-98);
  scene.add(ring);
}
function buildWorld(){if(worldBuilt)return;worldBuilt=true;const dirt=createDirtTexture();dirt.repeat.set(8,3);const groundGrass=createGrassTexture('#376d38');groundGrass.repeat.set(70,48);const ground=new THREE.Mesh(new THREE.PlaneGeometry(2600,1800),new THREE.MeshLambertMaterial({map:groundGrass}));ground.rotation.x=-Math.PI/2;ground.position.y=-.05;scene.add(ground);const grass=createGrassTexture();grass.repeat.set(52,4);const trackMat=new THREE.MeshLambertMaterial({map:grass,color:0xffffff,side:THREE.DoubleSide});const straight=new THREE.Mesh(new THREE.PlaneGeometry(TRACK_END_EXTENSION-TRACK_START_EXTENSION,TRACK_WIDTH),trackMat);straight.rotation.x=-Math.PI/2;straight.position.set((TRACK_START_EXTENSION+TRACK_END_EXTENSION)/2,0,BOTTOM_Z);scene.add(straight);scene.add(createTrackRibbon(mainCourseCurve,TRACK_WIDTH,trackMat));const railMat=new THREE.MeshLambertMaterial({color:0xf4f4f1});addInnerSandCourse(dirt);createStraightRailSection(TRACK_START_EXTENSION,TRACK_END_EXTENSION,RAIL_Z_OUTER,railMat);createStraightRailSection(TRACK_START_EXTENSION,PARDO_JOIN_X-48,RAIL_Z_INNER,railMat);createStraightRailSection(PARDO_JOIN_X+20,TRACK_END_EXTENSION,RAIL_Z_INNER,railMat);createOffsetRailCurve(RAIL_OFFSET,.002,Math.min(1,PARDO_JOIN_U+.012),railMat);createOffsetRailCurve(-RAIL_OFFSET,.002,Math.max(.002,PARDO_JOIN_U-.05),railMat);for(const d of [600,500,400,300,200,100])createDistanceMarker(FINISH_X-d,String(d));createFinishHorseshoe();createGrandstand();addOppositeStraightTrees();}

// ============================================================
// RUTAS: misma pista, ampliadas a todas las distancias del juego
// ============================================================
class RaceRoute{constructor(points){this.points=points;this.lengths=[];this.cumulative=[0];this.totalLength=0;for(let i=0;i<points.length-1;i++){const l=points[i].distanceTo(points[i+1]);this.lengths.push(l);this.totalLength+=l;this.cumulative.push(this.totalLength);}}getPointAtFraction(f){const wanted=THREE.MathUtils.clamp(f,0,1)*this.totalLength;let lo=0,hi=this.lengths.length-1,idx=hi;while(lo<=hi){const mid=(lo+hi)>>1;if(this.cumulative[mid+1]>=wanted){idx=mid;hi=mid-1;}else lo=mid+1;}const start=this.cumulative[idx],len=this.lengths[idx]||1,local=THREE.MathUtils.clamp((wanted-start)/len,0,1);return new THREE.Vector3().lerpVectors(this.points[idx],this.points[idx+1],local);}getTangentAtFraction(f){const a=this.getPointAtFraction(Math.max(0,f-.001)),b=this.getPointAtFraction(Math.min(1,f+.001));return b.sub(a).normalize();}}
function sampleCurveSegment(curve,u0,u1,count,pts){for(let i=0;i<=count;i++)pts.push(curve.getPointAt(THREE.MathUtils.lerp(u0,u1,i/count)).setY(.7));}
function sampleLine(x0,z0,x1,z1,count,pts){for(let i=0;i<=count;i++){const t=i/count;pts.push(new THREE.Vector3(THREE.MathUtils.lerp(x0,x1,t),.7,THREE.MathUtils.lerp(z0,z1,t)));}}
function buildOriginalShortRoute(d){const pts=[];if(d<=1200){sampleLine(FINISH_X-d,BOTTOM_Z,FINISH_X,BOTTOM_Z,180,pts);return new RaceRoute(pts);}const startU=d<=1400?LONG_START_U[1400]:LONG_START_U[1600];sampleCurveSegment(mainCourseCurve,startU,PARDO_JOIN_U,240,pts);sampleLine(PARDO_JOIN_X,BOTTOM_Z,FINISH_X,BOTTOM_Z,160,pts);return new RaceRoute(pts);}
function buildClosedLapSamples(){const pts=[];sampleLine(FINISH_X,BOTTOM_Z,TRACK_END_EXTENSION,BOTTOM_Z,20,pts);sampleCurveSegment(mainCourseCurve,0,PARDO_JOIN_U,500,pts);sampleLine(PARDO_JOIN_X,BOTTOM_Z,FINISH_X,BOTTOM_Z,180,pts);return pts;}
const CLOSED_LAP=buildClosedLapSamples();
const CLOSED_LAP_ROUTE=new RaceRoute(CLOSED_LAP);
function buildMidLongRoute(d){
  const nominalLap=1800,loops=Math.ceil(d/nominalLap),startNominal=Math.max(0,loops*nominalLap-d);
  const wanted=THREE.MathUtils.clamp(startNominal/nominalLap,0,.999)*CLOSED_LAP_ROUTE.totalLength;
  let lo=0,hi=CLOSED_LAP_ROUTE.cumulative.length-1;
  while(lo<hi){const mid=(lo+hi)>>1;if(CLOSED_LAP_ROUTE.cumulative[mid]<wanted)lo=mid+1;else hi=mid;}
  const startIndex=Math.max(0,lo-1),pts=[];
  for(let i=startIndex;i<CLOSED_LAP.length;i++)pts.push(CLOSED_LAP[i].clone());
  for(let l=1;l<loops;l++)for(let i=1;i<CLOSED_LAP.length;i++)pts.push(CLOSED_LAP[i].clone());
  return new RaceRoute(pts);
}
function classicLongStartX(d){
  if(d>=3000)return FINISH_X-930;
  if(d>=2800)return FINISH_X-860;
  if(d>=2500)return FINISH_X-760;
  return FINISH_X-700;
}
function buildClassicLongRoute(d){
  const startX=classicLongStartX(d),pts=[];
  sampleLine(startX,BOTTOM_Z,FINISH_X,BOTTOM_Z,Math.max(160,Math.round((FINISH_X-startX)/3)),pts);
  for(let i=1;i<CLOSED_LAP.length;i++)pts.push(CLOSED_LAP[i].clone());
  return new RaceRoute(pts);
}
function buildRoute(d){
  if(d<=1600)return buildOriginalShortRoute(d);
  if(d>=2400)return buildClassicLongRoute(d);
  return buildMidLongRoute(d);
}

async function loadRaceHorseGLB(){
  const urls=Array.from({length:11},(_,i)=>`./assets/horse_jockey_web/part_${String(i).padStart(2,'0')}.txt`);
  $('loadText').textContent='Cargando caballo y jockey realistas…';
  const chunks=await Promise.all(urls.map(async url=>{
    const r=await fetch(url,{cache:'force-cache'});
    if(!r.ok)throw new Error(`No se pudo cargar ${url}`);
    return (await r.text()).trim();
  }));
  const raw=atob(chunks.join(''));
  const bytes=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
  return await new Promise((resolve,reject)=>loader.parse(bytes.buffer,'',resolve,reject));
}
async function init3D(){if(renderer)return;scene=new THREE.Scene();scene.background=new THREE.Color(0x8fc7e8);camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,3000);camera.position.set(0,7,25);renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance',alpha:false,stencil:false,depth:true,preserveDrawingBuffer:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,.9));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=false;host.innerHTML='';host.appendChild(renderer.domElement);orbitControls=new OrbitControls(camera,renderer.domElement);orbitControls.enabled=false;orbitControls.enableDamping=true;orbitControls.dampingFactor=.08;orbitControls.minDistance=3;orbitControls.maxDistance=220;orbitControls.maxPolarAngle=Math.PI*.48;scene.add(new THREE.HemisphereLight(0xffffff,0x667755,2.25));const sun=new THREE.DirectionalLight(0xffffff,2.65);sun.position.set(100,180,80);scene.add(sun);buildWorld();const gltf=await loadRaceHorseGLB();horseTemplate=gltf.scene;horseClips=Object.fromEntries(gltf.animations.map(c=>[c.name,c]));if(!horseClips['horse.gallop'])throw new Error('El GLB no contiene horse.gallop');$('loadOverlay').classList.add('hidden');addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});}

function assignJockeys(field){const used=new Set();return field.map((h,i)=>{let jockey=h.preferredJockey;if(used.has(jockey))jockey=JOCKEYS.find(j=>!used.has(j))||jockey;used.add(jockey);return {...h,assignedJockey:jockey,raceNumber:i+1};});}
function drawStar(ctx,cx,cy,o,inn,n=5){let r=-Math.PI/2,step=Math.PI/n;ctx.beginPath();for(let i=0;i<n*2;i++){const rad=i%2===0?o:inn,x=cx+Math.cos(r)*rad,y=cy+Math.sin(r)*rad;i?ctx.lineTo(x,y):ctx.moveTo(x,y);r+=step;}ctx.closePath();ctx.fill();}
function silkTexture(h){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=h.silk;x.fillRect(0,0,256,256);x.fillStyle=h.accent;if(h.pattern==='stars')[[50,55],[160,50],[105,125],[195,150],[55,200],[160,210]].forEach(p=>drawStar(x,p[0],p[1],22,9));else if(h.pattern==='cross'){x.save();x.translate(128,128);x.rotate(-Math.PI/4);x.fillRect(-18,-190,36,380);x.rotate(Math.PI/2);x.fillRect(-18,-190,36,380);x.restore();}else if(h.pattern==='quarters'){x.fillRect(0,0,128,128);x.fillRect(128,128,128,128);}else if(h.pattern==='diagonal'){x.save();x.translate(128,128);x.rotate(-Math.PI/4);x.fillRect(-25,-190,50,380);x.restore();}else x.fillRect(0,105,256,46);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function numberTexture(n){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#0b0b0b';x.fillRect(0,0,256,256);x.strokeStyle='#2e2e2e';x.lineWidth=10;x.strokeRect(6,6,244,244);x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';x.font='bold 176px Arial';x.fillText(String(n),128,140);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function createJockey(h,scale){const g=new THREE.Group(),silk=new THREE.MeshLambertMaterial({map:silkTexture(h)}),accent=new THREE.MeshLambertMaterial({color:h.accent}),skin=new THREE.MeshLambertMaterial({color:0xb98267}),white=new THREE.MeshLambertMaterial({color:0xffffff}),black=new THREE.MeshLambertMaterial({color:0x151719});const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.16,.38,5,10),silk);torso.position.set(0,.82,0);torso.rotation.x=-.73;g.add(torso);const head=new THREE.Mesh(new THREE.SphereGeometry(.11,12,10),skin);head.position.set(0,1.08,.18);g.add(head);const cap=new THREE.Mesh(new THREE.SphereGeometry(.13,12,8,0,Math.PI*2,0,Math.PI*.62),accent);cap.position.set(0,1.16,.18);g.add(cap);for(const s of [-1,1]){const thigh=new THREE.Mesh(new THREE.CapsuleGeometry(.045,.3,4,8),white);thigh.position.set(s*.12,.57,0);thigh.rotation.z=s*.38;thigh.rotation.x=.75;g.add(thigh);const boot=new THREE.Mesh(new THREE.CapsuleGeometry(.038,.27,4,8),black);boot.position.set(s*.17,.36,.15);boot.rotation.x=1.02;g.add(boot);const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.038,.28,4,8),silk.clone());arm.position.set(s*.11,.78,.23);arm.rotation.x=-1.02;arm.rotation.z=s*.18;g.add(arm);}g.scale.setScalar(scale);return g;}
function createMantilla(h,w,height,length){const g=new THREE.Group(),mat=new THREE.MeshLambertMaterial({map:numberTexture(h.raceNumber),side:THREE.DoubleSide}),pw=Math.max(.36,length*.22),ph=Math.max(.3,height*.25);for(const s of [-1,1]){const p=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph),mat.clone());p.position.x=s*w*.50;p.rotation.y=s>0?-Math.PI/2:Math.PI/2;g.add(p);}return g;}
function setMaterialColor(material,color){if(!material)return;const mats=Array.isArray(material)?material:[material];for(const mat of mats){if(mat.color)mat.color.set(color);mat.needsUpdate=true;}}
function addRaceNumberToSaddle(root,model,h){
  const saddlePad=model.getObjectByName('saddle.pad');
  if(!saddlePad)return;
  model.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(saddlePad),size=new THREE.Vector3(),center=new THREE.Vector3();
  box.getSize(size);box.getCenter(center);
  const mat=new THREE.MeshBasicMaterial({map:numberTexture(h.raceNumber),side:THREE.DoubleSide});
  const w=Math.max(.42,size.z*.86),hh=Math.max(.38,size.y*.86);
  const sideX=Math.max(Math.abs(box.min.x),Math.abs(box.max.x))+.015;
  for(const side of [-1,1]){
    const plate=new THREE.Mesh(new THREE.PlaneGeometry(w,hh),mat.clone());
    plate.position.set(side*sideX,center.y,center.z);
    plate.rotation.y=side>0?-Math.PI/2:Math.PI/2;
    root.add(plate);
  }
}
function makeRunner(h){
  const root=new THREE.Group(),model=SkeletonUtils.clone(horseTemplate);
  root.add(model);
  model.traverse(o=>{
    if(!o.isMesh)return;
    if(o.material)o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone();
    const mats=Array.isArray(o.material)?o.material:[o.material];
    for(const mat of mats){
      const name=(mat?.name||'').toLowerCase();
      if(name.includes('horse.body.pattern')){setMaterialColor(mat,h.coat);mat.map=null;mat.normalMap=null;mat.roughnessMap=null;mat.metalnessMap=null;mat.roughness=.9;mat.metalness=0;mat.needsUpdate=true;}
      else if(name.includes('jockey_silk_main')||name.includes('jockey_silk_primary'))setMaterialColor(mat,h.silk);
      else if(name.includes('jockey_silk_secondary'))setMaterialColor(mat,h.accent);
      else if(name.includes('jockey_boot'))setMaterialColor(mat,0x171717);
      else if(name.includes('jockey_breeches')||name.includes('jockey_pants'))setMaterialColor(mat,0xf5f5f2);
      else if(name==='saddlecloth')setMaterialColor(mat,0x111111);
    }
  });
  model.rotation.y=0;
  model.updateMatrixWorld(true);
  let box=new THREE.Box3().setFromObject(model),center=new THREE.Vector3();
  box.getCenter(center);
  model.position.x-=center.x;
  model.position.z-=center.z;
  model.position.y-=box.min.y;
  model.updateMatrixWorld(true);
  box=new THREE.Box3().setFromObject(model);
  const size=new THREE.Vector3();box.getSize(size);
  addRaceNumberToSaddle(root,model,h);
  const mixer=new THREE.AnimationMixer(model),actions=[];
  const gallop=mixer.clipAction(horseClips['horse.gallop']);gallop.reset().play();actions.push(gallop);
  for(const name of ['JOCKEY_ChestAction','JOCKEY_HeadAction','JOCKEY_HelmetAction','JOCKEY_HelmetVisorAction','JOCKEY_LeftKneeAction','JOCKEY_RightKneeAction','JOCKEY_TorsoAction']){
    const clip=horseClips[name];
    if(clip){const a=mixer.clipAction(clip);a.reset().play();actions.push(a);}
  }
  return {root,model,jockey:model.getObjectByName('RACING_JOCKEY_ROOT'),jockeyY:0,mixer,action:gallop,actions,height:size.y};
}

// ============================================================
// CAJONES: visibles antes de la salida y alineados con cada caballo
// ============================================================
function clearGates(){if(gateGroup){scene.remove(gateGroup);gateGroup=null;}}
function gateNumberTexture(n){const c=document.createElement('canvas');c.width=128;c.height=128;const x=c.getContext('2d');x.fillStyle='#24577b';x.fillRect(0,0,128,128);x.fillStyle='#fff';x.font='bold 76px Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),64,70);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function createStartingGates(count){clearGates();gateGroup=new THREE.Group();gateGroup.userData.doors=[];const p=route.getPointAtFraction(0),tan=route.getTangentAtFraction(0),side=new THREE.Vector3(-tan.z,0,tan.x).normalize(),spacing=Math.min(2.25,(TRACK_WIDTH-2)/count),steel=new THREE.MeshLambertMaterial({color:0xd6d7d5}),blue=new THREE.MeshLambertMaterial({color:0x285d82});for(let i=0;i<count;i++){const stall=new THREE.Group(),off=(i-(count-1)/2)*spacing;stall.position.copy(p).addScaledVector(side,off).addScaledVector(tan,-1.1);stall.rotation.y=Math.atan2(tan.x,tan.z);for(const x of [-.95,.95]){for(const z of [-1.7,1.7]){const post=new THREE.Mesh(new THREE.BoxGeometry(.09,3.05,.09),steel);post.position.set(x,1.52,z);stall.add(post);}for(let y=.45;y<2.9;y+=.5){const bar=new THREE.Mesh(new THREE.BoxGeometry(.08,.07,3.4),steel);bar.position.set(x,y,0);stall.add(bar);}}const top=new THREE.Mesh(new THREE.BoxGeometry(2.0,.18,3.5),blue);top.position.y=3.05;stall.add(top);const sign=new THREE.Mesh(new THREE.PlaneGeometry(.8,.8),new THREE.MeshBasicMaterial({map:gateNumberTexture(i+1),side:THREE.DoubleSide}));sign.position.set(0,3.28,-1.5);stall.add(sign);for(const s of [-1,1]){const pivot=new THREE.Group();pivot.position.set(s*.92,1.35,1.72);const door=new THREE.Mesh(new THREE.BoxGeometry(.85,2.6,.08),steel);door.position.x=-s*.42;pivot.add(door);stall.add(pivot);gateGroup.userData.doors.push({pivot,side:s});}gateGroup.add(stall);}gateGroup.userData.opening=false;gateGroup.userData.t=0;scene.add(gateGroup);}
function openGates(){if(gateGroup){gateGroup.userData.opening=true;gateGroup.userData.t=0;}}
function animateGates(dt){if(!gateGroup?.userData.opening)return;gateGroup.userData.t=Math.min(1,gateGroup.userData.t+dt*4);const e=1-Math.pow(1-gateGroup.userData.t,3);gateGroup.userData.doors.forEach(d=>d.pivot.rotation.y=d.side*e*1.25);if(gateGroup.userData.t>=1)gateGroup.visible=false;}

function placeRunner(r,gatePose=false){const fraction=THREE.MathUtils.clamp(r.distance/race.distance,0,1),p=route.getPointAtFraction(fraction),tan=route.getTangentAtFraction(fraction),side=new THREE.Vector3(-tan.z,0,tan.x).normalize();const target=p.clone().addScaledVector(side,r.lateral);if(gatePose)target.addScaledVector(tan,-1.25);target.y=.05;r.root.position.copy(target);r.root.rotation.y=Math.atan2(tan.x,tan.z);}

async function startRace(field,r){await init3D();cancelAnimationFrame(raf);runners.forEach(x=>{scene.remove(x.root);x.mixer.stopAllAction();});runners=[];clearGates();race=r;route=buildRoute(r.distance);running=false;finished=false;elapsed=0;finishOrder=[];snapshot='';state.raceSpeed=1;state.cameraMode=0;state.paused=false;if(orbitControls)orbitControls.enabled=false;$('speedBtn').textContent='x1';$('cameraBtn').textContent='Cámara TV';if($('pauseBtn')){$('pauseBtn').textContent='Pausa';$('pauseBtn').disabled=true;}if($('startRaceBtn')){$('startRaceBtn').classList.add('show');$('startRaceBtn').disabled=false;}$('countdown').textContent='';$('finishFlash').classList.remove('show');$('tvRaceTitle').textContent=r.name.toUpperCase();$('tvVenue').textContent=r.venue;$('commentary').textContent='Participantes cargados. Pulsa DAR LA SALIDA cuando quieras.';const assigned=assignJockeys(field);fieldAbility=assigned.reduce((s,h)=>s+ability(h,r.distance),0)/assigned.length;const spacing=Math.min(2.25,(TRACK_WIDTH-2)/assigned.length);assigned.forEach((h,i)=>{const rig=makeRunner(h),runner={...rig,horse:h,distance:0,speed:0,lateral:(i-(assigned.length-1)/2)*spacing,energy:1,finished:false,time:null,form:(Math.random()-.5)*.008,phase:Math.random()*6.28};scene.add(runner.root);placeRunner(runner,true);runners.push(runner);});createStartingGates(assigned.length);state.lastField=field;show('raceScreen');$('loadOverlay').classList.add('hidden');startTime=performance.now();last=performance.now();raf=requestAnimationFrame(loop);}

function targetSpeed(r){const d=race.distance,h=r.horse,progress=r.distance/d,remaining=d-r.distance,base=d<=1200?17.8:d<=1600?17.35:d<=2000?17.0:d<=2500?16.65:16.3;let factor=(1+(ability(h,d)-fieldAbility)*.00155)*(1+(distanceFit(h,d)-.98)*.62)*(1+r.form);if(progress<.12)factor*=.88+progress;const fatigue=progress*progress*Math.max(0,94-h.stamina)*.0007*(d>=2200?1.25:.7);factor-=fatigue;if(remaining<420)factor*=1+(1-remaining/420)*(h.accel-88)*.00112;factor*=1+Math.sin(elapsed*.9+r.phase)*.0016;const min=h.specialty==='sprinter'&&d>=2400?.90:.94;return base*THREE.MathUtils.clamp(factor,min,1.043);}
function loop(now){
  const dt=Math.min(.04,(now-last)/1000||.016);last=now;
  if(state.paused){
    if(orbitControls){orbitControls.enabled=true;orbitControls.update();}
    renderer.render(scene,camera);if(!finished)raf=requestAnimationFrame(loop);return;
  }else if(orbitControls){orbitControls.enabled=false;}
  if(!running){
    updateCamera(dt);updateRank();renderer.render(scene,camera);
    if(!finished)raf=requestAnimationFrame(loop);return;
  }
  animateGates(dt);
  elapsed+=dt*state.raceSpeed;
  if(gateGroup&&elapsed>1.6)clearGates();
  runners.forEach(r=>{
    if(r.finished)return;
    const ts=targetSpeed(r),resp=1-Math.exp(-(2.6+r.horse.accel*.01)*dt*state.raceSpeed);
    r.speed=THREE.MathUtils.lerp(r.speed,ts,resp);r.distance+=r.speed*dt*state.raceSpeed;
    if(r.distance>=race.distance){r.distance=race.distance;r.finished=true;r.time=elapsed;finishOrder.push(r);if(finishOrder.length===1){snapshot=renderer.domElement.toDataURL('image/jpeg',.82);$('finishFlash').classList.add('show');}}
    placeRunner(r);r.mixer.update(dt*state.raceSpeed*(.82+r.speed/20));
  });
  if(finishOrder.length===runners.length){finished=true;setTimeout(results,700);}
  updateCamera(dt);updateRank();renderer.render(scene,camera);if(!finished)raf=requestAnimationFrame(loop);
}
function sorted(){return [...runners].sort((a,b)=>b.distance-a.distance||(a.time??999)-(b.time??999));}
function updateRank(){if(!race||!runners.length)return;const s=sorted(),lead=s[0];$('metersLeft').textContent=`${Math.max(0,Math.ceil(race.distance-lead.distance)).toLocaleString('es-ES')} m`;$('rankingRows').innerHTML=s.map((r,i)=>`<div class="rank-row"><div class="rank-pos">${i+1}</div><div class="rank-name"><b>${r.horse.raceNumber}. ${r.horse.name}</b><span>${r.horse.assignedJockey}</span></div><div class="rank-gap">${i?`-${Math.max(0,lead.distance-r.distance).toFixed(1)} m`:'LÍDER'}</div></div>`).join('');if(race.distance-lead.distance<700)$('commentary').textContent=race.distance-lead.distance<250?'¡Últimos 250 metros! Se abre la lucha por la victoria.':'Entrando en la fase decisiva: el grupo se prepara para el remate.';}
function setCameraFov(v){if(Math.abs(camera.fov-v)>.1){camera.fov=v;camera.updateProjectionMatrix();}}
function packCenter(){
  const c=new THREE.Vector3();if(!runners.length)return c;
  runners.forEach(r=>c.add(r.root.position));return c.divideScalar(runners.length);
}
function updateCamera(dt){
  if(!runners.length)return;
  const s=sorted(),lead=s[0],center=packCenter();
  const f=THREE.MathUtils.clamp(lead.distance/race.distance,0,1),tan=route.getTangentAtFraction(f);
  const rawSide=new THREE.Vector3(tan.z,0,-tan.x).normalize();
  const infieldCenter=new THREE.Vector3(-82,0,BOTTOM_Z-98);
  const candidateA=center.clone().addScaledVector(rawSide,16);
  const candidateB=center.clone().addScaledVector(rawSide,-16);
  const insidePos=candidateA.distanceToSquared(infieldCenter)<candidateB.distanceToSquared(infieldCenter)?candidateA:candidateB;
  const insideDir=insidePos.clone().sub(center).normalize();
  const outsideDir=insideDir.clone().negate();
  const remaining=race.distance-lead.distance;
  let desired,target=center.clone();
  if(state.cameraMode===0){
    const final=remaining<500;setCameraFov(final?30:33);
    desired=center.clone().addScaledVector(outsideDir,final?19:24).addScaledVector(tan,final?15:20);
    desired.y=final?5.8:8.3;
    target=center.clone().addScaledVector(tan,final?-3:-5);target.y=1.9;
  }else if(state.cameraMode===1){
    setCameraFov(48);desired=center.clone();desired.y=72;target.y=0;
  }else if(state.cameraMode===2){
    setCameraFov(38);desired=insidePos.clone().addScaledVector(tan,-3);
    desired.y=4.7;target=center.clone().addScaledVector(tan,5);target.y=1.8;
  }else if(state.cameraMode===3){
    setCameraFov(33);desired=center.clone().addScaledVector(outsideDir,8).addScaledVector(tan,5);
    desired.y=3.2;target=center.clone().addScaledVector(tan,-2);target.y=1.7;
  }else{
    setCameraFov(30);desired=new THREE.Vector3(FINISH_X,4.8,BOTTOM_Z+43);target=new THREE.Vector3(FINISH_X,1.8,BOTTOM_Z);
  }
  camera.position.lerp(desired,1-Math.exp(-5.2*dt));camera.lookAt(target);
}
function createRaceMemoryCard(r,winnerHorse){
  const c=document.createElement('canvas');c.width=1200;c.height=430;const x=c.getContext('2d');
  const sky=x.createLinearGradient(0,0,0,430);sky.addColorStop(0,'#85bfdc');sky.addColorStop(.55,'#c9bd8d');sky.addColorStop(1,'#245f3c');x.fillStyle=sky;x.fillRect(0,0,1200,430);
  x.fillStyle='#2b7147';x.fillRect(0,255,1200,175);
  x.strokeStyle='rgba(255,255,255,.92)';x.lineWidth=6;x.beginPath();x.moveTo(0,305);x.bezierCurveTo(310,270,760,274,1200,320);x.stroke();
  x.strokeStyle='rgba(255,255,255,.65)';x.lineWidth=3;x.beginPath();x.moveTo(0,335);x.bezierCurveTo(310,300,760,304,1200,350);x.stroke();
  x.fillStyle='rgba(4,13,9,.66)';x.fillRect(0,0,1200,430);
  x.fillStyle='#dfbf74';x.font='900 24px Arial';x.fillText('ZARZUELA RACING · GRAN PREMIO',52,61);
  x.fillStyle='#fff';x.font='900 52px Georgia';x.fillText(r.name.toUpperCase(),52,126);
  x.fillStyle='#d7e1da';x.font='600 24px Arial';x.fillText(r.distance.toLocaleString('es-ES')+' m · '+r.venue,52,172);
  x.fillStyle='#dfbf74';x.font='900 21px Arial';x.fillText('GANADOR',52,274);
  x.fillStyle='#fff';x.font='900 48px Georgia';x.fillText(winnerHorse?.name||'',52,328);
  x.fillStyle='#d7e1da';x.font='600 21px Arial';x.fillText(winnerHorse?.assignedJockey||'',52,362);
  return c.toDataURL('image/jpeg',.9);
}
function results(){
  const rr=[...finishOrder],winner=rr[0]?.time||0;
  $('resultTitle').textContent=race.name;
  $('resultSubtitle').textContent=race.distance.toLocaleString('es-ES')+' m · '+race.venue;
  $('photoFinish').src=snapshot;
  const panel=document.querySelector('.results-panel');
  let memory=$('raceMemory');
  if(!memory){memory=document.createElement('div');memory.id='raceMemory';panel.prepend(memory);}
  if(state.mode==='champ'){
    memory.style.cssText='height:170px;border-radius:16px;margin-bottom:14px;background-size:cover;background-position:center;border:1px solid rgba(255,255,255,.12);box-shadow:inset 0 -70px 80px rgba(0,0,0,.25)';
    memory.style.backgroundImage='url("'+createRaceMemoryCard(race,rr[0]?.horse)+'")';
    memory.style.display='block';
  }else{
    memory.style.display='none';
  }
  $('podium').innerHTML=rr.slice(0,3).map((r,i)=>`<div class="podium-card"><span>${i+1}º</span><b>${r.horse.raceNumber}. ${r.horse.name}</b><small>${r.horse.assignedJockey}</small></div>`).join('');
  $('classification').innerHTML=rr.map((r,i)=>`<div class="class-row"><strong>${i+1}º</strong><div><b>${r.horse.raceNumber}. ${r.horse.name}</b><br><span>${r.horse.stable}</span></div><span>${r.horse.assignedJockey}</span><b>${i?`+${(r.time-winner).toFixed(2)}s`:r.time.toFixed(2)+'s'}</b></div>`).join('');
  show('resultsScreen');
}

$('confirmBtn').onclick=()=>{const field=horses.filter(h=>state.selected.has(h.id));if(field.length>=6)startRace(field,currentRace());};
$('speedBtn').onclick=()=>{state.raceSpeed=state.raceSpeed===1?1.5:state.raceSpeed===1.5?2:1;$('speedBtn').textContent='x'+state.raceSpeed;};
if($('startRaceBtn'))$('startRaceBtn').onclick=()=>{if(running||finished)return;running=true;elapsed=0;last=performance.now();openGates();$('startRaceBtn').classList.remove('show');$('startRaceBtn').disabled=true;if($('pauseBtn'))$('pauseBtn').disabled=false;$('commentary').textContent='¡Se abren los cajones! Comienza la carrera.';};
$('cameraBtn').onclick=()=>{state.cameraMode=(state.cameraMode+1)%5;$('cameraBtn').textContent=['Cámara TV','Cámara aérea','Cámara rail','Cámara cercana','Cámara meta'][state.cameraMode];};
if($('pauseBtn'))$('pauseBtn').onclick=()=>{if(!running||finished)return;state.paused=!state.paused;if(orbitControls){orbitControls.enabled=state.paused;if(state.paused){orbitControls.target.copy(packCenter()).setY(1.8);orbitControls.update();}}$('pauseBtn').textContent=state.paused?'Reanudar':'Pausa';$('commentary').textContent=state.paused?'Carrera en pausa · puedes mover la cámara con ratón o dedo.':'Carrera reanudada.';};
$('exitRaceBtn').onclick=()=>{cancelAnimationFrame(raf);show('mainMenu');};
$('menuFromResults').onclick=()=>show('mainMenu');
$('repeatBtn').onclick=()=>startRace(state.lastField,currentRace());
$('anotherBtn').onclick=()=>show(state.mode==='champ'?'championshipMenu':'selectionScreen');

if($('trophiesBtn'))$('trophiesBtn').onclick=()=>show('trophiesScreen');
if($('trophiesBack'))$('trophiesBack').onclick=()=>show('mainMenu');
renderRaces();renderHorses();