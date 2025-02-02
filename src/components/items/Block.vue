<template></template>

<script setup lang="ts">
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

import BlocksService from "../../services/BlocksService";

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
const color = props.data.color;

const params = {
  name,
  width,
  height,
  thickness,
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

let box: Mesh;
const generateItem = (): Mesh => {
  const geometry = new BoxGeometry(
    params.width,
    params.thickness,
    params.height,
  );
  const material = new MeshStandardMaterial({ color: params.color });
  const item = new Mesh(geometry, material);
  item.receiveShadow = true;
  item.castShadow = true;
  return item;
};
box = generateItem();

let group: Group = new Group();
group.name = `block:${_id}`;
const updateGroup = (update: boolean = false) => {
  if (update === true) {
    group.remove(box);
    box = generateItem();
  }
  group.add(box);
  const translateX = (-props.sceneWidth + params.width) / 2;
  const translateY = (-props.sceneWidth + params.height) / 2;
  group.position.setX(translateX + params.x);
  group.position.setY(params.thickness / 2 + params.z);
  group.position.setZ(translateY + params.y);
  params.totalSurface = calculateTotalSurface().toFixed(2);
};
updateGroup();

const onChangeHandler = async () => {
  try {
    await BlocksService.update(_id, params);
    await updateGroup(true);
  } catch (err: any) {
    console.error("Block", "onChangeHandler", err.message);
    alert("Failed to update block: " + err.message);
  }
};

const deleteItemHandler = async () => {
  try {
    await BlocksService.delete(_id);
    emit("itemDeleted", "block", _id);
  } catch (err: any) {
    console.error("deleteItemHandler", err.message);
    alert("Failed to delete block: " + err.message);
  }
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
  gui.addColor(params, "color").name("color").onChange(onChangeHandler);
  const surfaceLabel = gui
    .add(params, "totalSurface")
    .name("Total surface (m²)")
    .listen();
  surfaceLabel.domElement.style.pointerEvents = "none";
  surfaceLabel.domElement.style.color = "#a2db3c";

  // Add delete button
  gui.add({ delete: deleteItemHandler }, "delete").name("Delete Block");
};

const emit = defineEmits(["itemDeleted"]);

defineExpose({
  group,
});

onMounted(async () => {
  console.log("Block", "onMounted", name, _id);
  setupGUI();
});
</script>
