<template>
  <!-- containers -->
  <div ref="sceneContainer" class="scene-container"></div>
  <div ref="guiContainer" class="gui-container"></div>
  <!-- components -->
  <Camera v-if="project" ref="cameraRef" />
  <Scene
    v-if="project"
    ref="sceneRef"
    :data="project"
    :parentGUI="gui.folders[0]"
  />
  <Renderer v-if="project" ref="rendererRef" :parentGUI="gui.folders[0]" />
</template>

<script setup lang="js">
import { random } from "lodash";
import { ref, onMounted, onUnmounted } from "vue";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

import { Camera, Renderer, Scene } from "./components";
import { ProjectsService } from "./services";
import {
  BoxGeometry,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
} from "three";

const APP_PROJECT_ID = 2;

const project = ref(null);
const fetchProject = async (id) => {
  try {
    const response = await ProjectsService.get(id);
    project.value = response.data;
  } catch (err) {
    console.error("App", "fetchProject", err.message);
  }
};

const sceneContainer = ref(null);
const sceneRef = ref(null);
const cameraRef = ref(null);
const rendererRef = ref(null);
const guiContainer = ref(null);

const engine = {
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

const gui = new GUI({
  autoPlace: false,
  title: `PROJET`,
});
gui.addFolder("OPTIONS");
gui.folders.map((item) => {
  item.show();
  item.close();
});

const grassTextures = [
  new TextureLoader().load(
    "public/assets/textures/Free Vegetation Textures 31-60/Vegetation (31).png",
  ),
  new TextureLoader().load(
    "public/assets/textures/Free Vegetation Textures 31-60/Vegetation (60).png",
  ),
];
const groundTextures = [
  new TextureLoader().load(
    "public/assets/textures/Grounds 1-100/Ground (1).png",
  ),
  new TextureLoader().load(
    "public/assets/textures/Grounds 1-100/Ground (2).png",
  ),
  new TextureLoader().load(
    "public/assets/textures/Grounds 1-100/Ground (3).png",
  ),
  new TextureLoader().load(
    "public/assets/textures/Grounds 1-100/Ground (4).png",
  ),
];
const generateCube = (params) => {
  const { size, wireframe = false } = params;
  const materials = [
    // Right
    new MeshStandardMaterial({ map: groundTextures[0], side: DoubleSide }),
    // Left
    new MeshStandardMaterial({ map: groundTextures[0], side: DoubleSide }),
    // Top
    new MeshStandardMaterial({ map: grassTextures[0], side: DoubleSide }),
    // Bottom
    new MeshStandardMaterial({ map: groundTextures[2], side: DoubleSide }),
    // Up
    new MeshStandardMaterial({ map: groundTextures[0], side: DoubleSide }),
    // Down
    new MeshStandardMaterial({ map: groundTextures[0], side: DoubleSide }),
  ];
  const geometry = new BoxGeometry(size, size, size);
  const item = new Mesh(geometry, materials);
  item.receiveShadow = true;
  item.castShadow = true;
  return item;
};

onMounted(async () => {
  console.log("App", "onMounted");
  await fetchProject(APP_PROJECT_ID);
  guiContainer.value.appendChild(gui.domElement);
  // get all engine
  engine.renderer = rendererRef.value.renderer;
  engine.scene = sceneRef.value.scene;
  engine.camera = cameraRef.value.camera;
  // ---------------------------------------------
  // 1. grounds
  const cubeSize = 100;
  for (let col = 0; col < 10; col++) {
    for (let row = 0; row < 10; row++) {
      const cube = generateCube({
        size: cubeSize,
        wireframe: true,
      });
      cube.position.set(
        col * cubeSize - (project.value.width - cubeSize) / 2,
        -(cubeSize / 2),
        row * cubeSize - (project.value.width - cubeSize) / 2,
      );
      cube.receiveShadow = true;
      cube.castShadow = true;
      engine.scene.add(cube);
    }
  }
  // ---------------------------------------------
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

<style>
body {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.scene-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.gui-container {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
