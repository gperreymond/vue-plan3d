<template>
  <div ref="sceneContainer" class="scene-container"></div>
  <div ref="guiContainer" class="gui-container"></div>
  <Scene ref="sceneRef" />
  <Camera ref="cameraRef" />
  <Renderer ref="rendererRef" />
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>

<script setup>
import { ref, onMounted } from "vue";

import Renderer from "./components/Renderer.vue";
import Scene from "./components/Scene.vue";
import Camera from "./components/Camera.vue";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const sceneRef = ref(null);
const cameraRef = ref(null);
const rendererRef = ref(null);
const sceneContainer = ref(null);
const guiContainer = ref(null);

const engine = {
  gui: {},
  renderer: false,
  scene: false,
  camera: false,
  items: [],
};

let animationFrameId;
let renderer, scene, camera, controls;

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  controls.update();
  engine.renderer.render(engine.scene, engine.camera);
};

onMounted(async () => {
  console.log("App", "onMounted");
  // get all engine
  engine.gui.renderer = rendererRef.value.gui;
  engine.gui.scene = sceneRef.value.gui;
  engine.renderer = rendererRef.value.renderer;
  engine.scene = sceneRef.value.scene;
  engine.camera = cameraRef.value.camera;
  // engine.items.push(lightRef.value.light);
  // engine.items.push(lightRef.value.ambient);
  console.log(engine);
  // plabe all gui
  guiContainer.value.appendChild(engine.gui.renderer.domElement);
  guiContainer.value.appendChild(engine.gui.scene.domElement);
  // add all items in the scene
  engine.items.map((item) => {
    engine.scene.add(item);
  });
  // controls
  controls = new OrbitControls(engine.camera, engine.renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  // Go pikachu!
  sceneContainer.value.appendChild(engine.renderer.domElement);
  animate();
});
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.gui-container {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
