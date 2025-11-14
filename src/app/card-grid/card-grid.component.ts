import { Component, Input, OnDestroy, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// This interface remains the same
export interface CardItem {
  id: number;
  title: string;
  description: string;
  mediaUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
}

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss']
})
export class CardGridComponent implements AfterViewInit, OnDestroy,OnChanges {
  @Input() items: CardItem[] = [];
  @Input() sectionTitle: string = 'Grid Section';
 @Input() isContentVisible = false;
  @ViewChild('gridSection') gridSection!: ElementRef;
  @ViewChild('heading') heading!: ElementRef;
  @ViewChild('grid') grid!: ElementRef;
  @ViewChild('overlay') overlay!: ElementRef;
  @ViewChild('overlayContent') overlayContent!: ElementRef;

  isOverlayVisible = false;
  selectedItem: CardItem | null = null;
  
  // This array type is correct, we just need to push the right thing into it.
  private scrollTriggers: ScrollTrigger[] = [];
 private animationsInitialized = false; // Flag to run animations only once
  ngAfterViewInit(): void {

  }
ngOnChanges(changes: SimpleChanges): void {
    if (changes['isContentVisible'] && changes['isContentVisible'].currentValue === true && !this.animationsInitialized) {
      this.animationsInitialized = true;
      setTimeout(() => this.setupScrollAnimations(), 100);
    }
  }

private setupScrollAnimations(): void {
    if (!this.gridSection?.nativeElement) return;

    // Animate the section heading
    const headingTween = gsap.from(this.heading.nativeElement, {
      scrollTrigger: {
        trigger: this.gridSection.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out'
    });
    if (headingTween.scrollTrigger) {
      this.scrollTriggers.push(headingTween.scrollTrigger);
    }

    // Animate the cards staggering in
    const cards = this.grid.nativeElement.querySelectorAll('.card');
    if (cards.length > 0) {
      const cardsTween = gsap.from(cards, {
        scrollTrigger: {
          trigger: this.grid.nativeElement,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1
      });
      if (cardsTween.scrollTrigger) {
        this.scrollTriggers.push(cardsTween.scrollTrigger);
      }
    }
  }
  

  openOverlay(item: CardItem): void {
    this.selectedItem = item;
    this.isOverlayVisible = true;
    document.body.classList.add('modal-active-body');

    gsap.timeline()
      .to(this.overlay.nativeElement, {
        autoAlpha: 1,
        duration: 0.4,
        ease: 'power2.out'
      })
      .fromTo(this.overlayContent.nativeElement, 
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 
        "-=0.2"
      );
  }

  closeOverlay(): void {
    gsap.timeline({
      onComplete: () => {
        this.isOverlayVisible = false;
        this.selectedItem = null;
        document.body.classList.remove('modal-active-body');
      }
    })
      .to(this.overlayContent.nativeElement, {
        scale: 0.9,
        opacity: 0,
        y: 30,
        duration: 0.3,
        ease: 'power2.in'
      })
      .to(this.overlay.nativeElement, {
        autoAlpha: 0,
        duration: 0.3
      }, "-=0.1");
  }

  ngOnDestroy(): void {
    // This now correctly iterates over actual ScrollTrigger instances and kills them.
    this.scrollTriggers.forEach(trigger => trigger.kill());
  }
}