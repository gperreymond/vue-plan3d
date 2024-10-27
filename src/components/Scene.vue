<template></template>

<script setup lang="ts">
import {
  AxesHelper,
  BoxGeometry,
  CameraHelper,
  DirectionalLight,
  DoubleSide,
  GridHelper,
  Group,
  HemisphereLight,
  HemisphereLightHelper,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Scene,
} from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

const maxZ = 1000;
const maxX = 3000;
const diagonal = maxX * Math.sqrt(2);

const helpersEnabled = false;
const groundColor = 0x9daf9d;

let material, geometry, ground;

const scene = new Scene();

// --------------------------------
// Lights
// --------------------------------

const light = new HemisphereLight(0xffffff, 0x080808, 1);
light.position.set(-diagonal / 4, 2 * maxZ, -diagonal / 4);
scene.add(light);

const lightSecond = new HemisphereLight(0xffffff, 0x080808, 1);
lightSecond.position.set(-diagonal / 4, maxZ / 2, diagonal / 4);
scene.add(lightSecond);

const shadowLight = new DirectionalLight(0xffffff, 0.5);
shadowLight.position.set(-diagonal / 4, 2 * maxZ, -diagonal / 4);
shadowLight.castShadow = true;
shadowLight.shadow.mapSize.width = maxX;
shadowLight.shadow.mapSize.height = maxX;
shadowLight.shadow.camera.near = 0;
shadowLight.shadow.camera.far = diagonal;
shadowLight.shadow.camera.left = -maxX;
shadowLight.shadow.camera.right = maxX;
shadowLight.shadow.camera.top = maxX / 2;
shadowLight.shadow.camera.bottom = -maxX / 2;
scene.add(shadowLight);

// --------------------------------
// Helpers
// --------------------------------

const helpers = new Group();

const axesHelper = new AxesHelper(maxZ);
axesHelper.setColors(0x0000ff, 0x0000ff, 0x0000ff);
helpers.add(axesHelper);

const gridHelper = new GridHelper(maxX, maxX / 100, 0x0000ff, 0xe8e5e1);
gridHelper.position.y = 0;
gridHelper.position.x = 0;
helpers.add(gridHelper);

const lightHelper = new HemisphereLightHelper(light, 100);
helpers.add(lightHelper);

const lightSecondHelper = new HemisphereLightHelper(lightSecond, 50);
helpers.add(lightSecondHelper);

const helper = new CameraHelper(shadowLight.shadow.camera);
helpers.add(helper);

// --------------------------------
// Grounds
// --------------------------------

geometry = new PlaneGeometry(maxX, maxX / 2);
material = new MeshStandardMaterial({ color: groundColor, side: DoubleSide });
ground = new Mesh(geometry, material);
ground.position.set(0, -1, maxX / 4);
ground.rotation.x = Math.PI / 2;
ground.receiveShadow = true;
ground.castShadow = false;
scene.add(ground);

// --------------------------------
// Cube for tests
// --------------------------------

geometry = new BoxGeometry(100, 100, 100);
material = new MeshStandardMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
cube.position.set(0, 50, 0);
cube.receiveShadow = false;
cube.castShadow = true;
helpers.add(cube);

const cube2 = new Mesh(geometry, material);
cube2.position.set(150, 50, 0);
cube2.receiveShadow = false;
cube2.castShadow = true;
helpers.add(cube2);

// --------------------------------
// GUI
// --------------------------------

const gui = new GUI({
  autoPlace: false,
  title: "Scene",
});
const setupGUI = () => {
  const params = {
    groundColor,
    helpersEnabled,
  };
  gui
    .addColor(params, "groundColor")
    .name("background color")
    .onChange((value) => {
      ground.material.setValues({ color: value });
    });
  gui
    .add(params, "helpersEnabled")
    .name("enable helpers")
    .onChange((value) => {
      if (value === true) {
        scene.add(helpers);
      } else {
        scene.remove(helpers);
      }
    });
};

defineExpose({
  scene,
  gui,
});

onMounted(() => {
  console.log("Scene", "onMounted");
  setupGUI();
});
</script>
