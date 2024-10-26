<template>
  <!-- containers -->
  <div ref="sceneContainer" class="scene-container"></div>
  <div ref="guiContainer" class="gui-container"></div>
  <!-- components -->
  <Scene ref="sceneRef" />
  <Camera ref="cameraRef" />
  <Renderer ref="rendererRef" />
  <!-- items -->
  <Wall
    v-for="(data, index) in filter(api.items, function (o) {
      return o.type === 'wall';
    })"
    :key="index"
    :ref="setWallRef"
    :data="data"
  />
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

const api = {
  items: [
    {
      type: "wall",
      title: "Mur du fond",
      width: 3000,
      height: 30,
      thickness: 15,
      color: 0xedebe6,
      posY: 15 / 2,
    },
    {
      type: "wall",
      title: "Mur de droite",
      width: 1500 - 15,
      height: 120,
      thickness: 15,
      color: 0xedebe6,
      rotation: Math.PI / 2,
      posX: 3000 / 2 - 15 / 2,
      posY: 1500 / 2 + 15 / 2,
    },
    {
      type: "wall",
      title: "Mur de gauche",
      width: 1500 - 15,
      height: 120,
      thickness: 15,
      color: 0xedebe6,
      rotation: -Math.PI / 2,
      posX: -(3000 / 2 - 15 / 2),
      posY: 1500 / 2 + 15 / 2,
    },
  ],
};

const sceneContainer = ref(null);
const sceneRef = ref(null);
const cameraRef = ref(null);
const rendererRef = ref(null);
const wallRefs = ref([]);
const setWallRef = (el) => {
  if (el) {
    wallRefs.value.push(el);
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
  console.log(wallRefs.value);
  // get all engine
  engine.renderer = rendererRef.value.renderer;
  engine.scene = sceneRef.value.scene;
  engine.camera = cameraRef.value.camera;
  // plabe all gui
  guiContainer.value.appendChild(rendererRef.value.gui.domElement);
  guiContainer.value.appendChild(sceneRef.value.gui.domElement);
  // add all items in the scene
  wallRefs.value.map((wall) => {
    engine.scene.add(wall.group);
    guiContainer.value.appendChild(wall.gui.domElement);
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
