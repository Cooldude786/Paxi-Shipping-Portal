import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IStatus,IParcelPayload,IParcelList } from 'src/app/models/Parcel.model';
import { Store } from '@ngrx/store';
import {
  dashboardPageFilterInitiate,
  dashboardPageInitiate,
  dashboardPageSearchInitiate,
  dashboardPageScrollInitiate
} from '../state/dashboard.actions';
import { getDashboardResult,getStatusGroup,getSearchText } from '../state/dashboard.selectors'
import { IAppState } from 'src/app/store/app.state';
import { DashboardService } from 'src/app/services/dashboard.service';
import { IRegisterParcel } from 'src/app/models/RegisterParcel.model';
import { getGuid, getShipperId } from '../../login/state/auth.selectors';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private _store:Store<IAppState>, private _dashboardService: DashboardService,private _router: Router) {}
  toggle = true;
  activeId = 1;
  statusArray?: string[] = [];
  searchtext !: string;
  statusText !: string;
  hasMoreData = false;
  totalRecord : number = 0;
  statusObj: IStatus[] = [
    // {
    //   id: '1',
    //   name: 'PENDING',
    // },
    // {
    //   id: '2',
    //   name: 'WAITING FOR COURIER',
    // },
    // {
    //   id: '3',
    //   name: 'WITH COURIER',
    // },
    // {
    //   id: '4',
    //   name: 'AT DESTINATION',
    // },
    // {
    //   id: '5',
    //   name: 'COMPLETED',
    // },
    // {
    //   id: '6',
    //   name: 'EXCEPTION',
    // },
    // {
    //   id: '7',
    //   name: 'EXCEPTION CLOSURE',
    // }
    {
      id: '4',
      name: 'ALL'
    },
    {
      id: '1',
      name: 'PENDING',
    },
    {
      id: '2',
      name: 'ACTIVE',
    },
    {
      id: '3',
      name: 'CLOSED',
    }
  ];
  parcelList?: IParcelList[];
  shipperId!:number;
  isGuid!: boolean;

  ngOnInit(): void {
    // Checking if user has creted his/her profile by checking if guid exists.
    this._store.select(getGuid).subscribe(guid => {
      this.isGuid = !!guid;
    })


    this._store.select(getShipperId).subscribe(
      (shipperId) => {
        if(shipperId){
          this.shipperId = shipperId;
        }
      }
    );
    const payload: IParcelPayload = {
      searchTerm: '',
      statusGroup: null,
    }
    this._store.dispatch(dashboardPageInitiate({ payload }));
    this._store.select(getDashboardResult).subscribe((data) => {
      if (data?.results) {
        this.parcelList = data.results;
        if(this.parcelList != undefined && this.parcelList.length < 10){
          this.hasMoreData = true;
        }
        if(data.totalItems != undefined){
          this.totalRecord = data.totalItems;
        }
      }
    });
    this._store.select(getStatusGroup).subscribe((data) => {
      if (data) {
        this.statusArray = data as string[];
      }
    });
    this._store.select(getSearchText).subscribe((data) => {
      if (data) {
        this.searchtext = data;
      }
    });
  }

  statusFilterGroupdesktop(e:MatSelectChange){
    this.hasMoreData = false;
    let selectedData: string[] = [];
    if(e.value != 'ALL'){
      selectedData.push(e.value);
    }else{
      selectedData = [];
    }
    const payload: IParcelPayload = {
      searchTerm: this.searchtext,
      statusGroup: selectedData,
    }
    this._store.dispatch(dashboardPageFilterInitiate({ payload }));
  }

  statusFilterGroup(e:Event){
    this.hasMoreData = false;
    const target = (e.target as HTMLInputElement).value;
    const checked = (e.target as HTMLInputElement).checked;
    let selectedData: string[] = [];
    selectedData.push(target);
    // for(let key in this.statusArray){
    //   selectedData.push(this.statusArray[+key]);
    // }
    selectedData = selectedData.filter((value, index, array) => array.indexOf(value) === index);
    if(checked == false){
      const index = selectedData.indexOf(target);
      if (index > -1) {
        selectedData.splice(index, 1);
      }
    }
    const payload: IParcelPayload = {
      searchTerm: this.searchtext,
      statusGroup: selectedData,
    }
    this._store.dispatch(dashboardPageFilterInitiate({ payload }));
  }
  filter(){
    this.hasMoreData = false;
    if(this.statusArray == undefined){
      this.statusArray = [];
    }
    const payload: IParcelPayload = {
      searchTerm: this.searchtext,
      statusGroup: this.statusArray
    }
    this._store.dispatch(dashboardPageSearchInitiate({ payload }));
  }
  handleKeyDown(event: any){
    if (event.keyCode == 13){
      event.target.blur();
      this.hasMoreData = false;
      if(this.statusArray == undefined){
        this.statusArray = [];
      }
      const payload: IParcelPayload = {
        searchTerm: this.searchtext,
        statusGroup: this.statusArray
      }
      this._store.dispatch(dashboardPageSearchInitiate({ payload }));
    }
  }
  onScroll(): void {
    if(this.parcelList != undefined){
      if(this.statusArray == undefined){
        this.statusArray = [];
      }
      const payload: IParcelPayload = {
        searchTerm: this.searchtext,
        statusGroup: this.statusArray,
      }
      this._store.dispatch(dashboardPageScrollInitiate({ payload }));
      this._store.select(getDashboardResult).subscribe((data) => {
        if(data?.results){
          this.parcelList = data.results;
          if(data.totalItems != undefined){
            this.totalRecord = data.totalItems;
          }
        }
      });
    }
    if(this._dashboardService.totalCount > this.totalRecord){
      this.hasMoreData = true;
    }
  }
  parcel_history(parcel: any){
    //console.log("Parcel ",parcel);
    if(parcel.type == "PARCEL"){
      this._router.navigate(['parcel-history/'+parcel.id]);
    } else {
      const payload : IRegisterParcel = {
        parcelType: '1',
        id:parcel.id,
        receiverNameSurname: parcel.receiver.name,
        receiverCell: parcel.receiver.cellphone,
        description: parcel.description,
        destinationNodeCode: `(${parcel.destinationNode.nodeCode}) ${parcel.destinationNode.nodeName}`,
        parcelNumber: '',
        shipperIdNo: 0,
        orderNumber: '',
        orderSourceIdNo: 1,
        shipperOrderIdNo: parcel.id
      }
      const destinationData = {
        nodeCode: parcel.destinationNode.nodeCode,
        nodeName: parcel.destinationNode.nodeName
      }

      localStorage.setItem('registerParcelPopulate', JSON.stringify([payload, destinationData]));
      this._router.navigate(['register-parcel'], { queryParams: { populate: true }});
    }
  }
}
