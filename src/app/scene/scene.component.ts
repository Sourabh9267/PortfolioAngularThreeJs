import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy, HostListener, NgZone } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef;
  private get canvas(): HTMLCanvasElement { return this.canvasRef.nativeElement; }

  // --- Core Three.js properties ---
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Group;
  private clock!: THREE.Clock;
  private mixer!: THREE.AnimationMixer;

  // --- Control properties ---
  private observer!: ResizeObserver;
  private isInitialized = false;
  private frameId: number | null = null;
  private neckBone: THREE.Bone | null = null;
  private leftEyeBone: THREE.Bone | null = null;
  private rightEyeBone: THREE.Bone | null = null;
  private mouse = new THREE.Vector2();

  // --- Tweakable Constants ---
  private readonly NECK_BONE_NAME = 'Neck';
  private readonly LEFT_EYE_BONE_NAME = 'LeftEye';
  private readonly RIGHT_EYE_BONE_NAME = 'RightEye';
  private readonly BASE_ROTATION_Y = 0.5;
  private readonly CAMERA_X_OFFSET = 0;
  private readonly CAMERA_Z_MULTIPLIER = 0.8; // Adjusted for a better default view
  private readonly MAX_UPWARD_TILT = 0.2;
  private readonly MAX_DOWNWARD_TILT = 4.5;
  private readonly NECK_SIDE_SENSITIVITY = 3.2;
  private readonly EYE_MOVEMENT_SENSITIVITY = 0.2;
  private readonly SMOOTHING_FACTOR = 0.1;

  constructor(private hostElement: ElementRef, private ngZone: NgZone) {}

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  ngAfterViewInit(): void {
    // We start observing the component's parent element.
    // The setup logic will only run when the observer fires.
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
    ScrollTrigger.killAll();
    if (this.frameId != null) cancelAnimationFrame(this.frameId);
    if (this.renderer) this.renderer.dispose();
  }

  private setupResizeObserver(): void {
    const host = this.hostElement.nativeElement.parentElement;
    this.observer = new ResizeObserver(entries => {
      this.ngZone.run(() => {
        const entry = entries[0];
        const { width, height } = entry.contentRect;

        if (!this.isInitialized && width > 0 && height > 0) {
          // --- INITIALIZE THE SCENE ---
          this.isInitialized = true;
          this.initScene(width, height);
          this.loadModelAndStart();
        } else if (this.isInitialized) {
          // --- HANDLE RESIZING ---
          this.updateSize(width, height);
        }
      });
    });
    this.observer.observe(host);
  }

  private initScene(width: number, height: number): void {
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  private loadModelAndStart(): void {
    // Lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    this.scene.add(hemisphereLight);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 5, 5);
    this.scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 3.0);
    rimLight.position.set(0, 2, -10);
    this.scene.add(rimLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(0, 1, 10);
    this.scene.add(fillLight);

    const loader = new GLTFLoader();
    loader.load('assets/model.glb', (gltf) => {
      this.model = gltf.scene;
      this.model.rotation.y = this.BASE_ROTATION_Y;
      const box = new THREE.Box3().setFromObject(this.model);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      this.model.position.sub(center);
      this.camera.position.z = size * this.CAMERA_Z_MULTIPLIER;
      this.camera.position.x = this.CAMERA_X_OFFSET;
      this.scene.add(this.model);

      this.mixer = new THREE.AnimationMixer(this.model);
      if (gltf.animations.length) this.mixer.clipAction(gltf.animations[0]).play();

      this.model.traverse((object) => {
        if (object instanceof THREE.Bone) {
          switch (object.name) {
            case this.NECK_BONE_NAME: this.neckBone = object; break;
            case this.LEFT_EYE_BONE_NAME: this.leftEyeBone = object; break;
            case this.RIGHT_EYE_BONE_NAME: this.rightEyeBone = object; break;
          }
        }
      });
      
      this.setupScrollAnimation();
      this.animate();
    });
  }

  private updateSize(width: number, height: number): void {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private setupScrollAnimation(): void {
    // Ensure the scroll trigger targets an element outside this component
    gsap.timeline({
      scrollTrigger: {
        trigger: ".bento-grid-container", // Use a parent as a trigger
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    })
    .to(this.model.scale, { x: 0.7, y: 0.7, z: 0.7 }, 0)
    .to(this.camera.position, { x: -1.0 }, 0);
  }

  private animate = (): void => {
    this.frameId = requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);

    if (this.neckBone) {
      const targetRotationX = THREE.MathUtils.mapLinear(
        this.mouse.y, -1, 1, this.MAX_UPWARD_TILT, this.MAX_DOWNWARD_TILT
      );
      const targetRotationY = this.mouse.x * this.NECK_SIDE_SENSITIVITY;
      this.neckBone.rotation.x = THREE.MathUtils.lerp(this.neckBone.rotation.x, targetRotationX, this.SMOOTHING_FACTOR);
      this.neckBone.rotation.y = THREE.MathUtils.lerp(this.neckBone.rotation.y, targetRotationY, this.SMOOTHING_FACTOR);
    }
    
    if (this.leftEyeBone && this.rightEyeBone) {
      // ... eye tracking logic ...
    }

    if(this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}