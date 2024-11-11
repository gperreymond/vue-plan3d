<template></template>

<script setup lang="ts">
import { random } from "lodash";
import {
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Texture,
} from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

import GroundsService from "../../services/GroundsService";
import { Ground } from "../textures";

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
const x = props.data.x;
const y = props.data.y;
const z = props.data.z;
const color = props.data.color;
const texture = props.data.texture || "";

const params = {
  name,
  width,
  height,
  x,
  y,
  z,
  color,
  texture,
  // calculated
  totalSurface: "0",
};

const calculateTotalSurface = () => {
  return (params.width / 100) * (params.height / 100);
};

let box: Mesh;
const generateItem = (): Mesh => {
  let currentTexture: Texture | undefined;
  if (params.texture !== "") {
    currentTexture = Ground.generate(
      params.texture,
      params.width,
      params.height,
    );
  }

  const geometry = new PlaneGeometry(
    params.width,
    params.height,
    params.width / 100,
    params.height / 100,
  );
  // // Perturber la géométrie
  // const positionAttribute = geometry.attributes.position;
  // const vertexCount = positionAttribute.count;
  // for (let i = 0; i < vertexCount; i++) {
  //   // Accéder aux coordonnées x, y, z
  //   const zOffset = random(0, 2); // Perturbation aléatoire
  //   positionAttribute.setZ(i, positionAttribute.getZ(i) + zOffset);
  // }
  // // Indiquer que la position a été modifiée
  // positionAttribute.needsUpdate = true;
  // geometry.computeVertexNormals(); // Recalculer les normales pour un rendu correct des ombres

  const item = new Mesh(
    geometry,
    new MeshStandardMaterial({
      wireframe: false,
      color: currentTexture ? null : params.color,
      side: DoubleSide,
      map: currentTexture ? currentTexture : null,
    }),
  );
  item.rotation.x = Math.PI / 2;
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
  const translateX = (-props.sceneWidth + params.width) / 2;
  const translateY = (-props.sceneWidth + params.height) / 2;
  group.position.setX(translateX + params.x);
  group.position.setY(params.z);
  group.position.setZ(translateY + params.y);
  group.add(box);
  params.totalSurface = calculateTotalSurface().toFixed(2);
};
updateGroup();

const onChangeHandler = async () => {
  await GroundsService.update(_id, params);
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
  gui.add(params, "x").name("x").onChange(onChangeHandler);
  gui.add(params, "y").name("y").onChange(onChangeHandler);
  gui.add(params, "z").name("z").onChange(onChangeHandler);
  gui
    .add(params, "texture", Ground.getTextures())
    .name("texture")
    .onChange(onChangeHandler);
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
  console.log("Wall", "onMounted", name, _id);
  setupGUI();
});
</script>
