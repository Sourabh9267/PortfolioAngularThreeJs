import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SceneComponent } from "./scene/scene.component";
import { TextScrambleComponent } from './components/text-scramble/text-scramble.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SceneComponent, TextScrambleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio';
}
