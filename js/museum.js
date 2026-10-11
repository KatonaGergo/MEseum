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

