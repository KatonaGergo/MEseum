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
