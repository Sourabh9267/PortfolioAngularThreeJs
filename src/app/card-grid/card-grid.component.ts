import { Component, Input, OnDestroy, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, ApplicationRef, Injector, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Subscription } from 'rxjs';
import { AnimationControlService } from '../services/animation-control.service';
import { CdkPortal, DomPortalOutlet, PortalModule } from '@angular/cdk/portal';
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
  imports: [CommonModule,PortalModule],
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss']
})
export class CardGridComponent implements AfterViewInit, OnDestroy {
  @Input() items: CardItem[] = [];
  @Input() sectionTitle: string = 'Grid Section';
 @Input() isContentVisible = false;
  @ViewChild('gridSection') gridSection!: ElementRef;
  @ViewChild('heading') heading!: ElementRef;
  @ViewChild('grid') grid!: ElementRef;
  @ViewChild('overlay') overlay!: ElementRef;
  @ViewChild('overlayContent') overlayContent!: ElementRef;

// --- Reference to the portal template ---
  @ViewChild(CdkPortal) portal!: CdkPortal;
  private portalHost!: DomPortalOutlet;

  selectedItem: CardItem | null = null;


  isOverlayVisible = false;
  
  // This array type is correct, we just need to push the right thing into it.
  private scrollTriggers: ScrollTrigger[] = [];
 private loaderFinishedSubscription!: Subscription;


   constructor(
    private animationControlService: AnimationControlService,
    // --- Inject services required for portals ---
    private appRef: ApplicationRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}
  ngAfterViewInit(): void {

  }
ngOnInit(): void {
    this.loaderFinishedSubscription = this.animationControlService.loaderFinished$.subscribe(() => {
      setTimeout(() => this.setupScrollAnimations(), 0);
    });
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

    // --- Create the portal host on the document body ---
    this.portalHost = new DomPortalOutlet(
      document.body,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );

    // --- Attach the portal to the host ---
    this.portalHost.attach(this.portal);
    document.body.classList.add('modal-active-body');

    // --- Animate using global selectors because the overlay is now on the body ---
    gsap.timeline()
      .to('.overlay', { autoAlpha: 1, duration: 0.4, ease: 'power2.out' })
      .fromTo('.overlay-content', 
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 
        "-=0.2"
      );
  }

  closeOverlay(): void {
    gsap.timeline({
      onComplete: () => {
        // --- Detach the portal to remove it from the body ---
        if (this.portalHost && this.portalHost.hasAttached()) {
          this.portalHost.detach();
        }
        this.selectedItem = null;
        document.body.classList.remove('modal-active-body');
      }
    })
      .to('.overlay-content', { scale: 0.9, opacity: 0, y: 30, duration: 0.3, ease: 'power2.in' })
      .to('.overlay', { autoAlpha: 0, duration: 0.3 }, "-=0.1");
  }

  ngOnDestroy(): void {
    if (this.loaderFinishedSubscription) {
      this.loaderFinishedSubscription.unsubscribe();
    }
    this.scrollTriggers.forEach(trigger => trigger.kill());
    // --- Ensure the portal is cleaned up if the component is destroyed ---
    if (this.portalHost && this.portalHost.hasAttached()) {
      this.portalHost.detach();
    }
  }
}