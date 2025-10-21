import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy, HostListener, NgZone, Output, EventEmitter } from '@angular/core';
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
  @Output() onSceneReady = new EventEmitter<void>();
  @ViewChild('canvas') private canvasRef!: ElementRef;
  private get canvas(): HTMLCanvasElement { return this.canvasRef.nativeElement; }

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Group;
  private clock!: THREE.Clock;
  private mixer!: THREE.AnimationMixer;
  
  private observer!: ResizeObserver;
  private isInitialized = false;
  private frameId: number | null = null;
  private neckBone: THREE.Bone | null = null;
  private leftEyeBone: THREE.Bone | null = null;
  private rightEyeBone: THREE.Bone | null = null;
  private mouse = new THREE.Vector2();

  // Configuration constants
  private readonly NECK_BONE_NAME = 'Neck';
  private readonly LEFT_EYE_BONE_NAME = 'LeftEye';
  private readonly RIGHT_EYE_BONE_NAME = 'RightEye';
  private readonly BASE_ROTATION_Y = 0.5;
  private readonly CAMERA_Y_OFFSET = 0;
  private readonly CAMERA_X_OFFSET = 0;
  private readonly CAMERA_Z_MULTIPLIER = 0.8;
  private readonly MAX_UPWARD_TILT = 0.2;
  private readonly MAX_DOWNWARD_TILT = 4.5;
  private readonly NECK_SIDE_SENSITIVITY = 3.2;
  private readonly EYE_MOVEMENT_SENSITIVITY = 0.2;
  private readonly SMOOTHING_FACTOR = 0.1;

  constructor(private hostElement: ElementRef, private ngZone: NgZone) {}

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // Normalize mouse coordinates to -1 to 1 range
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  ngAfterViewInit(): void {
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
    ScrollTrigger.killAll();
    if (this.frameId != null) cancelAnimationFrame(this.frameId);
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }

  private setupResizeObserver(): void {
    const host = this.hostElement.nativeElement;
    
    this.observer = new ResizeObserver(entries => {
      this.ngZone.run(() => {
        const entry = entries[0];
        const width = Math.round(entry.contentRect.width);
        const height = Math.round(entry.contentRect.height);
        
        // Only initialize when we have valid dimensions
        if (!this.isInitialized && width > 0 && height > 0) {
          this.isInitialized = true;
          this.initScene(width, height);
          this.loadModelAndStart();
        } else if (this.isInitialized && width > 0 && height > 0) {
          this.updateSize(width, height);
        }
      });
    });
    
    if (host) this.observer.observe(host);
  }

  private initScene(width: number, height: number): void {
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    
    // Set up camera with proper aspect ratio
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    
    // Set up renderer with transparency and anti-aliasing
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private loadModelAndStart(): void {
    // Enhanced lighting setup for better model appearance
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    this.scene.add(hemisphereLight);
    
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(5, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    this.scene.add(keyLight);
    
    const rimLight = new THREE.DirectionalLight(0xa594fd, 3.2);
    rimLight.position.set(0, 2, -10);
    this.scene.add(rimLight);
    
    const fillLight = new THREE.DirectionalLight(0xf28ab2, 1.5);
    fillLight.position.set(-5, 1, 10);
    this.scene.add(fillLight);
    
    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const loader = new GLTFLoader();
    loader.load(
      'assets/model.glb',
      (gltf) => {
        this.model = gltf.scene;
        this.model.rotation.y = this.BASE_ROTATION_Y;
        
        // Center the model properly
        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        
        this.model.position.sub(center);
        
        // Position camera based on model size
        this.camera.position.z = size * this.CAMERA_Z_MULTIPLIER;
        this.camera.position.x = this.CAMERA_X_OFFSET;
        this.camera.position.y = this.CAMERA_Y_OFFSET;
        this.camera.lookAt(0, 0, 0);
        
        // Enable shadows for the model
        this.model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        this.scene.add(this.model);

        // Set up animations if available
        this.mixer = new THREE.AnimationMixer(this.model);
        if (gltf.animations.length) {
          const action = this.mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        // Find bones for interactive movement
        this.model.traverse((object) => {
          if (object instanceof THREE.Bone) {
            switch (object.name) {
              case this.NECK_BONE_NAME:
                this.neckBone = object;
                break;
              case this.LEFT_EYE_BONE_NAME:
                this.leftEyeBone = object;
                break;
              case this.RIGHT_EYE_BONE_NAME:
                this.rightEyeBone = object;
                break;
            }
          }
        });
        
        this.setupScrollAnimation();
        this.animate();
        
        // Emit ready event to parent
        this.onSceneReady.emit();
      },
      (progress) => {
        // Optional: Handle loading progress
        const percentComplete = (progress.loaded / progress.total) * 100;
        console.log(`Model loading: ${percentComplete.toFixed(2)}%`);
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );
  }

  private updateSize(width: number, height: number): void {
    if (this.renderer && this.camera && width > 0 && height > 0) {
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  private setupScrollAnimation(): void {
    if (!this.model) return;
    
    // Smooth scroll-triggered animations
    gsap.timeline({
      scrollTrigger: {
        trigger: ".main-content",
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1,
        // markers: true, // Uncomment for debugging
      }
    })
    .to(this.model.scale, { 
      x: 0.7, 
      y: 0.7, 
      z: 0.7,
      ease: 'power2.inOut'
    }, 0)
    .to(this.camera.position, { 
      x: -1.0,
      ease: 'power2.inOut'
    }, 0);
  }

  private animate = (): void => {
    this.frameId = requestAnimationFrame(this.animate);
    
    const delta = this.clock.getDelta();
    
    // Update animations
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // Interactive neck movement based on mouse position
    if (this.neckBone) {
      const targetRotationX = THREE.MathUtils.mapLinear(
        this.mouse.y, 
        -1, 
        1, 
        this.MAX_DOWNWARD_TILT, 
        this.MAX_UPWARD_TILT
      );
      const targetRotationY = this.mouse.x * this.NECK_SIDE_SENSITIVITY;
      
      this.neckBone.rotation.x = THREE.MathUtils.lerp(
        this.neckBone.rotation.x, 
        targetRotationX, 
        this.SMOOTHING_FACTOR
      );
      this.neckBone.rotation.y = THREE.MathUtils.lerp(
        this.neckBone.rotation.y, 
        targetRotationY, 
        this.SMOOTHING_FACTOR
      );
    }
    
    // Interactive eye movement
    if (this.leftEyeBone && this.rightEyeBone) {
      const targetRotationX = -this.mouse.y * this.EYE_MOVEMENT_SENSITIVITY;
      const targetRotationY = this.mouse.x * this.EYE_MOVEMENT_SENSITIVITY;
      
      this.leftEyeBone.rotation.x = THREE.MathUtils.lerp(
        this.leftEyeBone.rotation.x, 
        targetRotationX, 
        this.SMOOTHING_FACTOR
      );
      this.leftEyeBone.rotation.y = THREE.MathUtils.lerp(
        this.leftEyeBone.rotation.y, 
        targetRotationY, 
        this.SMOOTHING_FACTOR
      );
      
      this.rightEyeBone.rotation.x = THREE.MathUtils.lerp(
        this.rightEyeBone.rotation.x, 
        targetRotationX, 
        this.SMOOTHING_FACTOR
      );
      this.rightEyeBone.rotation.y = THREE.MathUtils.lerp(
        this.rightEyeBone.rotation.y, 
        targetRotationY, 
        this.SMOOTHING_FACTOR
      );
    }

    // Render the scene
    if (this.isInitialized) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}