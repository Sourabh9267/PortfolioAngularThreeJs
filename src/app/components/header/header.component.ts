import { NgFor } from '@angular/common';
import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { gsap } from 'gsap/all';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [NgFor]
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('activePill') private activePillRef!: ElementRef;
  @ViewChild('navLinksList') private navLinksListRef!: ElementRef;

  navLinks = ['home', 'about', 'portfolio', 'certificates', 'contact'];
  activeSection = 'home';
  isMobileMenuOpen = false;
  private scrollTriggers: ScrollTrigger[] = [];

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.animateHeaderIn();
      this.setupScrollSpy();
      // Set initial position of the pill
      this.moveActivePill(document.querySelector('.nav-link.active') as HTMLElement, false);
    }, 100);
  }

  animateHeaderIn(): void {
    gsap.from('.desktop-nav .nav-link', {
      y: -30, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1
    });
  }

  setupScrollSpy(): void {
    this.navLinks.forEach(link => {
      const section = document.getElementById(link);
      if (section) {
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: self => {
            if (self.isActive) {
              this.ngZone.run(() => {
                this.activeSection = link;
                this.moveActivePill(document.querySelector(`.nav-link[href="#${link}"]`) as HTMLElement);
              });
            }
          }
        });
        this.scrollTriggers.push(trigger);
      }
    });
  }

  moveActivePill(target: HTMLElement | null, animate = true): void {
    if (!target || !this.activePillRef) return;

    const list = this.navLinksListRef.nativeElement;
    // Calculate position relative to the parent ul
    const offsetLeft = target.offsetLeft;
    const offsetWidth = target.offsetWidth;

    gsap.to(this.activePillRef.nativeElement, {
      x: offsetLeft,
      width: offsetWidth,
      duration: animate ? 0.4 : 0,
      ease: 'power3.out'
    });
  }

  scrambleLink(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const originalText = target.innerText;
    gsap.to(target, {
      duration: 0.5,
      scrambleText: { text: originalText, chars: '■□●○' }
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach(trigger => trigger.kill());
  }
}