<template></template>

<script setup lang="ts">
import {
  BoxGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3DEventMap,
} from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";
import PergolasService from "../../services/PergolasService";

const props = defineProps({
  parentGUI: { type: GUI, required: true },
  sceneWidth: { type: Number, required: true },
  data: { type: Object, required: true },
});

const _id = props.data.id;
const name = props.data.name;
const pillarWidth = props.data.pillarWidth;
const pillarHeight = props.data.pillarHeight;
const pillarThickness = props.data.pillarThickness;
const pillarColor = props.data.pillarColor;
const roofWidth = props.data.roofWidth;
const roofDepth = props.data.roofDepth;
const roofThickness = props.data.roofThickness;
const roofColor = props.data.roofColor;
const x = props.data.x;
const y = props.data.y;
const z = props.data.z;

const params = { pillarWidth, pillarHeight, pillarThickness, pillarColor, roofWidth, roofDepth, roofThickness, roofColor, x, y, z };

const pillars: Mesh<any, any, Object3DEventMap>[] = [];
const roof: Mesh<any, any, Object3DEventMap>[] = [];

const generatePillar = (): Mesh => {
  const geometry = new BoxGeometry(params.pillarWidth, params.pillarHeight, params.pillarThickness);
  const material = new MeshStandardMaterial({ color: params.pillarColor });
  return new Mesh(geometry, material);
};

const generateRoof = (): Mesh => {
  const geometry = new BoxGeometry(params.roofWidth, params.roofThickness, params.roofDepth);
  const material = new MeshStandardMaterial({ color: params.roofColor });
  return new Mesh(geometry, material);
};

let group: Group = new Group();
group.name = `pergola:${_id}`;
const updateGroup = (update: boolean = false) => {
  if (update) {
    pillars.forEach((p) => group.remove(p));
    roof.forEach((r) => group.remove(r));
  }
  
  // Pilars
  const positions = [
    [-params.roofWidth / 2, 0, -params.roofDepth / 2],
    [params.roofWidth / 2, 0, -params.roofDepth / 2],
    [-params.roofWidth / 2, 0, params.roofDepth / 2],
    [params.roofWidth / 2, 0, params.roofDepth / 2],
  ];

  positions.forEach(([px, py, pz]) => {
    const pillar = generatePillar();
    pillar.receiveShadow = true;
    pillar.castShadow = false;
    pillar.position.set(px, params.pillarHeight / 2, pz);
    group.add(pillar);
    pillars.push(pillar);
  });

  // Roof
  const roofMesh = generateRoof();
  roofMesh.receiveShadow = true;
  roofMesh.castShadow = false;
  roofMesh.position.set(0, params.pillarHeight, 0);
  group.add(roofMesh);
  roof.push(roofMesh);

  const translateX = (-props.sceneWidth + params.roofWidth) / 2;
  const translateY = (-props.sceneWidth + params.roofDepth) / 2;
  group.position.setX(translateX + params.x);
  group.position.setY(params.z);
  group.position.setZ(translateY + params.y);
};
updateGroup();

const onChangeHandler = async () => {
  await PergolasService.update(_id, params);
  updateGroup(true);
};

// Interface GUI
const gui = new GUI({ title: name, parent: props.parentGUI });
const setupGUI = () => {
  gui.add(params, "x").name("x").onChange(onChangeHandler);
  gui.add(params, "y").name("y").onChange(onChangeHandler);
  gui.add(params, "z").name("z").onChange(onChangeHandler);
  gui.add(params, "pillarWidth").name("Pillar Width").onChange(onChangeHandler);
  gui.add(params, "pillarHeight").name("Pillar Height").onChange(onChangeHandler);
  gui.add(params, "pillarThickness").name("Pillar Thickness").onChange(onChangeHandler);
  gui.addColor(params, "pillarColor").name("Pillar Color").onChange(onChangeHandler);
  gui.add(params, "roofWidth").name("Roof Width").onChange(onChangeHandler);
  gui.add(params, "roofDepth").name("Roof Depth").onChange(onChangeHandler);
  gui.add(params, "roofThickness").name("Roof Thickness").onChange(onChangeHandler);
  gui.addColor(params, "roofColor").name("Roof Color").onChange(onChangeHandler);
};

defineExpose({ group });

onMounted(() => {
  setupGUI();
});
</script>

<style scoped>
/* Ajoutez du style si nécessaire */
</style>
