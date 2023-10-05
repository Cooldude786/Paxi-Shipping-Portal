import { Component, OnDestroy  } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
import { AbstractControl, AsyncValidator, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import { Store } from '@ngrx/store';
import { createOrder, preRegisterStart, registerParcelFormRehydrate, updateOrder } from '../../state/register-parcel.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subscription, map } from 'rxjs';
import { IAppState } from 'src/app/store/app.state';
import { getShipperId } from '../../../login/state/auth.selectors';
import { getParcelPayload } from '../../state/register-parcel.selectors';
import Quagga from '@ericblade/quagga2';
import { IRegisterParcel } from 'src/app/models/RegisterParcel.model';

interface IParcelRes {
  success: boolean;
  message: string;
  totalItems?: any,
  filteredItems?: any,
  responseCode: string,
  results: {
    valid: boolean,
    reason: string,
    customerRefCode: string,
    processRequirements: any
  }
}
@Component({
  selector: 'app-parcel-number',
  templateUrl: './parcel-number.component.html',
  styleUrls: ['./parcel-number.component.scss']
})
export class ParcelNumberComponent implements AsyncValidator, OnDestroy {
  parcelNumberForm!: FormGroup;
  asyncParcelErrMsg?: string;
  scannerIsRunning = false;
  shipperId!:number;
  payloadSubs: IRegisterParcel | undefined;

  constructor(private _formbuilder: FormBuilder,private _router: Router,private _store: Store<IAppState>, private _https: HttpClient, private location: PlatformLocation) {
    location.onPopState(() => {
      this._router.navigate(['register-parcel'], { queryParams: { populate: true }, skipLocationChange:true});
   });
  }
  // Async Validation
  validate = (control: AbstractControl<any, any>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return this._https.post<IParcelRes>(`${environment.apiUrl}/parcel/validate-drop-label`, { customerRefCode: control.value.toUpperCase() }).pipe(
      map((res) => {
        console.log(res);
        if (res.results.valid === true && res.results.processRequirements.parcelDetails.customerRefStatusIdNo === 3) {
          this.asyncParcelErrMsg = 'Parcel number is already in use in pre register';
          return res.results.valid === true ? { invalidParcelNo: true } : null;
        }

        if (res.results.reason === 'ALREADY_IN_USE') {
          this.asyncParcelErrMsg = 'Parcel number is already in use.';
        } else if (res.results.reason === 'INVALID_LENGTH') {
          this.asyncParcelErrMsg = 'Parcel number length is invalid.';
        } else if (res.results.reason === 'INVALID_PREFIX') {
          this.asyncParcelErrMsg = 'Please enter a valid Parcel number, like D081316356062.';
        } else {
          this.asyncParcelErrMsg = 'Please enter a valid Parcel number, like D081316356062.';
        }
        return res.results.valid === false ? { invalidParcelNo: true } : null;
      })
    )
  }

  ngOnInit(): void {
    this.parcelNumberForm = this._formbuilder.group({
      parcel_number: new FormControl('',[
        Validators.required
      ], [this.validate])
    });

    this._store.select(getShipperId).subscribe(
      (shipperId) => {
        if(shipperId){
          this.shipperId = shipperId;
        }
      }
    );
    this._store.select(getParcelPayload).subscribe((data) => {
      this.payloadSubs = data;
    });
    // Rehydration
    this._store.dispatch(registerParcelFormRehydrate());
  }
  public validationError = (controlName: string, errorName: string) => {
    return this.parcelNumberForm.controls[controlName].hasError(errorName);
  }

  toogleScanner() {
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      // safely access `navigator.mediaDevices.getUserMedia`
      // Promise.resolve(navigator.mediaDevices.getUserMedia({ video: true }))
       if (this.scannerIsRunning) {
        Quagga.stop();
        this.scannerIsRunning = false;
        (document.querySelector('#scanner-container') as HTMLDivElement).innerHTML = '';
      } else {
        this.startScanner();
        // Set flag to is running
        this.scannerIsRunning = true;
      }
    } else {
      alert(`Sorry ☹️, your browser does not support mediaDevice browser api.\nPlease, use the latest browser version to access this feature.`);
    }
  }

  onSubmit() {
    if (this.parcelNumberForm.invalid) {
      console.log('Invalid form');
      return;
    }
    this._store.dispatch(setLoadingSpinner({ status: true }));
    this._store.dispatch(preRegisterStart({ parcelNo: this.parcelNumberForm.controls['parcel_number'].value}));
  }
  saveLater(){
    if(this.payloadSubs !== undefined){
      if(this.payloadSubs.id){
        this._store.dispatch(updateOrder());
      }else{
        this._store.dispatch(createOrder());
      }
    }else{
      this._store.dispatch(createOrder());
    }
  }

  startScanner() {
    Quagga.init({
      inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#scanner-container') as HTMLDivElement
      },
      decoder : {
        readers : ["code_128_reader"]
      },
      // One of the main features of QuaggaJS is its ability to locate a barcode in a given image. The locate property controls whether this feature is turned on (default) or off.
      // locate: true,
      // This top-level property controls the scan-frequency of the video-stream. It’s optional and defines the maximum number of scans per second. This renders useful for cases where the scan-session is long-running and resources such as CPU power are of concern.
      // frequency: 1,
    }, function(err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });


    // Quagga.onProcessed(function (result) {
    //   let drawingCtx = Quagga.canvas.ctx.overlay,
    //     drawingCanvas = Quagga.canvas.dom.overlay;

    //   if (result) {

    //     if (result.boxes) {
    //       drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width") as string), parseInt(drawingCanvas.getAttribute("height") as string));

    //       result.boxes.filter(function (box) {
    //         return box !== result.box;
    //       }).forEach(function (box) {
    //         Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
    //       });
    //     }

    //     if (result.box) {
    //       Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
    //     }

    //     if (result.codeResult && result.codeResult.code) {
    //       Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
    //     }
    //   }
    // });


    Quagga.onDetected((result) => {
      console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
      this.parcelNumberForm.setValue({ 'parcel_number': result.codeResult.code });
      this.parcelNumberForm.controls['parcel_number'].updateValueAndValidity();
      this.parcelNumberForm.controls['parcel_number'].markAsTouched();
      if (this.parcelNumberForm.valid) {
        this.toogleScanner();
        Quagga.stop();
        (document.querySelector('#scanner-container') as HTMLDivElement).innerHTML = '';
        this.onSubmit();
      }
    });
  }

  ngOnDestroy(): void {
    Quagga.stop();
    (document.querySelector('#scanner-container') as HTMLDivElement).innerHTML = '';
  }
}
