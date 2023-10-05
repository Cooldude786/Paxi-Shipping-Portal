import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  redirectToWhatsapp(){
    window.open('https://api.whatsapp.com/send?phone=270600702492','_blank');
  }
}
