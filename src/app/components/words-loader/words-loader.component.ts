import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { gsap } from 'gsap/all';

@Component({
  selector: 'app-words-loader',
  templateUrl: './words-loader.component.html',
  styleUrls: ['./words-loader.component.scss']
})
export class WordsLoaderComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('word') private wordRef!: ElementRef;
  @ViewChild('curtainTop') private curtainTopRef!: ElementRef;
  @ViewChild('curtainBottom') private curtainBottomRef!: ElementRef;

  @Input() isLoading: boolean = true;
  @Output() onLoaderHidden = new EventEmitter<void>();

  private words: string[] = [
    "Hello", "Hola", "Bonjour", "Hallo", "Ciao", "Olá", "你好", "こんにちは", "안녕하세요", "Привет", 
    "नमस्ते", "السلام عليكم", "Shalom", "Guten Tag", "Hej", "Merhaba", "Yia sas", "Cześć", 
    "Szia", "Ahoj", "Sawasdee", "Jambo"
  ];
  private introTimeline: gsap.core.Timeline | null = null;

  ngAfterViewInit(): void {
    setTimeout(() => this.playIntro(), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoading'] && !changes['isLoading'].currentValue) {
      this.hideLoader();
    }
  }

  private playIntro(): void {
    if (this.wordRef) {
      const target = this.wordRef.nativeElement;
      this.introTimeline = gsap.timeline({ repeat: -1 });

      const timeline = this.introTimeline;
      if (timeline) {
        // --- FAST SCRAMBLE ANIMATION ---
        this.words.forEach((word) => {
          timeline.to(target, {
            duration: 0.8,
            scrambleText: {
              text: word,
              chars: "■□●○",
              speed: 0.2,
            },
            ease: "power1.inOut"
          });
          timeline.to({}, { duration: 0.4 });
        });
      }
    }
  }


  private hideLoader(): void {
    if (this.introTimeline) {
      this.introTimeline.kill();
    }

    const topCurtain = this.curtainTopRef.nativeElement;
    const bottomCurtain = this.curtainBottomRef.nativeElement;
    const word = this.wordRef.nativeElement;

    gsap.timeline({
      onComplete: () => {
        this.onLoaderHidden.emit();
      }
    })
    .to(word, { opacity: 0, duration: 0.3, ease: 'power1.in' })
    .to(topCurtain, { yPercent: -100, duration: 1.0, ease: 'power3.inOut' }, "-=0.2")
    .to(bottomCurtain, { yPercent: 100, duration: 1.0, ease: 'power3.inOut' }, "<");
  }

  ngOnDestroy(): void {
    if (this.introTimeline) {
      this.introTimeline.kill();
    }
  }
}