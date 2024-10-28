<template>
  <!-- containers -->
  <div ref="sceneContainer" class="scene-container"></div>
  <div ref="guiContainer" class="gui-container"></div>
  <!-- components -->
  <Scene ref="sceneRef" />
  <Camera ref="cameraRef" />
  <Renderer ref="rendererRef" />
  <!-- items -->
  <Wall v-for="data in walls" :key="data.id" :data="data" :ref="setItemsRef" />
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>

<script setup lan="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { filter } from "lodash";

import Renderer from "./components/Renderer.vue";
import Scene from "./components/Scene.vue";
import Camera from "./components/Camera.vue";
import Wall from "./components/items/Wall.vue";
import HorizontalFence from "./components/items/HorizontalFence.vue";
import ProjectService from "./services/ProjectService";

const walls = ref([]);
const fetchProject = async (id) => {
  try {
    const response = await ProjectService.get(id);
    walls.value = response.data.walls;
  } catch (err) {
    console.error("fetchProject", err.message);
  }
};

const sceneContainer = ref(null);
const sceneRef = ref(null);
const cameraRef = ref(null);
const rendererRef = ref(null);
const itemsRef = ref([]);
const setItemsRef = (el) => {
  if (el) {
    itemsRef.value.push(el);
  }
};
const guiContainer = ref(null);

const engine = {
  gui: {},
  renderer: false,
  scene: false,
  camera: false,
};

let animationFrameId;
let renderer, scene, camera, controls;

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  engine.renderer.render(engine.scene, engine.camera);
};

onMounted(async () => {
  console.log("App", "onMounted");
  await fetchProject(1);
  console.log("App", "Walls", walls.value);
  // get all engine
  engine.renderer = rendererRef.value.renderer;
  engine.scene = sceneRef.value.scene;
  engine.camera = cameraRef.value.camera;
  // plabe all gui
  guiContainer.value.appendChild(rendererRef.value.gui.domElement);
  guiContainer.value.appendChild(sceneRef.value.gui.domElement);
  // add all items in the scene
  itemsRef.value.map((item) => {
    engine.scene.add(item.group);
    guiContainer.value.appendChild(item.gui.domElement);
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

onUnmounted(async () => {
  console.log("App", "onUnmounted");
  cancelAnimationFrame(animationFrameId);
  engine.renderer.dispose();
  controls.dispose();
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
