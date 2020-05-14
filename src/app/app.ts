import {AmbientLight, Color, DirectionalLight, GridHelper, HemisphereLight, OrthographicCamera, PCFSoftShadowMap, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Brick} from './brick';

/**
 * Application Template
 * @class App
 */
export class App {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 10000);
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });
  private readonly controls: OrbitControls;

  private brick: Brick;
  private ground: Brick;

  public isMobile = false;

  /**
   * App Constructor
   */
  constructor() {
    this.brick = new Brick(100, new Color('rgb(255,0,0)'));
    this.brick.position.y = 50;
    this.scene.add(this.brick);

    this.ground = new Brick([300, 10, 300], new Color(0x33aa33));
    this.ground.position.y = -5;
    this.scene.add(this.ground);

    this.camera.position.set(200, 200, -200);
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(0x282828);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.rotateSpeed = 0.35;

    this.checkUserAgent();
    this.initLightSystem();
    this.initHelpers();
    this.render();
  }

  /**
   * UserAgent verification example
   */
  private checkUserAgent() {
    const n = navigator.userAgent;
    if (
      n.match(/Android/i) ||
      n.match(/webOS/i) ||
      n.match(/iPhone/i) ||
      n.match(/iPad/i) ||
      n.match(/iPod/i) ||
      n.match(/BlackBerry/i)
    ) {
      this.isMobile = true;
      this.renderer.shadowMap.enabled = false;
    }
  }

  /**
   * Initialize screen helpers
   */
  private initHelpers() {
    const gridHelper = new GridHelper(320, 32);
    this.scene.add(gridHelper);
  }

  /**
   * Initialize Light System
   */
  private initLightSystem() {
    if (!this.isMobile) {
      const directionalLight = new DirectionalLight(0xffffff, 1.1);
      directionalLight.position.set(300, 1000, 500);
      directionalLight.target.position.set(0, 0, 0);
      directionalLight.castShadow = true;

      const d = 300;
      directionalLight.shadow.camera = new OrthographicCamera(-d, d, d, -d, 500, 1600);
      directionalLight.shadow.bias = 0.0001;
      directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024;
      this.scene.add(directionalLight);

      const light = new AmbientLight(0xffffff, 0.3);
      this.scene.add(light);
    } else {
      const hemisphereLight = new HemisphereLight(0xffffff, 1);
      this.scene.add(hemisphereLight);

      const light = new AmbientLight(0xffffff, 0.15);
      this.scene.add(light);
    }
  }

  /**
   * Update the resolution of the renderer and update the aspect ratio of the camera
   */
  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Render loop
   */
  private render() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());

    this.adjustCanvasSize();
    this.brick.rotateY(0.03);
  }
}
