import * as THREE from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

class Barrier {
  gui: GUI;
  group: THREE.Group;
  wall: THREE.Mesh | undefined; // The wall, can be undefined initially
  woodenPosts: THREE.Mesh[]; // An array to hold multiple wooden posts
  horizontalBars: THREE.Mesh[]; // Array to hold horizontal bars
  params: {
    wallLength: number;
    wallHeight: number;
    wallThickness: number; // Changed from wallWidth to wallThickness
    postHeight: number; // Height of the post
    postRadius: number; // Radius of the post
    numberOfPosts: number; // Number of posts to position
    barThickness: number; // Thickness of the horizontal bars
    barWidth: number; // Width of the horizontal bars
    barSpacing: number; // Spacing between rows of bars
    numberOfRows: number; // Number of rows of bars
    barInclination: number; // Inclination angle for horizontal bars (in degrees)
  }; // To store parameters
  spacing: number; // Spacing between posts
  spacingLabel: any; // Reference to spacing label in GUI
  totalLengthLabel: any; // Reference to total length label in GUI
  totalHorizontalBarsLengthLabel: any; // Reference to total horizontal bars length label in GUI

  constructor(title: string) {
    this.group = new THREE.Group();
    this.woodenPosts = []; // Initialize the array for wooden posts
    this.horizontalBars = []; // Initialize the array for horizontal bars
    this.spacing = 0; // Initialize spacing

    this.params = {
      wallLength: 3000,
      wallHeight: 30,
      wallThickness: 25, // Initialize wallThickness
      postHeight: 90, // Height of the post
      postRadius: 5, // Radius of the post
      numberOfPosts: 17, // Default number of posts
      barThickness: 7.2, // Thickness of the horizontal bars
      barWidth: 2.6, // Width of the horizontal bars
      barSpacing: 15, // Spacing between rows of bars
      numberOfRows: 6, // Default number of rows
      barInclination: 30, // Initialize inclination angle for horizontal bars
    };

    // GUI
    this.gui = new GUI({
      autoPlace: false,
      title,
    });
    this.setupGUI();

    // Create the initial wall, posts, and bars
    this.createWall();
    this.createWoodenPosts();
    this.createHorizontalBars();

    // Update the total length of horizontal bars display on initialization
    this.totalHorizontalBarsLengthLabel.setValue(
      this.calculateTotalHorizontalBarsLength(),
    );
  }

  setupGUI() {
    // Parameters for the wall
    this.gui
      .add(this.params, "wallLength")
      .name("Wall Length (cm)")
      .onChange(() => this.updateAll());
    this.gui
      .add(this.params, "wallHeight")
      .name("Wall Height (cm)")
      .onChange(() => this.updateAll());
    this.gui
      .add(this.params, "wallThickness")
      .name("Wall Thickness (cm)")
      .onChange(() => this.updateAll()); // Update to wallThickness

    // Parameters for the post
    this.gui
      .add(this.params, "postHeight")
      .name("Post Height (cm)")
      .onChange(() => this.updateAll());
    this.gui
      .add(this.params, "postRadius")
      .name("Post Radius (cm)")
      .onChange(() => this.updateAll());
    this.gui
      .add(this.params, "numberOfPosts")
      .name("Number of Posts")
      .min(1)
      .step(1)
      .onChange(() => this.updateAll());

    // Parameters for the horizontal bars
    this.gui
      .add(this.params, "barThickness")
      .name("Bar Thickness (cm)")
      .onChange(() => this.updateHorizontalBars());
    this.gui
      .add(this.params, "barWidth")
      .name("Bar Width (cm)")
      .onChange(() => this.updateHorizontalBars());
    this.gui
      .add(this.params, "barSpacing")
      .name("Bar Spacing (cm)")
      .onChange(() => this.updateHorizontalBars());
    this.gui
      .add(this.params, "numberOfRows")
      .name("Number of Rows")
      .min(1)
      .step(1)
      .onChange(() => this.updateHorizontalBars());
    this.gui
      .add(this.params, "barInclination")
      .name("Bar Inclination (°)")
      .min(-90)
      .max(90)
      .step(1)
      .onChange(() => this.updateHorizontalBars());

    // Add a label for spacing display
    this.spacingLabel = this.gui
      .add({ spacing: this.spacing }, "spacing")
      .name("Post Spacing (cm)")
      .listen();
    this.spacingLabel.domElement.style.pointerEvents = "none"; // Disable clicking
    this.spacingLabel.domElement.style.color = "red"; // Change text color to red

    // Add a label for total length display
    this.totalLengthLabel = this.gui
      .add({ totalLength: this.calculateTotalLength() }, "totalLength")
      .name("Total Length of Posts (cm)")
      .listen();
    this.totalLengthLabel.domElement.style.pointerEvents = "none"; // Disable clicking
    this.totalLengthLabel.domElement.style.color = "red"; // Change text color to red

    // Add a label for total horizontal bars length
    this.totalHorizontalBarsLengthLabel = this.gui
      .add({ totalHorizontalBarsLength: 0 }, "totalHorizontalBarsLength")
      .name("Total Length of Horizontal Bars (cm)")
      .listen();
    this.totalHorizontalBarsLengthLabel.domElement.style.pointerEvents = "none"; // Disable clicking
    this.totalHorizontalBarsLengthLabel.domElement.style.color = "red"; // Change text color to red
  }

  calculateTotalLength() {
    // Calculate the total length of the posts
    return this.params.postHeight * this.params.numberOfPosts;
  }

  calculateTotalHorizontalBarsLength() {
    // Calculate the total length of the horizontal bars
    return (
      (this.params.numberOfPosts - 1) * this.spacing * this.params.numberOfRows
    ); // Length of all bars
  }

  createWall() {
    const geometry = new THREE.BoxGeometry(
      this.params.wallLength,
      this.params.wallHeight,
      this.params.wallThickness,
    ); // Updated to wallThickness
    const material = new THREE.MeshLambertMaterial({
      color: "WhiteSmoke",
      wireframe: false,
    });

    // Remove the wall if it already exists
    if (this.wall) {
      this.group.remove(this.wall);
    }

    this.wall = new THREE.Mesh(geometry, material);
    this.wall.position.set(0, this.params.wallHeight / 2, 0);
    this.group.add(this.wall);
  }

  updateAll() {
    this.createWall(); // Recreate the wall with the new parameters
    this.updateWoodenPosts(); // Update the position of the posts after wall update
    this.updateHorizontalBars(); // Update the horizontal bars after wall and posts update

    // Update the total length of horizontal bars display
    this.totalHorizontalBarsLengthLabel.setValue(
      this.calculateTotalHorizontalBarsLength(),
    );
  }

  createWoodenPosts() {
    // Remove existing posts
    this.woodenPosts.forEach((post) => this.group.remove(post));
    this.woodenPosts = []; // Reset the posts array

    // Calculate spacing
    this.spacing =
      this.params.numberOfPosts > 1
        ? (this.params.wallLength - this.params.postRadius * 2) /
          (this.params.numberOfPosts - 1) // Calculate spacing
        : 0;

    // Update the spacing label
    this.spacingLabel.setValue(this.spacing); // Update the spacing label value

    // Update the total length label
    const totalLength = this.calculateTotalLength();
    this.totalLengthLabel.setValue(totalLength); // Update the total length label value

    for (let i = 0; i < this.params.numberOfPosts; i++) {
      const geometry = new THREE.CylinderGeometry(
        this.params.postRadius,
        this.params.postRadius,
        this.params.postHeight,
        32,
      );
      const material = new THREE.MeshLambertMaterial({
        color: "SaddleBrown",
        wireframe: false,
      });

      const woodenPost = new THREE.Mesh(geometry, material);
      // Position the post based on the index, centered on the wall
      woodenPost.position.set(
        i * this.spacing - this.params.wallLength / 2 + this.params.postRadius, // Start at the left and end at the right
        this.params.wallHeight + this.params.postHeight / 2, // On top of the wall
        0,
      );

      this.group.add(woodenPost);
      this.woodenPosts.push(woodenPost); // Add the post to the array
    }
  }

  createHorizontalBars() {
    // Remove existing bars
    this.horizontalBars.forEach((bar) => this.group.remove(bar));
    this.horizontalBars = []; // Reset the bars array

    // Calculate the inclination in radians
    const inclinationInRadians = THREE.MathUtils.degToRad(
      this.params.barInclination,
    ); // Convert inclination to radians

    for (let row = 0; row < this.params.numberOfRows; row++) {
      const yPosition =
        this.params.wallHeight +
        this.params.barThickness / 2 +
        row * this.params.barSpacing; // Positioning the rows of bars

      for (let i = 0; i < this.params.numberOfPosts - 1; i++) {
        const barGeometry = new THREE.BoxGeometry(
          this.spacing,
          this.params.barThickness,
          this.params.barWidth,
        ); // Updated to wallThickness
        const barMaterial = new THREE.MeshLambertMaterial({
          color: "Sienna",
          wireframe: false,
        });

        const horizontalBar = new THREE.Mesh(barGeometry, barMaterial);
        // Position the bar between the two posts
        horizontalBar.position.set(
          i * this.spacing -
            this.params.wallLength / 2 +
            (this.params.postRadius + this.spacing / 2), // Center the bar
          yPosition,
          0, // Fixed Z position
        );

        // Apply rotation for inclination to maintain horizontal alignment
        horizontalBar.rotation.x = inclinationInRadians; // Rotate around Y-axis for inclination

        this.group.add(horizontalBar);
        this.horizontalBars.push(horizontalBar); // Add the bar to the array
      }
    }

    // Update the total length of horizontal bars display
    this.totalHorizontalBarsLengthLabel.setValue(
      this.calculateTotalHorizontalBarsLength(),
    );
  }

  updateHorizontalBars() {
    this.createHorizontalBars(); // Recreate the bars with the new parameters
    // Update the total length of horizontal bars display
    this.totalHorizontalBarsLengthLabel.setValue(
      this.calculateTotalHorizontalBarsLength(),
    );
  }

  updateWoodenPosts() {
    this.createWoodenPosts(); // Recreate the posts with the new parameters
    this.updateHorizontalBars(); // Update the horizontal bars after posts update
  }
}

// Export the Barrier class as the default export
export default Barrier;
