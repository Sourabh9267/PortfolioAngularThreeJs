import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationControlService {
  private loaderFinishedSource = new Subject<void>();
  loaderFinished$ = this.loaderFinishedSource.asObservable();

  /**
   * Called by the root component when the main loader animation has finished
   * and the primary content is now visible.
   */
  notifyLoaderFinished(): void {
    this.loaderFinishedSource.next();
  }
}