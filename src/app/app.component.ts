import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SceneComponent } from './scene/scene.component';
import { WordsLoaderComponent } from './components/words-loader/words-loader.component';
import { WordCyclerComponent } from './components/word-cycler/word-cycler.component';
import { HeaderComponent } from './components/header/header.component';
import { BentoGridComponent, BentoItem } from './components/bento-grid/bento-grid.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    BentoGridComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  isLoading = true;
  isLoaderDestroyed = false;

  // Work portfolio items
  workItems: BentoItem[] = [
    { 
      id: 1, 
      title: 'Project One', 
      description: 'A comprehensive web application built with Angular and Three.js, featuring interactive 3D elements.', 
      mediaUrl: 'assets/Project1.gif', 
      liveUrl: '#', 
      spanRows: 2, 
      spanCols: 2 
    },
    { 
      id: 2, 
      title: 'Project Two', 
      description: 'Modern e-commerce platform with seamless user experience and advanced filtering.', 
      mediaUrl: 'assets/Project1.gif', 
      liveUrl: '#', 
      spanRows: 1, 
      spanCols: 1 
    },
    { 
      id: 3, 
      title: 'Project Three', 
      description: 'Real-time collaborative tool built with WebSockets and reactive state management.', 
      mediaUrl: 'assets/Project1.gif', 
      liveUrl: '#', 
      spanRows: 1, 
      spanCols: 1 
    },
    { 
      id: 4, 
      title: 'Project Four', 
      description: 'Data visualization dashboard with complex charts and interactive analytics.', 
      mediaUrl: 'assets/Project1.gif', 
      liveUrl: '#', 
      spanRows: 1, 
      spanCols: 2 
    },
  ];

  // Certificate items
  certificateItems: BentoItem[] = [
    { 
      id: 1, 
      title: 'Advanced Web Development', 
      description: 'Certification in modern web technologies including Angular, React, and Vue.js.', 
      mediaUrl: 'assets/Certificate1.jpg', 
      spanRows: 1, 
      spanCols: 1 
    },
    { 
      id: 2, 
      title: 'Three.js Mastery', 
      description: 'Expert-level certification in 3D web graphics and interactive experiences.', 
      mediaUrl: 'assets/Certificate1.jpg', 
      spanRows: 1, 
      spanCols: 1 
    },
    { 
      id: 3, 
      title: 'UI/UX Design Professional', 
      description: 'Comprehensive certification in user interface design and user experience principles.', 
      mediaUrl: 'assets/Certificate1.jpg', 
      spanRows: 1, 
      spanCols: 1 
    },
    { 
      id: 4, 
      title: 'Full Stack Development', 
      description: 'Complete stack certification covering frontend, backend, and deployment.', 
      mediaUrl: 'assets/Certificate1.jpg', 
      spanRows: 1, 
      spanCols: 1 
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
    // Animate about section
    gsap.from('.about-section h2', {
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.about-section p', {
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 75%',
        end: 'top 45%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.2
    });

    gsap.from('.about-section h3', {
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 70%',
        end: 'top 40%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.4
    });

    // Animate bento sections
    const bentoSections = document.querySelectorAll('.bento-section');
    bentoSections.forEach((section) => {
      // Animate section heading
      const heading = section.querySelector('h2');
      if (heading) {
        gsap.from(heading, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out'
        });
      }

      // Animate bento items with stagger
      const bentoItems = section.querySelectorAll('.bento-item');
      if (bentoItems.length > 0) {
        gsap.from(bentoItems, {
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 45%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 40,
          scale: 0.95,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1
        });
      }
    });

    // Animate contact section
    gsap.from('.placeholder-section', {
      scrollTrigger: {
        trigger: '.placeholder-section',
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out'
    });
  }
}