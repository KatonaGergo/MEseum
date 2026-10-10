import * as THREE from 'three';

// Egyszínű, "lapos árnyalású" anyag: ettől lesz retro a kinézet.
export const mat = (color) => new THREE.MeshLambertMaterial({ color, flatShading: true });

// A tárgyak egyszerű testekből (doboz, henger, gömb) állnak össze.
// A "shape" szöveg alapján dől el, melyik tárgyat építjük meg.
export function model(shape, color) {
  const g = new THREE.Group();
  const part = (geometry, c, x, y, z, rotation = [0, 0, 0]) => {
    const m = new THREE.Mesh(geometry, mat(c));
    m.position.set(x, y, z);
    m.rotation.set(...rotation);
    g.add(m);
  };
  const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const cyl = (r, h) => new THREE.CylinderGeometry(r, r, h, 8);

  if (shape === 'ball') part(new THREE.IcosahedronGeometry(0.35, 1), color, 0, 0.35, 0);
  else if (shape === 'book') { part(box(0.55, 0.12, 0.75), color, 0, 0.06, 0); part(box(0.5, 0.1, 0.7), 0xffffff, 0.03, 0.06, 0); }
  else if (shape === 'piano') { part(box(1.2, 0.4, 0.6), color, 0, 0.2, 0); part(box(1.2, 0.08, 0.25), 0xffffff, 0, 0.44, 0.2); part(box(1.2, 0.5, 0.1), color, 0, 0.65, -0.25); }
  else if (shape === 'dumbbell') { part(cyl(0.04, 0.9), color, 0, 0.3, 0, [0, 0, 1.57]); part(cyl(0.2, 0.12), color, -0.4, 0.3, 0, [0, 0, 1.57]); part(cyl(0.2, 0.12), color, 0.4, 0.3, 0, [0, 0, 1.57]); }
  else if (shape === 'rope') part(new THREE.TorusGeometry(0.3, 0.03, 6, 12), color, 0, 0.35, 0, [0.4, 0, 0]);
  else if (shape === 'monitor') { part(box(0.9, 0.55, 0.06), color, 0, 0.6, 0); part(box(0.8, 0.45, 0.02), 0x2a5ae8, 0, 0.6, 0.04); part(box(0.15, 0.3, 0.15), color, 0, 0.15, 0); }
  else if (shape === 'cap') { part(box(0.8, 0.05, 0.8), color, 0, 0.35, 0); part(cyl(0.25, 0.25), color, 0, 0.2, 0); }
  else if (shape === 'flask') { part(cyl(0.28, 0.4), color, 0, 0.2, 0); part(cyl(0.08, 0.35), color, 0, 0.55, 0); }
  else if (shape === 'controller') { part(box(0.7, 0.15, 0.4), color, 0, 0.3, 0); part(new THREE.IcosahedronGeometry(0.06, 0), 0xe8222a, 0.2, 0.4, 0); part(new THREE.IcosahedronGeometry(0.06, 0), 0x2a5ae8, 0.3, 0.4, 0.05); }
  else if (shape === 'car') { part(box(0.8, 0.15, 0.4), color, 0, 0.18, 0); part(box(0.4, 0.15, 0.35), 0xffffff, 0, 0.32, 0); [[-0.28, -0.22], [0.28, -0.22], [-0.28, 0.22], [0.28, 0.22]].forEach(([x, z]) => part(cyl(0.1, 0.08), 0x111111, x, 0.1, z, [1.57, 0, 0])); }
  else if (shape === 'lego') { part(box(0.6, 0.35, 0.4), color, 0, 0.18, 0); part(cyl(0.08, 0.08), color, -0.15, 0.4, 0); part(cyl(0.08, 0.08), color, 0.15, 0.4, 0); }
  else if (shape === 'chess') { part(cyl(0.2, 0.1), color, 0, 0.05, 0); part(cyl(0.1, 0.4), color, 0, 0.3, 0); part(new THREE.IcosahedronGeometry(0.14, 1), color, 0, 0.58, 0); }
  else if (shape === 'card') { part(box(0.8, 0.03, 0.55), color, 0, 0.3, 0, [-0.5, 0, 0]); part(box(0.7, 0.03, 0.45), 0xffffff, 0, 0.31, 0.01, [-0.5, 0, 0]); }
  else if (shape === 'plane') { part(box(0.15, 0.15, 0.9), color, 0, 0.35, 0); part(box(0.9, 0.04, 0.25), color, 0, 0.35, 0); part(box(0.3, 0.04, 0.12), color, 0, 0.35, 0.4); }
  else if (shape === 'globe') { part(cyl(0.2, 0.05), 0x222222, 0, 0.03, 0); part(cyl(0.03, 0.3), 0x222222, 0, 0.2, 0); part(new THREE.IcosahedronGeometry(0.3, 1), color, 0, 0.6, 0); }
  else if (shape === 'crystal') { part(new THREE.ConeGeometry(0.2, 0.7, 5), color, 0, 0.35, 0); part(new THREE.ConeGeometry(0.12, 0.45, 5), color, 0.25, 0.22, 0.05, [0, 0, -0.4]); }
  else if (shape === 'bassoon') { part(cyl(0.07, 1.1), color, 0, 0.55, 0); part(cyl(0.12, 0.2), 0xc9a227, 0, 0.1, 0); part(cyl(0.03, 0.4), 0x333333, 0.12, 1.15, 0, [0, 0, -1]); }
  else if (shape === 'recorder') { part(cyl(0.05, 0.9), color, 0, 0.2, 0, [0, 0, 1.4]); part(new THREE.IcosahedronGeometry(0.04, 0), 0x111111, 0, 0.3, 0.05); }
  else if (shape === 'clock') { part(box(0.5, 1.1, 0.3), color, 0, 0.55, 0); part(cyl(0.18, 0.05), 0xffffff, 0, 0.85, 0.16, [1.57, 0, 0]); part(cyl(0.04, 0.3), 0xc9a227, 0, 0.35, 0.16); }
  else if (shape === 'glasses') { part(new THREE.TorusGeometry(0.13, 0.02, 6, 12), color, -0.17, 0.3, 0); part(new THREE.TorusGeometry(0.13, 0.02, 6, 12), color, 0.17, 0.3, 0); part(box(0.1, 0.02, 0.02), color, 0, 0.32, 0); }
  else if (shape === 'pencil') { part(cyl(0.04, 0.9), color, 0, 0.2, 0, [0, 0, 1.4]); part(new THREE.ConeGeometry(0.04, 0.14, 6), 0x222222, -0.5, 0.28, 0, [0, 0, 1.4]); }
  else if (shape === 'belt') { part(new THREE.TorusGeometry(0.3, 0.05, 6, 12), color, 0, 0.15, 0, [1.57, 0, 0]); part(box(0.15, 0.06, 0.1), 0xc9a227, 0.3, 0.15, 0); }
  else part(box(0.6, 0.6, 0.6), color, 0, 0.3, 0); // ismeretlen alak: sima kocka
  return g;
}
