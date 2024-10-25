import * as THREE from "three";

const group = new THREE.Group();
const textureLoader = new THREE.TextureLoader();

const APP_TOTAL_WIDTH = 3000;
const APP_PADDING_LEFT = 420;
const APP_CALCULATED_WIDTH = APP_TOTAL_WIDTH - APP_PADDING_LEFT;
const APP_WOOD_HEIGHT = 12;
const APP_GARDENER_SIZE = 40;

let element, geometry, material, texture;

function loadTexture(path: string) {
  const texture = textureLoader.load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

// Horizontal
for (var n = 0; n < 2; n++) {
  texture = loadTexture("assets/textures/douglas_veinage.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(0.8, 0.5);
  geometry = new THREE.BoxGeometry(APP_CALCULATED_WIDTH, APP_WOOD_HEIGHT, 20);
  material = new THREE.MeshLambertMaterial({
    map: texture,
    wireframe: false,
  });
  element = new THREE.Mesh(geometry, material);
  element.position.set(0, (APP_WOOD_HEIGHT + 0.25) * n, APP_GARDENER_SIZE + 20);
  group.add(element);
}

texture = loadTexture("assets/textures/douglas_veinage.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(0.8, 0.5);
geometry = new THREE.BoxGeometry(
  APP_WOOD_HEIGHT,
  APP_WOOD_HEIGHT,
  APP_GARDENER_SIZE,
);
material = new THREE.MeshLambertMaterial({
  map: texture,
  wireframe: false,
});
element = new THREE.Mesh(geometry, material);
element.position.set(0, (APP_WOOD_HEIGHT + 0.25) * n, APP_GARDENER_SIZE + 20);
group.add(element);

// Vertical
// for (var n=0; n<2; n++) {
//     texture = loadTexture('assets/textures/douglas_veinage.jpg');
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
//     texture.repeat.set(0.8, 0.5);
//     geometry = new THREE.BoxGeometry(APP_WOOD_HEIGHT, 20, APP_GARDENER_SIZE)
//     material = new THREE.MeshLambertMaterial({
//         map: texture,
//         wireframe: false,
//     })
//     element = new THREE.Mesh(geometry, material)
//     element.position.set(-APP_CALCULATED_WIDTH/2+10, APP_WOOD_HEIGHT*n, APP_GARDENER_SIZE/2+10)
//     group.add(element)
// }
// for (var n=0; n<2; n++) {
//     texture = loadTexture('assets/textures/douglas_veinage.jpg');
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
//     texture.repeat.set(0.8, 0.5);
//     geometry = new THREE.BoxGeometry(APP_WOOD_HEIGHT, 20, APP_GARDENER_SIZE)
//     material = new THREE.MeshLambertMaterial({
//         map: texture,
//         wireframe: false,
//     })
//     element = new THREE.Mesh(geometry, material)
//     element.position.set(APP_CALCULATED_WIDTH/2 - APP_WOOD_HEIGHT, APP_WOOD_HEIGHT*n, APP_GARDENER_SIZE/2+10)
//     group.add(element)
// }

// // Groung
// geometry = new THREE.BoxGeometry(APP_CALCULATED_WIDTH-48, 20, APP_GARDENER_SIZE, (APP_CALCULATED_WIDTH-48)/10, 0, 2)
// material = new THREE.MeshLambertMaterial({
//     color: 'Green',
//     wireframe: true,
// })
// element = new THREE.Mesh(geometry, material)
// element.position.set(0, APP_WOOD_HEIGHT, APP_GARDENER_SIZE/2+10)
// group.add(element)

group.position.set(APP_PADDING_LEFT / 2, APP_WOOD_HEIGHT / 2, 0);

export const gardener = group;
export const gardenerWoodLong = `${(2 * APP_CALCULATED_WIDTH + 2 * APP_GARDENER_SIZE) / 100} m`;
