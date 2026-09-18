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
  ['safaga','Safaga','Asoc. La Toledana–Becares','G. Trolley de Prévaux','intermediate',95,95,96,1800,2400,0x17100e,'#08090a','#20c9c3','chestcross',{face:'none',socks:[]},'Castaño muy oscuro'],
  ['estraunza','Estraunza','Becares','A. Gutiérrez V.','stayer',94,98,94,2400,2800,0x2b1a15,'#f05a18','#1746b8','stripes',{face:'none',socks:[]},'Castaño oscuro'],
  ['sirjan','Sirjan','Cum Laude Racing','J. Gelabert','stayer',96,100,95,2200,3000,0x733b24,'#1746b8','#f05a18','stripes',{face:'none',socks:[]},'Castaño rojizo'],
  ['elsokhna','El Sokhna','Becares','A. Gutiérrez V.','miler',93,84,93,1200,1600,0x8e4a2c,'#f05a18','#1746b8','stripes',{face:'none',socks:[]},'Alazán'],
  ['presidency','Presidency','Presidency','V. Janáček','sprinter',99,81,99,1000,1400,0x4b2d23,'#d71920','#ffffff','band',{face:'none',socks:[]},'Castaño'],
  ['viciousharry','Vicious Harry','Vicious Harry','R. Sousa','sprinter',100,82,100,1000,1300,0x4a2d22,'#f5f5f5','#2458b8','stripes',{face:'none',socks:[]},'Castaño'],
  ['greatprospector','Great Prospector','Mallow Gran Canaria','B. Fayos','sprinter',100,82,99,1000,1400,0x3c261f,'#17305f','#f5f5f5','band',{face:'none',socks:[]},'Castaño'],
  ['rodaballo','Rodaballo','Pata Negra Racing','J. L. Martínez','miler',100,90,100,1400,1600,0x34221d,'#08796d','#54c97b','quarters',{face:'none',socks:[]},'Castaño'],
  ['fortun','Fortun','La Toledana','B. Fayos','stayer',96,99,95,2200,2600,0x100d0c,'#090a0b','#090a0b','solid',{face:'none',socks:[]},'Negro / castaño muy oscuro'],
  ['entrecopas','Entre Copas','Cuadra África','J. L. Martínez','stayer',95,100,93,2400,4000,0x8a4b2c,'#aa2431','#f2d66a','band',{face:'none',socks:[]},'Alazán'],
  ['amedeo','Amedeo Modigliani','Yeguada Rocío','V. Janáček','miler',98,87,98,1450,1800,0x3a241e,'#f5f5ef','#0d5c3d','stars',{face:'none',socks:[]},'Castaño oscuro'],
  ['frine','Friné','Duque de Alburquerque','J. Grosjean','stayer',99,100,99,2100,2800,0x8d8b86,'#ededeb','#722338','band',{face:'none',socks:[]},'Tordo'],
  ['espoir','Espoir Avenir (FR)','Alain Maubert','E. Corallo','stayer',98,100,98,2300,3100,0xaaa9a4,'#235a9d','#d53838','diagonal',{face:'none',socks:[]},'Tordo'],
  ['warofdance','War of Dance','Peques','R. N. Valle','stayer',96,99,95,2200,2600,0x4a2c22,'#f07b26','#12a4a4','quarters',{face:'none',socks:[]},'Castaño'],
  ['coetzee','Coetzee','Alex y Sofía','R. N. Valle','stayer',95,100,94,2400,4000,0x884526,'#203d87','#eadc61','band',{face:'none',socks:[]},'Alazán'],
  ['kildare','Kildare Legend','Salvador Márquez','R. Sousa','stayer',95,97,94,1800,2600,0xa45a31,'#f5f5f5','#d71920','band',{face:'none',socks:[]},'Alazán'],
  ['naranco','Naranco','Yeguada Rocío','V. Janáček','intermediate',100,95,99,1800,2100,0x30201b,'#f5f5ef','#0d5c3d','stars',{face:'none',socks:[]},'Castaño oscuro'],
  ['tetuan','Tetuan','Yeguada Rocío','V. Janáček','stayer',94,98,93,2200,2850,0x402921,'#f5f5ef','#0d5c3d','stars',{face:'none',socks:[]},'Castaño'],
  ['shackleton','Shackleton','Yeguada Rocío','I. Melgarejo','stayer',94,98,93,2300,3000,0x3d2a22,'#f5f5ef','#0d5c3d','stars',{face:'none',socks:[]},'Castaño'],
  ['pamplona','Pamplona','Yeguada Rocío','V. Janáček','stayer',96,100,95,2200,3000,0x9a512e,'#f5f5ef','#0d5c3d','stars',{face:'none',socks:[]},'Alazán'],
  ['ifnotnow','If Not Now','Yeguada Rocío','V. Janáček','intermediate',94,94,94,1900,2400,0x94502f,'#f5f5ef','#0d5c3d','stars',{face:'none',socks:[]},'Alazán'],
  ['thegame','The Game','Cielo de Madrid','R. Sousa','stayer',95,100,94,2400,4000,0x422920,'#72c9d7','#11181a','quarters',{face:'none',socks:[]},'Castaño'],
  ['mediastorm','Media Storm','Best Horse','B. Fayos','stayer',95,99,94,2200,2800,0x70402a,'#17307e','#ffffff','band',{face:'none',socks:[]},'Alazán'],
  ['elcaney','El Caney','Santa Bárbara','A. Gutiérrez V.','stayer',95,99,94,2200,2800,0x33231e,'#f2d64e','#168154','diagonal',{face:'none',socks:[]},'Castaño oscuro'],
  ['kingjungle','King of Jungle','Diaz Sarmiento','R. N. Valle','miler',99,86,99,1100,1600,0x4b3026,'#f5f5ef','#0d5c3d','stars',{face:'none',socks:[]},'Castaño'],
  ['samedi','Samedi Rien','Yeguada Rocío','V. Janáček','miler',100,87,99,1200,1600,0x5b3427,'#f5f5ef','#0d5c3d','stars',{face:'none',socks:[]},'Castaño']
].map((x,i)=>({
  id:x[0],name:x[1],stable:x[2],preferredJockey:x[3],specialty:x[4],
  speed:x[5],stamina:x[6],accel:x[7],best:[x[8],x[9]],coat:x[10],
  silk:x[11],accent:x[12],pattern:x[13],markings:x[14]||{face:'none',socks:[]},
  coatName:x[15]||'—',catalogNumber:i+1
}));

const REAL_JCE = {
  safaga:{
    peakValue:44.5,
    peakSource:'histórico',
    palmares:['GP Beamonte · Oaks 2023','GP Román Martín 2023','2ª GP Duque de Alburquerque 2024'],
    note:'Máximo histórico indicado: 44,5.'
  },
  estraunza:{
    peakValue:44.5,
    peakSource:'histórico',
    palmares:['GP Villapadierna · Derby 2025','GP Villamejor 2025'],
    note:'Máximo histórico indicado: 44,5.'
  },
  sirjan:{
    peakValue:46,
    peakSource:'JCE',
    palmares:['Memorial Duque de Toledo 2024','Prix Max Sicard 2024','2º GP de Madrid 2026','2º Copa de Oro 2026'],
    note:'Máximo JCE verificado: 46.'
  },
  elsokhna:{
    peakValue:41,
    peakSource:'JCE',
    palmares:['Victorias entre 1.200 y 1.600 m'],
    note:'Máximo JCE localizado: 41. Fue 4º en el Gobierno Vasco, donde alcanzó ese valor.'
  },
  presidency:{
    peakValue:45.5,
    peakSource:'JCE',
    palmares:['Gran Premio Ruban 2018 · valor 45,5'],
    note:'Máximo JCE localizado: 45,5.'
  },
  viciousharry:{
    peakValue:48,
    peakSource:'FR',
    peakLabel:'Máximo Francia',
    gameValue:48,
    palmares:['Prix Cor de Chasse · Listed','Actuaciones de Grupo/Listed en Francia'],
    note:'Valor francés 48 verificado en 2024–2025. No se usa 49–50 sin una referencia superior confirmada.'
  },
  greatprospector:{
    peakValue:46.5,
    peakSource:'JCE',
    palmares:['Gran Premio Antonio Blasco 2020','Andrés Covarrubias 2020'],
    note:'Máximo JCE localizado: 46,5.'
  },
  rodaballo:{
    peakValue:48.5,
    peakSource:'JCE',
    gameValue:48.5,
    palmares:['Máximo España 2021 · valor 48,5','Gran Premio Claudio Carudel'],
    note:'Máximo histórico en España: 48,5.'
  },
  fortun:{
    peakValue:44.5,
    peakSource:'histórico',
    gameValue:47,
    palmares:['GP Villapadierna · Derby 2012','2º GP de Madrid 2014'],
    note:'Máximo histórico de hándicap: 44,5. Para el juego se normaliza a 47 para compararlo con baremos modernos, ligeramente por debajo de Entre Copas.'
  },
  entrecopas:{
    peakValue:45,
    peakSource:'histórico',
    gameValue:48,
    palmares:['GP de Madrid 2011','GP de Madrid 2013','Gladiateur ×4','Corpa ×2','GP de San Sebastián'],
    note:'Máximo histórico de hándicap: 45. Valor de juego normalizado: 48 por su época y su palmarés excepcional de fondo.'
  },
  amedeo:{
    peakValue:45,
    peakSource:'JCE',
    palmares:['GP Claudio Carudel','GP de la Hispanidad','2º Gobierno Vasco'],
    note:'Máximo JCE localizado: 45. Capa castaña.'
  },
  frine:{
    peakValue:46.5,
    peakSource:'histórico',
    gameValue:51.5,
    palmares:['GP de Madrid 2014','Prix Fille de l’Air G3','Prix de Royallieu G2'],
    note:'Máximo español aportado: 46,5. Su nivel internacional fue superior; para el juego se normaliza a 51,5, por encima de Naranco como fondista/mediofondista de gran premio.'
  },
  espoir:{
    peakValue:50.5,
    peakSource:'FR',
    peakLabel:'Máximo Francia',
    gameValue:50.5,
    palmares:['Copa de Oro de San Sebastián 2026','Campaña internacional de alto nivel'],
    note:'Máximo francés localizado: 50,5.'
  },
  warofdance:{
    peakValue:45,
    peakSource:'JCE',
    gameValue:47,
    palmares:['GP de Madrid 2024','GP de Madrid 2025','Memorial Duque de Toledo 2023','Teresa 2024'],
    note:'Máximo oficial JCE: 45. Para el juego se eleva a 47 por el doble GP de Madrid y su consistencia en grandes premios.'
  },
  coetzee:{
    peakValue:45.5,
    peakSource:'FR',
    peakLabel:'Máximo Francia',
    gameValue:46,
    palmares:['GP de Madrid 2026','5º Prix du Cadran G1 2025','3º Prix Gladiateur G3 2025'],
    note:'Máximo Francia: 45,5. Equivalencia de juego aproximada: 46.'
  },
  kildare:{
    peakValue:45,
    peakSource:'JCE',
    palmares:['Bannaby 2026','3º GP de Madrid 2026']
  },
  naranco:{
    peakValue:50.5,
    peakSource:'FR',
    peakLabel:'Máximo Francia',
    gameValue:50.5,
    palmares:['La Coupe de Maisons-Laffitte G3','GP Román Martín'],
    note:'Máximo francés 50,5. Su pico fue alrededor de 2.000 m, por eso en el juego pasa a Intermedio y no domina automáticamente a los fondistas en 2.400–3.000 m.'
  },
  tetuan:{
    peakValue:44,
    peakSource:'JCE',
    palmares:['GP Villapadierna · Derby 2024','Gran Premio Nacional 2024','Román Martín 2025','Royal Gait 2025']
  },
  shackleton:{
    peakValue:44,
    peakSource:'JCE',
    palmares:['2º Corpa 2026','3º Copa de Oro 2026','4º GP de Madrid 2026']
  },
  pamplona:{
    peakValue:46,
    peakSource:'histórico',
    palmares:['GP Villamejor','Rheffissimo 2026','Indian Prince 2026'],
    note:'Máximo histórico indicado: 46.'
  },
  ifnotnow:{
    peakValue:43,
    peakSource:'JCE',
    gameValue:43,
    palmares:['Victoria 2.400 m La Zarzuela 2025','2º GP de San Sebastián 2026'],
    note:'Máximo español verificado: 43. No se usa la estimación 48–49.'
  },
  thegame:{
    peakValue:46,
    peakSource:'JCE',
    gameValue:46,
    palmares:['Máximo España 2023 · valor 46','GP Memorial Duque de Toledo 2022','2º GP de Madrid 2023 y 2024'],
    note:'Máximo histórico en España: 46.'
  },
  mediastorm:{
    peakValue:45.5,
    peakSource:'JCE',
    gameValue:46,
    palmares:['GP de Madrid 2022','Copa de Oro 2024','Duque de Alburquerque 2024'],
    note:'Máximo JCE localizado: 45,5. Valor juego: 46 por su palmarés de gran premio.'
  },
  elcaney:{
    peakValue:45.5,
    peakSource:'JCE',
    gameValue:46,
    palmares:['Gran Premio de Madrid 2023','Entre Copas · Gladiateur 2022'],
    note:'Máximo español verificado: 45,5. Valor juego: 46.'
  },
  kingjungle:{
    peakValue:45.5,
    peakSource:'JCE',
    palmares:['GP Ruban 2023','GP Urquijo 2023','GP Andalucía 2024 · valor 45,5'],
    note:'Máximo JCE localizado: 45,5.'
  },
  samedi:{
    peakValue:46,
    peakSource:'JCE',
    palmares:['GP de la Hispanidad ×3','Gran Premio Gobierno Vasco'],
    note:'Máximo histórico/JCE indicado: 46.'
  }
};

const TRACK_CONDITION = {
  hard:{label:'Duro / rápido', pace:1.006, fatigue:.94},
  normal:{label:'Bueno / normal', pace:1, fatigue:1},
  heavy:{label:'Pesado', pace:.982, fatigue:1.13}
};

const TERRAIN_PROFILE = {
  safaga:{hard:1.010,normal:1.004,heavy:.994},
  estraunza:{hard:1.000,normal:1.004,heavy:1.008},
  sirjan:{hard:.997,normal:1.004,heavy:1.012},
  fortun:{hard:.995,normal:1.003,heavy:1.012},
  entrecopas:{hard:.992,normal:1.002,heavy:1.016},
  frine:{hard:1.000,normal:1.006,heavy:1.012},
  espoir:{hard:1.000,normal:1.005,heavy:1.010},
  warofdance:{hard:1.004,normal:1.004,heavy:1.000},
  naranco:{hard:1.010,normal:1.006,heavy:.988},
  coetzee:{hard:.995,normal:1.003,heavy:1.014},
  thegame:{hard:.997,normal:1.004,heavy:1.010},
  elcaney:{hard:.996,normal:1.003,heavy:1.010},
  mediastorm:{hard:.998,normal:1.004,heavy:1.008},
  pamplona:{hard:1.000,normal:1.004,heavy:1.007},
  tetuan:{hard:1.002,normal:1.004,heavy:1.004},
  shackleton:{hard:.998,normal:1.003,heavy:1.008},
  viciousharry:{hard:1.012,normal:1.005,heavy:.985},
  rodaballo:{hard:1.010,normal:1.005,heavy:.990},
  presidency:{hard:1.010,normal:1.004,heavy:.988},
  greatprospector:{hard:1.008,normal:1.004,heavy:.990},
  samedi:{hard:1.006,normal:1.005,heavy:.994},
  kingjungle:{hard:1.008,normal:1.004,heavy:.990},
  amedeo:{hard:1.006,normal:1.004,heavy:.994},
  ifnotnow:{hard:.998,normal:1.003,heavy:1.006},
  elsokhna:{hard:1.005,normal:1.003,heavy:.994}
};

const RIVALRY_EDGE = {
  'safaga|warofdance':.0045,
  'warofdance|safaga':-.0015,
  'fortun|frine':.0025,
  'frine|fortun':.0025,
  'estraunza|sirjan':.0025,
  'sirjan|estraunza':.0025,
  'estraunza|tetuan':.0030,
  'tetuan|estraunza':-.0005
};

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

const state={mode:'free',selectedRace:null,selected:new Set(),lastField:[],raceSpeed:1,cameraMode:0,paused:false,manualCamera:false,trackCondition:'normal'};

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
function terrainFit(h,condition=state.trackCondition){
  const profile=TERRAIN_PROFILE[h.id];
  return profile?.[condition]??1;
}
function rivalryBoost(h,field){
  if(!field?.length)return 0;
  let boost=0;
  field.forEach(o=>{if(o.id!==h.id)boost+=RIVALRY_EDGE[h.id+'|'+o.id]||0;});
  return THREE.MathUtils.clamp(boost,-.006,.006);
}
function rating(h,d){return ability(h,d)*distanceFit(h,d)*terrainFit(h);}
function currentRace(){return state.mode==='champ'?{...state.selectedRace,condition:state.trackCondition}:{id:'free',name:'Carrera Libre',distance:+$('freeDistance').value,venue:'Hipódromo de La Zarzuela · Madrid',favors:'Variable',condition:state.trackCondition};}
function horseLevel(h){return Math.round(h.speed*.38+h.stamina*.37+h.accel*.25);}

const SIM_STATS_KEY='zarzuela-racing-simstats-v1';
let simStats=loadSimStats();
let raceStatsSaved=false;

function loadSimStats(){
  try{
    const saved=JSON.parse(localStorage.getItem(SIM_STATS_KEY)||'null');
    return saved&&typeof saved==='object'?saved:{races:0,horses:{}};
  }catch(e){
    return {races:0,horses:{}};
  }
}
function statFor(id){
  if(!simStats.horses)simStats.horses={};
  if(!simStats.horses[id])simStats.horses[id]={starts:0,wins:0,seconds:0,thirds:0,podiums:0,last5:[],distanceWins:{}};
  return simStats.horses[id];
}
function saveSimStats(){
  try{localStorage.setItem(SIM_STATS_KEY,JSON.stringify(simStats));}catch(e){}
}
function saveRaceStats(order){
  if(raceStatsSaved||!order.length)return;
  raceStatsSaved=true;
  simStats.races=(simStats.races||0)+1;
  order.forEach((runner,i)=>{
    const s=statFor(runner.horse.id),pos=i+1;
    s.starts=(s.starts||0)+1;
    if(pos===1){
      s.wins=(s.wins||0)+1;
      s.distanceWins=s.distanceWins||{};
      s.distanceWins[String(race.distance)]=(s.distanceWins[String(race.distance)]||0)+1;
    }
    if(pos===2)s.seconds=(s.seconds||0)+1;
    if(pos===3)s.thirds=(s.thirds||0)+1;
    if(pos<=3)s.podiums=(s.podiums||0)+1;
    s.last5=[{pos,race:race.name,distance:race.distance},...(s.last5||[])].slice(0,5);
  });
  saveSimStats();
}
function bestSimDistance(s){
  const entries=Object.entries(s.distanceWins||{});
  if(!entries.length)return '—';
  entries.sort((a,b)=>b[1]-a[1]||(+a[0])-(+b[0]));
  return Number(entries[0][0]).toLocaleString('es-ES')+' m';
}
function renderStatsScreen(){
  const all=horses.map(h=>({h,s:statFor(h.id)}));
  const totalStarts=all.reduce((n,x)=>n+(x.s.starts||0),0);
  const totalWins=all.reduce((n,x)=>n+(x.s.wins||0),0);
  $('statsSummary').innerHTML=`
    <div><span>${simStats.races||0}</span><small>Carreras · este dispositivo</small></div>
    <div><span>${totalStarts}</span><small>Participaciones</small></div>
    <div><span>${totalWins}</span><small>Victorias registradas</small></div>
    <div><span>${horses.length}</span><small>Caballos</small></div>`;

  all.sort((a,b)=>(b.s.wins||0)-(a.s.wins||0)||(b.s.podiums||0)-(a.s.podiums||0)||horseLevel(b.h)-horseLevel(a.h));

  $('statsGrid').innerHTML=all.map(({h,s})=>{
    const winPct=s.starts?Math.round((s.wins/s.starts)*100):0;
    const podiumPct=s.starts?Math.round((s.podiums/s.starts)*100):0;
    const coat='#'+h.coat.toString(16).padStart(6,'0');
    const recent=(s.last5||[]).map(x=>`<span class="recent-pos p${Math.min(x.pos,4)}">${x.pos}º</span>`).join('')||'<span class="stats-empty">Sin carreras todavía</span>';
    const real=REAL_JCE[h.id];
    const peakText=real?.peakValue!=null
      ? String(real.peakValue).replace('.',',')
      : (real?.estimated?'Pendiente':'—');
    const peakLabel=real?.peakValue!=null
      ? (real.peakLabel||(real.peakSource==='JCE'?'Máximo JCE':'Máximo histórico'))
      : (real?.estimated?'Máximo estimado':'Valor máximo');
    const gameValueRow=real?.gameValue!=null&&real.gameValue!==real.peakValue
      ? `<div class="peak-value-row"><span>Valor juego ajustado</span><b>${String(real.gameValue).replace('.',',')}</b></div>`
      : '';
    const realPalmares=real?.palmares?.length
      ? `<div class="real-palmares">${real.palmares.map(x=>`<span>★ ${x}</span>`).join('')}</div>`
      : '<div class="stats-empty">Palmarés pendiente de revisar.</div>';
    return `<article class="stats-card">
      <div class="stats-card-head">
        <div class="coat-dot" style="background:${coat}"></div>
        <div><div class="horse-number">${SPECIALTY[h.specialty].label} · ${h.coatName}</div><h3>${h.name}</h3><p>${h.stable}</p></div>
        <div class="level-badge"><small>NIVEL</small><b>${horseLevel(h)}</b></div>
      </div>
      <div class="base-stat-grid">
        <div><span>Velocidad</span><b>${h.speed}</b></div>
        <div><span>Fondo</span><b>${h.stamina}</b></div>
        <div><span>Aceleración</span><b>${h.accel}</b></div>
        <div><span>Ideal</span><b>${h.best[0].toLocaleString('es-ES')}–${h.best[1].toLocaleString('es-ES')} m</b></div>
      </div>
      <div class="real-history">
        <div class="real-title"><span>HISTORIAL REAL</span></div>
        <div class="peak-value-row">
          <span>${peakLabel}</span>
          <b>${peakText}</b>
        </div>
        ${gameValueRow}
        ${realPalmares}
        ${real?.note?`<p>${real.note}</p>`:''}
      </div>
      <div class="sim-title">TUS SIMULACIONES · ESTE DISPOSITIVO</div>
      <div class="sim-stat-grid">
        <div><b>${s.starts||0}</b><span>Carreras</span></div>
        <div><b>${s.wins||0}</b><span>Victorias</span></div>
        <div><b>${s.podiums||0}</b><span>Podios</span></div>
        <div><b>${winPct}%</b><span>Victorias</span></div>
        <div><b>${podiumPct}%</b><span>Podios</span></div>
        <div><b>${bestSimDistance(s)}</b><span>Mejor distancia</span></div>
      </div>
      <div class="recent-row"><small>ÚLTIMAS 5</small><div>${recent}</div></div>
    </article>`;
  }).join('');
}

function silkPreview(h){let bg;if(h.pattern==='stars')bg=`radial-gradient(circle at 30% 30%,${h.accent} 0 2px,transparent 2.5px),radial-gradient(circle at 72% 68%,${h.accent} 0 2px,transparent 2.5px),${h.silk}`;else if(h.pattern==='stripes')bg=`repeating-linear-gradient(90deg,${h.silk} 0 5px,${h.accent} 5px 10px)`;else if(h.pattern==='chestcross')bg=`linear-gradient(90deg,transparent 38%,${h.accent} 38% 62%,transparent 62%),linear-gradient(0deg,transparent 38%,${h.accent} 38% 62%,transparent 62%),${h.silk}`;else if(h.pattern==='solid')bg=h.silk;else bg=`linear-gradient(135deg,${h.silk} 0 43%,${h.accent} 44% 60%,${h.silk} 61%)`;return `<div style="width:30px;height:30px;border-radius:50%;border:2px solid ${h.accent};background:${bg}"></div>`;}
function renderRaces(){$('raceGrid').innerHTML=races.map(r=>`<article class="race-card ${state.selectedRace?.id===r.id?'selected':''}" data-race="${r.id}"><div class="eyebrow">${r.distance.toLocaleString('es-ES')} m</div><h3>${r.name}</h3><p>${r.venue}</p><div class="race-meta"><span class="pill gold">Favorece ${r.favors}</span></div></article>`).join('');document.querySelectorAll('[data-race]').forEach(c=>c.onclick=()=>{state.selectedRace=races.find(r=>r.id===c.dataset.race);$('chooseRaceBtn').disabled=false;renderRaces();});}
function renderHorses(){
  const d=currentRace().distance;
  $('horseGrid').innerHTML=horses.map(h=>{
    const sel=state.selected.has(h.id),fit=Math.round(distanceFit(h,d)*100);
    return `<article class="horse-card ${sel?'selected':''}" data-horse="${h.id}">
      <div class="select-mark">${sel?'✓':'+'}</div>
      <div style="display:flex;gap:10px;align-items:center">${silkPreview(h)}<div><div class="horse-number">Nº ${h.catalogNumber} · ${SPECIALTY[h.specialty].label}</div><h3>${h.name}</h3></div></div>
      <div class="horse-sub">${h.stable}<br>${h.preferredJockey}</div>
      <div class="horse-meta"><span>${h.coatName}</span><span>Ideal ${h.best[0].toLocaleString('es-ES')}–${h.best[1].toLocaleString('es-ES')} m</span></div>
      <div class="fitbar"><span style="width:${Math.min(100,fit)}%"></span></div>
      <div class="stats"><div>Nivel<b>${horseLevel(h)}</b></div><div>Velocidad<b>${h.speed}</b></div><div>Fondo<b>${h.stamina}</b></div><div>Acel.<b>${h.accel}</b></div></div>
    </article>`;
  }).join('');
  document.querySelectorAll('[data-horse]').forEach(c=>c.onclick=()=>{const id=c.dataset.horse;if(state.selected.has(id))state.selected.delete(id);else if(state.selected.size<12)state.selected.add(id);renderHorses();});
  renderSummary();
}
function renderSummary(){const r=currentRace();$('selectedCount').textContent=state.selected.size;$('confirmBtn').disabled=state.selected.size<6;$('raceSummary').innerHTML=`<b>${r.name}</b><br>${r.distance.toLocaleString('es-ES')} m · ${TRACK_CONDITION[state.trackCondition].label}`;$('selectedList').innerHTML=horses.filter(h=>state.selected.has(h.id)).map(h=>`<div class="selected-item"><b>${h.catalogNumber}. ${h.name}</b><span>${SPECIALTY[h.specialty].label}</span></div>`).join('');}
function openSelection(mode){state.mode=mode;state.selected.clear();$('selectionModeLabel').textContent=mode==='champ'?'Modo Campeonato':'Carrera Libre';$('freeDistanceControl').style.display=mode==='free'?'flex':'none';renderHorses();show('selectionScreen');}
$('freeBtn').onclick=()=>openSelection('free');
$('champBtn').onclick=()=>{state.mode='champ';state.selectedRace=null;$('chooseRaceBtn').disabled=true;renderRaces();show('championshipMenu');};
$('chooseRaceBtn').onclick=()=>openSelection('champ');
document.querySelectorAll('[data-go="mainMenu"]').forEach(b=>b.onclick=()=>show('mainMenu'));
$('selectionBack').onclick=()=>show(state.mode==='champ'?'championshipMenu':'mainMenu');
$('freeDistance').onchange=renderHorses;
if($('trackCondition'))$('trackCondition').onchange=()=>{state.trackCondition=$('trackCondition').value;renderHorses();};
$('randomBtn').onclick=()=>{state.selected.clear();[...horses].sort(()=>Math.random()-.5).slice(0,8).forEach(h=>state.selected.add(h.id));renderHorses();};
$('bestBtn').onclick=()=>{const d=currentRace().distance;state.selected.clear();[...horses].sort((a,b)=>rating(b,d)-rating(a,d)).slice(0,10).forEach(h=>state.selected.add(h.id));renderHorses();};

// ============================================================
// ESCENA: geometría basada en la versión La Zarzuela aportada
// ============================================================
let scene,camera,renderer,orbitControls,horseTemplate,horseClips={},worldBuilt=false;
let race=null,runners=[],route=null,gateGroup=null,raf=0,last=0,startTime=0,elapsed=0,running=false,finished=false,finishOrder=[],snapshot='',fieldAbility=0,finishPhotoPending=false,racePaceLeader=null,lastRankRender=0;
const manualCameraOffset=new THREE.Vector3();
const smoothCameraFocus=new THREE.Vector3();
let smoothCameraFocusReady=false;
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
const PARDO_EXIT_START_U=Math.max(0,PARDO_JOIN_U-.040);
const PARDO_EXIT_END_X=PARDO_JOIN_X+105;
function samplePardoExit(pts){
  const p0=mainCourseCurve.getPointAt(PARDO_EXIT_START_U).setY(.7);
  const t0=mainCourseCurve.getTangentAt(PARDO_EXIT_START_U).setY(0).normalize();
  const p3=new THREE.Vector3(PARDO_EXIT_END_X,.7,BOTTOM_Z);
  const c1=p0.clone().addScaledVector(t0,58);
  const c2=p3.clone().add(new THREE.Vector3(-66,0,0));
  const transition=new THREE.CubicBezierCurve3(p0,c1,c2,p3);
  for(let i=1;i<=120;i++)pts.push(transition.getPoint(i/120));
}
function buildOriginalShortRoute(d){
  const pts=[];
  if(d<=1200){sampleLine(FINISH_X-d,BOTTOM_Z,FINISH_X,BOTTOM_Z,180,pts);return new RaceRoute(pts);}
  const startU=d<=1400?LONG_START_U[1400]:LONG_START_U[1600];
  sampleCurveSegment(mainCourseCurve,startU,PARDO_EXIT_START_U,220,pts);
  samplePardoExit(pts);
  sampleLine(PARDO_EXIT_END_X,BOTTOM_Z,FINISH_X,BOTTOM_Z,150,pts);
  return new RaceRoute(pts);
}
function buildClosedLapSamples(){
  const pts=[];
  sampleLine(FINISH_X,BOTTOM_Z,TRACK_END_EXTENSION,BOTTOM_Z,20,pts);
  sampleCurveSegment(mainCourseCurve,0,PARDO_EXIT_START_U,450,pts);
  samplePardoExit(pts);
  sampleLine(PARDO_EXIT_END_X,BOTTOM_Z,FINISH_X,BOTTOM_Z,150,pts);
  return pts;
}
const CLOSED_LAP=buildClosedLapSamples();
const CLOSED_LAP_ROUTE=new RaceRoute(CLOSED_LAP);
function buildMidLongRoute(d){
  const nominalLap=1800,loops=Math.ceil(d/nominalLap),visualNudge=d===2000?-150:0,startNominal=Math.max(0,loops*nominalLap-d+visualNudge);
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
  if(d>=2500)return FINISH_X-740;
  if(d>=2400)return FINISH_X-680;
  if(d===2000)return FINISH_X-620;
  return FINISH_X-650;
}
function buildClassicLongRoute(d){
  const startX=classicLongStartX(d),pts=[];
  sampleLine(startX,BOTTOM_Z,FINISH_X,BOTTOM_Z,Math.max(160,Math.round((FINISH_X-startX)/3)),pts);
  for(let i=1;i<CLOSED_LAP.length;i++)pts.push(CLOSED_LAP[i].clone());
  return new RaceRoute(pts);
}
function buildRoute(d){
  if(d<=1600)return buildOriginalShortRoute(d);
  if(d===2000)return buildClassicLongRoute(d);
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
async function init3D(){if(renderer)return;scene=new THREE.Scene();scene.background=new THREE.Color(0x8fc7e8);camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,3000);camera.position.set(0,7,25);renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',alpha:false,stencil:false,depth:true,preserveDrawingBuffer:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.15));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=false;host.innerHTML='';host.appendChild(renderer.domElement);orbitControls=new OrbitControls(camera,renderer.domElement);orbitControls.enabled=false;orbitControls.enableDamping=true;orbitControls.dampingFactor=.08;orbitControls.minDistance=3;orbitControls.maxDistance=220;orbitControls.maxPolarAngle=Math.PI*.48;scene.add(new THREE.HemisphereLight(0xffffff,0x667755,2.25));const sun=new THREE.DirectionalLight(0xffffff,2.65);sun.position.set(100,180,80);scene.add(sun);buildWorld();const gltf=await loadRaceHorseGLB();horseTemplate=gltf.scene;horseClips=Object.fromEntries(gltf.animations.map(c=>[c.name,c]));if(!horseClips['horse.gallop'])throw new Error('El GLB no contiene horse.gallop');$('loadOverlay').classList.add('hidden');addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});}

function assignJockeys(field){
  const used=new Set(),stableSeen=new Map();
  return field.map((h,i)=>{
    let jockey=h.preferredJockey;
    if(used.has(jockey))jockey=JOCKEYS.find(j=>!used.has(j))||jockey;
    used.add(jockey);

    const stableIndex=stableSeen.get(h.stable)||0;
    stableSeen.set(h.stable,stableIndex+1);

    let capColor=h.accent;
    if(h.stable==='Yeguada Rocío'){
      capColor=[0xf5f5ef,0x0d5c3d,0xf5f5ef,0x0d5c3d][stableIndex%4];
    }else if(h.stable==='Becares'){
      capColor=[0xf05a18,0x1746b8,0xf05a18,0x1746b8][stableIndex%4];
    }else if(h.id==='safaga')capColor=0x20c9c3;
    else if(h.id==='sirjan')capColor=0xf05a18;
    else if(h.id==='fortun')capColor=0x090a0b;

    return {...h,assignedJockey:jockey,raceNumber:i+1,capColor};
  });
}
function drawStar(ctx,cx,cy,o,inn,n=5){let r=-Math.PI/2,step=Math.PI/n;ctx.beginPath();for(let i=0;i<n*2;i++){const rad=i%2===0?o:inn,x=cx+Math.cos(r)*rad,y=cy+Math.sin(r)*rad;i?ctx.lineTo(x,y):ctx.moveTo(x,y);r+=step;}ctx.closePath();ctx.fill();}
function silkTexture(h){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=h.silk;x.fillRect(0,0,256,256);x.fillStyle=h.accent;if(h.pattern==='stars')[[50,55],[160,50],[105,125],[195,150],[55,200],[160,210]].forEach(p=>drawStar(x,p[0],p[1],22,9));else if(h.pattern==='cross'){x.save();x.translate(128,128);x.rotate(-Math.PI/4);x.fillRect(-18,-190,36,380);x.rotate(Math.PI/2);x.fillRect(-18,-190,36,380);x.restore();}else if(h.pattern==='quarters'){x.fillRect(0,0,128,128);x.fillRect(128,128,128,128);}else if(h.pattern==='diagonal'){x.save();x.translate(128,128);x.rotate(-Math.PI/4);x.fillRect(-25,-190,50,380);x.restore();}else if(h.pattern==='stripes'){for(let sx=0;sx<256;sx+=48)x.fillRect(sx,0,24,256);}else if(h.pattern==='chestcross'){x.fillRect(112,38,32,180);x.fillRect(52,104,152,32);}else if(h.pattern==='solid'){}else x.fillRect(0,105,256,46);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
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
function addHorseMarkings(root,h,box,size){
  // Desactivado: las marcas añadidas como geometría podían quedar flotando al animarse.
}
function makeRunner(h){
  const root=new THREE.Group(),model=SkeletonUtils.clone(horseTemplate),jockeySilkTexture=silkTexture(h);
  if(renderer){
    jockeySilkTexture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    jockeySilkTexture.minFilter=THREE.LinearMipmapLinearFilter;
    jockeySilkTexture.magFilter=THREE.LinearFilter;
  }
  root.add(model);
  model.traverse(o=>{
    if(!o.isMesh)return;
    if(o.material)o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone();
    const mats=Array.isArray(o.material)?o.material:[o.material];
    const objectName=(o.name||'').toLowerCase();
    for(const mat of mats){
      const name=(mat?.name||'').toLowerCase();
      const horseLeg=/leg|limb|fetlock|pastern|cannon|sock/.test(name+' '+objectName);
      if(objectName.includes('jockey_helmet')){
        mat.map=null;
        setMaterialColor(mat,h.capColor??h.accent);
        mat.roughness=.68;
        mat.needsUpdate=true;
      }
      else if(name.includes('horse_teeth')){setMaterialColor(mat,0x5a493b);mat.map=null;mat.needsUpdate=true;}
      else if(name.includes('horse_gums')){setMaterialColor(mat,0x4a2727);mat.map=null;mat.needsUpdate=true;}
      else if(name.includes('horse_cornea')){mat.transparent=true;mat.opacity=.16;mat.depthWrite=false;mat.needsUpdate=true;}
      else if(name==='horse_hooves'||horseLeg||name.includes('hoof')||objectName.includes('hoof')){setMaterialColor(mat,0x090705);mat.map=null;mat.roughness=.88;mat.metalness=0;mat.needsUpdate=true;}
      else if(name.includes('horse.body.pattern')){
        setMaterialColor(mat,h.coat);
        mat.map=null;
        mat.normalMap=null;
        mat.roughnessMap=null;
        mat.metalnessMap=null;
        mat.aoMap=null;
        mat.roughness=.84;
        mat.metalness=0;
        mat.needsUpdate=true;
      }
      else if(name.includes('jockey_silk_main')||name.includes('jockey_silk_primary')){mat.map=jockeySilkTexture;setMaterialColor(mat,0xffffff);mat.roughness=.72;mat.needsUpdate=true;}
      else if(name.includes('jockey_silk_secondary'))setMaterialColor(mat,h.id==='safaga'?h.silk:h.accent);

      else if(name.includes('jockey_boot'))setMaterialColor(mat,0x171717);
      else if(name.includes('jockey_breeches')||name.includes('jockey_pants'))setMaterialColor(mat,0xf5f5f2);
      else if(name==='saddlecloth')setMaterialColor(mat,0x111111);
    }
  });
  // Forzamos el color del gorro directamente sobre los nodos reales del GLB.
  for(const capNodeName of ['JOCKEY_Helmet','JOCKEY_HelmetVisor']){
    const capNode=model.getObjectByName(capNodeName);
    if(capNode){
      capNode.traverse(part=>{
        if(!part.isMesh)return;
        const oldMats=Array.isArray(part.material)?part.material:[part.material];
        const newMats=oldMats.map(()=>new THREE.MeshLambertMaterial({
          color:h.capColor??h.accent
        }));
        part.material=Array.isArray(part.material)?newMats:newMats[0];
      });
    }
  }

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
  addHorseMarkings(root,h,box,size);
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

function tacticFor(h){
  if(h.speed>=96&&h.accel>=96)return 'front';
  if(h.stamina>=97&&h.speed<=92)return 'closer';
  if(h.accel>=94&&h.stamina>=94)return 'stalker';
  return ['front','stalker','closer'][h.catalogNumber%3];
}
function effortFor(r){
  const d=race.distance,remaining=Math.max(0,d-r.distance);
  let effort;
  if(d<=1600){
    if(remaining>520)effort=.70;
    else if(remaining>300)effort=.70+((520-remaining)/220)*.20;
    else effort=.92+((300-remaining)/300)*.08;
  }else if(d>=2000){
    if(remaining>600)effort=.64;
    else if(remaining>300)effort=.78+((600-remaining)/300)*.16;
    else effort=.94+((300-remaining)/300)*.06;
  }else{
    if(remaining>550)effort=.68;
    else if(remaining>300)effort=.76+((550-remaining)/250)*.16;
    else effort=.93+((300-remaining)/300)*.07;
  }
  if(r.tactic==='front'&&remaining>(d<=1600?520:600))effort+=.020;
  if(r.tactic==='closer'&&remaining<500)effort+=.035;
  if(r.tactic==='stalker'&&remaining<650)effort+=.018;
  return THREE.MathUtils.clamp(effort,.60,1);
}
function laneFree(r,lane,longitudinalWindow=7.5){
  const limit=TRACK_WIDTH/2-2.0;
  if(Math.abs(lane)>limit)return false;
  return !runners.some(o=>o!==r&&!o.finished&&Math.abs(o.distance-r.distance)<longitudinalWindow&&Math.abs(o.lateral-lane)<2.05);
}
function interiorSignFor(r){
  const f=THREE.MathUtils.clamp(r.distance/race.distance,0,1);
  const p=route.getPointAtFraction(f),tan=route.getTangentAtFraction(f);
  const side=new THREE.Vector3(-tan.z,0,tan.x).normalize();
  const infield=new THREE.Vector3(-82,0,BOTTOM_Z-98);
  const plus=p.clone().addScaledVector(side,2);
  const minus=p.clone().addScaledVector(side,-2);
  return plus.distanceToSquared(infield)<minus.distanceToSquared(infield)?1:-1;
}
function railTargetFor(r){
  return interiorSignFor(r)*(TRACK_WIDTH/2-3.0);
}
function turnIntensityFor(r){
  const f=THREE.MathUtils.clamp(r.distance/race.distance,0,1);
  const a=route.getTangentAtFraction(Math.max(0,f-.004));
  const b=route.getTangentAtFraction(Math.min(1,f+.004));
  const angle=Math.acos(THREE.MathUtils.clamp(a.dot(b),-1,1));
  return THREE.MathUtils.clamp(angle/.085,0,1);
}
function railEfficiencyFor(r){
  const rail=railTargetFor(r);
  const metresFromRail=Math.abs(r.lateral-rail);
  const wide=THREE.MathUtils.clamp((metresFromRail-1.0)/11.0,0,1);
  const turn=turnIntensityFor(r);
  // En curva el exterior recorre claramente más: el castigo llega a ~4.5% en la calle más abierta.
  return 1-wide*(.0045+.0405*turn);
}
function stepToward(value,target,step){
  if(Math.abs(target-value)<=step)return target;
  return value+Math.sign(target-value)*step;
}
function laneOpportunity(r,lane){
  const limit=TRACK_WIDTH/2-2.1;
  if(Math.abs(lane)>limit)return -999;
  let score=0;
  for(const o of runners){
    if(o===r||o.finished)continue;
    const longitudinal=o.distance-r.distance;
    const lateral=Math.abs(o.lateral-lane);
    if(lateral<1.65){
      if(longitudinal>0&&longitudinal<3.0)score-=8;
      else if(longitudinal>0&&longitudinal<7.0)score-=3.5;
      else if(Math.abs(longitudinal)<4.0)score-=2.0;
    }
  }
  return score;
}
function updateRaceAI(r,dt,live,leader){
  const scaledDt=dt*state.raceSpeed;
  r.nextDecision-=scaledDt;
  r.laneLock=Math.max(0,r.laneLock-scaledDt);

  const remaining=race.distance-r.distance;
  const finalAttackDistance=race.distance<=1600?440:575;
  const insideSign=interiorSignFor(r);
  const railTarget=railTargetFor(r);
  const turn=turnIntensityFor(r);
  const straightOnly=race.distance<=1200;
  const onFinalStraight=straightOnly||(remaining<=finalAttackDistance&&turn<.10);
  const inFinal=onFinalStraight;

  if(!inFinal){
    // Durante curvas y recorrido: pelotón compacto junto a la cuerda.
    // Los slots están medidos desde el rail hacia el exterior.
    const railSlots=[.75,2.15,3.55,4.95];
    const row=r.packRow||0;
    const col=r.packCol||0;
    const slotIndex=row===0?0:row===1?Math.min(1,col):Math.min(2,col);
    const preferredLane=railTarget-insideSign*railSlots[slotIndex];

    if(r.nextDecision<=0&&r.laneLock<=0){
      r.mergeBlocked=false;
      r.mustMerge=false;

      if(straightOnly){
        // 1000/1200 m: no obligamos a buscar cuerda porque el recorrido es recto.
        r.targetLateral=r.lateral;
        r.maneuver='straight-hold';
      }else{
        const metresFromRail=Math.abs(r.lateral-railTarget);
        const veryWide=metresFromRail>7.0;
        const wide=metresFromRail>5.25;

        // Al salir de cajones cerramos más deprisa; después el movimiento es más fino.
        const mergeStep=r.distance<70?2.05:(turn>.12?1.85:1.55);
        const desiredLane=stepToward(r.lateral,preferredLane,mergeStep);

        const blockerAhead=live
          .filter(o=>o!==r&&!o.finished)
          .filter(o=>o.distance>r.distance&&o.distance-r.distance<5.2)
          .sort((a,b)=>a.distance-b.distance)
          .find(o=>Math.abs(o.lateral-desiredLane)<1.85);

        if(!blockerAhead&&laneFree(r,desiredLane,4.25)){
          r.targetLateral=desiredLane;
          r.maneuver=veryWide?'close-hard':wide?'close-inside':'hold-rail-pack';
        }else{
          // Si el interior está ocupado, solo abrimos UNA calle para buscar el hueco.
          const outwardIndex=Math.min(railSlots.length-1,slotIndex+1);
          const outwardLane=railTarget-insideSign*railSlots[outwardIndex];

          if(blockerAhead&&laneFree(r,outwardLane,4.0)){
            r.targetLateral=stepToward(r.lateral,outwardLane,mergeStep*.85);
            r.maneuver='one-lane-out';
          }else{
            // Si tampoco hay hueco, se queda detrás: no cruza caballos ni se abre media pista.
            const smallInward=stepToward(r.lateral,preferredLane,mergeStep*.40);
            if(laneFree(r,smallInward,3.4)){
              r.targetLateral=smallInward;
              r.maneuver='queue-inside';
            }else{
              r.targetLateral=r.lateral;
              r.maneuver='wait-behind';
              r.mergeBlocked=true;
              r.mustMerge=veryWide;
            }
          }
        }
      }

      r.laneLock=(r.mustMerge?.24:.50)+Math.random()*.14;
      r.nextDecision=(r.mustMerge?.18:.30)+Math.random()*.13;
    }
  }else if(!r.finalMoveChosen){
    // Recta final: aquí sí se abre el abanico buscando una salida limpia.
    const finalSlots=[.85,2.65,4.65,6.85].map(x=>railTarget-insideSign*x);
    const candidates=finalSlots.map((lane,i)=>({
      name:['final-inside','final-middle','final-outside','final-wide'][i],
      lane,
      score:laneOpportunity(r,lane)+[1.05,.62,.25,0][i]
    }));

    if(r.tactic==='closer'){
      candidates[2].score+=.70;
      candidates[3].score+=.45;
    }
    if(r.tactic==='front')candidates[0].score+=.45;
    if(r.tactic==='stalker')candidates[1].score+=.40;

    const currentScore=laneOpportunity(r,r.lateral)+.30;
    const best=candidates.sort((a,b)=>b.score-a.score)[0];

    if(best.score>currentScore+.10){
      r.targetLateral=best.lane;
      r.maneuver=best.name;
    }else{
      r.targetLateral=r.lateral;
      r.maneuver='final-hold';
    }

    r.finalMoveChosen=true;
    r.laneLock=99;
    r.nextDecision=99;
  }

  // Cierre más decidido hacia cuerda; apertura final más rápida para que se vean los ataques.
  const lateralRate=inFinal?3.10:(turn>.10?2.35:1.85);
  const laneBlend=1-Math.exp(-lateralRate*scaledDt);
  const proposedLateral=THREE.MathUtils.lerp(r.lateral,r.targetLateral,laneBlend);
  const lateralConflict=runners.some(o=>
    o!==r&&!o.finished&&
    Math.abs(o.distance-r.distance)<4.35&&
    Math.abs(o.lateral-proposedLateral)<1.95
  );
  if(!lateralConflict)r.lateral=proposedLateral;

  r.effort=effortFor(r);
  if(r.effort>.78)r.energy=Math.max(.82,r.energy-scaledDt*(r.effort-.78)*.0034);
  else r.energy=Math.min(1,r.energy+scaledDt*.0007);
}
function placeRunner(r,gatePose=false){const fraction=THREE.MathUtils.clamp(r.distance/race.distance,0,1),p=route.getPointAtFraction(fraction),tan=route.getTangentAtFraction(fraction),side=new THREE.Vector3(-tan.z,0,tan.x).normalize();const target=p.clone().addScaledVector(side,r.lateral);if(gatePose)target.addScaledVector(tan,-1.25);target.y=.05;r.root.position.copy(target);r.root.rotation.y=Math.atan2(tan.x,tan.z);}

async function startRace(field,r){await init3D();cancelAnimationFrame(raf);runners.forEach(x=>{scene.remove(x.root);x.mixer.stopAllAction();});runners=[];clearGates();race={...r,condition:state.trackCondition};route=buildRoute(r.distance);running=false;finished=false;elapsed=0;finishOrder=[];snapshot='';finishPhotoPending=false;racePaceLeader=null;lastRankRender=0;raceStatsSaved=false;smoothCameraFocusReady=false;state.raceSpeed=1;state.cameraMode=0;state.paused=false;state.manualCamera=false;if(orbitControls)orbitControls.enabled=false;$('speedBtn').textContent='x1';$('cameraBtn').textContent='Cámara TV';if($('pauseBtn')){$('pauseBtn').textContent='Pausa';$('pauseBtn').disabled=true;}if($('startRaceBtn')){$('startRaceBtn').classList.add('show');$('startRaceBtn').disabled=false;}$('countdown').textContent='';$('finishFlash').classList.remove('show');$('tvRaceTitle').textContent=r.name.toUpperCase();$('tvVenue').textContent=r.venue+' · '+TRACK_CONDITION[state.trackCondition].label;$('commentary').textContent='Participantes cargados. Terreno: '+TRACK_CONDITION[state.trackCondition].label+'. Pulsa DAR LA SALIDA cuando quieras.';const assigned=assignJockeys(field);fieldAbility=assigned.reduce((s,h)=>s+ability(h,r.distance)*distanceFit(h,r.distance)*terrainFit(h),0)/assigned.length;const spacing=Math.min(1.82,(TRACK_WIDTH-4)/assigned.length);assigned.forEach((h,i)=>{const rig=makeRunner(h),runner={...rig,horse:h,distance:0,speed:0,lateral:(i-(assigned.length-1)/2)*spacing,targetLateral:(i-(assigned.length-1)/2)*spacing,startLateral:(i-(assigned.length-1)/2)*spacing,energy:1,effort:.7,tactic:tacticFor(h),blocked:false,nextDecision:.15+Math.random()*.25,laneLock:.35+Math.random()*.25,maneuver:'start',finalLaneChosen:false,finalMoveChosen:false,packSlot:0,packRow:0,packCol:0,finished:false,time:null,form:(Math.random()-.5)*.012,rivalry:rivalryBoost(h,assigned),phase:Math.random()*6.28};scene.add(runner.root);placeRunner(runner,true);runners.push(runner);});
const paceCandidates=runners.filter(x=>x.tactic==='front');
racePaceLeader=(paceCandidates.length?paceCandidates[Math.floor(Math.random()*paceCandidates.length)]:runners[0])||null;
const packOrder=[racePaceLeader,...runners.filter(x=>x!==racePaceLeader).sort((a,b)=>{
  const priority={front:0,stalker:1,closer:2};
  return (priority[a.tactic]??1)-(priority[b.tactic]??1) || rating(b.horse,r.distance)-rating(a.horse,r.distance);
})];
packOrder.forEach((runner,i)=>{
  runner.packSlot=i;
  if(i===0){
    runner.packRow=0;runner.packCol=0;
  }else if(i<=2){
    // Dos perseguidores: primera y segunda calle desde la cuerda.
    runner.packRow=1;runner.packCol=i-1;
  }else{
    // Resto: filas de tres, siempre priorizando las tres calles interiores.
    runner.packRow=2+Math.floor((i-3)/3);
    runner.packCol=(i-3)%3;
  }
});
createStartingGates(assigned.length);state.lastField=field;show('raceScreen');$('loadOverlay').classList.add('hidden');startTime=performance.now();last=performance.now();raf=requestAnimationFrame(loop);}

function targetSpeed(r,live,leader){
  const d=race.distance,h=r.horse,progress=r.distance/d,remaining=d-r.distance;
  const condition=TRACK_CONDITION[race.condition]||TRACK_CONDITION.normal;
  const base=(d<=1200?17.8:d<=1600?17.35:d<=2000?17.0:d<=2500?16.65:16.3)*condition.pace;
  const adjustedAbility=ability(h,d)*distanceFit(h,d)*terrainFit(h,race.condition);
  let factor=(1+(adjustedAbility-fieldAbility)*.00078)*(1+r.form+r.rivalry);
  const effortSpeed=.79+r.effort*.21;
  factor*=effortSpeed;
  factor*=.968+.032*r.energy;

  const gapToLeader=Math.max(0,(leader?.distance||r.distance)-r.distance);
  const nearestAhead=live
    .filter(o=>o!==r&&!o.finished&&o.distance>r.distance&&Math.abs(o.lateral-r.lateral)<1.80)
    .sort((a,b)=>a.distance-b.distance)[0];

  const finalAttackDistance=d<=1600?440:575;
  const packPhase=remaining>finalAttackDistance;
  if(packPhase&&racePaceLeader){
    const row=r.packRow||0;
    const col=r.packCol||0;
    // Pelotón escalonado: puntero, dos cerca detrás y luego filas separadas.
    let desiredGap=0;
    if(row===1)desiredGap=2.65+col*.75;
    else if(row>=2)desiredGap=5.85+(row-2)*3.75+col*.45;
    const actualGap=racePaceLeader.distance-r.distance;

    if(r===racePaceLeader){
      const second=live.find(o=>o!==r);
      if(second&&r.distance-second.distance>2.8)factor*=.984;
      else factor*=1.003;
    }else{
      const error=actualGap-desiredGap;
      if(error>0)factor*=1+Math.min(.055,error*.010);
      else factor*=1-Math.min(.050,Math.abs(error)*.011);
      if(r.distance>racePaceLeader.distance-.65)factor*=.945;
    }
  }else if(remaining>220){
    if(gapToLeader>6)factor*=1+Math.min(.020,(gapToLeader-6)*.0008);
  }

  if(nearestAhead){
    const draftGap=nearestAhead.distance-r.distance;
    if(draftGap>3&&draftGap<12){
      factor*=1.006;
      r.energy=Math.min(1,r.energy+.0005);
    }
    if(draftGap<2.2&&Math.abs(nearestAhead.lateral-r.lateral)<1.70){
      factor*=.925;
    }else if(draftGap<4.0&&Math.abs(nearestAhead.lateral-r.lateral)<1.70){
      factor*=.970;
    }
  }

  if(r.blocked)factor*=.990;
  if(r.mustMerge&&d>1200)factor*=.935;
  else if(r.mergeBlocked&&d>1200)factor*=.968;

  // El exterior paga la distancia extra durante toda la curva.
  // Solo se neutraliza cuando ya están realmente rectos en la recta final.
  const finalStraight=remaining<(d<=1600?440:575)&&turnIntensityFor(r)<.10;
  if(!finalStraight)factor*=railEfficiencyFor(r);
  else factor*=THREE.MathUtils.lerp(1,railEfficiencyFor(r),.06);

  const fatigue=progress*progress*Math.max(0,94-h.stamina)*.00056*(d>=2200?1.12:.70)*condition.fatigue;
  factor-=fatigue;
  if(remaining<300)factor*=1+(1-remaining/300)*(h.accel-88)*.00135;
  factor*=1+Math.sin(elapsed*.9+r.phase)*.0012;
  const min=h.specialty==='sprinter'&&d>=2400?.90:.91;
  return base*THREE.MathUtils.clamp(factor,min,1.05);
}
function captureFinishPhoto(){
  const oldPos=camera.position.clone(),oldQuat=camera.quaternion.clone(),oldFov=camera.fov;
  // Foto finish lateral: los caballos cruzan delante de la herradura, que queda centrada al fondo.
  camera.position.set(FINISH_X+.10,4.25,BOTTOM_Z+32);
  camera.fov=24;
  camera.updateProjectionMatrix();
  camera.lookAt(FINISH_X+.10,2.65,RAIL_Z_INNER-.82);
  renderer.render(scene,camera);
  snapshot=renderer.domElement.toDataURL('image/jpeg',.92);
  camera.position.copy(oldPos);
  camera.quaternion.copy(oldQuat);
  camera.fov=oldFov;
  camera.updateProjectionMatrix();
}
function loop(now){
  const dt=Math.min(.04,(now-last)/1000||.016);last=now;
  if(state.paused){
    if(orbitControls){orbitControls.enabled=true;orbitControls.update();}
    renderer.render(scene,camera);if(!finished)raf=requestAnimationFrame(loop);return;
  }else if(orbitControls){orbitControls.enabled=false;}
  if(!running){
    updateCamera(dt);
    if(now-lastRankRender>120){updateRank();lastRankRender=now;}
    renderer.render(scene,camera);
    if(!finished)raf=requestAnimationFrame(loop);return;
  }
  animateGates(dt);
  elapsed+=dt*state.raceSpeed;
  if(gateGroup&&elapsed>1.6)clearGates();
  const liveFrame=sorted(),leaderFrame=liveFrame[0]||null;
  runners.forEach(r=>{
    if(r.finished)return;
    updateRaceAI(r,dt,liveFrame,leaderFrame);
    const ts=targetSpeed(r,liveFrame,leaderFrame),resp=1-Math.exp(-(2.6+r.horse.accel*.01)*dt*state.raceSpeed);
    r.speed=THREE.MathUtils.lerp(r.speed,ts,resp);
    const previousDistance=r.distance;
    const proposedDistance=previousDistance+r.speed*dt*state.raceSpeed;
    const closeAhead=runners
      .filter(o=>o!==r&&!o.finished&&o.distance>previousDistance&&Math.abs(o.lateral-r.lateral)<2.20)
      .sort((a,b)=>a.distance-b.distance)[0];
    if(closeAhead){
      const maxAllowed=Math.max(previousDistance,closeAhead.distance-4.05);
      r.distance=Math.min(proposedDistance,maxAllowed);
    }else{
      r.distance=proposedDistance;
    }
    if(r.distance>=race.distance){r.distance=race.distance;r.finished=true;r.time=elapsed;finishOrder.push(r);if(finishOrder.length===1){finishPhotoPending=true;$('finishFlash').classList.add('show');}}
    placeRunner(r);r.mixer.update(dt*state.raceSpeed*(.82+r.speed/20));
  });
  // Cinturón de seguridad final: si dos caballos quedan demasiado juntos en la misma calle,
  // el de atrás se coloca detrás en vez de atravesar el modelo delantero.
  const safetyOrder=[...runners].filter(x=>!x.finished).sort((a,b)=>b.distance-a.distance);
  for(let i=0;i<safetyOrder.length;i++){
    const front=safetyOrder[i];
    for(let j=i+1;j<safetyOrder.length;j++){
      const back=safetyOrder[j];
      if(Math.abs(front.lateral-back.lateral)<2.20&&front.distance-back.distance<4.05){
        back.distance=Math.max(0,front.distance-4.05);
        back.speed=Math.min(back.speed,front.speed*.985);
      }
    }
  }
  runners.forEach(r=>{if(!r.finished)placeRunner(r);});

  if(finishPhotoPending){captureFinishPhoto();finishPhotoPending=false;}
  if(finishOrder.length===runners.length){finished=true;setTimeout(results,700);}
  updateCamera(dt);if(now-lastRankRender>90){updateRank();lastRankRender=now;}renderer.render(scene,camera);if(!finished)raf=requestAnimationFrame(loop);
}
function sorted(){return [...runners].sort((a,b)=>b.distance-a.distance||(a.time??999)-(b.time??999));}
function miniSilk(h){let bg;if(h.pattern==='stars')bg=`radial-gradient(circle at 30% 30%,${h.accent} 0 1.5px,transparent 2px),radial-gradient(circle at 70% 68%,${h.accent} 0 1.5px,transparent 2px),${h.silk}`;else if(h.pattern==='stripes')bg=`repeating-linear-gradient(90deg,${h.silk} 0 4px,${h.accent} 4px 8px)`;else if(h.pattern==='chestcross')bg=`linear-gradient(90deg,transparent 38%,${h.accent} 38% 62%,transparent 62%),linear-gradient(0deg,transparent 38%,${h.accent} 38% 62%,transparent 62%),${h.silk}`;else if(h.pattern==='solid')bg=h.silk;else bg=`linear-gradient(135deg,${h.silk} 0 44%,${h.accent} 45% 60%,${h.silk} 61%)`;return `<span style="width:18px;height:18px;min-width:18px;border-radius:50%;display:inline-block;border:1px solid rgba(255,255,255,.65);background:${bg};box-shadow:0 0 0 1px rgba(0,0,0,.25)"></span>`;}
function updateRank(){if(!race||!runners.length)return;const s=sorted(),lead=s[0];$('metersLeft').textContent=`${Math.max(0,Math.ceil(race.distance-lead.distance)).toLocaleString('es-ES')} m`;$('rankingRows').innerHTML=s.map((r,i)=>`<div class="rank-row"><div class="rank-pos">${i+1}</div><div style="display:flex;align-items:center;gap:7px;min-width:0">${miniSilk(r.horse)}<div class="rank-name"><b>${r.horse.raceNumber}. ${r.horse.name}</b><span>${r.horse.assignedJockey}</span></div></div><div class="rank-gap">${i?`-${Math.max(0,lead.distance-r.distance).toFixed(1)} m`:'LÍDER'}</div></div>`).join('');if(race.distance-lead.distance<650){const rem=race.distance-lead.distance;$('commentary').textContent=rem<300?'¡Últimos 300 metros! Ahora sí: todos a fondo hasta la meta.':rem<600?'Entrando en los últimos 600: empiezan los movimientos y los adelantamientos.':'El grupo se prepara para el ataque final.';}}
function setCameraFov(v){if(Math.abs(camera.fov-v)>.1){camera.fov=v;camera.updateProjectionMatrix();}}
function packCenter(){
  const c=new THREE.Vector3();if(!runners.length)return c;
  runners.forEach(r=>c.add(r.root.position));return c.divideScalar(runners.length);
}
function frontCameraFocus(){
  const s=sorted();
  if(!s.length)return {center:new THREE.Vector3(),lead:null,gap:0,frontSpread:0};
  const lead=s[0],second=s[1]||lead,gap=Math.max(0,lead.distance-second.distance);
  const cluster=s.filter(r=>lead.distance-r.distance<=48).slice(0,5);
  const center=new THREE.Vector3();
  let total=0;
  cluster.forEach((r,i)=>{
    const behind=Math.max(0,lead.distance-r.distance);
    const weight=i===0?3.5:Math.max(.55,2.0-behind/32);
    center.addScaledVector(r.root.position,weight);
    total+=weight;
  });
  if(total>0)center.divideScalar(total);else center.copy(lead.root.position);
  if(gap>45)center.lerp(lead.root.position,.72);
  else center.lerp(lead.root.position,.28);
  const last=cluster.at(-1)||lead;
  return {center,lead,gap,frontSpread:Math.max(0,lead.distance-last.distance)};
}
function updateCamera(dt){
  if(!runners.length)return;
  const focus=frontCameraFocus(),lead=focus.lead;
  if(!smoothCameraFocusReady){smoothCameraFocus.copy(focus.center);smoothCameraFocusReady=true;}
  else smoothCameraFocus.lerp(focus.center,1-Math.exp(-3.4*dt));
  const center=smoothCameraFocus;

  if(state.manualCamera){
    const desired=center.clone().add(manualCameraOffset);
    camera.position.lerp(desired,1-Math.exp(-4.0*dt));
    const target=center.clone();target.y=1.8;
    camera.lookAt(target);
    return;
  }
  const f=THREE.MathUtils.clamp(lead.distance/race.distance,0,1),tan=route.getTangentAtFraction(f);
  const rawSide=new THREE.Vector3(tan.z,0,-tan.x).normalize();
  const infieldCenter=new THREE.Vector3(-82,0,BOTTOM_Z-98);
  const candidateA=center.clone().addScaledVector(rawSide,16);
  const candidateB=center.clone().addScaledVector(rawSide,-16);
  const insidePos=candidateA.distanceToSquared(infieldCenter)<candidateB.distanceToSquared(infieldCenter)?candidateA:candidateB;
  const insideDir=insidePos.clone().sub(center).normalize();
  const outsideDir=insideDir.clone().negate();
  const remaining=race.distance-lead.distance;
  const separation=Math.max(focus.gap,focus.frontSpread);
  let desired,target=center.clone();
  if(state.cameraMode===0){
    const final=remaining<500;
    const extra=THREE.MathUtils.clamp(separation/55,0,1);
    setCameraFov((final?30:33)+extra*8);
    desired=center.clone().addScaledVector(outsideDir,(final?19:24)+extra*10).addScaledVector(tan,final?15:20);
    desired.y=(final?5.8:8.3)+extra*4.5;
    target=center.clone().lerp(lead.root.position,focus.gap>35?.55:.22).addScaledVector(tan,final?-3:-5);target.y=1.9;
  }else if(state.cameraMode===1){
    setCameraFov(50);desired=center.clone().lerp(lead.root.position,.35);desired.y=78+Math.min(22,separation*.25);target.copy(center).lerp(lead.root.position,.45);target.y=0;
  }else if(state.cameraMode===2){
    const extra=THREE.MathUtils.clamp(separation/60,0,1);
    setCameraFov(38+extra*7);desired=insidePos.clone().addScaledVector(tan,-3);desired.y=4.7+extra*2.5;target=center.clone().lerp(lead.root.position,.45).addScaledVector(tan,5);target.y=1.8;
  }else if(state.cameraMode===3){
    setCameraFov(35);desired=lead.root.position.clone().addScaledVector(outsideDir,9).addScaledVector(tan,5);desired.y=3.5;target=lead.root.position.clone().addScaledVector(tan,-2);target.y=1.7;
  }else{
    setCameraFov(30);desired=new THREE.Vector3(FINISH_X,4.8,BOTTOM_Z+43);target=new THREE.Vector3(FINISH_X,1.8,BOTTOM_Z);
  }
  camera.position.lerp(desired,1-Math.exp(-5.5*dt));camera.lookAt(target);
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
  saveRaceStats(rr);
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
  $('podium').innerHTML=rr.slice(0,3).map((r,i)=>`<div class="podium-card"><span>${i+1}º</span><div style="display:flex;align-items:center;gap:9px;min-width:0">${miniSilk(r.horse)}<b>${r.horse.raceNumber}. ${r.horse.name}</b></div><small>${r.horse.assignedJockey}</small></div>`).join('');
  $('classification').innerHTML=rr.map((r,i)=>`<div class="class-row"><strong>${i+1}º</strong><div><b>${r.horse.raceNumber}. ${r.horse.name}</b><br><span>${r.horse.stable}</span></div><span>${r.horse.assignedJockey}</span><b>${i?`+${(r.time-winner).toFixed(2)}s`:r.time.toFixed(2)+'s'}</b></div>`).join('');
  show('resultsScreen');
}

$('confirmBtn').onclick=()=>{const field=horses.filter(h=>state.selected.has(h.id));if(field.length>=6)startRace(field,currentRace());};
$('speedBtn').onclick=()=>{state.raceSpeed=state.raceSpeed===1?1.5:state.raceSpeed===1.5?2:1;$('speedBtn').textContent='x'+state.raceSpeed;};
if($('startRaceBtn'))$('startRaceBtn').onclick=()=>{if(running||finished)return;running=true;elapsed=0;last=performance.now();openGates();$('startRaceBtn').classList.remove('show');$('startRaceBtn').disabled=true;if($('pauseBtn'))$('pauseBtn').disabled=false;$('commentary').textContent='¡Se abren los cajones! Comienza la carrera.';};
$('cameraBtn').onclick=()=>{state.manualCamera=false;state.cameraMode=(state.cameraMode+1)%5;$('cameraBtn').textContent=['Cámara TV','Cámara aérea','Cámara rail','Cámara cercana','Cámara meta'][state.cameraMode];};
if($('pauseBtn'))$('pauseBtn').onclick=()=>{if(!running||finished)return;if(!state.paused){state.paused=true;state.manualCamera=false;if(orbitControls){orbitControls.enabled=true;const f=frontCameraFocus();orbitControls.target.copy(f.center).setY(1.8);orbitControls.update();}$('pauseBtn').textContent='Reanudar';$('commentary').textContent='Carrera en pausa · coloca la cámara donde quieras.';}else{const f=frontCameraFocus();manualCameraOffset.copy(camera.position).sub(f.center);state.paused=false;state.manualCamera=true;if(orbitControls)orbitControls.enabled=false;$('pauseBtn').textContent='Pausa';$('commentary').textContent='Cámara libre siguiendo el pelotón · pulsa Cámara para volver a una vista TV.';}};
$('exitRaceBtn').onclick=()=>{cancelAnimationFrame(raf);show('mainMenu');};
$('menuFromResults').onclick=()=>show('mainMenu');
$('repeatBtn').onclick=()=>startRace(state.lastField,currentRace());
$('anotherBtn').onclick=()=>show(state.mode==='champ'?'championshipMenu':'selectionScreen');

if($('statsBtn'))$('statsBtn').onclick=()=>{renderStatsScreen();show('statsScreen');};
if($('statsBack'))$('statsBack').onclick=()=>show('mainMenu');
if($('trophiesBtn'))$('trophiesBtn').onclick=()=>show('trophiesScreen');
if($('trophiesBack'))$('trophiesBack').onclick=()=>show('mainMenu');
renderRaces();renderHorses();