import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import CountryList from 'country-list-with-dial-code-and-flag';
import CountryFlagSvg from 'country-list-with-dial-code-and-flag/dist/flag-svg';

interface ICountrylist {
  code: string,
  dialCode: string,
  name: string,
  svgFlag: SafeHtml
}

@Component({
  selector: 'app-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
})
export class PhoneInputComponent implements OnInit {
  @Output() sendMobile = new EventEmitter<string>();
  @Input() fetchMobileValue = '';

  showList:boolean = false;
  countryList: ICountrylist[] = []
  searchValue?: string;
  preferredCountryCode = 'ZA';
  preferredCountryDialCode?: string;
  preferredCountrysvgFlag?: SafeHtml;

  constructor(private _sanitizer: DomSanitizer) {}


  ngOnInit() {
    this.preferredCountry(this.preferredCountryCode)
    this.handleSearch()
  }

  emitMobile(event: Event){
    const data =  event.target as HTMLInputElement;
    console.log(this.preferredCountryDialCode);

    // this.sendMobile.emit(`${this.preferredCountryDialCode?.slice(1)}${data.value}`);
    this.sendMobile.emit(`${data.value}`);
  }

  toogleList() {
    // enable the below coommennts to start search country
    // this.showList = !this.showList;

  }

  handleSearch(e?: Event | null) {
    if (e) {
      e.preventDefault();
    }
    if (this.searchValue) {
      const countryName = this.searchValue;
      const filteredData = CountryList.findByKeyword(countryName);

      if (filteredData.length > 0) {
        this.filterCountry(filteredData)
      }  else {
        this.filterCountry(CountryList.getAll())
      }
    } else {
      this.filterCountry(CountryList.getAll())
    }
  }

  setCountry(code: string) {
    this.preferredCountryCode = code
    this.preferredCountry(this.preferredCountryCode)
    this.toogleList()
  }

  filterCountry(data: any[]) {
    this.countryList = [];
    data.map((country) => {
      const svg = CountryFlagSvg[country.code]
      const svgFlag = [svg.slice(0, 4), " style='height: 1.2rem;'", svg.slice(4)].join('');
      this.countryList.push({
        code: country.code,
        dialCode: country.dialCode,
        name: country.name,
        svgFlag: this._sanitizer.bypassSecurityTrustHtml(svgFlag)
      })
    })
  }

  preferredCountry(code: string) {
    const country = CountryList.findOneByCountryCode(code)
    if (country) {
      this.preferredCountryDialCode = country.dialCode
      const svg = CountryFlagSvg[country.code]
      const svgFlag = [svg.slice(0, 4), " style='height: 1.5rem;'", svg.slice(4)].join('');
      this.preferredCountrysvgFlag = this._sanitizer.bypassSecurityTrustHtml(svgFlag)
    }
  }

}
