<template></template>

<script setup>
import { AmbientLight, DirectionalLight, DirectionalLightHelper } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

const lightColor = 0xffffff;
const lightIntensity = 1;
const ambientIntensity = 0.5;

const light = new DirectionalLight(lightColor, lightIntensity);
light.position.set(5, 10, 5);
light.castShadow = true;

const ambient = new AmbientLight();
ambient.intensity = ambientIntensity;

const helper = new DirectionalLightHelper(light, 100);

const gui = new GUI({
  autoPlace: false,
  title: "Light",
});
const setupGUI = () => {
  const params = {
    lightColor,
    lightIntensity,
    ambientIntensity,
  };
  gui
    .addColor(params, "lightColor")
    .name("light color")
    .onChange((value) => {
      light.color = value;
    });
  gui
    .add(params, "lightIntensity")
    .name("light intensity")
    .min(0)
    .max(1)
    .step(0.1)
    .onChange((value) => {
      light.intensity = value;
    });
  gui
    .add(params, "ambientIntensity")
    .name("ambient intensity")
    .min(0)
    .max(1)
    .step(0.1)
    .onChange((value) => {
      ambient.intensity = value;
    });
};

defineExpose({
  light,
  ambient,
  gui,
  helper,
});

onMounted(async () => {
  console.log("Light", "onMounted");
  setupGUI();
});
</script>
