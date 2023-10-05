import { IErrorResponse } from "src/app/models/ErrorResponse.model";

export interface ISharedState {
  showLoading: boolean;
  errorMessage: IErrorResponse | null;
}

export const initialState: ISharedState = {
  showLoading: false,
  errorMessage: null,
  // errorMessage: {
  //   status: "VERIFICATION_FAIL",
  //   message: "PIN does not match"
  // },
}
