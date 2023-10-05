import { createReducer, on } from "@ngrx/store";
import { initialState } from "./auth.state";
import { loginFail, loginSuccess, logout, revokeTokenSuccess } from "./auth.actions";

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, action) => {
    return {
      ...state,
      user: action.user,
    }
  }),
  on(loginFail, (state, action) => {
    let response = null;
    if (action.authError != null) {
      response = { message: action.authError.message, type: action.authError.type };
    }
    return {
      ...state,
      authError: response,
    }
  }),
  on(revokeTokenSuccess, (state, action) => {
    return {
      ...state,
      user: action.user,
    }
  }),
  on(logout, (state) => {
    return {
      ...state,
      authError: null,
      user: null
    }
  })
)
