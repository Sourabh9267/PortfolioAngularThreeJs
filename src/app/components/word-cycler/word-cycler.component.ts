import { NgFor } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-word-cycler',
  templateUrl: './word-cycler.component.html',
  styleUrls: ['./word-cycler.component.scss'],
  imports: [NgFor]
})
export class WordCyclerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('wordsContainer') private wordsContainerRef!: ElementRef;
  
  words: string[] = ["Designer", "Developer", "Engineer", "Learner"];
  private timeline: gsap.core.Timeline | null = null;

  ngAfterViewInit(): void {
    setTimeout(() => this.startAnimation(), 0);
  }

  startAnimation(): void {
    if (this.wordsContainerRef) {
      const container = this.wordsContainerRef.nativeElement;
      const wordElements = container.querySelectorAll('.word');
      if (wordElements.length === 0) return;
      const wordHeight = wordElements[0].clientHeight;

      this.timeline = gsap.timeline({ repeat: -1 });

      // Loop through each word to create the animation sequence
      for (let i = 0; i < this.words.length; i++) {
        this.timeline.to(container, {
          y: -i * wordHeight,
          duration: 1.0,
          ease: 'power3.inOut',
          delay: 1.5 // Hold each word for 1.5 seconds
        });
      }
      // Add a final step to loop back to the start smoothly
      this.timeline.to({}, { duration: 1.5 });
    }
  }

  ngOnDestroy(): void {
    if (this.timeline) this.timeline.kill();
  }
}