const floors = [];
// water
for (let x = 0; x < 21; x++) {
  for (let y = 0; y < 21; y++) {
    floors.push({ rows: 1, cols: 1, x, y: y, z: 0, texture: "water" });
  }
}
// isle left
for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 3; y++) {
    floors.push({
      rows: 1,
      cols: 1,
      x: x + 1,
      y: y + 6,
      z: 1,
      texture: "groundEarth",
    });
  }
}
// isle stone center
for (let x = 0; x < 2; x++) {
  floors.push({ rows: 1, cols: 1, x: x + 4, y: 7, z: 1, texture: "stone04" });
}
for (let x = 0; x < 5; x++) {
  for (let y = 0; y < 4; y++) {
    floors.push({
      rows: 1,
      cols: 1,
      x: x + 6,
      y: y + 6,
      z: 1,
      texture: "stone04",
    });
  }
}
for (let x = 0; x < 2; x++) {
  floors.push({ rows: 1, cols: 1, x: x + 11, y: 7, z: 1, texture: "stone04" });
}
// isle right
for (let x = 0; x < 4; x++) {
  for (let y = 0; y < 3; y++) {
    floors.push({
      rows: 1,
      cols: 1,
      x: x + 13,
      y: y + 6,
      z: 1,
      texture: "groundEarth",
    });
  }
}
floors.push({ rows: 1, cols: 1, x: 17, y: 6, z: 1, texture: "groundEarth" });
for (let x = 0; x < 2; x++) {
  for (let y = 0; y < 3; y++) {
    floors.push({
      rows: 1,
      cols: 1,
      x: x + 18,
      y: y + 6,
      z: 1,
      texture: "groundEarth",
    });
  }
}
for (let y = 0; y < 8; y++) {
  floors.push({ rows: 1, cols: 1, x: 8, y: y + 10, z: 1, texture: "stone04" });
}
// isle bottom
for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 2; y++) {
    floors.push({
      rows: 1,
      cols: 1,
      x: x + 7,
      y: y + 18,
      z: 1,
      texture: "stone04",
    });
  }
}
// isle top
for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 2; y++) {
    floors.push({
      rows: 1,
      cols: 1,
      x: x + 7,
      y: y + 4,
      z: 1,
      texture: "stone04",
    });
  }
}
for (let y = 0; y < 3; y++) {
  floors.push({ rows: 1, cols: 1, x: 8, y: y + 1, z: 1, texture: "stone04" });
}

const data = {
  cube: {
    width: 50,
    height: 25,
    depth: 50,
  },
  floors,
};

export default data;
