import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
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

  // --- Core Three.js properties ---
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Group;
  private frameId: number | null = null;
  private clock!: THREE.Clock;

  // --- Animation properties ---
  private mixer!: THREE.AnimationMixer;
  
  // --- Bone storage ---
  private neckBone: THREE.Bone | null = null;
  private leftEyeBone: THREE.Bone | null = null;
  private rightEyeBone: THREE.Bone | null = null;

  private mouse = new THREE.Vector2();

  // --- Tweakable Constants ---
  private readonly NECK_BONE_NAME = 'Neck';
  private readonly LEFT_EYE_BONE_NAME = 'LeftEye';
  private readonly RIGHT_EYE_BONE_NAME = 'RightEye';
  private readonly BASE_ROTATION_Y = 0.5;
  private readonly CAMERA_Z_MULTIPLIER = 0.8;
  private readonly CAMERA_X_OFFSET = 0; // Set to 0 for now to guarantee it's centered
  private readonly MAX_UPWARD_TILT = 0;
  private readonly MAX_DOWNWARD_TILT = 4.7;
  private readonly NECK_SIDE_SENSITIVITY = 3.2;
  private readonly EYE_MOVEMENT_SENSITIVITY = 0.3;
  private readonly SMOOTHING_FACTOR = 0.1;

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  // Allow the onResize function to be called without an event
  @HostListener('window:resize', ['$event'])
  onResize(event: Event | null = null) {
    if (this.camera && this.renderer) {
      const width = this.canvas.clientWidth;
      const height = this.canvas.clientHeight;
      
      if (width > 0 && height > 0) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.canvasRef) this.initAndLoad();
  }

  ngOnDestroy(): void {
    ScrollTrigger.killAll(); // Clean up ScrollTrigger instances
    if (this.frameId != null) cancelAnimationFrame(this.frameId);
    if (this.renderer) this.renderer.dispose();
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private initAndLoad(): void {
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Lighting setup is unchanged
   const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
hemisphereLight.position.set(0, 20, 0);
this.scene.add(hemisphereLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
keyLight.position.set(5, 5, 5);
this.scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 3.0);
rimLight.position.set(0, 2, -10);
this.scene.add(rimLight);

// --- THIS IS THE NEW LIGHT ---
// 4. Fill Light (soft light from the front)
const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
fillLight.position.set(0, 1, 10); // Position it directly in front
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
      
      // --- THE CRITICAL FIX ---
      // We manually call onResize() here to ensure the camera and renderer
      // have the final, correct dimensions from the Flexbox layout.
      this.onResize(null);
      // ------------------------

      this.setupScrollAnimation();
      this.animate();
    }, undefined, (error) => console.error(error));
  }

  private setupScrollAnimation(): void {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.content-section',
        start: 'top bottom',
        end: 'top top',
        scrub: true,
      }
    })
    .to(this.model.scale, { x: 0.5, y: 0.5, z: 0.5 })
    .to(this.camera.position, { x: 2.5 }, 0); // Animate the camera, not the model position
  }

  private animate = (): void => {
    this.frameId = requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);

    // Head tracking logic remains the same
    if (this.neckBone) {
      const targetRotationX = THREE.MathUtils.mapLinear(
        this.mouse.y, -1, 1, this.MAX_DOWNWARD_TILT, this.MAX_UPWARD_TILT
      );
      const targetRotationY = this.mouse.x * this.NECK_SIDE_SENSITIVITY;
      this.neckBone.rotation.x = THREE.MathUtils.lerp(this.neckBone.rotation.x, targetRotationX, this.SMOOTHING_FACTOR);
      this.neckBone.rotation.y = THREE.MathUtils.lerp(this.neckBone.rotation.y, targetRotationY, this.SMOOTHING_FACTOR);
    }
    
    if (this.leftEyeBone && this.rightEyeBone) {
      const targetRotationX = -this.mouse.y * this.EYE_MOVEMENT_SENSITIVITY;
      const targetRotationY = this.mouse.x * this.EYE_MOVEMENT_SENSITIVITY;
      this.leftEyeBone.rotation.x = THREE.MathUtils.lerp(this.leftEyeBone.rotation.x, targetRotationX, this.SMOOTHING_FACTOR);
      this.leftEyeBone.rotation.y = THREE.MathUtils.lerp(this.leftEyeBone.rotation.y, targetRotationY, this.SMOOTHING_FACTOR);
      this.rightEyeBone.rotation.x = THREE.MathUtils.lerp(this.rightEyeBone.rotation.x, targetRotationX, this.SMOOTHING_FACTOR);
      this.rightEyeBone.rotation.y = THREE.MathUtils.lerp(this.rightEyeBone.rotation.y, targetRotationY, this.SMOOTHING_FACTOR);
    }

    this.renderer.render(this.scene, this.camera);
  }
}