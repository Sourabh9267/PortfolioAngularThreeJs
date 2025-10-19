import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SceneComponent } from "./scene/scene.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SceneComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio';
}
