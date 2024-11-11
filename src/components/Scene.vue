<template></template>

<script setup lang="ts">
import {
  AxesHelper,
  CameraHelper,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  HemisphereLightHelper,
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

const params = {
  width,
  // calculated
  gridHelperEnabled,
  axesHelperEnabled,
};

const scene = new Scene();

// --------------------------------
// FOG
// --------------------------------

// const rendererClearColor = 0x87ceeb;
// scene.fog = new Fog(rendererClearColor, 0.1, 100);

// --------------------------------
// Lights
// --------------------------------

const light = new HemisphereLight(0xffffff, 0x080808, 1);
light.position.set(-width / 2, 2000, -width / 2);
scene.add(light);

const lightSecond = new HemisphereLight(0xffffff, 0x080808, 1);
lightSecond.position.set(-width / 2, 500, 0);
scene.add(lightSecond);

const shadowLight = new DirectionalLight(0xffffff, 0.5);
shadowLight.position.set(-width / 2, 2000, -width / 2);
shadowLight.castShadow = true;
shadowLight.shadow.mapSize.width = width;
shadowLight.shadow.mapSize.height = width;
shadowLight.shadow.camera.near = 0;
shadowLight.shadow.camera.far = width;
shadowLight.shadow.camera.left = -width;
shadowLight.shadow.camera.right = width;
shadowLight.shadow.camera.top = width / 2;
shadowLight.shadow.camera.bottom = -width / 2;
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
    axesHelper = new AxesHelper(1000);
    axesHelper.position.set(-width / 2, 0, -width / 2);
    axesHelper.setColors(0xff00ff, 0xff0000, 0x0000ff);
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
// scene.add(lightHelper);
// scene.add(lightSecondHelper);
// scene.add(cameraHelper);

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
