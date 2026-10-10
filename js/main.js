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
