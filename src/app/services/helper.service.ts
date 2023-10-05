import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, map } from 'rxjs';
import { IErrorResponse, IWarningResponse } from "../models/ErrorResponse.model";
import { SnackbarService } from "../shared/snackbar.service";
import { environment } from '../../environments/environment';
import { MapLocation } from '../models/RegisterParcel.model';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Injectable({
  providedIn: "root",
})
export class HelperService {

  constructor(private _snackbarService: SnackbarService,private _httpClient: HttpClient, private recaptchaV3Service: ReCaptchaV3Service) {}

  showSuccessSnackbar(message: string) {
    if (message) {
      const snackbarConfig = {
        panelClass: ['navyblue-snackbar', 'mb2-snackbar'],
        verticalPosition: "bottom",
        horizontalPosition: "center",
        duration: 4000
      }
      this._snackbarService.viewResponse(message, 'Dismiss', snackbarConfig)
    }
  }

  showErrorSnackbar(errorStatus: IErrorResponse) {
    if (errorStatus) {
      const snackbarConfig = {
        panelClass: ['error-snackbar', 'mb2-snackbar'],
        verticalPosition: "bottom",
        horizontalPosition: "center",
        duration: 8000
      }
      this._snackbarService.viewResponse(errorStatus.message, 'Dismiss', snackbarConfig)
    }
  }

  showWarningSnackbar(warningStatus: IWarningResponse) {
    if (warningStatus) {
      const snackbarConfig = {
        panelClass: ['warning-snackbar', 'mb2-snackbar'],
        verticalPosition: "bottom",
        horizontalPosition: "center",
        duration: 4000
      }
      this._snackbarService.viewResponse(warningStatus.message, 'Dismiss', snackbarConfig)
    }
  }


  formatError(err: any) {
    let error: IErrorResponse = {
      status: "",
      message: "",
      data: ""
    }
    if (err.message) {
      if (err.status) {
        error = {
          status: err.status,
          message: err.message,
        }
      } else {
        error = {
          status: "",
          message: err.message
        }
      }
    } else if (err.responseMessage) {
      if (err.responseCode) {
        error = {
          status: err.responseCode,
          message: err.responseMessage
        }
      } else {
        error = {
          status: "",
          message: err.responseMessage
        }
      }
    } else {
      error = {
        status: "",
        message: "Unknown error occurred!!"
      }
    }
    return error;
  }

  getDestinationLocationNew(): Observable<MapLocation[]>{
    return this._httpClient.get<MapLocation[]>(
      `${environment.apiUrl}/lookup/nodes/fetch-for-select`
    ).pipe(
      map((data) =>{
        const location: MapLocation[] = [];
        for(let key in data){
          location.push({...data[key]});
        }
        return location;
      })
    );
  }

  validatePhone(phone: string): Observable<any> {
    const payload = {
      phoneNumber: phone,
      phoneNumberRegion:"ZA",
      getNumberType: true,
      checkIsPossibleNumber: false,
      checkIsValidNumber: true,
      checkIsValidNumberForRegion: null,
      getRegionCodeForNumber: false
    };
    return this._httpClient.post<any>(
      `${environment.apiUrl}/libphonenumber/validate`,
      payload
    );
  }

  public executeRecaptchaV3() {
    return this.recaptchaV3Service.execute('importantAction')
    // .subscribe((token: string) => token);
  }
}
