<template></template>

<script setup lang="ts">
import { PCFSoftShadowMap, WebGLRenderer } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

const props = defineProps({
  parentGUI: {
    type: GUI,
    required: true,
  },
});

const rendererClearColor = 0x87ceeb;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.setClearColor(rendererClearColor);

const gui: GUI = new GUI({
  autoPlace: false,
  title: "Renderer",
  parent: props.parentGUI,
});
gui.show();
gui.close();
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

defineExpose({
  renderer,
});

onMounted(async () => {
  console.log("Renderer", "onMounted");
  setupGUI();
});
</script>
