import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

@Component({
  selector: 'app-text-scramble',
  templateUrl: './text-scramble.component.html',
  styleUrls: ['./text-scramble.component.scss']
})
export class TextScrambleComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scrambleText') private scrambleTextRef!: ElementRef;

  private words: string[] = ["Developer", "Designer", "Software Engineer", "Lifelong Learner"];
  private masterTimeline: gsap.core.Timeline | null = null;

  ngAfterViewInit(): void {
  // Use the same setTimeout trick here.
  setTimeout(() => {
    if (this.scrambleTextRef) {
      const target = this.scrambleTextRef.nativeElement;
      // ... the rest of the animation logic goes here ...
      // ... (the code from the previous working version) ...
      this.masterTimeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      const timeline = this.masterTimeline;
      if (timeline) {
        this.words.forEach(word => {
          const singleWordTimeline = gsap.timeline();
          singleWordTimeline.to(target, {
            duration: 1.5,
            scrambleText: { text: word, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", speed: 0.3 },
            ease: "none"
          }).to({}, { duration: 2 });
          timeline.add(singleWordTimeline);
        });
      }
    }
  }, 0);
}


  ngOnDestroy(): void {
    if (this.masterTimeline) {
      this.masterTimeline.kill();
    }
  }
}