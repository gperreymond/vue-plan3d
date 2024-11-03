<template></template>

<script setup lang="ts">
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

import WallsService from "../../services/WallsService";

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
const thickness = props.data.thickness;
const x = props.data.x;
const y = props.data.y;
const z = props.data.z;
const flip = props.data.flip;
const color = props.data.color;

const params = {
  name,
  width,
  height,
  thickness,
  x,
  y,
  z,
  flip,
  color,
  // calculated
  totalSurface: "0",
};

const calculateTotalSurface = () => {
  return (params.width / 100) * (params.height / 100);
};

let box: Mesh;
const generateItem = (): Mesh => {
  const geometry = new BoxGeometry(
    params.width,
    params.height,
    params.thickness,
  );
  const material = new MeshStandardMaterial({ color: params.color });
  const item = new Mesh(geometry, material);
  item.receiveShadow = true;
  item.castShadow = true;
  return item;
};
box = generateItem();

let group: Group = new Group();
const updateGroup = (update: boolean = false) => {
  if (update === true) {
    group.remove(box);
    box = generateItem();
  }
  box.rotation.set(0, params.flip === true ? Math.PI / 2 : 0, 0);
  group.add(box);
  let translateX = 0;
  let translateY = 0;
  if (params.flip === false) {
    translateX = (-props.sceneWidth + params.width) / 2;
    translateY = (-props.sceneWidth + params.thickness) / 2;
  } else {
    translateX = (-props.sceneWidth + params.thickness) / 2;
    translateY = (-props.sceneWidth + params.width) / 2;
  }
  group.position.setX(translateX + params.x);
  group.position.setY(params.height / 2 + params.z);
  group.position.setZ(translateY + params.y);
  params.totalSurface = calculateTotalSurface().toFixed(2);
};
updateGroup();

const onChangeHandler = async () => {
  await WallsService.update(_id, params);
  await updateGroup(true);
};

const gui = new GUI({
  autoPlace: false,
  title: name,
  parent: props.parentGUI,
});
gui.show();
gui.close();
const setupGUI = () => {
  gui.add(params, "name").name("name").onChange(onChangeHandler);
  gui.add(params, "width").name("width").onChange(onChangeHandler);
  gui.add(params, "height").name("height").onChange(onChangeHandler);
  gui.add(params, "thickness").name("thickness").onChange(onChangeHandler);
  gui.add(params, "x").name("x").onChange(onChangeHandler);
  gui.add(params, "y").name("y").onChange(onChangeHandler);
  gui.add(params, "z").name("z").onChange(onChangeHandler);
  gui.add(params, "flip").name("flip").onChange(onChangeHandler);
  gui.addColor(params, "color").name("color").onChange(onChangeHandler);
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
  console.log("Wall", "onMounted", name, _id);
  setupGUI();
});
</script>
