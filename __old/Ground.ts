import * as THREE from "three";

let element, geometry, material;
const group = new THREE.Group();

// Ground
geometry = new THREE.BoxGeometry(3000, 2, 500);
material = new THREE.MeshLambertMaterial({
  color: "Snow",
  wireframe: false,
});
element = new THREE.Mesh(geometry, material);
element.position.set(0, -1, 0);
group.add(element);

export default group;
