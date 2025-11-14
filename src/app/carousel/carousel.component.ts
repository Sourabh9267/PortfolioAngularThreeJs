import { Component, Input, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface CarouselItem {
  id: number;
  title: string;
  description: string;
  mediaUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="carousel-section" #carouselSection>
      <div class="carousel-container">
        <h2 class="carousel-heading" #heading>{{ sectionTitle }}</h2>
        
        <div class="carousel-wrapper">
          <!-- Navigation Buttons -->
          <button 
            class="nav-btn prev" 
            (click)="prevSlide()"
            [disabled]="currentIndex === 0"
            #prevBtn>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <!-- Carousel Track -->
          <div class="carousel-track" #carouselTrack>
            <div 
              *ngFor="let item of items; let i = index"
              class="carousel-card"
              [class.active]="i === currentIndex"
              (click)="openOverlay(item)">
              
              <div class="card-media-container">
                <img [src]="item.mediaUrl" [alt]="item.title" class="card-media">
                <div class="card-overlay-hint">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 5v.01M12 19v.01M5 12h.01M19 12h.01"/>
                  </svg>
                  <span>View Details</span>
                </div>
              </div>

              <div class="card-content">
                <h3 class="card-title">{{ item.title }}</h3>
                <p class="card-description">{{ item.description }}</p>
                
                <div class="card-tags">
                  <span *ngFor="let tag of item.tags" class="tag">{{ tag }}</span>
                </div>

                <div class="card-actions">
                  <a *ngIf="item.liveUrl" 
                     [href]="item.liveUrl" 
                     target="_blank" 
                     class="action-btn"
                     (click)="$event.stopPropagation()">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Live Demo
                  </a>
                  <a *ngIf="item.githubUrl" 
                     [href]="item.githubUrl" 
                     target="_blank" 
                     class="action-btn secondary"
                     (click)="$event.stopPropagation()">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>

          <button 
            class="nav-btn next" 
            (click)="nextSlide()"
            [disabled]="currentIndex === items.length - 1"
            #nextBtn>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <!-- Indicators -->
        <div class="carousel-indicators">
          <button 
            *ngFor="let item of items; let i = index"
            class="indicator"
            [class.active]="i === currentIndex"
            (click)="goToSlide(i)">
          </button>
        </div>
      </div>
    </section>

    <!-- Fullscreen Overlay -->
    <div class="fullscreen-overlay" 
         [class.active]="overlayActive"
         (click)="closeOverlay()"
         #overlay>
      <button class="close-btn" (click)="closeOverlay()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      <div class="overlay-content" (click)="$event.stopPropagation()" #overlayContent>
        <div class="overlay-media-container">
          <img *ngIf="activeOverlayItem" 
               [src]="activeOverlayItem.mediaUrl" 
               [alt]="activeOverlayItem.title" 
               class="overlay-media">
        </div>

        <div class="overlay-info" #overlayInfo>
          <div *ngIf="activeOverlayItem">
            <h2 class="overlay-title">{{ activeOverlayItem.title }}</h2>
            <p class="overlay-description">{{ activeOverlayItem.description }}</p>
            
            <div class="overlay-tags">
              <span *ngFor="let tag of activeOverlayItem.tags" class="tag">{{ tag }}</span>
            </div>

            <div class="overlay-actions">
              <a *ngIf="activeOverlayItem.liveUrl" 
                 [href]="activeOverlayItem.liveUrl" 
                 target="_blank" 
                 class="overlay-btn primary">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
                View Live
              </a>
              <a *ngIf="activeOverlayItem.githubUrl" 
                 [href]="activeOverlayItem.githubUrl" 
                 target="_blank" 
                 class="overlay-btn secondary">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                Source Code
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .carousel-section {
      padding: 8rem 2rem;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .carousel-container {
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
    }

    .carousel-heading {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      letter-spacing: -2px;
      text-align: center;
      margin-bottom: 4rem;
      background: linear-gradient(135deg, #fff 0%, #a594fd 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .carousel-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .carousel-track {
      flex: 1;
      overflow: hidden;
      padding: 2rem 0;
    }

    .carousel-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

      &:hover {
        transform: translateY(-8px);
        border-color: rgba(165, 148, 253, 0.3);
        box-shadow: 
          0 20px 60px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(165, 148, 253, 0.2);

        .card-overlay-hint {
          opacity: 1;
        }

        .card-media {
          transform: scale(1.05);
        }
      }
    }

    .card-media-container {
      position: relative;
      width: 100%;
      height: 400px;
      overflow: hidden;
      background: #000;
    }

    .card-media {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    .card-overlay-hint {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      opacity: 0;
      transition: opacity 0.4s ease;

      svg {
        width: 48px;
        height: 48px;
        stroke: #fff;
      }

      span {
        font-size: 1.25rem;
        font-weight: 600;
        color: #fff;
      }
    }

    .card-content {
      padding: 2rem;
    }

    .card-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 1rem;
      letter-spacing: -0.5px;
      color: #fff;
    }

    .card-description {
      font-size: 1rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 1.5rem;
    }

    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .tag {
      padding: 0.5rem 1rem;
      background: rgba(165, 148, 253, 0.15);
      border: 1px solid rgba(165, 148, 253, 0.3);
      border-radius: 100px;
      font-size: 0.875rem;
      font-weight: 600;
      color: #a594fd;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(165, 148, 253, 0.25);
        transform: translateY(-2px);
      }
    }

    .card-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #a594fd, #f28ab2);
      border: none;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;

      svg {
        width: 18px;
        height: 18px;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(165, 148, 253, 0.4);
      }

      &.secondary {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);

        &:hover {
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
        }
      }
    }

    .nav-btn {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #fff;

      svg {
        width: 24px;
        height: 24px;
      }

      &:hover:not(:disabled) {
        background: rgba(165, 148, 253, 0.2);
        border-color: rgba(165, 148, 253, 0.4);
        transform: scale(1.1);
      }

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }

    .carousel-indicators {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
    }

    .indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;

      &.active {
        background: #a594fd;
        transform: scale(1.3);
      }

      &:hover {
        background: rgba(165, 148, 253, 0.7);
      }
    }

    /* Fullscreen Overlay */
    .fullscreen-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(20px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s ease;

      &.active {
        opacity: 1;
        visibility: visible;
      }
    }

    .close-btn {
      position: absolute;
      top: 2rem;
      right: 2rem;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      cursor: pointer;
      z-index: 10;
      color: #fff;
      transition: all 0.3s ease;

      svg {
        width: 24px;
        height: 24px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
      }
    }

    .overlay-content {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 3rem;
      max-width: 1400px;
      width: 90%;
      max-height: 85vh;
      background: rgba(20, 20, 20, 0.95);
      backdrop-filter: blur(30px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.8);
    }

    .overlay-media-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      overflow: hidden;
    }

    .overlay-media {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .overlay-info {
      padding: 3rem 3rem 3rem 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .overlay-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      letter-spacing: -1px;
      background: linear-gradient(135deg, #fff 0%, #a594fd 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .overlay-description {
      font-size: 1.125rem;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 2rem;
    }

    .overlay-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 2.5rem;
    }

    .overlay-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .overlay-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      color: #fff;

      svg {
        width: 20px;
        height: 20px;
      }

      &.primary {
        background: linear-gradient(135deg, #a594fd, #f28ab2);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(165, 148, 253, 0.5);
        }
      }

      &.secondary {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);

        &:hover {
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
        }
      }
    }

    @media (max-width: 1024px) {
      .overlay-content {
        grid-template-columns: 1fr;
        width: 95%;
        max-height: 90vh;
      }

      .overlay-media-container {
        height: 50vh;
      }

      .overlay-info {
        padding: 2rem;
      }
    }

    @media (max-width: 768px) {
      .carousel-section {
        padding: 4rem 1rem;
      }

      .carousel-wrapper {
        gap: 1rem;
      }

      .nav-btn {
        width: 44px;
        height: 44px;

        svg {
          width: 20px;
          height: 20px;
        }
      }

      .card-media-container {
        height: 300px;
      }

      .card-content {
        padding: 1.5rem;
      }

      .card-title {
        font-size: 1.5rem;
      }

      .close-btn {
        top: 1rem;
        right: 1rem;
        width: 44px;
        height: 44px;
      }

      .overlay-title {
        font-size: 2rem;
      }
    }
  `]
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  @Input() items: CarouselItem[] = [];
  @Input() sectionTitle: string = 'Projects';

  @ViewChild('carouselSection') carouselSection!: ElementRef;
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;
  @ViewChild('heading') heading!: ElementRef;
  @ViewChild('overlay') overlay!: ElementRef;
  @ViewChild('overlayContent') overlayContent!: ElementRef;
  @ViewChild('overlayInfo') overlayInfo!: ElementRef;

  currentIndex = 0;
  overlayActive = false;
  activeOverlayItem: CarouselItem | null = null;
  private scrollTriggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupAnimations();
    }, 100);
  }

  private setupAnimations(): void {
    // Heading animation
    gsap.from(this.heading.nativeElement, {
      scrollTrigger: {
        trigger: this.carouselSection.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Cards entrance animation
    const cards = this.carouselTrack.nativeElement.querySelectorAll('.carousel-card');
    if (cards.length > 0) {
      gsap.from(cards[0], {
        scrollTrigger: {
          trigger: this.carouselSection.nativeElement,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });
    }
  }

  nextSlide(): void {
    if (this.currentIndex < this.items.length - 1) {
      this.animateSlide(this.currentIndex + 1);
    }
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.animateSlide(this.currentIndex - 1);
    }
  }

  goToSlide(index: number): void {
    if (index !== this.currentIndex) {
      this.animateSlide(index);
    }
  }

  private animateSlide(newIndex: number): void {
    const cards = this.carouselTrack.nativeElement.querySelectorAll('.carousel-card');
    const currentCard = cards[this.currentIndex];
    const nextCard = cards[newIndex];

    const direction = newIndex > this.currentIndex ? 1 : -1;

    gsap.timeline()
      .to(currentCard, {
        opacity: 0,
        x: -100 * direction,
        scale: 0.9,
        duration: 0.4,
        ease: 'power2.in'
      })
      .set(nextCard, {
        opacity: 0,
        x: 100 * direction,
        scale: 0.9
      })
      .to(nextCard, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => {
          this.currentIndex = newIndex;
        }
      });
  }

  openOverlay(item: CarouselItem): void {
    this.activeOverlayItem = item;
    this.overlayActive = true;
    document.body.style.overflow = 'hidden';

    gsap.timeline()
      .set(this.overlay.nativeElement, { display: 'flex' })
      .to(this.overlay.nativeElement, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
      .from(this.overlayContent.nativeElement, {
        scale: 0.95,
        opacity: 0,
        duration: 0.4,
        ease: 'back.out(1.7)'
      }, '-=0.2')
      .from(this.overlayInfo.nativeElement.children, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
      }, '-=0.3');
  }

  closeOverlay(): void {
    gsap.timeline({
      onComplete: () => {
        this.overlayActive = false;
        this.activeOverlayItem = null;
        document.body.style.overflow = '';
      }
    })
      .to(this.overlayInfo.nativeElement.children, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in'
      })
      .to(this.overlayContent.nativeElement, {
        scale: 0.95,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, '-=0.2')
      .to(this.overlay.nativeElement, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, '-=0.2');
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach(trigger => trigger.kill());
  }
}