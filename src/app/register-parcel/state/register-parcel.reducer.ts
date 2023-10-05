import { createReducer, on } from '@ngrx/store';
import { initialState } from './register-parcel.state';
import { 
    registerParcelFormSuccess,
    createOrderSucess,
    loadLocationSucess
} from './register-parcel.actions';

export const registerParcelReducer = createReducer(
    initialState,
    on(registerParcelFormSuccess, (state, action) => {
        return {
            ...state,
            parcelPayload: { ...action.payload },
        };
    }),
    on(createOrderSucess, (state, action) => {
        return {
          ...state,
          order: { uid: action.orderIdNo },
        };
    }),
    on(loadLocationSucess, (state,action) => {
        return {
            ...state,
            destination: action.destination
        }
    }),
);