import * as THREE from 'three';
import { TEAM_NAME, OWNERS } from './data.js';
import { buildMuseum, world, colliders, ROOMS } from './museum.js';
import { model, mat } from './models.js';

const $ = (id) => document.getElementById(id);   // rövidítés: elem keresése id alapján

// ================= 1. JELENET =================
const canvas = $('c');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(0.6);                       // kis felbontás = pixeles, retro kép
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 400);
camera.rotation.order = 'YXZ';                     // először fordulunk, utána nézünk fel-le

const hemi = new THREE.HemisphereLight(0xffffff, 0x444455);   // általános égi fény
const sun = new THREE.DirectionalLight(0xfff1d0);             // napfény
const sunBall = new THREE.Mesh(new THREE.SphereGeometry(5, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfff2a0, fog: false }));
scene.add(hemi, sun, sunBall, world);
scene.background = new THREE.Color();
scene.fog = new THREE.Fog(0x000000, 40, 140);
buildMuseum();                                     // az épület és a kültér (museum.js)

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

// ================= 2. KIÁLLÍTÁS =================
let exhibits = new THREE.Group();                  // az aktuális tárgyak
const exhibitColliders = [];                       // a talapzatok ütközési téglalapjai
let hovered = null;                                // a tárgy, amire éppen nézünk
let currentOwner = -1;

// Újraépíti a tárgyakat az adott tulajdonos adatai alapján (data.js).
function buildExhibits(ownerIndex) {
  scene.remove(exhibits);
  exhibits = new THREE.Group();
  scene.add(exhibits);
  exhibitColliders.length = 0;
  const owner = OWNERS[ownerIndex];

  // Hol vannak a tárgysorok: a csarnok közepén (intro) és a 4 szobában.
  const places = [{ key: 'intro', at: [0, 0], step: [1.7, 0] }, ...ROOMS];
  places.forEach((place) => {
    const items = owner.rooms[place.key];
    items.forEach((item, i) => {
      const n = i - (items.length - 1) / 2;        // sorszám a sor közepétől számolva
      const x = place.at[0] + place.step[0] * n;
      const z = place.at[1] + place.step[1] * n;
      const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1, 0.9), mat(0x222222));
      pedestal.position.y = 0.5;
      const object = model(item.shape, item.color);
      object.position.y = 1;                       // a talapzat tetejére
      const holder = new THREE.Group();
      holder.add(pedestal, object);
      holder.position.set(x, 0, z);
      holder.userData.item = item;                 // ide tesszük az adatot, hogy később megtaláljuk
      exhibits.add(holder);
      exhibitColliders.push({ x0: x - 0.5, x1: x + 0.5, z0: z - 0.5, z1: z + 0.5 });
    });
  });
  currentOwner = ownerIndex;
  $('owner').textContent = `${owner.name} – ${owner.role}`;
  $('ownerSel').value = ownerIndex;
}

// ================= 3. NAPSZAK =================
let hour = 12;                                     // játékbeli óra (0–24)
let secPerHour = 60;                               // hány valós másodperc egy játékbeli óra
const NIGHT = new THREE.Color(0x0a0a1e);
const DAY = new THREE.Color(0xbfe3ff);

function updateTime() {
  // angle: déli 12 órakor a nap a legmagasabban van, éjfélkor a legalacsonyabban.
  const angle = ((hour - 6) / 24) * Math.PI * 2;
  const daylight = 0.5 + 0.5 * Math.sin(angle);    // 0 = éjszaka, 1 = dél
  scene.background.copy(NIGHT).lerp(DAY, daylight);
  scene.fog.color.copy(scene.background);
  hemi.intensity = 0.5 + 0.9 * daylight;
  sun.intensity = 2.2 * daylight;
  sun.position.set(Math.cos(angle) * 20, 15, 8);
  sunBall.position.set(Math.cos(angle) * 120, Math.sin(angle) * 120, -40);

  const h = Math.floor(hour), m = Math.floor((hour % 1) * 60);
  $('clock').textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');

  // Melyik tulajdonos időszakában vagyunk? Ha változott, cseréljük a kiállítást.
  const owner = OWNERS.findIndex((o) => hour >= o.from && hour < o.to);
  if (owner !== currentOwner) buildExhibits(owner);
}
function jumpToOwner(i) { hour = OWNERS[i].from + 1; updateTime(); }
function setSpeed(value) {
  secPerHour = Math.min(600, Math.max(0.5, value));
  $('speed').value = Math.min(120, secPerHour);
  $('spV').textContent = +secPerHour.toFixed(1);
}

// ================= 4. IRÁNYÍTÁS =================
const keys = {};                                   // melyik billentyű van lenyomva
let yaw = 0, pitch = 0;                            // balra-jobbra és fel-le nézés (radián)
let locked = false;                                // be van-e zárva az egér a játékba
const pos = new THREE.Vector3(8, 1.7, 34);         // kezdőpont: a múzeum előtt, kint

addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3') jumpToOwner(+e.code.slice(5) - 1);
  if (e.code === 'Equal' || e.code === 'NumpadAdd') setSpeed(secPerHour / 1.5);        // + : gyorsabb idő
  if (e.code === 'Minus' || e.code === 'NumpadSubtract') setSpeed(secPerHour * 1.5);   // - : lassabb idő
});
addEventListener('keyup', (e) => (keys[e.code] = false));
addEventListener('mousemove', (e) => {
  if (!locked) return;
  yaw -= e.movementX * 0.0022;
  pitch = Math.max(-1.4, Math.min(1.4, pitch - e.movementY * 0.0022));
});
$('pause').addEventListener('click', (e) => {
  if (e.target.id === 'go' || e.target.id === 'pause') canvas.requestPointerLock();
});
document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === canvas;
  $('pause').hidden = locked;                      // menü látszik, ha nincs bezárva az egér
});

// Szabad-e a (x, z) pont? Nem, ha belelógna egy falba/talapzatba (0.4 m a játékos sugara).
function isFree(x, z) {
  const r = 0.4;
  if (Math.abs(x) > 60 || Math.abs(z) > 60) return false;           // a világ széle
  return ![...colliders, ...exhibitColliders].some(
    (c) => x > c.x0 - r && x < c.x1 + r && z > c.z0 - r && z < c.z1 + r);
}
function movePlayer(dt) {
  const forward = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0);
  const right = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
  const length = Math.hypot(forward, right) || 1;                   // átlósan se legyen gyorsabb
  const speed = keys.ShiftLeft || keys.ShiftRight ? 7 : 4;
  const step = (speed * dt) / length;
  const dx = (-Math.sin(yaw) * forward + Math.cos(yaw) * right) * step;
  const dz = (-Math.cos(yaw) * forward - Math.sin(yaw) * right) * step;
  if (isFree(pos.x + dx, pos.z)) pos.x += dx;      // x és z irányt külön vizsgáljuk,
  if (isFree(pos.x, pos.z + dz)) pos.z += dz;      // így a fal mentén tudunk csúszni
}

// ================= 5. TÁRGYRA NÉZÉS =================
const raycaster = new THREE.Raycaster();
raycaster.far = 4.5;                               // legfeljebb ennyi méterről
function lookAtExhibit() {
  raycaster.setFromCamera({ x: 0, y: 0 }, camera); // sugár a képernyő közepéből
  const hit = raycaster.intersectObjects(exhibits.children, true)[0];
  let target = hit ? hit.object : null;
  while (target && !target.userData.item) target = target.parent;   // felmegyünk a tárgy csoportjáig

  if (target === hovered) return;
  if (hovered) hovered.traverse((o) => o.material?.emissive?.setHex(0x000000));   // régi kiemelés le
  hovered = target;
  $('info').hidden = !hovered;
  if (hovered) {
    hovered.traverse((o) => o.material?.emissive?.setHex(0x444444));              // új kiemelés fel
    $('iTitle').textContent = hovered.userData.item.name;
    $('iText').textContent = hovered.userData.item.text;
  }
}
