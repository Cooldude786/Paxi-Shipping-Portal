export interface IRegisterParcel {
  id?:number,
  shipperIdNo:number,
  orderNumber:string,
  parcelType: string,
  receiverNameSurname: string,
  receiverCell: string,
  description: string,
  destinationNodeCode:string,
  parcelNumber:string,
  orderSourceIdNo: number,
  shipperOrderIdNo?: number,
}

export interface MapLocation {
  nodeIdNo: number;
  nodeCode: string;
  nodeShortName:string;
}

export interface IParcelSuccess {
  orderIdNo: number;
}

export class IMapLocation {
  constructor(
    private nodeIdNo: number,
    private nodeCode: string,
    private nodeShortName:string,
  ) {}
}
