import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

interface IConfig {
  panelClass: string[];
  verticalPosition?: any;
  horizontalPosition?: any;
  duration?: number | 2000;
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(public snackbar: MatSnackBar, private _zone: NgZone) { }

  viewResponse(message: string, action: string, settings: IConfig) {
    const config = new MatSnackBarConfig();
    config.panelClass = settings.panelClass;
    if (settings.verticalPosition == null || undefined) {
      settings.verticalPosition = 'bottom'
    }
    config.verticalPosition = settings.verticalPosition;
    if (settings.horizontalPosition == null || undefined) {
      settings.horizontalPosition = 'center'
    }
    config.horizontalPosition = settings.horizontalPosition;
    if (settings.duration == null || undefined) {
      // settings.duration = 2000;
    }
    config.duration = settings.duration;

    this._zone.run(()=> {
      this.snackbar.open(message, action, config);
    })
  }
}
