<template></template>

<script setup lang="ts">
import {
  AxesHelper,
  BoxGeometry,
  CameraHelper,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  HemisphereLightHelper,
  Mesh,
  MeshStandardMaterial,
  Scene,
} from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

import ProjectsService from "../services/ProjectsService";

const props = defineProps({
  parentGUI: {
    type: GUI,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const _id = props.data.id;
const name = props.data.name;
const width = props.data.width;
const gridHelperEnabled = false;
const axesHelperEnabled = false;

const maxZ = 1000;
const maxX = 3000;
const diagonal = maxX * Math.sqrt(2);

const params = {
  width,
  // calculated
  gridHelperEnabled,
  axesHelperEnabled,
};

const scene = new Scene();

// --------------------------------
// Lights
// --------------------------------

const light = new HemisphereLight(0xffffff, 0x080808, 1);
light.position.set(-diagonal / 4, 2 * maxZ, -diagonal / 4);
scene.add(light);

const lightSecond = new HemisphereLight(0xffffff, 0x080808, 1);
lightSecond.position.set(-diagonal / 4, maxZ / 2, diagonal / 4);
scene.add(lightSecond);

const shadowLight = new DirectionalLight(0xffffff, 0.5);
shadowLight.position.set(-diagonal / 4, 2 * maxZ, -diagonal / 4);
shadowLight.castShadow = true;
shadowLight.shadow.mapSize.width = maxX;
shadowLight.shadow.mapSize.height = maxX;
shadowLight.shadow.camera.near = 0;
shadowLight.shadow.camera.far = diagonal;
shadowLight.shadow.camera.left = -maxX;
shadowLight.shadow.camera.right = maxX;
shadowLight.shadow.camera.top = maxX / 2;
shadowLight.shadow.camera.bottom = -maxX / 2;
scene.add(shadowLight);

// --------------------------------
// Helpers
// --------------------------------

let gridHelper: GridHelper;
let axesHelper: AxesHelper;
const updateHelpers = (update: boolean = false) => {
  if (update === true) {
    scene.remove(gridHelper);
    scene.remove(axesHelper);
  }
  if (params.axesHelperEnabled === true) {
    axesHelper = new AxesHelper(maxZ);
    axesHelper.setColors(0x0000ff, 0x0000ff, 0x0000ff);
    scene.add(axesHelper);
  }
  if (params.gridHelperEnabled === true) {
    gridHelper = new GridHelper(
      params.width,
      params.width / 100,
      0x0000ff,
      0xe8e5e1,
    );
    gridHelper.position.y = 0;
    gridHelper.position.x = 0;
    scene.add(gridHelper);
  }
};
updateHelpers();

const lightHelper = new HemisphereLightHelper(light, 100);
const lightSecondHelper = new HemisphereLightHelper(lightSecond, 50);
const cameraHelper = new CameraHelper(shadowLight.shadow.camera);

// --------------------------------
// Cube for tests
// --------------------------------

const cube = new Mesh(
  new BoxGeometry(100, 100, 100),
  new MeshStandardMaterial({ color: 0x00ff00 }),
);
cube.position.set(0, 50, 0);
cube.receiveShadow = false;
cube.castShadow = true;

// --------------------------------
// GUI
// --------------------------------

const onChangeHandler = async () => {
  await ProjectsService.update(_id, params);
  await updateHelpers(true);
};

const gui = new GUI({
  autoPlace: false,
  title: "Scene",
  parent: props.parentGUI,
});
gui.show();
gui.close();
const setupGUI = () => {
  gui.add(params, "width").name("width").onChange(onChangeHandler);
  gui
    .add(params, "gridHelperEnabled")
    .name("enable grid helper")
    .onChange(onChangeHandler);
  gui
    .add(params, "axesHelperEnabled")
    .name("enable axes helper")
    .onChange(onChangeHandler);
};

defineExpose({
  scene,
});

onMounted(() => {
  console.log("Scene", "onMounted", name, _id);
  setupGUI();
});
</script>
