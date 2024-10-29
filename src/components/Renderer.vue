<template></template>

<script setup lang="ts">
import { PCFSoftShadowMap, WebGLRenderer } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

const rendererClearColor = 0x87ceeb;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.setClearColor(0x87ceeb);

const gui = new GUI({
  autoPlace: false,
  title: "Renderer",
});
gui.show();
const setupGUI = () => {
  const params = {
    rendererClearColor,
  };
  gui
    .addColor(params, "rendererClearColor")
    .name("background color")
    .onChange((value) => {
      renderer.setClearColor(value);
    });
};

const onresizeHandler = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.onresize = onresizeHandler;

defineExpose({
  renderer,
  gui,
});

onMounted(async () => {
  console.log("Renderer", "onMounted");
  setupGUI();
});
</script>
