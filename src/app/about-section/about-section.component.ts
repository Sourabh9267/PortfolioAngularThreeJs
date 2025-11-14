import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface Skill {
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about-section" #aboutSection>
      <div class="about-container">
        <!-- Heading with reveal -->
        <h2 class="about-heading" #heading>ABOUT ME</h2>
        
        <!-- Main content with Apple-style text reveal -->
        <div class="about-content">
          <p class="about-text" #aboutText>
            A passionate developer and designer crafting exceptional digital experiences. 
            I blend creativity with technical expertise to build innovative solutions that 
            push the boundaries of what's possible on the web. With a keen eye for detail 
            and a commitment to excellence, I transform ideas into reality through clean 
            code and thoughtful design.
          </p>
          
          <p class="about-text" #aboutText2>
            My journey in web development has been driven by curiosity and the desire to 
            create meaningful interactions. I specialize in modern frameworks and cutting-edge 
            technologies, always staying ahead of the curve to deliver experiences that 
            inspire and engage.
          </p>
        </div>

        <!-- Skills Pills -->
        <div class="skills-section">
          <h3 class="skills-heading" #skillsHeading>Skills & Technologies</h3>
          <div class="skills-grid" #skillsGrid>
            <div 
              *ngFor="let skill of skills; let i = index" 
              class="skill-pill"
              [style.--skill-color]="skill.color">
              <div class="skill-icon" [innerHTML]="skill.icon"></div>
              <span class="skill-name">{{ skill.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      padding: 12rem 4rem;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .about-container {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }

    .about-heading {
      font-size: clamp(3rem, 8vw, 6rem);
      font-weight: 800;
      letter-spacing: -2px;
      margin-bottom: 4rem;
      text-align: center;
      background: linear-gradient(135deg, #fff 0%, #a594fd 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .about-content {
      margin-bottom: 6rem;
    }

    .about-text {
      font-size: clamp(1.25rem, 2.5vw, 2rem);
      line-height: 1.6;
      margin-bottom: 2rem;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 400;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }

    .skills-section {
      margin-top: 8rem;
    }

    .skills-heading {
      font-size: clamp(1.5rem, 3vw, 2.5rem);
      font-weight: 700;
      text-align: center;
      margin-bottom: 3rem;
      letter-spacing: -0.5px;
      color: rgba(255, 255, 255, 0.9);
    }

    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      max-width: 1000px;
      margin: 0 auto;
    }

    .skill-pill {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.75rem;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 100px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, var(--skill-color), transparent);
        opacity: 0;
        transition: opacity 0.4s ease;
        z-index: 0;
      }
      
      &:hover {
        transform: translateY(-4px);
        border-color: var(--skill-color);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3),
                    0 0 0 1px var(--skill-color);
        
        &::before {
          opacity: 0.15;
        }
        
        .skill-icon {
          transform: scale(1.1) rotate(5deg);
        }
      }
    }

    .skill-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      z-index: 1;
      
      :deep(svg) {
        width: 100%;
        height: 100%;
        fill: currentColor;
      }
    }

    .skill-name {
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.3px;
      white-space: nowrap;
      position: relative;
      z-index: 1;
      color: rgba(255, 255, 255, 0.9);
    }

    @media (max-width: 768px) {
      .about-section {
        padding: 6rem 2rem;
      }
      
      .about-heading {
        margin-bottom: 3rem;
      }
      
      .skills-section {
        margin-top: 4rem;
      }
      
      .skill-pill {
        padding: 0.75rem 1.5rem;
      }
    }
  `]
})
export class AboutSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('aboutSection') aboutSection!: ElementRef;
  @ViewChild('heading') heading!: ElementRef;
  @ViewChild('aboutText') aboutText!: ElementRef;
  @ViewChild('aboutText2') aboutText2!: ElementRef;
  @ViewChild('skillsHeading') skillsHeading!: ElementRef;
  @ViewChild('skillsGrid') skillsGrid!: ElementRef;

  private scrollTriggers: ScrollTrigger[] = [];

  skills: Skill[] = [
    { 
      name: 'Angular', 
      icon: '<svg viewBox="0 0 24 24"><path d="M12 2L2 6l1.5 13L12 22l8.5-3L22 6z" fill="#DD0031"/><path d="M12 2v20l8.5-3L22 6z" fill="#C3002F"/><path d="M12 4.5L7.5 17h2l1-2.5h3L14.5 17h2L12 4.5z" fill="white"/></svg>',
      color: '#DD0031'
    },
    { 
      name: 'TypeScript', 
      icon: '<svg viewBox="0 0 24 24"><rect width="24" height="24" fill="#3178C6" rx="3"/><path d="M13 7h-2v10h2V7zm4 0h-2v10h2V7zM9 7H7v10h2V7z" fill="white"/></svg>',
      color: '#3178C6'
    },
    { 
      name: 'Three.js', 
      icon: '<svg viewBox="0 0 24 24"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5l7 3.5v7l-7 3.5-7-3.5V8l7-3.5z" fill="#FFFFFF"/></svg>',
      color: '#049EF4'
    },
    { 
      name: 'GSAP', 
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#88CE02"/><path d="M8 12l3 3 5-6" stroke="white" stroke-width="2" fill="none"/></svg>',
      color: '#88CE02'
    },
    { 
      name: 'SCSS', 
      icon: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#CC6699"/></svg>',
      color: '#CC6699'
    },
    { 
      name: 'JavaScript', 
      icon: '<svg viewBox="0 0 24 24"><rect width="24" height="24" fill="#F7DF1E" rx="3"/><path d="M7 18h2v-3c0-1 .5-1.5 1.5-1.5h1c1 0 1.5.5 1.5 1.5v3h2v-3.5c0-2-1-3-3-3h-1c-2 0-3 1-3 3V18z" fill="#000"/></svg>',
      color: '#F7DF1E'
    },
    { 
      name: 'WebGL', 
      icon: '<svg viewBox="0 0 24 24"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2l6 3.33V15l-6 3.33L6 15V7.33L12 4z" fill="#990000"/></svg>',
      color: '#990000'
    },
    { 
      name: 'Git', 
      icon: '<svg viewBox="0 0 24 24"><path d="M21.62 11.11l-8.73-8.73c-.49-.49-1.28-.49-1.77 0L9.7 3.8l2.23 2.23c.52-.17 1.11-.07 1.53.35.42.42.52 1.06.33 1.59l2.15 2.15c.52-.19 1.16-.09 1.58.33.6.6.6 1.56 0 2.15-.59.59-1.55.59-2.14 0-.43-.43-.54-1.07-.32-1.61L13.5 9.42v5.74c.14.07.28.15.4.27.59.59.59 1.55 0 2.14-.59.59-1.55.59-2.14 0-.59-.59-.59-1.55 0-2.14.15-.15.32-.26.5-.33V9.42c-.18-.07-.35-.18-.5-.33-.44-.44-.54-1.08-.31-1.62L9.2 5.23l-6.88 6.88c-.49.49-.49 1.28 0 1.77l8.73 8.73c.49.49 1.28.49 1.77 0l8.69-8.69c.49-.49.49-1.28 0-1.77z" fill="#F05032"/></svg>',
      color: '#F05032'
    },
    { 
      name: 'RxJS', 
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#B7178C"/><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="white"/></svg>',
      color: '#B7178C'
    },
    { 
      name: 'Node.js', 
      icon: '<svg viewBox="0 0 24 24"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm6.5 13.5L12 19l-6.5-3.5v-7L12 5l6.5 3.5v7z" fill="#339933"/></svg>',
      color: '#339933'
    }
  ];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupAnimations();
    }, 100);
  }

  private setupAnimations(): void {
    // Heading animation
    const headingSplit = new SplitText(this.heading.nativeElement, { type: 'chars' });
    
    gsap.from(headingSplit.chars, {
      scrollTrigger: {
        trigger: this.aboutSection.nativeElement,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 100,
      rotationX: -90,
      stagger: 0.02,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });

    // Apple-style text reveal for paragraphs
    this.createTextReveal(this.aboutText.nativeElement, 'top 70%');
    this.createTextReveal(this.aboutText2.nativeElement, 'top 65%');

    // Skills heading
    gsap.from(this.skillsHeading.nativeElement, {
      scrollTrigger: {
        trigger: this.skillsHeading.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Skills pills with stagger
    const pills = this.skillsGrid.nativeElement.querySelectorAll('.skill-pill');
    gsap.from(pills, {
      scrollTrigger: {
        trigger: this.skillsGrid.nativeElement,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      scale: 0.8,
      y: 30,
      stagger: {
        amount: 0.6,
        from: 'start',
        ease: 'power2.out'
      },
      duration: 0.6,
      ease: 'back.out(1.7)'
    });
  }

private createTextReveal(element: HTMLElement, start: string): void {
  const split = new SplitText(element, { type: 'lines', linesClass: 'line' });

  // Ensure TypeScript understands SplitText returns Element[]
  (split.lines as Element[]).forEach((line) => {
    const el = line as HTMLElement;

    const wrapper = document.createElement('div');
    wrapper.style.overflow = 'hidden';
    wrapper.style.paddingBottom = '0.2em';

    el.parentNode?.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  });

  gsap.from(split.lines, {
    scrollTrigger: {
      trigger: element,
      start: start,
      end: 'top 40%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    yPercent: 100,
    duration: 1,
    stagger: 0.1,
    ease: 'power3.out'
  });
}

  ngOnDestroy(): void {
    this.scrollTriggers.forEach(trigger => trigger.kill());
  }
}