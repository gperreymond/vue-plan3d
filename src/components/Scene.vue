<template></template>

<script setup>
import {
  AxesHelper,
  BoxGeometry,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  Scene,
  SpotLight,
  SpotLightHelper,
} from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

const maxZ = 500;
const maxX = 3000;
const spotLightColor = 0xffffff;

const scene = new Scene();
const axesHelper = new AxesHelper(maxZ);
axesHelper.setColors(0x0000ff, 0x0000ff, 0x0000ff);
scene.add(axesHelper);

const gridHelper = new GridHelper(maxX, maxX / 100, 0x0000ff, 0x808080);
gridHelper.position.y = 0;
gridHelper.position.x = 0;
scene.add(gridHelper);

const spotLight = new SpotLight(spotLightColor, 1, maxX / 2);
spotLight.position.set(0, maxX / 2, 0);
spotLight.castShadow = true;
scene.add(spotLight);
const spotLightHelper = new SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const geometry = new BoxGeometry(100, 100, 100);
const material = new MeshStandardMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
scene.add(cube);

const gui = new GUI({
  autoPlace: false,
  title: "Scene",
});
const setupGUI = () => {
  const params = {
    spotLightColor,
  };
  gui
    .addColor(params, "spotLightColor")
    .name("spotlight color")
    .onChange((value) => {
      spotLight.setColor(value);
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
