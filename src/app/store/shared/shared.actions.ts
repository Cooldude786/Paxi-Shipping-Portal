import { createAction, props } from "@ngrx/store";
import { IErrorResponse } from "src/app/models/ErrorResponse.model";

export const SET_LOADING_ACTION = '[shared state] set loading spinner';
export const SET_ERROR_MESSAGE = '[shared state] set error message';
export const SET_WARNING_MESSAGE = '[shared state] set warning message';

export const setLoadingSpinner = createAction(SET_LOADING_ACTION, props<{ status: boolean }>());
export const setErrorMessage = createAction(SET_ERROR_MESSAGE, props<{ message: IErrorResponse | null }>());
