import * as THREE from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

class Planter {
  gui: GUI;
  group: THREE.Group;
  box: THREE.Group | undefined; // The planter box, can be undefined initially
  params: {
    length: number;
    width: number;
    height: number;
    beamThickness: number;
  }; // To store parameters

  constructor(title: string) {
    this.group = new THREE.Group();
    this.params = {
      length: 2580,
      width: 80,
      height: 24,
      beamThickness: 20,
    };

    // GUI
    this.gui = new GUI({
      autoPlace: false,
      title,
    });
    this.setupGUI();

    // Create the initial planter box
    this.createBox();
  }

  setupGUI() {
    // Parameters for the planter box
    this.gui
      .add(this.params, "length")
      .name("Length (cm)")
      .min(10)
      .step(1)
      .onChange(() => this.updateBox());
    this.gui
      .add(this.params, "width")
      .name("Width (cm)")
      .min(10)
      .step(1)
      .onChange(() => this.updateBox());
    this.gui
      .add(this.params, "height")
      .name("Height (cm)")
      .min(10)
      .step(1)
      .onChange(() => this.updateBox());
    this.gui
      .add(this.params, "beamThickness")
      .name("Beam Thickness (cm)")
      .min(1)
      .step(0.1)
      .onChange(() => this.updateBox());
  }

  createBox() {
    // Remove the existing box if it already exists
    if (this.box) {
      this.group.remove(this.box);
    }

    const outerGeometry = new THREE.BoxGeometry(
      this.params.length,
      this.params.height,
      this.params.width,
    );

    const innerGeometry = new THREE.BoxGeometry(
      this.params.length - 2 * this.params.beamThickness,
      this.params.height - this.params.beamThickness + 10,
      this.params.width - 2 * this.params.beamThickness,
    );

    const outerMaterial = new THREE.MeshLambertMaterial({
      color: "Red",
      wireframe: false,
    });

    const innerMaterial = new THREE.MeshLambertMaterial({
      color: "MediumSeaGreen",
      wireframe: false,
    });

    // Create outer and inner meshes
    const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);

    // Position the inner mesh to fit inside the outer mesh
    innerMesh.position.set(0, this.params.beamThickness / 2, 0);

    // Combine the meshes to form the hollow box
    this.box = new THREE.Group();
    this.box.add(outerMesh);
    this.box.add(innerMesh);

    this.group.add(this.box);
    this.group.position.set(0, this.params.height / 2, 0);
  }

  updateBox() {
    this.createBox(); // Recreate the box with the new parameters
  }
}

export default Planter;
