import * as THREE from 'three';
import { mat } from './models.js';

// Koordináták: x = jobbra, z = felénk (a múzeum "eleje" dél, +z), y = fel. Méter egységben.
// A csarnok a (0,0) pont körül van, 20x20 méteres. Mind a 4 oldalán egy-egy szoba csatlakozik.
export const WH = 5;          // falmagasság
const T = 0.4;                // falvastagság
const WOOD = 0x4a2f1c, GOLD = 0xc9a227, MARBLE = 0xf2ecdf, HALL = 0xe8dcc0;   // antik színek
export const world = new THREE.Group();   // minden, amit itt építünk, ebbe kerül
export const colliders = [];  // téglalapok, amiken a játékos nem mehet át

// ---- Segédfüggvények ----
// Egy doboz: méret (w,h,d), középpont (x,y,z), szín vagy anyag.
function box(w, h, d, x, y, z, look) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof look === 'number' ? mat(look) : look);
  m.position.set(x, y, z);
  world.add(m);
}
// Ütközési téglalap felvétele (középpont + méret).
export function addCollider(x, z, w, d) {
  colliders.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2 });
}
// Fal két pont között (x1,z1)-(x2,z2): látszik is, és át sem lehet menni rajta.
function wall(x1, z1, x2, z2, color) {
  const w = Math.abs(x2 - x1) + T, d = Math.abs(z2 - z1) + T;
  const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
  box(w, WH, d, cx, WH / 2, cz, color);
  box(w + 0.06, 1.1, d + 0.06, cx, 0.55, cz, WOOD);          // faburkolat a fal alján
  box(w + 0.12, 0.25, d + 0.12, cx, WH - 0.125, cz, GOLD);   // aranyozott párkány felül
  addCollider(cx, cz, w, d);
}
// Felirattábla (canvas-ra rajzolt szöveg), rotY = merre néz.
function sign(text, width, x, y, z, rotY) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = '#e8222a'; ctx.font = 'bold 44px monospace'; ctx.textAlign = 'center';
  ctx.fillText(text, 128, 48);
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(width, width / 4), new THREE.MeshBasicMaterial({ map: texture }));
  m.position.set(x, y, z);
  m.rotation.y = rotY;
  world.add(m);
}
// Csillár: arany gyűrű, rúd és 6 izzó.
function chandelier(x, z, r) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.05, 6, 16), mat(GOLD));
  ring.rotation.x = Math.PI / 2;
  ring.position.set(x, WH - 1.2, z);
  world.add(ring);
  box(0.06, 1.2, 0.06, x, WH - 0.6, z, GOLD);
  for (let i = 0; i < 6; i++) {
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 4), new THREE.MeshBasicMaterial({ color: 0xfff2b0 }));
    bulb.position.set(x + Math.cos(i * 1.047) * r, WH - 1.1, z + Math.sin(i * 1.047) * r);
    world.add(bulb);
  }
}
// Sakktábla-padló: 2x2 pixeles képet ismételünk.
function checkerFloor() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 2;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#efe6d2'; ctx.fillRect(0, 0, 2, 2);
  ctx.fillStyle = '#5a4a3a'; ctx.fillRect(0, 0, 1, 1); ctx.fillRect(1, 1, 1, 1);
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  return new THREE.MeshLambertMaterial({ map: texture });
}

// ---- A szobák adatai ----
// at/step: hová kerül a tárgysor közepe, és milyen irányban követik egymást a tárgyak.
// door: az ajtónyílás feletti áthidaló (pontosan akkora, mint a nyílás). roof: a tető közepe és mérete.
// Szabály: két elem ne fedje egymást! Ha igen, a közös felületek villognak (z-fighting).
// door: sign: a felirat helye [x, z, forgatás].
const P = Math.PI / 2;
export const ROOMS = [
  { key: 'hobby', label: 'HOBBY', x: 0, z: -16, w: 12, d: 12, wallColor: 0xc9a46e, floorColor: 0x6b4a2a,
    walls: [[-6, -10.2, -6, -22], [6, -10.2, 6, -22], [-6, -22, 6, -22]],
    door: [0, -10, 3.6, T], roof: [0, -16.2, 12.4, 12], sign: [0, -9.78, 0], at: [0, -19], step: [1.7, 0] },
  { key: 'future', label: 'FUTURE', x: 16, z: 0, w: 12, d: 12, wallColor: 0x8fa6b3, floorColor: 0x4a5a6b,
    walls: [[10.2, -6, 22, -6], [10.2, 6, 22, 6], [22, -6, 22, 6]],
    door: [10, 0, T, 3.6], roof: [16.2, 0, 12, 12.4], sign: [9.78, 0, -P], at: [19, 0], step: [0, 1.7] },
  { key: 'gift', label: 'GIFT', x: 0, z: 16, w: 12, d: 12, wallColor: 0xa85c5c, floorColor: 0x5a2a2a,
    walls: [[-6, 10.2, -6, 22], [6, 10.2, 6, 22], [-6, 22, 6, 22]],
    door: [0, 10, 3.6, T], roof: [0, 16.2, 12.4, 12], sign: [0, 9.78, 2 * P], at: [0, 19], step: [1.7, 0] },
  { key: 'past', label: 'PAST', x: -16, z: 0, w: 12, d: 12, wallColor: 0x86a07a, floorColor: 0x4a5a3a,
    walls: [[-10.2, -6, -22, -6], [-10.2, 6, -22, 6], [-22, -6, -22, 6]],
    door: [-10, 0, T, 3.6], roof: [-16.2, 0, 12, 12.4], sign: [-9.78, 0, P], at: [-19, 0], step: [0, 1.7] },
];

// A csarnok falai. A déli falban (z=10) két nyílás van: a GIFT szoba ajtaja és a bejárat (x 6.5 és 9.5 között).
const HALL_WALLS = [
  [-10, -10, -2, -10], [2, -10, 10, -10],   // északi fal (HOBBY ajtó)
  [10, -10, 10, -2], [10, 2, 10, 10],       // keleti fal (FUTURE ajtó)
  [-10, 10, -2, 10], [2, 10, 6.5, 10], [9.5, 10, 10, 10],  // déli fal (GIFT ajtó + bejárat)
  [-10, -10, -10, -2], [-10, 2, -10, 10],   // nyugati fal (PAST ajtó)
];
const TREES = [[-20, 30], [-12, 40], [-30, 15], [30, 28], [24, 40], [38, 12], [-36, -10], [-30, -30], [0, -40], [30, -30], [40, -8], [-8, 28], [20, 26]];

// ---- Az egész világ felépítése ----
export function buildMuseum() {
  // Kültér: fű, kövezett út a bejárathoz, fák
  box(300, 0.2, 300, 0, -0.15, 0, 0x5a8f4e);
  box(3, 0.05, 40, 8, 0.02, 30, 0xb8b2a6);
  TREES.forEach(([x, z]) => {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 2, 6), mat(0x6b4a2a));
    trunk.position.set(x, 1, z);
    const top = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4, 6), mat(0x2f6f3a));
    top.position.set(x, 4, z);
    world.add(trunk, top);
    addCollider(x, z, 0.8, 0.8);
  });
}
