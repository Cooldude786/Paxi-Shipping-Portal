import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  contactFormURL?: SafeResourceUrl;
  constructor(public sanitizer: DomSanitizer) {}
  redirectToWhatsapp(){
    window.open('https://api.whatsapp.com/send?phone=270600702492','_blank');
  }
  openPoint(){
    window.open('https://www.paxi.co.za/paxi-points','_blank');
  }
  ngOnInit() {
    this.contactFormURL = this.sanitizer.bypassSecurityTrustResourceUrl(environment.contactForm);
  }
}
