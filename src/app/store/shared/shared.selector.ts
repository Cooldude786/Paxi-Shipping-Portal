import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ISharedState } from "./shared.state";

export const SHARED_STATE_NAME = 'shared';

const getSharedState = createFeatureSelector<ISharedState>(SHARED_STATE_NAME);

export const getLoading = createSelector(getSharedState, (state) => {
  return state.showLoading;
})

export const getErrorMessage = createSelector(getSharedState, (state) => {
  return state.errorMessage;
})
