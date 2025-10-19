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

  private words: string[] = ["DEVELOPER", "DESIGNER", "ENGINEER", "CREATOR"];
  private masterTimeline: gsap.core.Timeline | null = null;

  ngAfterViewInit(): void {
    if (this.scrambleTextRef) {
      const target = this.scrambleTextRef.nativeElement;

      this.masterTimeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });

      // After the null check, assign the timeline to a local constant.
      // This is the key to solving the TypeScript error.
      const timeline = this.masterTimeline;

      if (timeline) {
        this.words.forEach(word => {
          const singleWordTimeline = gsap.timeline();
          singleWordTimeline.to(target, {
            duration: 1.5,
            scrambleText: {
              text: word,
              chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
              speed: 0.3
            },
            ease: "none"
          })
          .to({}, { duration: 2 });
          
          // Use the local 'timeline' variable, which TypeScript knows is safe.
          timeline.add(singleWordTimeline);
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.masterTimeline) {
      this.masterTimeline.kill();
    }
  }
}