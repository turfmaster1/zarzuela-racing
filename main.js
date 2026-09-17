import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as skeletonClone } from 'three/addons/utils/SkeletonUtils.js';

const $ = (id) => document.getElementById(id);
const screens = [...document.querySelectorAll('.screen')];
const show = (id) => {
  screens.forEach((screen) => screen.classList.toggle('active', screen.id === id));
  window.scrollTo(0, 0);
};

const SPECIALTY = {
  sprinter: { label: 'Sprinter', center: 1200, width: 360 },
  miler: { label: 'Miler', center: 1600, width: 430 },
  intermediate: { label: 'Intermedio', center: 2050, width: 520 },
  stayer: { label: 'Fondista', center: 2525, width: 700 }
};

const JOCKEYS = [
  'V. Janáček', 'R. Sousa', 'J. Gelabert', 'B. Fayos', 'A. Gutiérrez V.',
  'G. Trolley de Prévaux', 'J. L. Martínez', 'E. Corallo', 'J. Grosjean',
  'R. N. Valle', 'N. de Julián', 'I. Melgarejo', 'A. Werlé', 'C. Cadel',
  'J. Gómez', 'D. Sikorova', 'R. Ramos', 'J. L. Borrego'
];

const horses = [
  ['safaga','Safaga','Asoc. La Toledana–Becares','G. Trolley de Prévaux','intermediate',92,93,95,1900,2450,0x3b251c,'#090b0d','#36d0d4','cross'],
  ['estraunza','Estraunza','Becares','A. Gutiérrez V.','stayer',92,98,93,2250,2850,0x6e3824,'#ef7619','#1f55ad','diagonal'],
  ['sirjan','Sirjan','Cum Laude Racing','J. Gelabert','stayer',92,99,91,2300,3100,0x3c241d,'#17633f','#f7f7f2','band'],
  ['fortun','Fortun','La Toledana','B. Fayos','intermediate',94,94,92,1800,2450,0x60331f,'#101214','#39c8ca','cross'],
  ['entrecopas','Entre Copas','Cuadra África','J. L. Martínez','stayer',89,100,86,2400,4000,0xa8542d,'#aa2431','#f2d66a','band'],
  ['amedeo','Amedeo Modigliani','Yeguada Rocío','V. Janáček','miler',98,84,97,1450,1800,0x43271c,'#f5f5ef','#0d5c3d','stars'],
  ['frine','Friné','Duque de Alburquerque','J. Grosjean','stayer',94,97,94,2200,2700,0x6b3826,'#ededeb','#722338','band'],
  ['espoir','Espoir Avenir (FR)','Alain Maubert','E. Corallo','stayer',95,97,94,2300,2850,0x77706a,'#235a9d','#d53838','diagonal'],
  ['warofdance','War of Dance','Peques','R. N. Valle','stayer',94,96,93,2300,2650,0x4a2b21,'#f07b26','#12a4a4','quarters'],
  ['coetzee','Coetzee','Alex y Sofía','R. N. Valle','stayer',93,96,92,2300,2750,0x593326,'#203d87','#eadc61','band'],
  ['naranco','Naranco','Yeguada Rocío','V. Janáček','stayer',91,95,90,2200,2650,0x38251e,'#f5f5ef','#0d5c3d','stars'],
  ['tetuan','Tetuan','Yeguada Rocío','V. Janáček','stayer',90,96,89,2200,2850,0x2e201b,'#f5f5ef','#0d5c3d','stars'],
  ['shackleton','Shackleton','Yeguada Rocío','I. Melgarejo','stayer',90,97,87,2300,3000,0x573726,'#f5f5ef','#0d5c3d','stars'],
  ['pamplona','Pamplona','Yeguada Rocío','V. Janáček','stayer',91,95,90,2200,2850,0x503126,'#f5f5ef','#0d5c3d','stars'],
  ['ifnotnow','If Not Now','Yeguada Rocío','V. Janáček','intermediate',93,92,93,1850,2350,0x38231c,'#f5f5ef','#0d5c3d','stars'],
  ['thegame','The Game','Cielo de Madrid','R. Sousa','stayer',93,95,92,2150,2650,0x4c2e24,'#72c9d7','#11181a','quarters'],
  ['mediastorm','Media Storm','Best Horse','B. Fayos','stayer',92,96,90,2300,2750,0x6d3e2a,'#17307e','#ffffff','band'],
  ['elcaney','El Caney','Santa Bárbara','A. Gutiérrez V.','stayer',91,96,90,2250,2850,0x39241d,'#f2d64e','#168154','diagonal'],
  ['kingjungle','King of Jungle','Yeguada Rocío','V. Janáček','sprinter',99,78,99,1000,1400,0x44291e,'#f5f5ef','#0d5c3d','stars'],
  ['samedi','Samedi Rien','Yeguada Rocío','V. Janáček','miler',97,85,96,1400,1800,0x603627,'#f5f5ef','#0d5c3d','stars']
].map((x, i) => ({
  id:x[0], name:x[1], stable:x[2], preferredJockey:x[3], specialty:x[4],
  speed:x[5], stamina:x[6], accel:x[7], best:[x[8],x[9]], coat:x[10],
  silk:x[11], accent:x[12], pattern:x[13], catalogNumber:i+1
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
].map((x) => ({ id:x[0], name:x[1], distance:x[2], venue:x[3], favors:x[4] }));

const state = { mode:'free', selectedRace:null, selected:new Set(), lastField:[], raceSpeed:1, cameraMode:0 };

function distanceFit(h, d) {
  const s = SPECIALTY[h.specialty];
  const bell = Math.exp(-Math.pow((d - s.center) / s.width, 2));
  let fit = 0.945 + bell * 0.055;
  if (d >= h.best[0] && d <= h.best[1]) fit += 0.008;
  const gap = d < h.best[0] ? h.best[0] - d : d > h.best[1] ? d - h.best[1] : 0;
  fit -= Math.min(0.055, gap / 15000);
  if (h.specialty === 'sprinter' && d >= 2200) fit -= 0.035;
  if (h.specialty === 'stayer' && d <= 1400) fit -= 0.028;
  return THREE.MathUtils.clamp(fit, 0.88, 1.015);
}

function ability(h, d) {
  const long = THREE.MathUtils.clamp((d - 1200) / 1800, 0, 1);
  return h.speed * (0.48 - 0.12 * long) + h.stamina * (0.26 + 0.20 * long) + h.accel * 0.26;
}

function rating(h, d) { return ability(h, d) * distanceFit(h, d); }
function currentRace() {
  return state.mode === 'champ' ? state.selectedRace : {
    id:'free', name:'Carrera Libre', distance:+$('freeDistance').value,
    venue:'Hipódromo de La Zarzuela · Madrid', favors:'Variable'
  };
}

function silkPreview(h) {
  const bg = h.pattern === 'stars'
    ? `radial-gradient(circle at 30% 30%,${h.accent} 0 2px,transparent 2.5px),radial-gradient(circle at 72% 68%,${h.accent} 0 2px,transparent 2.5px),${h.silk}`
    : `linear-gradient(135deg,${h.silk} 0 43%,${h.accent} 44% 60%,${h.silk} 61%)`;
  return `<div style="width:30px;height:30px;border-radius:50%;border:2px solid ${h.accent};background:${bg}"></div>`;
}

function renderRaces() {
  $('raceGrid').innerHTML = races.map((r) => `<article class="race-card ${state.selectedRace?.id===r.id?'selected':''}" data-race="${r.id}"><div class="eyebrow">${r.distance.toLocaleString('es-ES')} m</div><h3>${r.name}</h3><p>${r.venue}</p><div class="race-meta"><span class="pill gold">Favorece ${r.favors}</span></div></article>`).join('');
  document.querySelectorAll('[data-race]').forEach((card) => card.onclick = () => {
    state.selectedRace = races.find((r) => r.id === card.dataset.race);
    $('chooseRaceBtn').disabled = false;
    renderRaces();
  });
}

function renderHorses() {
  const d = currentRace().distance;
  $('horseGrid').innerHTML = horses.map((h) => {
    const selected = state.selected.has(h.id);
    const fit = Math.round(distanceFit(h,d) * 100);
    return `<article class="horse-card ${selected?'selected':''}" data-horse="${h.id}"><div class="select-mark">${selected?'✓':'+'}</div><div style="display:flex;gap:10px;align-items:center">${silkPreview(h)}<div><div class="horse-number">Nº ${h.catalogNumber} · ${SPECIALTY[h.specialty].label}</div><h3>${h.name}</h3></div></div><div class="horse-sub">${h.stable}<br>${h.preferredJockey}</div><div class="fitbar"><span style="width:${Math.min(100,fit)}%"></span></div><div class="stats"><div>Velocidad<b>${h.speed}</b></div><div>Resistencia<b>${h.stamina}</b></div><div>Aceleración<b>${h.accel}</b></div></div></article>`;
  }).join('');
  document.querySelectorAll('[data-horse]').forEach((card) => card.onclick = () => {
    const id = card.dataset.horse;
    if (state.selected.has(id)) state.selected.delete(id);
    else if (state.selected.size < 12) state.selected.add(id);
    renderHorses();
  });
  renderSummary();
}

function renderSummary() {
  const r = currentRace();
  $('selectedCount').textContent = state.selected.size;
  $('confirmBtn').disabled = state.selected.size < 6;
  $('raceSummary').innerHTML = `<b>${r.name}</b><br>${r.distance.toLocaleString('es-ES')} m`;
  $('selectedList').innerHTML = horses.filter((h) => state.selected.has(h.id)).map((h) => `<div class="selected-item"><b>${h.catalogNumber}. ${h.name}</b><span>${SPECIALTY[h.specialty].label}</span></div>`).join('');
}

function openSelection(mode) {
  state.mode = mode;
  state.selected.clear();
  $('selectionModeLabel').textContent = mode === 'champ' ? 'Modo Campeonato' : 'Carrera Libre';
  $('freeDistanceControl').style.display = mode === 'free' ? 'flex' : 'none';
  renderHorses();
  show('selectionScreen');
}

$('freeBtn').onclick = () => openSelection('free');
$('champBtn').onclick = () => { state.mode='champ'; state.selectedRace=null; $('chooseRaceBtn').disabled=true; renderRaces(); show('championshipMenu'); };
$('chooseRaceBtn').onclick = () => openSelection('champ');
document.querySelectorAll('[data-go="mainMenu"]').forEach((b) => b.onclick = () => show('mainMenu'));
$('selectionBack').onclick = () => show(state.mode==='champ'?'championshipMenu':'mainMenu');
$('freeDistance').onchange = renderHorses;
$('randomBtn').onclick = () => { state.selected.clear(); [...horses].sort(()=>Math.random()-.5).slice(0,8).forEach((h)=>state.selected.add(h.id)); renderHorses(); };
$('bestBtn').onclick = () => { const d=currentRace().distance; state.selected.clear(); [...horses].sort((a,b)=>rating(b,d)-rating(a,d)).slice(0,10).forEach((h)=>state.selected.add(h.id)); renderHorses(); };

let scene, camera, renderer, horseTemplate, horseClip, worldBuilt=false, runners=[], race=null;
let currentRoute=null, gates=null, raf=0, last=0, startTime=0, elapsed=0, running=false, finished=false, finishOrder=[], snapshot='', fieldAbility=0;
const host = $('webglHost');
const loader = new GLTFLoader();
const TRACK_WIDTH=18, HALF_STRAIGHT=250;
const TRACK_RADIUS=(1600-4*HALF_STRAIGHT)/(2*Math.PI);
const LEFT_X=-HALF_STRAIGHT, RIGHT_X=HALF_STRAIGHT, BOTTOM_Z=-TRACK_RADIUS, TOP_Z=TRACK_RADIUS, FINISH_X=190;
const FINISH = new THREE.Vector3(FINISH_X, 0.02, BOTTOM_Z);
const EXTENSION_RIGHT=1620;

function sampleLine(points,a,b,samples=80){for(let i=0;i<=samples;i++){const t=i/samples;points.push(new THREE.Vector3(THREE.MathUtils.lerp(a.x,b.x,t),0.06,THREE.MathUtils.lerp(a.z,b.z,t)));}}
function sampleArc(points,cx,cz,r,start,end,samples=100){for(let i=0;i<=samples;i++){const t=i/samples,a=THREE.MathUtils.lerp(start,end,t);points.push(new THREE.Vector3(cx+Math.cos(a)*r,0.06,cz+Math.sin(a)*r));}}

class RaceRoute {
  constructor(points, exactDistance){this.points=points;this.exactDistance=exactDistance;this.cumulative=[0];for(let i=1;i<points.length;i++)this.cumulative.push(this.cumulative[i-1]+points[i].distanceTo(points[i-1]));this.rawLength=this.cumulative.at(-1);}
  getPoint(distance){const d=THREE.MathUtils.clamp(distance,0,this.rawLength);let lo=0,hi=this.cumulative.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(this.cumulative[mid]<d)lo=mid+1;else hi=mid;}const i=Math.max(1,lo),d1=this.cumulative[i-1],d2=this.cumulative[i],a=d2===d1?0:(d-d1)/(d2-d1);return new THREE.Vector3().lerpVectors(this.points[i-1],this.points[i],a);}
  getTangent(distance){const d1=Math.max(0,distance-1),d2=Math.min(this.rawLength,distance+1);return new THREE.Vector3().subVectors(this.getPoint(d2),this.getPoint(d1)).normalize();}
}

function buildRoute(distance){
  const pts=[];
  if(distance<=1200){sampleLine(pts,{x:FINISH_X+distance,z:BOTTOM_Z},{x:FINISH_X,z:BOTTOM_Z},220);return new RaceRoute(pts,distance);}
  if(distance<=1800){
    const start={x:LEFT_X+TRACK_RADIUS,z:0};
    const fixed=1.5*Math.PI*TRACK_RADIUS+(RIGHT_X-LEFT_X)+Math.PI*TRACK_RADIUS+(RIGHT_X-FINISH_X);
    const extra=Math.max(0,distance-fixed);
    sampleLine(pts,{x:start.x,z:start.z+extra},start,Math.max(30,Math.ceil(extra/3)));
    sampleArc(pts,LEFT_X,0,TRACK_RADIUS,0,-Math.PI/2,70);
    sampleArc(pts,LEFT_X,0,TRACK_RADIUS,-Math.PI/2,-1.5*Math.PI,130);
    sampleLine(pts,{x:LEFT_X,z:TOP_Z},{x:RIGHT_X,z:TOP_Z},130);
    sampleArc(pts,RIGHT_X,0,TRACK_RADIUS,Math.PI/2,-Math.PI/2,130);
    sampleLine(pts,{x:RIGHT_X,z:BOTTOM_Z},{x:FINISH_X,z:BOTTOM_Z},50);
    return new RaceRoute(pts,distance);
  }
  const extension=Math.max(0,distance-1660);
  sampleLine(pts,{x:RIGHT_X+extension,z:BOTTOM_Z},{x:RIGHT_X,z:BOTTOM_Z},Math.max(50,Math.ceil(extension/4)));
  sampleLine(pts,{x:RIGHT_X,z:BOTTOM_Z},{x:LEFT_X,z:BOTTOM_Z},130);
  sampleArc(pts,LEFT_X,0,TRACK_RADIUS,-Math.PI/2,Math.PI/2,130);
  sampleLine(pts,{x:LEFT_X,z:TOP_Z},{x:RIGHT_X,z:TOP_Z},130);
  sampleArc(pts,RIGHT_X,0,TRACK_RADIUS,Math.PI/2,-Math.PI/2,130);
  sampleLine(pts,{x:RIGHT_X,z:BOTTOM_Z},{x:FINISH_X,z:BOTTOM_Z},50);
  return new RaceRoute(pts,distance);
}

async function init3D(){
  if(renderer) return;
  scene=new THREE.Scene(); scene.background=new THREE.Color(0x98c8e2); scene.fog=new THREE.Fog(0x98c8e2,700,2500);
  camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,0.1,5000);
  renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.setSize(innerWidth,innerHeight); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  host.innerHTML=''; host.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff,0x476342,1.9));
  const sun=new THREE.DirectionalLight(0xfff5df,2.8);sun.position.set(-260,420,210);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-500;sun.shadow.camera.right=500;sun.shadow.camera.top=350;sun.shadow.camera.bottom=-350;scene.add(sun);
  buildWorld();
  $('loadText').textContent='Cargando caballos 3D y equipación…';
  await new Promise((resolve,reject)=>loader.load('https://threejs.org/examples/models/gltf/Horse.glb',(gltf)=>{horseTemplate=gltf.scene;horseClip=gltf.animations[0];resolve();},undefined,reject));
  $('loadOverlay').classList.add('hidden');
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
}

function stadiumLoopPoints(offset=0){
  const pts=[]; const r=TRACK_RADIUS+offset;
  for(let i=0;i<=90;i++){const t=i/90;pts.push(new THREE.Vector3(THREE.MathUtils.lerp(LEFT_X,RIGHT_X,t),0.55,BOTTOM_Z-offset));}
  for(let i=0;i<=80;i++){const a=THREE.MathUtils.lerp(-Math.PI/2,Math.PI/2,i/80);pts.push(new THREE.Vector3(RIGHT_X+Math.cos(a)*r,0.55,Math.sin(a)*r));}
  for(let i=0;i<=90;i++){const t=i/90;pts.push(new THREE.Vector3(THREE.MathUtils.lerp(RIGHT_X,LEFT_X,t),0.55,TOP_Z+offset));}
  for(let i=0;i<=80;i++){const a=THREE.MathUtils.lerp(Math.PI/2,Math.PI*1.5,i/80);pts.push(new THREE.Vector3(LEFT_X+Math.cos(a)*r,0.55,Math.sin(a)*r));}
  return pts;
}

function buildWorld(){
  if(worldBuilt)return; worldBuilt=true;
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(4200,2200),new THREE.MeshStandardMaterial({color:0x6f7f50,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-0.05;ground.receiveShadow=true;scene.add(ground);
  const shape=new THREE.Shape(); const outer=TRACK_RADIUS+TRACK_WIDTH/2, inner=TRACK_RADIUS-TRACK_WIDTH/2;
  shape.moveTo(LEFT_X,-outer);shape.lineTo(RIGHT_X,-outer);shape.absarc(RIGHT_X,0,outer,-Math.PI/2,Math.PI/2,false);shape.lineTo(LEFT_X,outer);shape.absarc(LEFT_X,0,outer,Math.PI/2,Math.PI*1.5,false);
  const hole=new THREE.Path();hole.moveTo(LEFT_X,-inner);hole.lineTo(RIGHT_X,-inner);hole.absarc(RIGHT_X,0,inner,-Math.PI/2,Math.PI/2,false);hole.lineTo(LEFT_X,inner);hole.absarc(LEFT_X,0,inner,Math.PI/2,Math.PI*1.5,false);shape.holes.push(hole);
  const turf=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshStandardMaterial({color:0x4f9145,roughness:.98}));turf.rotation.x=-Math.PI/2;turf.position.y=.015;turf.receiveShadow=true;scene.add(turf);
  const extensionLength=EXTENSION_RIGHT-RIGHT_X;
  const ext=new THREE.Mesh(new THREE.PlaneGeometry(extensionLength,TRACK_WIDTH),new THREE.MeshStandardMaterial({color:0x4f9145,roughness:.98}));ext.rotation.x=-Math.PI/2;ext.position.set((EXTENSION_RIGHT+RIGHT_X)/2,.016,BOTTOM_Z);ext.receiveShadow=true;scene.add(ext);
  for(let x=-245;x<250;x+=28){const stripe=new THREE.Mesh(new THREE.PlaneGeometry(14,TRACK_WIDTH-1),new THREE.MeshBasicMaterial({color:0x66a65e,transparent:true,opacity:.18}));stripe.rotation.x=-Math.PI/2;stripe.position.set(x,.024,BOTTOM_Z);scene.add(stripe);}
  createRails(); createGrandstand(); createFinish(); createInfield();
}

function createRails(){
  const mat=new THREE.MeshStandardMaterial({color:0xf5f5f1,roughness:.55,metalness:.05});
  [-TRACK_WIDTH/2-1.3,TRACK_WIDTH/2+1.3].forEach((off)=>{
    const pts=stadiumLoopPoints(off); const curve=new THREE.CatmullRomCurve3(pts,true);
    const rail1=new THREE.Mesh(new THREE.TubeGeometry(curve,520,.10,7,true),mat);rail1.position.y=.35;scene.add(rail1);
    const rail2=new THREE.Mesh(new THREE.TubeGeometry(curve,520,.075,6,true),mat);rail2.position.y=-.05;scene.add(rail2);
    for(let i=0;i<pts.length;i+=10){const p=pts[i];const post=new THREE.Mesh(new THREE.CylinderGeometry(.075,.09,1.15,7),mat);post.position.set(p.x,.58,p.z);post.castShadow=true;scene.add(post);}
  });
  [-TRACK_WIDTH/2-1.3,TRACK_WIDTH/2+1.3].forEach((zOff)=>{
    const z=BOTTOM_Z+zOff;const len=EXTENSION_RIGHT-RIGHT_X;const rail=new THREE.Mesh(new THREE.BoxGeometry(len,.12,.12),mat);rail.position.set((RIGHT_X+EXTENSION_RIGHT)/2,.9,z);scene.add(rail);
    for(let x=RIGHT_X;x<=EXTENSION_RIGHT;x+=12){const post=new THREE.Mesh(new THREE.CylinderGeometry(.075,.09,1.15,7),mat);post.position.set(x,.58,z);scene.add(post);}
  });
}

function createGrandstand(){
  const concrete=new THREE.MeshStandardMaterial({color:0xd9d7cf,roughness:.88});
  const dark=new THREE.MeshStandardMaterial({color:0x444b4a,roughness:.8});
  const seat=new THREE.MeshStandardMaterial({color:0x6d756e,roughness:.95});
  const stand=new THREE.Group();stand.position.set(80,0,BOTTOM_Z-55);
  for(let module=-1;module<=1;module++){
    const baseX=module*72;
    for(let i=0;i<8;i++){const step=new THREE.Mesh(new THREE.BoxGeometry(66,1.1,4.4),seat);step.position.set(baseX,0.55+i*.85,-i*3.5);stand.add(step);}
    const back=new THREE.Mesh(new THREE.BoxGeometry(68,15,2.2),concrete);back.position.set(baseX,8,-29);stand.add(back);
    const roof=new THREE.Mesh(new THREE.BoxGeometry(72,.65,24),concrete);roof.position.set(baseX,18,-19);roof.rotation.x=-.12;stand.add(roof);
    for(let c=-2;c<=2;c++){const support=new THREE.Mesh(new THREE.CylinderGeometry(.28,.38,16,10),dark);support.position.set(baseX+c*14,9,-28);support.rotation.z=-.12;stand.add(support);}
  }
  scene.add(stand);
}

function createInfield(){
  const hedgeMat=new THREE.MeshStandardMaterial({color:0x315f37,roughness:1});
  for(let x=-180;x<=180;x+=45){const h=new THREE.Mesh(new THREE.BoxGeometry(28,1.6,2.3),hedgeMat);h.position.set(x,.8,0);scene.add(h);}
  const trunkMat=new THREE.MeshStandardMaterial({color:0x6b4b31,roughness:1}),leafMat=new THREE.MeshStandardMaterial({color:0x2f6c3f,roughness:1});
  for(let i=0;i<70;i++){const a=Math.random()*Math.PI*2,r=160+Math.random()*260;const x=Math.cos(a)*r,z=Math.sin(a)*r*.62;if(z>BOTTOM_Z-35&&z<TOP_Z+35&&x>-360&&x<360)continue;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.35,.5,4,7),trunkMat);trunk.position.set(x,2,z);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(2.5+Math.random()*1.5,1),leafMat);crown.position.set(x,5,z);scene.add(trunk,crown);}
}

function textTexture(text,bg='#ffffff',fg='#111111'){
  const c=document.createElement('canvas');c.width=512;c.height=192;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=fg;ctx.font='900 104px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,102);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}

function createFinish(){
  const white=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.5});
  const line=new THREE.Mesh(new THREE.BoxGeometry(.75,.05,TRACK_WIDTH+3),white);line.position.set(FINISH_X,.055,BOTTOM_Z);scene.add(line);
  [-TRACK_WIDTH/2-1.8,TRACK_WIDTH/2+1.8].forEach((zOff)=>{
    const post=new THREE.Group();
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(.16,.19,6.5,10),white);pole.position.y=3.25;post.add(pole);
    for(let y=.5;y<6.2;y+=1.0){const band=new THREE.Mesh(new THREE.CylinderGeometry(.171,.20,.44,10),new THREE.MeshStandardMaterial({color:0x151515}));band.position.y=y;post.add(band);}
    post.position.set(FINISH_X,0,BOTTOM_Z+zOff);scene.add(post);
  });
  const board=new THREE.Mesh(new THREE.PlaneGeometry(7.2,2.2),new THREE.MeshStandardMaterial({map:textTexture('META'),side:THREE.DoubleSide,roughness:.65}));board.position.set(FINISH_X+1,5.7,BOTTOM_Z-TRACK_WIDTH/2-2.1);board.rotation.y=Math.PI/2;scene.add(board);
}

function assignUniqueJockeys(field){
  const used=new Set();
  return field.map((horse,i)=>{let jockey=horse.preferredJockey;if(used.has(jockey))jockey=JOCKEYS.find((j)=>!used.has(j))||jockey;used.add(jockey);return {...horse,assignedJockey:jockey,raceNumber:i+1};});
}

function makeSilkTexture(h){
  const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=h.silk;ctx.fillRect(0,0,256,256);ctx.fillStyle=h.accent;
  if(h.pattern==='stars')[[55,55],[155,48],[105,118],[190,145],[58,190],[150,210]].forEach(([x,y])=>drawStar(ctx,x,y,21,9,5));
  else if(h.pattern==='cross'){ctx.save();ctx.translate(128,128);ctx.rotate(-Math.PI/4);ctx.fillRect(-18,-180,36,360);ctx.rotate(Math.PI/2);ctx.fillRect(-18,-180,36,360);ctx.restore();}
  else if(h.pattern==='quarters'){ctx.fillRect(0,0,128,128);ctx.fillRect(128,128,128,128);}
  else if(h.pattern==='diagonal'){ctx.save();ctx.translate(128,128);ctx.rotate(-Math.PI/4);ctx.fillRect(-24,-190,48,380);ctx.restore();}
  else ctx.fillRect(0,105,256,46);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;return tex;
}
function drawStar(ctx,cx,cy,outer,inner,points){let rot=-Math.PI/2,step=Math.PI/points;ctx.beginPath();for(let i=0;i<points*2;i++){const r=i%2===0?outer:inner;const x=cx+Math.cos(rot)*r,y=cy+Math.sin(rot)*r;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);rot+=step;}ctx.closePath();ctx.fill();}

function makeNumberTexture(n){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#f7f7f4';ctx.fillRect(0,0,256,256);ctx.strokeStyle='#111';ctx.lineWidth=8;ctx.strokeRect(5,5,246,246);ctx.fillStyle='#111';ctx.font='900 172px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(n),128,137);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;}

function createJockey(h,scale){
  const g=new THREE.Group();const silkMat=new THREE.MeshStandardMaterial({map:makeSilkTexture(h),roughness:.72});const accent=new THREE.MeshStandardMaterial({color:h.accent,roughness:.62});const skin=new THREE.MeshStandardMaterial({color:0xb97d5f,roughness:.78});const white=new THREE.MeshStandardMaterial({color:0xf4f3ed,roughness:.8});const black=new THREE.MeshStandardMaterial({color:0x181b1d,roughness:.8});
  const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.15,.36,6,10),silkMat);torso.position.set(0,.78,0);torso.rotation.x=-.72;g.add(torso);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.105,14,10),skin);head.position.set(0,1.03,.16);g.add(head);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(.122,14,8,0,Math.PI*2,0,Math.PI*.62),accent);cap.position.set(0,1.11,.16);g.add(cap);
  for(const side of [-1,1]){
    const thigh=new THREE.Mesh(new THREE.CapsuleGeometry(.04,.28,5,8),white);thigh.position.set(side*.11,.55,-.01);thigh.rotation.z=side*.35;thigh.rotation.x=.75;g.add(thigh);
    const boot=new THREE.Mesh(new THREE.CapsuleGeometry(.035,.26,4,8),black);boot.position.set(side*.16,.35,.14);boot.rotation.x=1.05;g.add(boot);
    const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.035,.26,4,8),silkMat.clone());arm.position.set(side*.105,.76,.22);arm.rotation.x=-1.05;arm.rotation.z=side*.18;g.add(arm);
    const hand=new THREE.Mesh(new THREE.SphereGeometry(.032,8,8),skin);hand.position.set(side*.11,.69,.40);g.add(hand);
  }
  g.scale.setScalar(scale);return g;
}

function createSaddlecloth(h,width,height,length){
  const g=new THREE.Group();const tex=makeNumberTexture(h.raceNumber);const mat=new THREE.MeshStandardMaterial({map:tex,roughness:.78,side:THREE.DoubleSide});const w=Math.max(.38,length*.24),hh=Math.max(.34,height*.28);[-1,1].forEach((side)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,hh),mat.clone());m.position.set(side*width*.48,0,0);m.rotation.y=side>0?-Math.PI/2:Math.PI/2;g.add(m);});return g;
}

function buildRunner(h){
  const root=new THREE.Group();const model=skeletonClone(horseTemplate);model.traverse((o)=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.material)o.material=o.material.clone();}});model.scale.setScalar(.013);root.add(model);model.updateMatrixWorld(true);
  let box=new THREE.Box3().setFromObject(model),size=new THREE.Vector3();box.getSize(size);
  if(size.x>size.z){model.rotation.y=-Math.PI/2;model.updateMatrixWorld(true);box=new THREE.Box3().setFromObject(model);box.getSize(size);}
  const center=new THREE.Vector3();box.getCenter(center);const height=size.y,width=size.x,length=size.z;
  const cloth=createSaddlecloth(h,width,height,length);cloth.position.set(center.x,box.min.y+height*.59,center.z-length*.02);root.add(cloth);
  const jockeyScale=Math.max(.68,height*.46);const jockey=createJockey(h,jockeyScale);jockey.position.set(center.x,box.min.y+height*.62,center.z+length*.02);root.add(jockey);
  const saddle=new THREE.Mesh(new THREE.BoxGeometry(Math.max(.28,width*.72),Math.max(.08,height*.055),Math.max(.45,length*.24)),new THREE.MeshStandardMaterial({color:0x3a2419,roughness:.86}));saddle.position.set(center.x,box.min.y+height*.66,center.z-length*.02);root.add(saddle);
  const mixer=new THREE.AnimationMixer(model);const action=mixer.clipAction(horseClip);action.setDuration(.74+Math.random()*.04).play();
  return {root,model,mixer,action,jockey,jockeyBaseY:jockey.position.y,jockeyBaseRot:jockey.rotation.x,height};
}

function clearGates(){if(gates){scene.remove(gates);gates=null;}}
function createStartingGates(fieldSize){
  clearGates();gates=new THREE.Group();const start=currentRoute.getPoint(0),tan=currentRoute.getTangent(0),side=new THREE.Vector3(-tan.z,0,tan.x).normalize();const steel=new THREE.MeshStandardMaterial({color:0xd7d8d6,metalness:.5,roughness:.45});const blue=new THREE.MeshStandardMaterial({color:0x285d82,metalness:.25,roughness:.55});
  const spacing=Math.min(1.42,(TRACK_WIDTH-1.2)/fieldSize);const frontDoors=[];
  for(let i=0;i<fieldSize;i++){
    const stall=new THREE.Group();const offset=(i-(fieldSize-1)/2)*spacing;
    const local=new THREE.Vector3().copy(side).multiplyScalar(offset);stall.position.copy(start).add(local);stall.rotation.y=Math.atan2(tan.x,tan.z);
    [-.57,.57].forEach((x)=>{for(const z of [-.85,.85]){const p=new THREE.Mesh(new THREE.BoxGeometry(.07,2.25,.07),steel);p.position.set(x,1.12,z);stall.add(p);}for(let y=.45;y<2.1;y+=.42){const bar=new THREE.Mesh(new THREE.BoxGeometry(.07,.06,1.72),steel);bar.position.set(x,y,0);stall.add(bar);}});
    const top=new THREE.Mesh(new THREE.BoxGeometry(1.22,.12,1.85),blue);top.position.y=2.2;stall.add(top);
    for(const sideDoor of [-1,1]){const pivot=new THREE.Group();pivot.position.set(sideDoor*.55,1.0,.86);const door=new THREE.Mesh(new THREE.BoxGeometry(.52,1.85,.06),steel);door.position.x=-sideDoor*.26;pivot.add(door);stall.add(pivot);frontDoors.push({pivot,side:sideDoor});}
    gates.add(stall);
  }
  gates.userData.frontDoors=frontDoors;scene.add(gates);
}
function openStartingGates(){if(!gates)return;gates.userData.opening=true;gates.userData.openT=0;}
function animateGates(dt){if(!gates?.userData.opening)return;gates.userData.openT=Math.min(1,gates.userData.openT+dt*4.5);const e=1-Math.pow(1-gates.userData.openT,3);gates.userData.frontDoors.forEach(({pivot,side})=>pivot.rotation.y=side*e*1.2);}

function placeRunner(r,immediate=false){
  const center=currentRoute.getPoint(r.distance),tan=currentRoute.getTangent(r.distance),side=new THREE.Vector3(-tan.z,0,tan.x).normalize();const target=center.clone().add(side.multiplyScalar(r.lateral));target.y=.04;
  if(immediate)r.root.position.copy(target);else r.root.position.copy(target);
  const angle=Math.atan2(tan.x,tan.z);let diff=angle-r.root.rotation.y;while(diff>Math.PI)diff-=Math.PI*2;while(diff<-Math.PI)diff+=Math.PI*2;r.root.rotation.y+=diff*(immediate?1:.22);
}

async function startRace(field,raceDef){
  await init3D();cancelAnimationFrame(raf);runners.forEach((r)=>{scene.remove(r.root);r.mixer.stopAllAction();});runners=[];clearGates();race=raceDef;currentRoute=buildRoute(race.distance);finished=false;running=false;elapsed=0;finishOrder=[];snapshot='';state.raceSpeed=1;state.cameraMode=0;$('speedBtn').textContent='x1';$('cameraBtn').textContent='Cámara TV';$('finishFlash').classList.remove('show');$('tvRaceTitle').textContent=race.name.toUpperCase();$('tvVenue').textContent=race.venue;$('commentary').textContent='Los participantes están cargados en los cajones.';
  const assigned=assignUniqueJockeys(field);fieldAbility=assigned.reduce((sum,h)=>sum+ability(h,race.distance),0)/assigned.length;
  assigned.forEach((h,i)=>{const rig=buildRunner(h);const runner={...rig,horse:h,distance:0,speed:0,lateral:(i-(assigned.length-1)/2)*Math.min(1.15,(TRACK_WIDTH-3)/assigned.length),energy:1,finished:false,time:null,form:(Math.random()-.5)*.010,phase:Math.random()*Math.PI*2};scene.add(runner.root);placeRunner(runner,true);runners.push(runner);});
  createStartingGates(assigned.length);state.lastField=field;show('raceScreen');$('loadOverlay').classList.add('hidden');startTime=performance.now();last=performance.now();raf=requestAnimationFrame(loop);
}

function targetSpeed(r){
  const d=race.distance,h=r.horse,progress=r.distance/d,remaining=d-r.distance;const base=d<=1200?17.9:d<=1600?17.4:d<=2000?17.0:d<=2500?16.6:16.2;
  const abilityFactor=1+(ability(h,d)-fieldAbility)*.00155;const fitFactor=1+(distanceFit(h,d)-.98)*.62;let factor=abilityFactor*fitFactor*(1+r.form);
  if(progress<.12)factor*=.88+progress*1.0;else if(progress<.72)factor*=.995;
  const fatigue=(progress*progress)*Math.max(0,94-h.stamina)*.0007*(d>=2200?1.25:.7);factor-=fatigue;
  if(remaining<420){const kick=(1-remaining/420);factor*=1+kick*(h.accel-88)*.00115;}
  factor*=1+Math.sin(elapsed*.9+r.phase)*.0018;
  const min=h.specialty==='sprinter'&&d>=2400?.90:.94;return base*THREE.MathUtils.clamp(factor,min,1.045);
}

function loop(now){
  const dt=Math.min(.04,(now-last)/1000||.016);last=now;animateGates(dt);const since=(now-startTime)/1000;
  if(since<3){$('countdown').textContent=3-Math.floor(since);}else{
    if(!running){running=true;$('countdown').textContent='';$('commentary').textContent='¡Se abren los cajones! Comienza la carrera.';openStartingGates();}
    elapsed+=dt*state.raceSpeed;
    runners.forEach((r)=>{if(r.finished)return;const ts=targetSpeed(r),response=1-Math.exp(-(2.6+r.horse.accel*.010)*dt*state.raceSpeed);r.speed=THREE.MathUtils.lerp(r.speed,ts,response);r.distance+=r.speed*dt*state.raceSpeed;if(r.distance>=race.distance){r.distance=race.distance;r.finished=true;r.time=elapsed;finishOrder.push(r);if(finishOrder.length===1){snapshot=renderer.domElement.toDataURL('image/jpeg',.82);$('finishFlash').classList.add('show');}}
      placeRunner(r);r.mixer.update(dt*state.raceSpeed*(.85+r.speed/19));const stride=elapsed*(10+r.speed*.25)+r.phase;r.jockey.position.y=r.jockeyBaseY+Math.sin(stride)*r.height*.012;r.jockey.rotation.x=r.jockeyBaseRot+Math.sin(stride+.8)*.035;
    });
    if(finishOrder.length===runners.length){finished=true;setTimeout(results,700);}
  }
  updateCamera(dt);updateRank();renderer.render(scene,camera);if(!finished)raf=requestAnimationFrame(loop);
}

function sorted(){return [...runners].sort((a,b)=>b.distance-a.distance||(a.time??999)-(b.time??999));}
function updateRank(){if(!race||!runners.length)return;const s=sorted(),lead=s[0];$('metersLeft').textContent=`${Math.max(0,Math.ceil(race.distance-lead.distance)).toLocaleString('es-ES')} m`;$('rankingRows').innerHTML=s.map((r,i)=>`<div class="rank-row"><div class="rank-pos">${i+1}</div><div class="rank-name"><b>${r.horse.raceNumber}. ${r.horse.name}</b><span>${r.horse.assignedJockey}</span></div><div class="rank-gap">${i?`-${Math.max(0,lead.distance-r.distance).toFixed(1)} m`:'LÍDER'}</div></div>`).join('');if(race.distance-lead.distance<700)$('commentary').textContent=race.distance-lead.distance<250?'¡Últimos 250 metros! Se abre la lucha por la victoria.':'Entrando en la fase decisiva: el grupo se prepara para el remate.';}

function updateCamera(dt){
  if(!runners.length)return;const s=sorted();const center=new THREE.Vector3();s.forEach((r)=>center.add(r.root.position));center.divideScalar(s.length);const leader=s[0],tan=currentRoute.getTangent(leader.distance),side=new THREE.Vector3(-tan.z,0,tan.x).normalize(),remaining=race.distance-leader.distance;let desired,target=center.clone();
  if(state.cameraMode===0){const final=remaining<500;desired=center.clone().add(side.multiplyScalar(final?34:52)).sub(tan.clone().multiplyScalar(final?18:30));desired.y=final?10:21;target.y=final?2.1:3.6;}
  else if(state.cameraMode===1){desired=center.clone();desired.y=75;target.y=0;}
  else if(state.cameraMode===2){desired=center.clone().add(side.multiplyScalar(19)).sub(tan.clone().multiplyScalar(5));desired.y=5.5;target.add(tan.multiplyScalar(10));target.y=1.8;}
  else{desired=FINISH.clone().add(new THREE.Vector3(28,8,-24));target=FINISH.clone();target.y=1.8;}
  camera.position.lerp(desired,1-Math.exp(-4.3*dt));camera.lookAt(target);
}

function results(){const rr=[...finishOrder],winner=rr[0]?.time||0;$('resultTitle').textContent=race.name;$('resultSubtitle').textContent=`${race.distance.toLocaleString('es-ES')} m · ${race.venue}`;$('photoFinish').src=snapshot;$('podium').innerHTML=rr.slice(0,3).map((r,i)=>`<div class="podium-card"><span>${i+1}º</span><b>${r.horse.raceNumber}. ${r.horse.name}</b><small>${r.horse.assignedJockey}</small></div>`).join('');$('classification').innerHTML=rr.map((r,i)=>`<div class="class-row"><strong>${i+1}º</strong><div><b>${r.horse.raceNumber}. ${r.horse.name}</b><br><span>${r.horse.stable}</span></div><span>${r.horse.assignedJockey}</span><b>${i?`+${(r.time-winner).toFixed(2)}s`:r.time.toFixed(2)+'s'}</b></div>`).join('');show('resultsScreen');}

$('confirmBtn').onclick=()=>{const field=horses.filter((h)=>state.selected.has(h.id));if(field.length>=6)startRace(field,currentRace());};
$('speedBtn').onclick=()=>{state.raceSpeed=state.raceSpeed===1?1.5:state.raceSpeed===1.5?2:1;$('speedBtn').textContent='x'+state.raceSpeed;};
$('cameraBtn').onclick=()=>{state.cameraMode=(state.cameraMode+1)%4;$('cameraBtn').textContent=['Cámara TV','Cámara aérea','Cámara rail','Cámara meta'][state.cameraMode];};
$('exitRaceBtn').onclick=()=>{cancelAnimationFrame(raf);show('mainMenu');};
$('menuFromResults').onclick=()=>show('mainMenu');
$('repeatBtn').onclick=()=>startRace(state.lastField,currentRace());
$('anotherBtn').onclick=()=>show(state.mode==='champ'?'championshipMenu':'selectionScreen');

renderRaces();renderHorses();