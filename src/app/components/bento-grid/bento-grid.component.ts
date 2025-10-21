// --- IMPORT THE REQUIRED CDK MODULES ---
import { Component, Input, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { gsap } from 'gsap';
import { CommonModule } from '@angular/common';
import { CdkPortal, PortalModule, DomPortalOutlet } from '@angular/cdk/portal';
import { ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';

export interface BentoItem {
  // ... interface is unchanged
  id: number;
  title: string;
  description: string;
  mediaUrl: string;
  liveUrl?: string;
  spanRows: number;
  spanCols: number;
}

@Component({
  selector: 'app-bento-grid',
  standalone: true,
  // --- ADD PortalModule TO IMPORTS ---
  imports: [CommonModule, PortalModule], 
  templateUrl: './bento-grid.component.html',
  styleUrls: ['./bento-grid.component.scss']
})
export class BentoGridComponent implements OnDestroy {
  // --- GET A REFERENCE TO THE PORTAL TEMPLATE ---
  @ViewChild(CdkPortal) modalPortal!: CdkPortal;
  
  // No longer need ViewChild for overlay/content here as they are inside the portal
  
  @Input() items: BentoItem[] = [];
  activeItem: BentoItem | null = null;

  private portalHost!: DomPortalOutlet;

  constructor(
    private renderer: Renderer2,
    // --- INJECT SERVICES NEEDED FOR CDK PORTALS ---
    private appRef: ApplicationRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  openModal(item: BentoItem): void {
    this.activeItem = item;
    
    // Create a portal host on the document body
    this.portalHost = new DomPortalOutlet(
      document.body,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );

    // Attach the portal to the host
    this.portalHost.attach(this.modalPortal);

    // Add class to prevent background scrolling
    this.renderer.addClass(document.body, 'modal-active-body');

    // --- SLIGHT CHANGE TO ANIMATION SELECTORS ---
    // We now select from the global document since the modal is on the body
    gsap.timeline()
      .set('.modal-overlay', { visibility: 'visible' })
      .to('.modal-overlay', { opacity: 1, duration: 0.4, ease: 'power2.out' })
      .fromTo('.modal-content', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }, "-=0.2")
      .fromTo('.modal-belt', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, "-=0.3");
  }

  closeModal(): void {
    gsap.timeline({
      onComplete: () => {
        // --- DETACH AND CLEAN UP THE PORTAL ---
        if (this.portalHost && this.portalHost.hasAttached()) {
          this.portalHost.detach();
        }
        this.activeItem = null;
        this.renderer.removeClass(document.body, 'modal-active-body');
      }
    })
    .to(['.modal-belt', '.modal-content'], { opacity: 0, y: 20, duration: 0.3, ease: 'power2.in', stagger: 0.05 })
    .to('.modal-overlay', { opacity: 0, duration: 0.3, ease: 'power2.in' }, "-=0.2");
  }

  ngOnDestroy(): void {
    // Ensure the portal is cleaned up if the component is destroyed
    if (this.portalHost && this.portalHost.hasAttached()) {
      this.portalHost.detach();
    }
    this.renderer.removeClass(document.body, 'modal-active-body');
  }
}