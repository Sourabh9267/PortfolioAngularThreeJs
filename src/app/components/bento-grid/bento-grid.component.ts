import { Component, Input, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { gsap } from 'gsap/all';
import { CommonModule } from '@angular/common';

// --- UPDATED INTERFACE to include description ---
export interface BentoItem {
  id: number;
  title: string;
  description: string; // Added description
  mediaUrl: string;
  liveUrl?: string;
  spanRows: number;
  spanCols: number;
}

@Component({
  selector: 'app-bento-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bento-grid.component.html',
  styleUrls: ['./bento-grid.component.scss']
})
export class BentoGridComponent implements AfterViewInit, OnDestroy {
  @ViewChild('modalOverlay') private modalOverlayRef!: ElementRef;
  @ViewChild('modalContent') private modalContentRef!: ElementRef;
  @ViewChild('modalBelt') private modalBeltRef!: ElementRef;

  @Input() items: BentoItem[] = [];
  activeItem: BentoItem | null = null;

  ngAfterViewInit(): void {
    gsap.set(this.modalOverlayRef.nativeElement, { visibility: 'hidden', opacity: 0 });
  }

  openModal(item: BentoItem): void {
    this.activeItem = item;
    const overlay = this.modalOverlayRef.nativeElement;
    const content = this.modalContentRef.nativeElement;
    const belt = this.modalBeltRef.nativeElement;

    gsap.timeline()
      .set(overlay, { visibility: 'visible' })
      .to(overlay, { opacity: 1, duration: 0.4, ease: 'power2.out' })
      // Animate the main content box
      .fromTo(content, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }, "-=0.2")
      // Animate the belt sliding up from the bottom
      .fromTo(belt, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, "-=0.3");
  }

  closeModal(): void {
    const overlay = this.modalOverlayRef.nativeElement;
    const content = this.modalContentRef.nativeElement;
    const belt = this.modalBeltRef.nativeElement;

    gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { visibility: 'hidden' });
        this.activeItem = null;
      }
    })
    .to([belt, content], { opacity: 0, y: 20, duration: 0.3, ease: 'power2.in', stagger: 0.05 })
    .to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in' }, "-=0.2");
  }

  ngOnDestroy(): void {
    gsap.killTweensOf([this.modalOverlayRef.nativeElement, this.modalContentRef.nativeElement, this.modalBeltRef.nativeElement]);
  }
}