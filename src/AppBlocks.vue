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
  CubeTextureLoader,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
} from "three";

import arena from "./data/arena-001";

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

const tiles = [
  "ground",
  "groundEarth",
  "groundEarthCheckered",
  "groundCheckered",
  "groundMud",
  "snow",
  "stone01",
  "stone02",
  "stone03",
  "stone04",
  "stone05",
  "stone06",
  "stone07",
  "wallBrick01",
  "wallBrick02",
  "wallBrick03",
  "wallBrick04",
  "wallBrick05",
  "wallBrick06",
  "wallStone",
  "water",
];
const mapping = ["px", "nx", "py", "ny", "pz", "nz"];
const textures = {};
tiles.map((tile) => {
  textures[tile] = {};
  mapping.map((filename) => {
    textures[tile][filename] = new TextureLoader().load(
      `public/assets/cubes/${tile}/${filename}.png`,
      () => {
        console.log(`[${tile}] texture :${filename}: loaded!`);
      },
    );
  });
});

const generateCube = (params) => {
  const group = new Group();
  const { texture = "water", width, height, depth } = params;
  const materials = [
    // Right
    new MeshStandardMaterial({ map: textures[texture].ny, side: DoubleSide }),
    // Left
    new MeshStandardMaterial({ map: textures[texture].ny, side: DoubleSide }),
    // Top
    new MeshStandardMaterial({ map: textures[texture].pz, side: DoubleSide }),
    // Bottom
    new MeshStandardMaterial({ map: textures[texture].nz, side: DoubleSide }),
    // Up
    new MeshStandardMaterial({ map: textures[texture].ny, side: DoubleSide }),
    // Down
    new MeshStandardMaterial({ map: textures[texture].ny, side: DoubleSide }),
  ];
  const material = new MeshStandardMaterial({ wireframe: true });
  const geometry = new BoxGeometry(width, height, depth);
  const item = new Mesh(geometry, materials);
  item.receiveShadow = true;
  item.castShadow = true;
  group.add(item);
  return group;
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
  arena.floors.map((floor) => {
    for (let col = 0; col < floor.cols; col++) {
      for (let row = 0; row < floor.rows; row++) {
        const cube = generateCube({
          ...arena.cube,
          ...floor,
        });
        cube.position.set(
          col * arena.cube.width -
            (project.value.width - arena.cube.width) / 2 +
            arena.cube.width * (floor.x || 0),
          -(arena.cube.height / 2) + arena.cube.height * (floor.z || 0),
          row * arena.cube.depth -
            (project.value.width - arena.cube.depth) / 2 +
            arena.cube.depth * (floor.y || 0),
        );
        cube.receiveShadow = true;
        cube.castShadow = true;
        engine.scene.add(cube);
      }
    }
  });
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
