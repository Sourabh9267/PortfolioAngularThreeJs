import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SceneComponent } from "./scene/scene.component";
import { TextScrambleComponent } from './components/text-scramble/text-scramble.component';
import { WordsLoaderComponent } from './components/words-loader/words-loader.component';
import { NgIf } from '@angular/common';
import { WordCyclerComponent } from './components/word-cycler/word-cycler.component';
import { PortfolioCardsComponent } from './components/portfolio-cards/portfolio-cards.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SceneComponent, TextScrambleComponent, WordsLoaderComponent, NgIf, WordCyclerComponent, PortfolioCardsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  // This flag starts the hiding process
  isLoading = true;
  // This flag removes the component from the DOM after its animation is done
  isLoaderDestroyed = false;

  ngOnInit(): void {
    // Start the hide process after 3.5 seconds
    setTimeout(() => {
      this.isLoading = false;
    }, 3500);
  }

  // This function is called when the loader's animation is complete
  onLoaderAnimationFinish(): void {
    this.isLoaderDestroyed = true;
  }
}
