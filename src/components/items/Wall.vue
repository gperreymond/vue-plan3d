<template></template>

<script setup lang="ts">
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { onMounted } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

let geometry, material, item;

const group = new Group();

geometry = new BoxGeometry(
  props.data.width,
  props.data.heigh,
  props.data.thickness,
);
material = new MeshStandardMaterial({ color: props.data.color });
item = new Mesh(geometry, material);
item.position.set(
  props.data.posX || 0,
  props.data.heigh / 2,
  props.data.posY || 0,
);
item.rotation.set(0, props.data.rotation || 0, 0);
item.receiveShadow = true;
item.castShadow = true;
group.add(item);

defineExpose({
  group,
});

onMounted(async () => {
  console.log("Wall", "onMounted", props.data.name);
});
</script>
