export interface IParcelPayload {
  shipperIdNo?: number;
  searchTerm: string;
  statusGroup: string[] | null;
  username?: string;
}
export interface IStatus {
  id: string;
  name: string;
}

export interface IParcelListSucess {
  totalItems: number;
  filteredItems: number;
  results: [
    {
      id:number;
      customerRefCode: string;
      createDatetime: string;
      description: string;
      customerEstimatedDeliveryDate: string;
      type: string;
      parcelStatus: {
        idNo: number;
        description: string;
        customerDescription: string;
        group: string;
      }
      receiver: {
        name: string;
        cellphone: string;
      }
      destinationNode: {
        nodeCode: string;
        nodeName: string;
        nodeShortName: string;
        valid: boolean;
      }
    }
  ]
}

export interface IParcelList {
  id:number;
  customerRefCode: string;
  createDatetime: string;
  description: string;
  customerEstimatedDeliveryDate: string;
  type: string;
  parcelStatus: {
    idNo: number;
    description: string;
    customerDescription: string;
    group: string;
  }
  receiver: {
    name: string;
    cellphone: string;
  }
  destinationNode: {
    nodeCode: string;
    nodeName: string;
    nodeShortName: string;
    valid: boolean;
  }
}


export interface IParcelHistoryPayload{
  parcelIdNo:number;
  customerVisibleOnly:string;
}
export interface IParcelHistorySucess{
  parcelIdNo:number;
  customerRefCode:string;
  inductionDatetime:string;
  collectWindowEndDatetime:string;
  createdDate:string;
  lastInscanDatetime:string;
  targetSlaDate:string;
  estimatedCustomerDeliveryDate:string;
  rcvCustomerCellPhone:string;
  rcvCustomerOneProfileGUID:string;
  rcvCustomerName:string;
  sendCustomerCellPhone:string;
  sendCustomerOneProfileGUID:string;
  collectCustomerName:string;
  sendCustomerName:string;
  logServProvWaybillCode:string;
  logServProvCollectionCode:string;
  parcelStatus:{
    parcelStatusIdNo:number;
    parcelStatusDesc:string;
    parcelStatusCustomerDesc:string;
  }
  currentNode:{
    nodeIdNo:number;
    nodeCode:string;
    nodeShortName:string;
    nodeName:string;
  }
  destinationNode:{
    nodeIdNo:number;
    nodeCode:string;
    nodeShortName:string;
    nodeName:string;
  }
  originNode:{
    nodeIdNo:number;
    nodeCode:string;
    nodeShortName:string;
    nodeName:string;
  }
  parcelEvents:[
    {
      eventTypeIdNo:number;
      eventTypeDesc:string;
      eventNodeCode:string;
      eventNodeName:string;
      eventDatetime:string;
      eventReference:string;
      eventMessage:string;
      eventUsername:string;
      eventDeviceIdNo:number;
    }
  ]
}
