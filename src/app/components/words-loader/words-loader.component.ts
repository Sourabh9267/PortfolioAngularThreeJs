import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { gsap } from 'gsap/all'; // Use 'all' for guaranteed plugin access

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
    "नमस्ते", "السلام عليكم", "Shalom", "Guten Tag", "Hej", "Merhaba", "Yia sas", "Cześć"
  ];
  private wordIndex = 0;
  private isHiding = false;
  private currentTween: gsap.core.Timeline | null = null;

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.wordRef) {
        gsap.set(this.wordRef.nativeElement, { textContent: this.words[0], opacity: 1 });
        this.wordIndex = 1;
        // --- SPEED INCREASE: REDUCED INITIAL PAUSE ---
        setTimeout(() => this.cycleWords(), 500); // Was 800ms, now 500ms
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoading'] && !changes['isLoading'].currentValue) {
      this.isHiding = true;
      this.hideLoader();
    }
  }

  private cycleWords(): void {
    if (this.isHiding || !this.wordRef) return;

    const target = this.wordRef.nativeElement;
    const nextWord = this.words[this.wordIndex];
    this.wordIndex = (this.wordIndex + 1) % this.words.length;

    this.currentTween = gsap.timeline({
      onComplete: () => {
        this.cycleWords();
      }
    })
    // 1. Animate the CURRENT word out (ultra-fast)
    .to(target, {
      opacity: 0,
      y: -25,
      // --- SPEED INCREASE: DURATION REDUCED ---
      duration: 0.2, // Was 0.3s
      ease: 'power2.in'
    })
    // 2. INSTANTLY set the new word and move it below
    .set(target, {
      textContent: nextWord,
      y: 25,
    })
    // 3. Animate the NEW word in (ultra-fast)
    .to(target, {
      opacity: 1,
      y: 0,
      // --- SPEED INCREASE: DURATION REDUCED ---
      duration: 0.2, // Was 0.3s
      ease: 'power2.out'
    });
  }

  private hideLoader(): void {
    // ... (This function remains unchanged and is correct)
    if (this.currentTween) {
      this.currentTween.kill();
    }
    gsap.killTweensOf(this.wordRef.nativeElement);

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
    if (this.currentTween) {
      this.currentTween.kill();
    }
    gsap.killTweensOf([this.wordRef?.nativeElement, this.curtainTopRef?.nativeElement, this.curtainBottomRef?.nativeElement]);
  }
}