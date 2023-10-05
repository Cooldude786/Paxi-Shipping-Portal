import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IAuthState } from "./auth.state";

export const AUTH_STATE_NAME = 'auth';

const getAuthState = createFeatureSelector<IAuthState>(AUTH_STATE_NAME);

export const getAuthError = createSelector(getAuthState, (state) => {
  return state.authError;
})

export const isAuthenticated = createSelector(getAuthState, (state) => {
  return state.user ? true : false;
})

export const getToken = createSelector(getAuthState, (state) => {
  return state.user ? state.user.userToken : null;
})

export const getShipperId = createSelector(getAuthState, (state) => {
  return state.user ? state.user.shipperId : null;
})

export const getGuid = createSelector(getAuthState, (state) => {
  return state.user ? state.user.guid : null;
})

export const getEmail = createSelector(getAuthState, (state) => {
  return state.user ? state.user.email : '';
})

export const getUid = createSelector(getAuthState, (state) => {
  return state.user ? state.user.uid : null;
})

export const getUserState = createSelector(getAuthState, (state) => {
  return state.user;
})

export const getUserRefreshToken = createSelector(getAuthState, (state) => {
  return state.user?.userRefreshToken;
})
