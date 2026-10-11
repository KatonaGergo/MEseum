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
