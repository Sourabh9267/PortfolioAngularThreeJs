// about-section.component.ts
import { Component, ElementRef, ViewChild, OnDestroy, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Subscription } from 'rxjs';
import { AnimationControlService } from '../services/animation-control.service';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface Skill {
  name: string;
  icon: string;       // raw SVG string
  color: string;
  safeIcon?: SafeHtml; // sanitized SVG for binding
}

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about-section" #aboutSection>
      <div class="about-container">
        <h2 class="about-heading" #heading>About Me</h2>

        <div class="about-content">
          <p class="about-text" #aboutText>
            A passionate developer and designer crafting exceptional digital experiences.
            I blend creativity with technical expertise to build innovative solutions
            that push the boundaries of what's possible on the web.
          </p>

          <p class="about-text" #aboutText2>
            I specialize in modern frameworks and cutting-edge technologies,
            always staying ahead of the curve to deliver experiences that inspire and engage.
          </p>
        </div>

        <div class="skills-section">
          <h3 class="skills-heading" #skillsHeading>Skills & Technologies</h3>

          <div class="skills-grid" #skillsGrid>
            <div
              *ngFor="let skill of skills"
              class="skill-pill"
              [style.--skill-color]="skill.color"
            >
              <div class="skill-icon" [innerHTML]="skill.safeIcon"></div>
              <span class="skill-name">{{ skill.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      padding: 10rem 2.5rem;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .about-container {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }

    .about-heading {
      font-size: clamp(2.8rem, 6vw, 4.4rem);
      font-weight: 800;
      text-align: center;
      margin-bottom: 3.5rem;
      font-family: 'NeueMachina' sans-serif !important;
    }

    .about-text {
      font-size: clamp(1.05rem, 2.2vw, 1.5rem);
      line-height: 1.6;
      margin-bottom: 1.6rem;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
      color: rgba(255,255,255,0.92);
    }

    .skills-section {
      margin-top: 4.5rem;
    }

    .skills-heading {
      text-align: center;
      font-size: clamp(1.25rem, 2.4vw, 1.9rem);
      font-weight: 700;
      margin-bottom: 1.8rem;
      color: rgba(255,255,255,0.95);
      font-family:'NeueMachina';
    }

    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.9rem;
      justify-content: center;
    }

    .skill-pill {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.65rem 1.25rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 999px;
      transition: transform .28s ease, box-shadow .28s ease;
      cursor: default;
      --skill-color: #ffffff;
    }

    .skill-pill:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 24px rgba(0,0,0,0.35);
      border-color: var(--skill-color);
    }

    .skill-icon {
      width: 24px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--skill-color);
      flex: 0 0 24px;
    }

    /* Important: ensure svg inside .skill-icon uses currentColor */
    .skill-icon svg {
      width: 100%;
      height: 100%;
      display: block;
      fill: currentColor;
      stroke: currentColor;
    }

    .skill-name {
      font-weight: 600;
      color: rgba(255,255,255,0.94);
      font-size: 0.95rem;
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .about-section { padding: 6rem 1.5rem; }
      .about-heading { margin-bottom: 2rem; }
      .skills-section { margin-top: 2.5rem; }
    }
  `]
})
export class AboutSectionComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('aboutSection') aboutSection!: ElementRef<HTMLElement>;
  @ViewChild('heading') heading!: ElementRef<HTMLElement>;
  @ViewChild('aboutText') aboutText!: ElementRef<HTMLElement>;
  @ViewChild('aboutText2') aboutText2!: ElementRef<HTMLElement>;
  @ViewChild('skillsHeading') skillsHeading!: ElementRef<HTMLElement>;
  @ViewChild('skillsGrid') skillsGrid!: ElementRef<HTMLElement>;

  private loaderFinishedSubscription!: Subscription | null;
  private scrollTriggers: ScrollTrigger[] = [];
  private splitTexts: SplitText[] = [];

 skills: Skill[] = [
  {
    name: 'Figma',
    color: '#F24E1E',
    icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
    <circle cx="15" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></circle>
    <path d="M9 21C10.6569 21 12 19.6569 12 18V15H9C7.34315 15 6 16.3431 6 18C6 19.6569 7.34315 21 9 21Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
    <path d="M12 9V15H9C7.34315 15 6 13.6569 6 12C6 10.3431 7.34315 9 9 9H12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M12 3V9H9C7.34315 9 6 7.65685 6 6C6 4.34315 7.34315 3 9 3H12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M12 3V9H15C16.6569 9 18 7.65685 18 6C18 4.34315 16.6569 3 15 3H12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`
  },

  {
    name: 'HTML',
    color: '#E34F26',
    icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
    <path d="M16.7685 3H8.23147C6.06757 3 4.98562 3 4.39152 3.70888C3.79742 4.41777 3.9697 5.50319 4.31426 7.67402L5.68897 16.3351C5.98587 18.2056 6.416 18.7661 8.18181 19.4563L11.0756 20.5873C11.7796 20.8624 12.1316 21 12.5 21C12.8684 21 13.2204 20.8624 13.9244 20.5873L16.8182 19.4563C18.584 18.7661 19.0141 18.2056 19.311 16.3351L20.6857 7.67402C21.0303 5.50319 21.2026 4.41777 20.6085 3.70888C20.0144 3 18.9324 3 16.7685 3Z" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M15.5 8H10.5269C9.61889 8 9.43592 8.18899 9.51742 9.09276L9.69841 11.0998C9.76714 11.862 9.94159 12.0141 10.7079 12.0141H13.8631C14.788 12.0141 14.9719 12.2076 14.8706 13.1264L14.7013 14.6624C14.6333 15.2803 14.6139 15.3041 14.0195 15.5038L12.7852 15.9187C12.4624 16.0271 12.4565 16.0271 12.1337 15.9187L10.7602 15.4571C10.3907 15.3329 10.2668 15.1818 10.2007 14.8117" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`
  },

  {
    name: 'CSS',
    color: '#1572B6',
    icon: `
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
    <path d="M19.75 2.50024H4.75C4.19772 2.50024 3.75 2.94796 3.75 3.50024L5.60753 17.8961C5.69611 18.5826 6.13335 19.1745 6.76348 19.4609L10.7598 21.2774C11.0829 21.4243 11.4336 21.5002 11.7884 21.5002C12.0935 21.5002 12.396 21.4441 12.6808 21.3346L17.637 19.4283C18.3227 19.1646 18.8086 18.5462 18.9026 17.8176L20.75 3.50024C20.75 2.94796 20.3023 2.50024 19.75 2.50024Z" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M7.5 6.5H16.5L8 11H16L15.5 16L12 17L8.5 16L8.3 14" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`
  },

  {
    name: 'Bootstrap',
    color: '#7952B3',
    icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
    <path d="M12.8824 12C14.0519 12 15 12.8954 15 14C15 15.1046 14.0519 16 12.8824 16H10.6C9.84575 16 9.46863 16 9.23431 15.7657C9 15.5314 9 15.1542 9 14.4V12M12.8824 12C14.0519 12 15 11.1046 15 10C15 8.89543 14.0519 8 12.8824 8H10.6C9.84575 8 9.46863 8 9.23431 8.23431C9 8.46863 9 8.84575 9 9.6V12M12.8824 12H9" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M22 12C20.8954 12 20 11.1046 20 10V8C20 4.69067 19.3093 4 16 4H8C4.69067 4 4 4.69067 4 8V10C4 11.1046 3.10457 12 2 12" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M2 12C3.10457 12 4 12.8954 4 14L4 16C4 19.3093 4.69067 20 8 20H16C19.3093 20 20 19.3093 20 16V14C20 12.8954 20.8954 12 22 12" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`
  },

  {
    name: 'SCSS',
    color: '#CC6699',
    icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M301.8 442.9L301.8 442.9zM550.9 355.9C530.8 355.9 510.9 360.5 492.9 369.4C487 357.5 480.9 347.1 479.9 339.3C478.7 330.2 477.4 324.8 478.8 314C480.2 303.2 486.5 287.9 486.4 286.8C486.3 285.7 485 280.2 472.1 280.1C459.2 280 448.1 282.6 446.8 286C444.5 292.2 442.7 298.6 441.5 305.1C439.2 316.8 415.7 358.6 402.4 380.4C398 371.9 394.3 364.4 393.5 358.4C392.3 349.3 391 343.9 392.4 333.1C393.8 322.3 400.1 307 400 305.9C399.9 304.8 398.6 299.3 385.7 299.2C372.8 299.1 361.7 301.7 360.4 305.1C359.1 308.5 357.7 316.5 355.1 324.2C352.5 331.9 321.2 401.5 313 419.6C308.8 428.8 305.2 436.2 302.6 441.2C302.2 442 301.9 442.5 301.7 442.9C302 442.4 302.2 441.9 302.2 442.1C300 446.4 298.7 448.8 298.7 448.8L298.7 448.9C297 452.1 295.1 455 294.2 455C293.6 455 292.3 446.6 294.5 435.1C299.2 410.9 310.3 373.3 310.2 372C310.1 371.3 312.3 364.8 302.9 361.3C293.8 358 290.5 363.5 289.7 363.5C288.9 363.5 288.3 365.5 288.3 365.5C288.3 365.5 298.4 323.1 268.9 323.1C250.5 323.1 224.9 343.3 212.3 361.6C204.4 365.9 187.3 375.2 169.3 385.1C162.4 388.9 155.3 392.8 148.6 396.5C148.1 396 147.7 395.5 147.2 395C111.4 356.8 45.3 329.8 48.1 278.5C49.1 259.8 55.6 210.7 175.2 151.1C273.2 102.3 351.5 115.7 365 145.5C384.4 188 323.1 267.1 221.3 278.5C182.5 282.8 162.1 267.8 157 262.2C151.7 256.3 150.9 256 148.9 257.1C145.6 258.9 147.7 264.1 148.9 267.2C151.9 275.1 164.4 289.1 185.7 296.1C204.4 302.2 249.9 305.6 304.9 284.3C366.7 260.5 414.8 194.2 400.7 138.7C386.3 82.3 292.8 63.8 204.4 95.2C151.7 113.9 94.7 143.3 53.7 181.6C5 227.2-2.8 266.9 .4 283.5C11.8 342.4 93 380.8 125.5 409.2C123.9 410.1 122.4 410.9 121 411.7C104.7 419.8 42.8 452.2 27.3 486.4C9.8 525.2 30.2 553 43.6 556.8C85.4 568.4 128.2 547.5 151.2 513.2C174.2 478.9 171.4 434.1 160.8 413.7C160.7 413.4 160.5 413.2 160.4 412.9C164.6 410.4 168.9 407.9 173.2 405.4C181.5 400.5 189.6 396 196.7 392.1C192.7 402.9 189.8 415.9 188.3 434.7C186.5 456.7 195.6 485.2 207.4 496.4C212.6 501.3 218.9 501.4 222.8 501.4C236.6 501.4 242.8 490 249.7 476.4C258.2 459.8 265.7 440.5 265.7 440.5C265.7 440.5 256.3 492.7 282 492.7C291.4 492.7 300.8 480.6 305 474.4L305 474.5C305 474.5 305.2 474.1 305.7 473.3C306.7 471.8 307.2 470.9 307.2 470.9L307.2 470.6C311 464.1 319.3 449.2 331.8 424.6C348 392.8 363.5 353.1 363.5 353.1C365 361.8 367.1 370.4 369.7 378.9C372.5 388.4 378.4 398.8 383.1 408.9C379.3 414.1 377 417.1 377 417.1C377 417.2 377 417.2 377.1 417.3C374.1 421.3 370.7 425.6 367.2 429.8C354.4 445 339.2 462.4 337.2 467.4C334.8 473.3 335.4 477.7 340 481.1C343.4 483.7 349.4 484.1 355.7 483.6C367.2 482.8 375.3 480 379.2 478.2C386.4 475.6 393.2 472.1 399.4 467.6C411.9 458.4 419.5 445.2 418.8 427.8C418.4 418.2 415.3 408.6 411.5 399.6C412.6 398 413.8 396.3 414.9 394.6C434.7 365.7 450 334 450 334C451.5 342.7 453.6 351.3 456.2 359.8C458.6 367.9 463.3 376.8 467.6 385.5C449 400.6 437.5 418.1 433.5 429.6C426.1 450.9 431.9 460.5 442.8 462.7C447.7 463.7 454.7 461.4 459.9 459.2C467.6 456.6 474.9 452.9 481.5 448.1C494 438.9 506.1 426 505.3 408.5C505 400.6 502.8 392.7 499.9 385.1C515.6 378.5 536 374.9 562 377.9C617.7 384.4 628.6 419.2 626.5 433.7C624.4 448.2 612.7 456.3 608.8 458.7C604.9 461.1 603.7 462 604 463.8C604.5 466.4 606.3 466.3 609.6 465.7C614.2 464.9 638.8 453.9 639.9 427C641.5 393 608.8 355.6 550.9 355.9L550.9 355.9zM121.8 500.6C103.4 520.7 77.6 528.3 66.5 521.9C54.6 515 59.3 485.4 82 464C95.8 451 113.6 439 125.4 431.6C128.1 430 132 427.6 136.8 424.7C137.6 424.2 138 424 138 424C138.9 423.4 139.9 422.9 140.9 422.3C149.2 452.7 141.2 479.5 121.8 500.6L121.8 500.6zM256.2 409.2C249.8 424.9 236.3 464.9 228.1 462.8C221.1 461 216.8 430.5 226.7 400.5C231.7 385.4 242.3 367.4 248.6 360.4C258.7 349.1 269.8 345.5 272.4 350C275.9 355.9 260.2 399.4 256.2 409.2zM367.2 462.2C364.5 463.6 362 464.5 360.8 463.8C359.9 463.3 361.9 461.4 361.9 461.4C361.9 461.4 375.8 446.5 381.3 439.7C384.5 435.7 388.2 431 392.2 425.8C392.2 426.3 392.3 426.8 392.3 427.4C392.2 445.3 375 457.4 367.2 462.2L367.2 462.2zM452.8 442.7C450.8 441.3 451.1 436.6 457.8 422C460.4 416.3 466.4 406.7 476.8 397.5C478 401 478.6 404.6 478.7 408.3C478.6 430.8 462.5 439.2 452.8 442.7L452.8 442.7z"/></svg>`
  },

  {
    name: 'TypeScript',
    color: '#3178C6',
    icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
    <path d="M2.5 12.0001C2.5 7.52178 2.5 5.28261 3.89124 3.89136C5.28249 2.50012 7.52166 2.50012 12 2.50012C16.4783 2.50012 18.7175 2.50012 20.1088 3.89136C21.5 5.28261 21.5 7.52178 21.5 12.0001C21.5 16.4785 21.5 18.7176 20.1088 20.1089C18.7175 21.5001 16.4783 21.5001 12 21.5001C7.52166 21.5001 5.28249 21.5001 3.89124 20.1089C2.5 18.7176 2.5 16.4785 2.5 12.0001Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M18 12.0001H16.2C15.5373 12.0001 15 12.5374 15 13.2001V13.8001C15 14.4629 15.5373 15.0001 16.2 15.0001H16.8C17.4627 15.0001 18 15.5374 18 16.2001V16.8001C18 17.4629 17.4627 18.0001 16.8 18.0001H15" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M8.5 12.0001H10.5M12.5 12.0001H10.5M10.5 12.0001V18.0001" stroke="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`
  },

  {
    name: 'GSAP',
    color: '#88CE02',
    icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
    <path d="M11.5908 14.536C11.1388 14.7038 10.7358 15.0268 10.3317 15.2845C9.48946 15.8216 8.63063 16.4131 7.58474 16.3597C4.46802 16.2004 2 12.3209 2 9.56692C2 5.38782 6.10119 2 11.1603 2C15.7188 2 19.4995 4.75056 20.2031 8.35214C20.4227 9.47603 19.9208 10.1613 19.3027 11.0803L21.3692 13.1287C21.797 13.5528 22.011 13.7649 21.9996 13.9858C21.9881 14.2066 21.7199 14.4234 21.1834 14.8569C20.7141 15.236 20.3205 15.6902 20.3205 16.1249C20.5325 17.5959 21.4196 20.0253 20.4459 21.2837C19.2685 22.8054 16.9884 21.5105 15.6126 20.9801C14.178 20.4271 13.4607 20.1506 12.9795 19.6296C11.8449 18.4013 11.5908 14.536 11.5908 14.536ZM11.5908 14.536C13.0845 13.9816 14.3114 15.7714 15.8378 15.1043C16.3596 14.8762 16.8134 14.4444 17.2671 14.1071" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M20.5 18.9999C20.5 18.9999 19 18.4999 18.5 17.4999" stroke="none" stroke-width="1.5" stroke-linecap="round" />
    <path d="M14 9.01907C14 9.01907 12.1384 9.01907 11.3067 10.3287C11.0575 10.7213 10.6752 11.0693 10.2233 10.9881C9.01847 10.7716 7.65343 9.99767 7 8" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" />
</svg>`
  },

  {
    name: 'Angular',
    color: '#DD0031',
    icon: `
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 256 256"><path d="M227.08,64.62l-96-40a7.93,7.93,0,0,0-6.16,0l-96,40a8,8,0,0,0-4.85,8.44l16,120a8,8,0,0,0,4.35,6.1l80,40a8,8,0,0,0,7.16,0l80-40a8,8,0,0,0,4.35-6.1l16-120A8,8,0,0,0,227.08,64.62ZM200.63,186.74,128,223.06,55.37,186.74,40.74,77,128,40.67,215.26,77ZM121,84.12l-40,72a8,8,0,1,0,14,7.76L106,144H150l11,19.88a8,8,0,1,0,14-7.76l-40-72a8,8,0,0,0-14,0ZM141.07,128H114.93L128,104.47Z"></path></svg>`
  },

  {
    name: 'Git',
    color: '#F05032',
    icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
    <path d="M6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8Z" stroke="#141B34" stroke-width="1.5" />
    <path d="M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z" stroke="#141B34" stroke-width="1.5" />
    <path d="M18 8C19.1046 8 20 7.10457 20 6C20 4.89543 19.1046 4 18 4C16.8954 4 16 4.89543 16 6C16 7.10457 16.8954 8 18 8Z" stroke="#141B34" stroke-width="1.5" />
    <path d="M6.01734 8.74067C6.01734 10.4142 5.77537 12.1995 9.22051 11.9855H12.0053M17.9929 8.57617C18.1259 11.9855 16.9199 11.7648 15.7861 11.9855H12.0053M12.0053 15.7001V11.9855" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`
  },

  {
    name: 'GitHub',
    color: '#181717',
    icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
    <path d="M10 20.5675C6.57143 21.7248 3.71429 20.5675 2 17" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 22V18.7579C10 18.1596 10.1839 17.6396 10.4804 17.1699C10.6838 16.8476 10.5445 16.3904 10.1771 16.2894C7.13394 15.4528 5 14.1077 5 9.64606C5 8.48611 5.38005 7.39556 6.04811 6.4464C6.21437 6.21018 6.29749 6.09208 6.31748 5.9851C6.33746 5.87813 6.30272 5.73852 6.23322 5.45932C5.95038 4.32292 5.96871 3.11619 6.39322 2.02823C6.39322 2.02823 7.27042 1.74242 9.26698 2.98969C9.72282 3.27447 9.95075 3.41686 10.1515 3.44871C10.3522 3.48056 10.6206 3.41384 11.1573 3.28041C11.8913 3.09795 12.6476 3 13.5 3C14.3524 3 15.1087 3.09795 15.8427 3.28041C16.3794 3.41384 16.6478 3.48056 16.8485 3.44871C17.0493 3.41686 17.2772 3.27447 17.733 2.98969C19.7296 1.74242 20.6068 2.02823 20.6068 2.02823C21.0313 3.11619 21.0496 4.32292 20.7668 5.45932C20.6973 5.73852 20.6625 5.87813 20.6825 5.9851C20.7025 6.09207 20.7856 6.21019 20.9519 6.4464C21.6199 7.39556 22 8.48611 22 9.64606C22 14.1077 19.8661 15.4528 16.8229 16.2894C16.4555 16.3904 16.3162 16.8476 16.5196 17.1699C16.8161 17.6396 17 18.1596 17 18.7579V22" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`
  },

  {
    name: 'Java SpringBoot',
    color: '#007396',
    icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
    <path d="M6.17481 10.3333C4.96738 10.7408 4.22049 11.304 4.22049 11.9261C4.22049 12.7743 5.60897 13.513 7.6601 13.897M7.6601 13.897C6.89833 14.2824 6.44271 14.7715 6.44271 15.3038C6.44271 16.5474 8.93001 17.5556 11.9983 17.5556C12.7884 17.5556 13.54 17.4887 14.2205 17.3682M7.6601 13.897C8.61629 14.076 9.71648 14.1779 10.8872 14.1779C12.5946 14.1779 14.1521 13.9611 15.3316 13.6045M16.4427 10.1243C15.031 10.5414 13.0635 10.8002 10.8872 10.8002C6.5916 10.8002 3.10938 9.79203 3.10938 8.5484C3.10938 7.5881 5.18563 6.76821 8.10937 6.44446" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M22 19.0699C22 20.6882 17.5228 22 12 22C6.47715 22 2 20.6882 2 19.0699C2 17.9195 3.70729 16.9239 7 16.4444" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" />
    <path d="M18.7591 8.78799C22.9744 7.69436 23.5765 14.2562 17.5547 16.4438" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M17.5582 2C16.8173 2.12346 15.4246 2.81481 15.7802 4.59259C16.1358 6.37037 15.6322 7.30864 15.3359 7.55556" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M13.1128 2C12.372 2.14815 10.9793 2.97778 11.3349 5.11111C11.6905 7.24444 11.1869 7.81482 10.8906 8.11111" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`
  },

  {
    name: 'Adobe Photoshop',
    color: '#31A8FF',
    icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M6.5 16V12M6.5 12V9.125C6.5 9.00892 6.5 8.95087 6.50482 8.90198C6.55158 8.42721 6.92721 8.05158 7.40198 8.00482C7.45087 8 7.50892 8 7.625 8H9C10.1046 8 11 8.89543 11 10C11 11.1046 10.1046 12 9 12H6.5Z" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M17.4658 11.2225C17.2923 10.5267 16.4782 10 15.5 10C14.3954 10 13.5 10.6716 13.5 11.5C13.5 12.3284 14.3954 13 15.5 13C16.6046 13 17.5 13.6716 17.5 14.5C17.5 15.3284 16.6046 16 15.5 16C14.5183 16 13.7019 15.4696 13.5323 14.77" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" />
</svg>`
  },

  {
    name: 'Adobe Illustrator',
    color: '#FF7A00',
    icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M13 16L12.1339 13.2M7 16L7.86614 13.2M7.86614 13.2L8.59031 10.8589C9.17989 8.95298 9.47468 8 10 8C10.5253 8 10.8201 8.95298 11.4097 10.8589L12.1339 13.2M7.86614 13.2H12.1339" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M16 16V11" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M16 8.5V8" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`
  }
];


  constructor(
    private animationControlService: AnimationControlService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    this.loaderFinishedSubscription = null;
  }

  ngOnInit(): void {
    // sanitize SVGs once at init so innerHTML gets proper SVG markup
    // convert raw svg -> SafeHtml once so innerHTML renders properly
  this.skills = this.skills.map(s => ({
    ...s,
    safeIcon: this.sanitizer.bypassSecurityTrustHtml(s.icon)
  }));
    // If you have an external loader, subscribe; otherwise we'll also run in AfterViewInit.
    this.loaderFinishedSubscription = this.animationControlService.loaderFinished$?.subscribe(() => {
      // slight delay so Angular finishes rendering nodes
      setTimeout(() => this.setupAnimations(), 50);
    }) || null;

    // ensure change detection so template has sanitized icons
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    // In case loader service isn't used or hasn't fired, ensure animation setup runs.
    // small timeout to ensure lines are painted before SplitText runs
    setTimeout(() => {
      this.setupAnimations();
    }, 80);
  }

  private setupAnimations(): void {
    // guard
    if (!this.aboutSection?.nativeElement) return;

    // Heading tween
    const headingTween = gsap.from(this.heading.nativeElement, {
      scrollTrigger: {
        trigger: this.aboutSection.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out'
    });
    if (headingTween.scrollTrigger) this.scrollTriggers.push(headingTween.scrollTrigger);

    // text reveals
    this.createTextReveal(this.aboutText.nativeElement, 'top 75%');
    this.createTextReveal(this.aboutText2.nativeElement, 'top 70%');

    // skills heading
    const sh = gsap.from(this.skillsHeading.nativeElement, {
      scrollTrigger: {
        trigger: this.skillsHeading.nativeElement,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out'
    });
    if (sh.scrollTrigger) this.scrollTriggers.push(sh.scrollTrigger);

    // pills stagger
    const pills = this.skillsGrid.nativeElement.querySelectorAll('.skill-pill');
    const pillsTween = gsap.from(pills, {
      scrollTrigger: {
        trigger: this.skillsGrid.nativeElement,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      scale: 0.92,
      stagger: 0.08,
      duration: 0.6,
      ease: 'back.out(1.7)'
    });
    if (pillsTween.scrollTrigger) this.scrollTriggers.push(pillsTween.scrollTrigger);
  }

  private createTextReveal(element: HTMLElement, start: string): void {
    if (!element) return;

    // create SplitText (lines)
    const split = new SplitText(element, { type: 'lines', linesClass: 'line' });
    // store so we can revert
    this.splitTexts.push(split);

    // wrap lines (SplitText returns Element[])
    (split.lines as Element[]).forEach((lineEl) => {
      const el = lineEl as HTMLElement;
      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      wrapper.style.paddingBottom = '0.12em';
      el.parentNode?.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    });

    // animate lines
    const tl = gsap.from(split.lines, {
      scrollTrigger: {
        trigger: element,
        start: start,
        end: 'top 40%',
        toggleActions: 'play none none reverse'
      },
      yPercent: 120,
      opacity: 0,
      duration: 0.95,
      stagger: 0.11,
      ease: 'power3.out'
    });

    if (tl.scrollTrigger) this.scrollTriggers.push(tl.scrollTrigger);
  }

  ngOnDestroy(): void {
    if (this.loaderFinishedSubscription) {
      this.loaderFinishedSubscription.unsubscribe();
      this.loaderFinishedSubscription = null;
    }
    // kill scroll triggers
    this.scrollTriggers.forEach(t => t.kill());
    this.scrollTriggers = [];

    // revert splittext wrappers (restores original DOM)
    this.splitTexts.forEach(s => {
      try { s.revert(); } catch (e) { /* ignore */ }
    });
    this.splitTexts = [];
  }
}
