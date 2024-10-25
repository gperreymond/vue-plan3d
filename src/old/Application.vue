<template>
  <div ref="sceneContainer" class="scene-container"></div>
  <div ref="guiContainer" class="gui-container"></div>
</template>

<script setup>
import { ref, watch, reactive, onMounted, onBeforeUnmount } from "vue";
import Application from "./Application";
import Barrier from "./items/Barrier";
import Planter from "./items/Planter";

const sceneContainer = ref(null);
const guiContainer = ref(null);
const app = new Application();

// let barrierParams;
// function setWatchers() {
//   console.log("setWatchers...", barrierParams);
//   watch(
//     () => barrierParams,
//     (value) => {
//       console.log("Updated barrier params:", value);
//     },
//     { deep: true, immediate: true },
//   );
// }

onMounted(() => {
  console.log("onMounted!!!");
  document.body.appendChild(app.stats.dom);
  app.init(window.innerWidth, window.innerHeight);
  app.animate();
  sceneContainer.value.appendChild(app.renderer.domElement);
  // Barrier
  const barrier = new Barrier("Barrière");
  barrier.group.position.z = barrier.params.wallThickness / 2;
  app.scene.add(barrier.group);
  guiContainer.value.appendChild(barrier.gui.domElement);
  // Barrier
  // const planter = new Planter("Jardinère");
  // planter.group.position.z = planter.params.beamThickness/2 + planter.params.width/2;
  // planter.group.position.x =
  //   (barrier.params.wallLength - planter.params.length) / 2;
  // app.scene.add(planter.group);
  // guiContainer.value.appendChild(planter.gui.domElement);
  // Update positions
  // setWatchers();
});

onBeforeUnmount(() => {
  console.log("onBeforeUnmount!!!");
  app.cancel();
});
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.gui-container {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
