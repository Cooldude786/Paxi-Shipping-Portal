import { createReducer, on } from "@ngrx/store";
import { initialState } from "./shared.state";
import { setErrorMessage, setLoadingSpinner } from "./shared.actions";

export const sharedReducer = createReducer(
  initialState,
  on(setLoadingSpinner, (state, action) => {
    return {
      ...state,
      showLoading: action.status,
    }
  }),
  on(setErrorMessage, (state, action) => {
    if (action.message) {
      return {
        ...state,
        errorMessage: { status: action.message?.status, message: action.message?.message, data: action.message?.data } ,
      }
    } else {
      return {
        ...state,
        errorMessage: null
      }
    }
  }),
)
