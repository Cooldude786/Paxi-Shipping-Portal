import { Component } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {
  hidePrimary = false;
  hideSecondary = false;
  hideSuccess = false;
  hideInfo = false;
  hideWarning = false;
  hideDanger = false;
}
