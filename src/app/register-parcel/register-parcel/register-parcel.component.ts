import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControlOptions } from '@angular/forms';
import { MatDialogRef, MatDialog} from  '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { registerParcelFormInitiate, loadLocation } from '../state/register-parcel.actions';
import { IRegisterParcel,MapLocation } from 'src/app/models/RegisterParcel.model';
import { getLocationData} from '../state/register-parcel.selectors';
import { getShipperId } from '../../login/state/auth.selectors';
import { Observable, Subscription, map, startWith, take } from 'rxjs';

declare global{
  var nodeCode: string;
  var nodeIdNo: number;
  var nodeShortName: string;
  var dialogVal: MatDialogRef<LocationDialog>;
}
function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

@Component({
  selector: 'app-register-parcel',
  templateUrl: './register-parcel.component.html',
  styleUrls: ['./register-parcel.component.scss']
})

export class RegisterParcelComponent {
  shipperId!:number;
  recepientForm!: FormGroup;
  destinationCode!: MapLocation[];
  filteredOptions?: Observable<MapLocation[]>;
  shipperOrderIdNo?: number;

  constructor(
    private _formbuilder: FormBuilder,
    private _router: Router,
    public dialog: MatDialog,
    private _store: Store<IRegisterParcel>,
    private _route: ActivatedRoute
  ){
    _store.dispatch(loadLocation());
  }
  public validation_msgs = {
    'contactAutocompleteControl': [
      { type: 'invalidAutocompleteObject', message: 'The destination you selected is currently unavailable, please select a different PAXI point' },
      { type: 'required', message: 'Destination is required.' }
    ]
  }
  ngOnInit(): void {
    this.recepientForm = this._formbuilder.group({
      // recipient_name: new FormControl('',Validators.compose([Validators.required,Validators.maxLength(74), Validators.pattern(
      //   /^[^0-9@#$%^&*()\[\]{}_+=<>\\\/?,.]+$/
      // )])),
      recipient_name: new FormControl('',Validators.compose([Validators.required,Validators.maxLength(74), Validators.pattern(
        /^[a-zA-Z ]*$/
      )])),
      /*phone_number: new FormControl('',Validators.compose([Validators.required,Validators.minLength(9),Validators.maxLength(10), Validators.pattern(
        /[0-9]$/
      )])),*/
      phone_number: new FormControl('',Validators.compose([Validators.required,Validators.pattern("^((\\0-?)|0)?[0-9]{9}$")])),
      description: new FormControl('',Validators.compose([Validators.maxLength(50)])),
      destination: new FormControl('',Validators.compose([autocompleteObjectValidator(), Validators.required])),
      orderId: new FormControl(''),
    },{
      validators: [
        this.notIncludeSpace('recipient_name'),
      ]
    } as AbstractControlOptions);
    this._store.select(getLocationData).subscribe(
      (destinationCode) => {
        this.destinationCode = destinationCode;
      }
    );
    this.filteredOptions = this.recepientForm.controls['destination'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nodeShortName;
        return name ? this._filter(name as string) : this.destinationCode.slice();
      }),
    );
    this._store.select(getShipperId).subscribe(
      (shipperId) => {
        if(shipperId){
          this.shipperId = shipperId;
        }
      }
    );

    // check if forms need population
    this._route.queryParams.subscribe((params: Params) => {
      if (params && params['populate']) {
        const getParcelFormInfo = localStorage.getItem('registerParcelPopulate');
        if (getParcelFormInfo !== null) {
          const parcelFormInfo = JSON.parse(getParcelFormInfo)
          this.recepientForm.patchValue({ 'recipient_name': parcelFormInfo[0].receiverNameSurname});
          this.recepientForm.patchValue({ 'phone_number': parcelFormInfo[0].receiverCell.slice(2)});
          this.recepientForm.patchValue({ 'description': parcelFormInfo[0].description});
          this.recepientForm.patchValue({ 'orderId': parcelFormInfo[0].id});
          this.shipperOrderIdNo = parcelFormInfo[0].shipperOrderIdNo;
          const locationDestination : MapLocation = {
            nodeCode: parcelFormInfo[1].nodeCode,
            nodeIdNo: 0,
            nodeShortName: parcelFormInfo[1].nodeName
          }
          this.displayFn(locationDestination);
          this.recepientForm.patchValue({ 'destination': locationDestination});
        }
      } else {
        localStorage.removeItem('registerParcelPopulate');
      }
    });
  }
  public parcelType: number = 0;
  toggleBtn(id: number) {
    if(this.parcelType !== 0){
      this.parcelType = 0;
    }else{
      this.parcelType = id
    }
  }
  displayFn(location: MapLocation): string {
    return location && location.nodeShortName ? `(${location.nodeCode}) ${location.nodeShortName}` : '';
  }
  private _filter(value: string): MapLocation[] {
    const filterValue = value.toLowerCase();
    return this.destinationCode.filter(option => String(option.nodeCode).toLowerCase().indexOf(filterValue ) > -1 ||
    option.nodeShortName.toLowerCase().indexOf(filterValue ) > -1);
  }
  public validationError = (controlName: string, errorName: string) => {
    return this.recepientForm.controls[controlName].hasError(errorName);
  }
  openDialog() {
    const dialogRef = this.dialog.open(LocationDialog,{
      panelClass: 'paxi-point-dilouge'
    });
    dialogRef.beforeClosed().subscribe(() => {
      if(globalThis.nodeCode != "" && globalThis.nodeIdNo != undefined && globalThis.nodeShortName != ""){
        const locationDestination : MapLocation = {
          nodeCode: globalThis.nodeCode,
          nodeIdNo:globalThis.nodeIdNo,
          nodeShortName:globalThis.nodeShortName
        }
        this.displayFn(locationDestination);
        this.recepientForm.controls['destination'].setValue(locationDestination);
      }
    });
  }
  onSubmit() {
    const phone_number = "27"+(this.recepientForm.value.phone_number*1).toString();
    var nodeCode = "";
    nodeCode = this.recepientForm.value.destination.nodeCode;
    const payload : IRegisterParcel = {
      id: this.recepientForm.value.orderId,
      parcelType: '1',
      receiverNameSurname: this.recepientForm.value.recipient_name.trim(),
      receiverCell: phone_number,
      description: this.recepientForm.value.description,
      destinationNodeCode: nodeCode,
      parcelNumber: '',
      shipperIdNo: this.shipperId,
      orderNumber: '',
      orderSourceIdNo:1,
      shipperOrderIdNo: this.shipperOrderIdNo ?? 0
    }
    const destinationData = {
      nodeCode: this.recepientForm.value.destination.nodeCode,
      nodeName: this.recepientForm.value.destination.nodeShortName
    }
    localStorage.setItem('registerParcelPopulate', JSON.stringify([payload, destinationData]));
    this._store.dispatch(registerParcelFormInitiate({ payload }));
  }
  notIncludeSpace(recipient_name:any){
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[recipient_name];
      const reg = new RegExp(/^[^.\s]/);
      if(control.value != ""){
        if(!reg.test(control.value)){
          return control.setErrors({ notIncludeSpace: true });
        }
      }
    };
  }
}
@Component({
  selector: 'location-dialog',
  templateUrl: 'location.html',
  standalone: true,
})
export class LocationDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<LocationDialog>
  ){
      globalThis.dialogVal = dialogRef;
  }
  ngOnInit(): void {
    window.addEventListener('message', this.receiveMessage, false);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  receiveMessage(message: { origin: string; data: { trg: string; point: any; }; }){
    if (message.origin == 'https://map.paxi.co.za' && message.data && message.data.trg === 'paxi') {
      var point = message.data.point;
      globalThis.nodeCode = point.nodeCode;
      globalThis.nodeIdNo = point.id;
      globalThis.nodeShortName = point.shortName;
      globalThis.dialogVal.close();
    }
  }
}
