<template>
  <!-- containers -->
  <div ref="sceneContainer" class="scene-container"></div>
  <div ref="guiContainer" class="gui-container"></div>
  <div class="buttons-container">
    <button @click="addNewBlockHandler">New Block</button>
    <button @click="addNewBoxHandler">New Box</button>
    <button @click="addNewGroundHandler">New Ground</button>
    <button @click="addNewWallHandler">New Wall</button>
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
  <Box
    v-for="data in boxes"
    :key="data.id"
    :data="data"
    :ref="setItemsRef"
    :parentGUI="gui.folders[4]"
    :sceneWidth="project.width"
  />
  <HorizontalFence
    v-for="data in horizontalFences"
    :key="data.id"
    :data="data"
    :ref="setItemsRef"
    :parentGUI="gui.folders[5]"
    :sceneWidth="project.width"
  />
</template>

<script setup lang="js">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
// import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

import {
  Block,
  Box,
  Camera,
  Ground,
  HorizontalFence,
  Renderer,
  Scene,
  Wall,
} from "../components";
import {
  BlocksService,
  BoxesService,
  GroundsService,
  ProjectsService,
  WallsService,
} from "../services";

const route = useRoute();
const projectId = ref(null);

const project = ref(null);
const grounds = ref([]);
const walls = ref([]);
const blocks = ref([]);
const boxes = ref([]);
const horizontalFences = ref([]);
const fetchProject = async (id) => {
  try {
    const response = await ProjectsService.get(id);
    project.value = response.data;
    grounds.value = response.data.grounds;
    walls.value = response.data.walls;
    blocks.value = response.data.blocks;
    boxes.value = response.data.boxes;
    horizontalFences.value = response.data.horizontalFences;
  } catch (err) {
    console.error("App", "fetchProject", err.message);
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
gui.addFolder("BOXES");
gui.addFolder("HORIZONTAL FENCES");
gui.folders.map((item) => {
  item.show();
  item.close();
});

const addNewBoxHandler = async () => {
  await BoxesService.create(projectId.value);
  await fetchProject(projectId.value);
};

const addNewBlockHandler = async () => {
  await BlocksService.create(projectId.value);
  await fetchProject(projectId.value);
};

const addNewGroundHandler = async () => {
  await GroundsService.create(projectId.value);
  await fetchProject(projectId.value);
};

const addNewWallHandler = async () => {
  await WallsService.create(projectId.value);
  await fetchProject(projectId.value);
};

onMounted(async () => {
  console.log("App", "onMounted");
  projectId.value = route.query.projectId;
  await fetchProject(projectId.value);
  guiContainer.value.appendChild(gui.domElement);
  // get all engine
  engine.renderer = rendererRef.value.renderer;
  engine.scene = sceneRef.value.scene;
  engine.camera = cameraRef.value.camera;
  itemsRef.value.map((item) => {
    try {
      engine.scene.add(item.group);
    } catch (err) {
      console.error("App", "onMounted", err.message);
    }
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
.buttons-container > button {
  margin-right: 5px;
}
</style>
