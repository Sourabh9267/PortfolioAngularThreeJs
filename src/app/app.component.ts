import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SceneComponent } from './scene/scene.component';
import { WordsLoaderComponent } from './components/words-loader/words-loader.component';
import { WordCyclerComponent } from './components/word-cycler/word-cycler.component';
import { HeaderComponent } from './components/header/header.component';
import { AboutSectionComponent } from './about-section/about-section.component';
import { CardGridComponent, CardItem } from './card-grid/card-grid.component'; 
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationControlService } from './services/animation-control.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    SceneComponent, 
    WordsLoaderComponent,
    WordCyclerComponent, 
    HeaderComponent,
    AboutSectionComponent,
    CardGridComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  isLoading = true;
  isLoaderDestroyed = false;
constructor(private animationControlService: AnimationControlService) {}

  // Work portfolio items
  workItems: CardItem[] = [
    { 
      id: 1, 
      title: 'Interactive 3D Portfolio', 
      description: 'A cutting-edge portfolio website featuring real-time 3D graphics powered by Three.js, with smooth GSAP animations and a responsive design. Built with Angular 17 and TypeScript for optimal performance.', 
      mediaUrl: 'assets/Project1.gif', 
      liveUrl: 'https://example.com/project1', 
      githubUrl: 'https://github.com/username/project1',
      tags: ['Angular', 'Three.js', 'GSAP', 'TypeScript', 'WebGL']
    },
    { 
      id: 2, 
      title: 'E-Commerce Platform', 
      description: 'Modern full-stack e-commerce solution with advanced product filtering, real-time inventory management, and seamless checkout experience. Features include wishlist functionality, product recommendations, and admin dashboard.', 
      mediaUrl: 'assets/Project1.gif', 
      liveUrl: 'https://example.com/project2',
      githubUrl: 'https://github.com/username/project2',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux']
    },
    { 
      id: 3, 
      title: 'Real-Time Collaboration Tool', 
      description: 'WebSocket-based collaborative workspace enabling teams to work together in real-time. Features include live cursor tracking, document co-editing, video calls, and integrated task management.', 
      mediaUrl: 'assets/Project1.gif', 
      liveUrl: 'https://example.com/project3',
      githubUrl: 'https://github.com/username/project3',
      tags: ['Vue.js', 'WebSockets', 'Socket.io', 'Express', 'WebRTC']
    },
    { 
      id: 4, 
      title: 'Analytics Dashboard', 
      description: 'Comprehensive data visualization platform with interactive charts, real-time metrics, and customizable widgets. Processes millions of data points to provide actionable business insights with beautiful D3.js visualizations.', 
      mediaUrl: 'assets/Project1.gif', 
      liveUrl: 'https://example.com/project4',
      githubUrl: 'https://github.com/username/project4',
      tags: ['D3.js', 'React', 'TypeScript', 'Recharts', 'PostgreSQL']
    },
    { 
      id: 5, 
      title: 'AI Content Generator', 
      description: 'Machine learning powered content creation platform that generates high-quality articles, social media posts, and marketing copy. Integrates with multiple AI models for diverse content types.', 
      mediaUrl: 'assets/Project1.gif', 
      liveUrl: 'https://example.com/project5',
      githubUrl: 'https://github.com/username/project5',
      tags: ['Python', 'TensorFlow', 'Next.js', 'OpenAI', 'FastAPI']
    },
  ];

  // Certificate items
  certificateItems: CardItem[] = [
    { 
      id: 1, 
      title: 'Advanced Web Development Certification', 
      description: 'Comprehensive certification covering modern web technologies including Angular, React, Vue.js, and advanced JavaScript patterns. Completed with distinction, demonstrating expertise in building scalable web applications.', 
      mediaUrl: 'assets/Certificate1.jpg',
      tags: ['Angular', 'React', 'Vue.js', 'JavaScript', 'Web APIs']
    },
    { 
      id: 2, 
      title: 'Three.js & WebGL Mastery', 
      description: 'Expert-level certification in 3D web graphics, covering advanced Three.js techniques, shader programming, particle systems, and performance optimization for creating immersive web experiences.', 
      mediaUrl: 'assets/Certificate1.jpg',
      tags: ['Three.js', 'WebGL', 'GLSL', '3D Graphics', 'Shaders']
    },
    { 
      id: 3, 
      title: 'UI/UX Design Professional', 
      description: 'Comprehensive certification in user interface design and user experience principles, covering design thinking, prototyping, user research, accessibility, and modern design tools and methodologies.', 
      mediaUrl: 'assets/Certificate1.jpg',
      tags: ['UI/UX', 'Figma', 'Design Thinking', 'Prototyping', 'A11y']
    },
    { 
      id: 4, 
      title: 'Full Stack Development Expert', 
      description: 'Complete stack certification covering frontend frameworks, backend development, database design, cloud deployment, DevOps practices, and modern software architecture patterns.', 
      mediaUrl: 'assets/Certificate1.jpg',
      tags: ['Full Stack', 'Node.js', 'Docker', 'AWS', 'CI/CD']
    },
    { 
      id: 5, 
      title: 'GSAP Animation Specialist', 
      description: 'Advanced certification in web animation techniques using GSAP (GreenSock Animation Platform), covering ScrollTrigger, timeline animations, SVG morphing, and performance optimization.', 
      mediaUrl: 'assets/Certificate1.jpg',
      tags: ['GSAP', 'ScrollTrigger', 'SVG', 'Animation', 'Motion Design']
    },
    { 
      id: 6, 
      title: 'TypeScript Advanced Patterns', 
      description: 'Deep dive into TypeScript covering advanced types, generics, decorators, design patterns, and best practices for building type-safe, maintainable enterprise applications.', 
      mediaUrl: 'assets/Certificate1.jpg',
      tags: ['TypeScript', 'Design Patterns', 'OOP', 'Type Safety', 'Architecture']
    },
  ];

  private resolveSceneReady: () => void = () => {};

  ngOnInit(): void {
    // Promise 1: Minimum display time of 3 seconds
    const minTimePromise = new Promise<void>(resolve => {
      setTimeout(resolve, 3000);
    });

    // Promise 2: Scene ready event
    const sceneReadyPromise = new Promise<void>(resolve => {
      this.resolveSceneReady = resolve;
    });

    // Wait for both promises to complete
    Promise.all([minTimePromise, sceneReadyPromise]).then(() => {
      this.isLoading = false;
    });
  }

  ngAfterViewInit(): void {
    // Set up scroll-triggered animations for sections
    this.setupScrollAnimations();
  }

  onSceneInitialized(): void {
    // Resolve the scene ready promise
    this.resolveSceneReady();
  }

  onLoaderAnimationFinish(): void {
    this.isLoaderDestroyed = true;
    
    // Trigger hero entrance animations
    setTimeout(() => {
      this.animateHeroEntrance();
    }, 100);
  }

  private animateHeroEntrance(): void {
    // Animate hero left (name)
    gsap.from('.hero-left', {
      opacity: 0,
      x: -50,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2
    });

    // Animate hero right (role cycler)
    gsap.from('.hero-right', {
      opacity: 0,
      x: 50,
      duration: 1,
      ease: 'power3.out',
      delay: 0.4
    });

    // Animate scene with subtle fade
    gsap.from('.hero-center', {
      opacity: 0,
      scale: 0.95,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.3
    });
  }

  private setupScrollAnimations(): void {
    // Additional scroll animations can be added here
    // The individual components handle their own scroll animations
    
    // Example: Parallax effect on hero section
    gsap.to('.hero-section', {
      scrollTrigger: {
        trigger: '.main-content',
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
      },
      opacity: 0.3,
      scale: 0.95,
      ease: 'none'
    });
  }
}