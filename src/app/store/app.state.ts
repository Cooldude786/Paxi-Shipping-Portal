import { ActionReducer, INIT, MetaReducer } from "@ngrx/store";
import { authReducer } from "../login/state/auth.reducer";
import { AUTH_STATE_NAME } from "../login/state/auth.selectors";
import { userModuleReducer } from "../user/state/user.reducer";
import { USER_STATE_NAME } from "../user/state/user.selectors";
import IUserModuleSate from "../user/state/user.state";
import { sharedReducer } from "./shared/shared.reducer";
import { SHARED_STATE_NAME } from "./shared/shared.selector"
import { ISharedState } from "./shared/shared.state"
import { logout } from "../login/state/auth.actions";

export interface IAppState {
  [SHARED_STATE_NAME]: ISharedState;
  [AUTH_STATE_NAME]: IAppState;
  [USER_STATE_NAME]: IUserModuleSate;
}

export const AppReducer = {
  [SHARED_STATE_NAME]: sharedReducer,
  [AUTH_STATE_NAME]: authReducer,
  [USER_STATE_NAME]: userModuleReducer,
}

// Meta Reducers
const logoutMeta = (reducer: ActionReducer<any>): ActionReducer<any> => {
  return (state, action) => {
    if(action.type === logout.type) {
      return reducer(undefined, { type: INIT });
    }
    return reducer(state, action);
  }
}

export const metaReducers: MetaReducer<any>[] = [logoutMeta];
