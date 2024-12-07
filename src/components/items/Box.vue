<template></template>

<script setup lang="ts">
import {
  BoxGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
} from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

import BoxesService from "../../services/BoxesService";

const props = defineProps({
  parentGUI: {
    type: GUI,
    required: true,
  },
  sceneWidth: {
    type: Number,
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
const height = props.data.height;
const wallThickness = props.data.wallThickness;
const wallHeight = props.data.wallHeight;
const x = props.data.x;
const y = props.data.y;
const z = props.data.z;
const color = props.data.color;

const params = {
  name,
  width,
  height,
  wallThickness,
  wallHeight,
  x,
  y,
  z,
  color,
  // calculated
  totalSurface: "0",
};

const calculateTotalSurface = () => {
  return (params.width / 100) * (params.height / 100);
};

let walls: Group;
const generateWalls = (): Group => {
  const group = new Group();
  // wall north
  const wallNorth = new Mesh(
    new BoxGeometry(params.width, params.wallHeight, params.wallThickness),
    new MeshStandardMaterial({ color: params.color }),
  );
  wallNorth.receiveShadow = true;
  wallNorth.castShadow = true;
  wallNorth.position.setX(0);
  wallNorth.position.setY(params.wallHeight / 2);
  wallNorth.position.setZ((-params.height + params.wallThickness) / 2);
  group.add(wallNorth);
  // wall south
  const wallSouth = new Mesh(
    new BoxGeometry(params.width, params.wallHeight, params.wallThickness),
    new MeshStandardMaterial({ color: params.color }),
  );
  wallSouth.receiveShadow = true;
  wallSouth.castShadow = true;
  wallSouth.position.setX(0);
  wallSouth.position.setY(params.wallHeight / 2);
  wallSouth.position.setZ((params.height - params.wallThickness) / 2);
  group.add(wallSouth);
  // wall east
  const wallEast = new Mesh(
    new BoxGeometry(params.wallThickness, params.wallHeight, params.height),
    new MeshStandardMaterial({ color: params.color }),
  );
  wallEast.receiveShadow = true;
  wallEast.castShadow = true;
  wallEast.position.setX((params.width - params.wallThickness) / 2);
  wallEast.position.setY(params.wallHeight / 2);
  wallEast.position.setZ(0);
  group.add(wallEast);
  // wall west
  const wallWest = new Mesh(
    new BoxGeometry(params.wallThickness, params.wallHeight, params.height),
    new MeshStandardMaterial({ color: params.color }),
  );
  wallWest.receiveShadow = true;
  wallWest.castShadow = true;
  wallWest.position.setX((-params.width + params.wallThickness) / 2);
  wallWest.position.setY(params.wallHeight / 2);
  wallWest.position.setZ(0);
  group.add(wallWest);
  return group;
};
walls = generateWalls();

let plan: Mesh;
const generatePlan = (): Mesh => {
  const item = new Mesh(
    new PlaneGeometry(params.width, params.height),
    new MeshStandardMaterial({
      color: params.color,
      side: DoubleSide,
    }),
  );
  item.rotation.x = Math.PI / 2;
  item.receiveShadow = true;
  item.castShadow = false;
  return item;
};
plan = generatePlan();

let group: Group = new Group();
group.name = `box:${_id}`;
const updateGroup = (update: boolean = false) => {
  if (update === true) {
    group.remove(plan);
    group.remove(walls);
    plan = generatePlan();
    walls = generateWalls();
  }
  const translateX = (-props.sceneWidth + params.width) / 2;
  const translateY = (-props.sceneWidth + params.height) / 2;
  group.position.setX(translateX + params.x);
  group.position.setY(params.z);
  group.position.setZ(translateY + params.y);
  group.add(plan);
  group.add(walls);
  params.totalSurface = calculateTotalSurface().toFixed(2);
};
updateGroup();
generateWalls();

const onChangeHandler = async () => {
  await BoxesService.update(_id, params);
  await updateGroup(true);
};

const gui = new GUI({
  autoPlace: false,
  title: params.name,
  parent: props.parentGUI,
});
gui.show();
gui.close();
const setupGUI = () => {
  gui.add(params, "name").name("name").onChange(onChangeHandler);
  gui.add(params, "width").name("width").onChange(onChangeHandler);
  gui.add(params, "height").name("height").onChange(onChangeHandler);
  gui
    .add(params, "wallThickness")
    .name("wallThickness")
    .onChange(onChangeHandler);
  gui.add(params, "wallHeight").name("wallHeight").onChange(onChangeHandler);
  gui.add(params, "x").name("x").onChange(onChangeHandler);
  gui.add(params, "y").name("y").onChange(onChangeHandler);
  gui.add(params, "z").name("z").onChange(onChangeHandler);
  gui
    .addColor(params, "color")
    .name("background color")
    .onChange(onChangeHandler);
  const surfaceLabel = gui
    .add(params, "totalSurface")
    .name("Total surface (m²)")
    .listen();
  surfaceLabel.domElement.style.pointerEvents = "none";
  surfaceLabel.domElement.style.color = "#a2db3c";
};

defineExpose({
  group,
});

onMounted(async () => {
  console.log("Box", "onMounted", name, _id);
  setupGUI();
});
</script>
