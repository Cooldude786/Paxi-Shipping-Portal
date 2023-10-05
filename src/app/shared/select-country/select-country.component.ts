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
  selector: 'app-select-country',
  templateUrl: './select-country.component.html',
  styleUrls: ['./select-country.component.scss']
})
export class SelectCountryComponent implements OnInit {
  @Output() sendCountryCode = new EventEmitter<string>();
  @Input() fetchCountryCode = '';
  @Input() showCountries = false;

  showList:boolean = false;
  countryList: ICountrylist[] = []
  searchValue?: string;
  // preferredCountryCode = 'ZA';
  preferredCountryCode = '';
  // preferredCountryName = 'South Africa';
  preferredCountryName = '';
  preferredCountryDialCode?: string;
  preferredCountrysvgFlag?: SafeHtml;

  constructor(private _sanitizer: DomSanitizer) {}


  ngOnInit() {
    console.log('fetched Country Code : ', this.fetchCountryCode);

    if (this.fetchCountryCode && this.fetchCountryCode.length > 0) {
      this.preferredCountryCode = this.fetchCountryCode;
      const fetchCountry = CountryList.findOneByCountryCode(this.fetchCountryCode)
      this.preferredCountryName = fetchCountry?.name || 'South Africa';
    } else {
      this.preferredCountryCode = 'ZA';
      this.preferredCountryName = 'South Africa';
    }
    this.preferredCountry(this.preferredCountryCode)
    this.handleSearch()
    this.emitCountryCode()
  }

  emitCountryCode(){
    this.sendCountryCode.emit(`${this.preferredCountryCode}`);
  }

  toogleList() {
    if (this.fetchCountryCode && this.fetchCountryCode.length > 0 && !this.showCountries) {
      return;
    } else {
      this.showList = !this.showList;
    }
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

  setCountry(code: string, name: string) {
    this.preferredCountryCode = code
    this.preferredCountryName = name
    this.preferredCountry(this.preferredCountryCode)
    this.emitCountryCode()
    this.toogleList()
    this.searchValue = ''
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
