<template>
  <!-- containers -->
  <div ref="sceneContainer" class="scene-container"></div>
  <div ref="guiContainer" class="gui-container"></div>
  <div class="buttons-container">
    <button @click="addNewWallHandler">New Wall</button>
    <button @click="addNewBlockHandler">New Block</button>
  </div>
  <!-- components -->
  <Camera v-if="project" ref="cameraRef" />
  <Scene
    v-if="project"
    ref="sceneRef"
    :data="project"
    :parentGUI="gui.folders[0]"
  />
  <Renderer v-if="project" ref="rendererRef" :parentGUI="gui.folders[0]" />
  <!-- items -->
  <Ground
    v-for="data in grounds"
    :key="data.id"
    :data="data"
    :ref="setItemsRef"
    :parentGUI="gui.folders[1]"
    :sceneWidth="project.width"
  />
  <Wall
    v-for="data in walls"
    :key="data.id"
    :data="data"
    :ref="setItemsRef"
    :parentGUI="gui.folders[2]"
    :sceneWidth="project.width"
  />
  <Block
    v-for="data in blocks"
    :key="data.id"
    :data="data"
    :ref="setItemsRef"
    :parentGUI="gui.folders[3]"
    :sceneWidth="project.width"
  />
  <HorizontalFence
    v-for="data in horizontalFences"
    :key="data.id"
    :data="data"
    :ref="setItemsRef"
    :parentGUI="gui.folders[4]"
  />
</template>

<script setup lan="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
// import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

import Renderer from "./components/Renderer.vue";
import Scene from "./components/Scene.vue";
import Camera from "./components/Camera.vue";
import Wall from "./components/items/Wall.vue";
import Ground from "./components/items/Ground.vue";
import Block from "./components/items/Block.vue";
import HorizontalFence from "./components/items/HorizontalFence.vue";

import ProjectsService from "./services/ProjectsService";
import BlocksService from "./services/BlocksService";
import WallsService from "./services/WallsService";

const project = ref(null);
const grounds = ref([]);
const walls = ref([]);
const blocks = ref([]);
const horizontalFences = ref([]);
const fetchProject = async (id) => {
  try {
    const response = await ProjectsService.get(id);
    project.value = response.data;
    grounds.value = response.data.grounds;
    walls.value = response.data.walls;
    blocks.value = response.data.blocks;
    // horizontalFences.value = response.data.horizontalFences;
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
gui.addFolder("GROUNDS");
gui.addFolder("WALLS");
gui.addFolder("BLOCKS");
gui.addFolder("HORIZONTAL FENCES");
gui.folders.map((item) => {
  item.show();
  item.close();
});

const addNewWallHandler = async () => {
  await WallsService.create(1);
  await fetchProject(1);
};

const addNewBlockHandler = async () => {};

onMounted(async () => {
  console.log("App", "onMounted");
  await fetchProject(1);
  guiContainer.value.appendChild(gui.domElement);
  // get all engine
  engine.renderer = rendererRef.value.renderer;
  engine.scene = sceneRef.value.scene;
  engine.camera = cameraRef.value.camera;
  itemsRef.value.map((item) => {
    engine.scene.add(item.group);
  });
  // controls
  controls = new OrbitControls(engine.camera, engine.renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  // Go pikachu!
  sceneContainer.value.appendChild(engine.renderer.domElement);

  // const loader = new FBXLoader();
  // loader.load('public/assets/quiver_tree_02_4k.fbx/quiver_tree_02_4k.fbx', function(item) {
  //   engine.scene.add(item);
  // }, undefined, function ( error ) {
  //   console.error( error );
  // });

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
.buttons-container {
  position: absolute;
  left: 10px;
  top: 10px;
}
</style>
