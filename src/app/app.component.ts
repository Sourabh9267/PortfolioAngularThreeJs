import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SceneComponent } from './scene/scene.component';
import { WordsLoaderComponent } from './components/words-loader/words-loader.component';
import { WordCyclerComponent } from './components/word-cycler/word-cycler.component';
import { HeaderComponent } from './components/header/header.component';
// --- NEW IMPORTS ---
import { BentoGridComponent, BentoItem } from './components/bento-grid/bento-grid.component';
// Remove the old portfolio cards import if it exists

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, SceneComponent, WordsLoaderComponent,
    WordCyclerComponent, HeaderComponent, BentoGridComponent // Add BentoGridComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoading = true;
  isLoaderDestroyed = false;

  
  workItems: BentoItem[] = [
    { id: 1, title: 'Project One', description: 'A description of the first project.', mediaUrl: 'assets/Project1.gif', liveUrl: '#', spanRows: 2, spanCols: 2 },
    { id: 2, title: 'Project Two', description: 'Details about the second project.', mediaUrl: 'assets/Project1.gif', liveUrl: '#', spanRows: 1, spanCols: 1 },
    { id: 3, title: 'Project Three', description: 'More info on project three.', mediaUrl: 'assets/Project1.gif', liveUrl: '#', spanRows: 1, spanCols: 1 },
    { id: 4, title: 'Project Four', description: 'The fourth project was very cool.', mediaUrl: 'assets/Project1.gif', liveUrl: '#', spanRows: 1, spanCols: 2 },
  ];

  certificateItems: BentoItem[] = [
    { id: 1, title: 'Cert One', description: 'Certification from a cool place.', mediaUrl: 'assets/Certificate1.jpg', spanRows: 1, spanCols: 1 },
    { id: 2, title: 'Cert Two', description: 'Another valuable certification.', mediaUrl: 'assets/Certificate1.jpg', spanRows: 1, spanCols: 1 },
    { id: 3, title: 'Cert Three', description: 'This one was really hard to get!', mediaUrl: 'assets/Certificate1.jpg', spanRows: 1, spanCols: 1 },
    { id: 4, title: 'Cert Four', description: 'A foundational certificate.', mediaUrl: 'assets/Certificate1.jpg', spanRows: 1, spanCols: 1 },
  ];
  ngOnInit(): void {
    setTimeout(() => { this.isLoading = false; }, 500);
  }

  onSceneInitialized(): void {
    this.isLoading = false;
  }

  onLoaderAnimationFinish(): void {
    this.isLoaderDestroyed = true;
  }
}