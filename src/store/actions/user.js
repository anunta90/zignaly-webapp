import tradeApi from "../../services/tradeApiClient";
import { SET_SELECTED_EXCHANGE } from "./settings";
import initialState from "../initialState";
import { showErrorAlert } from "./ui";

export const REMOVE_USER = "REMOVE_USER_ACTION";
export const GET_USER_BALANCE = "GET_USER_BALANCE_ACTION";
export const SET_USER_BALANCE_LOADER = "SET_USER_BALANCE_LOADER_ACTION";
export const REMOVE_USER_BALANCE = "REMOVE_USER_BALANCE_ACTION";
export const GET_DAILY_USER_BALANCE = "GET_DAILY_USER_BALANCE_ACTION";
export const REMOVE_USER_EXCHANGE = "REMOVE_USER_EXCHANGE";
export const GET_USER_DATA = "GET_USER_DATA_ACTION";
export const ENABLE_TWO_FA = "ENABLE_TWO_FA";
export const SET_DAILY_BALANCE_LOADER = "SET_DAILY_BALANCE_LOADER_ACTION";

/**
 * @typedef {import('../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import('../../services/tradeApiClient.types').UserEntity} UserEntity
 * @typedef {import('../../services/tradeApiClient.types').AuthorizationPayload} AuthorizationPayload
 * @typedef {import("../../services/tradeApiClient.types").UserEquityPayload} UserEquityPayload
 * @typedef {import('../../store/store').AppThunk} AppThunk
 * @typedef {import('redux').AnyAction} AnyAction
 * @typedef {import("../../services/tradeApiClient.types").UserEquityPayload}
 */

/**
 * Get user connected exchanges store thunk action.
 *
 * @param {String} token Trade API user authorization.
 * @param {Array<ExchangeConnectionEntity>} responseData Trade API user authorization.
 *
 * @returns {AppThunk} Thunk action function.
 */
const initUserExchanges = (token, responseData) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      // @ts-ignore
      const storeSelectedExchange = state.settings.selectedExchange;
      let exchangeInternalId = "";
      let selected = null;
      if (storeSelectedExchange && storeSelectedExchange.internalId) {
        exchangeInternalId = storeSelectedExchange.internalId;
        selected = responseData.find((item) => item.internalId === exchangeInternalId);
      }
      if (!selected) {
        selected = responseData.length ? responseData[0] : initialState.settings.selectedExchange;
      }
      dispatch(setSelectedExchange(selected));
      if (responseData.length > 0) {
        /**
         * @type {UserEquityPayload}
         */
        let balancePayload = { token: token, exchangeInternalId: selected.internalId };
        dispatch(getDailyUserBalance(balancePayload));
      }
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

/**
 *
 * @param {ExchangeConnectionEntity} payload Exchange connection.
 * @returns {AnyAction} Action object
 */
export const setSelectedExchange = (payload) => {
  return {
    type: SET_SELECTED_EXCHANGE,
    payload,
  };
};

export const unsetUser = () => {
  return {
    type: REMOVE_USER,
  };
};

/**
 * Get user balance store thunk action.
 *
 * @param {UserEquityPayload} payload Trade API user authorization.
 *
 * @returns {AppThunk} Thunk action function.
 */
export const setUserBalance = (payload) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_USER_BALANCE_LOADER,
      });
      const responseData = await tradeApi.userBalanceGet(payload);
      const action = {
        type: GET_USER_BALANCE,
        payload: responseData,
      };

      dispatch(action);
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

export const unsetUserBalance = () => {
  return {
    type: REMOVE_USER_BALANCE,
  };
};

/**
 * Remove exchange from user exchanges list.
 *
 * @param {string} internalId Exchange account internal id.
 * @returns {Object} return action object.
 */
export const removeUserExchange = (internalId) => {
  return {
    type: REMOVE_USER_EXCHANGE,
    payload: internalId,
  };
};

/**
 * Get user balance store thunk action.
 *
 * @param {UserEquityPayload} payload Trade API user authorization.
 *
 * @returns {AppThunk} Thunk action function.
 */
export const getDailyUserBalance = (payload) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_DAILY_BALANCE_LOADER,
      });
      const response = await tradeApi.userEquityGet(payload);
      const action = {
        type: GET_DAILY_USER_BALANCE,
        payload: response,
      };
      dispatch(action);
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

/**
 * Get user balance store thunk action.
 *
 * @param {AuthorizationPayload} payload Trade API user authorization.
 *
 * @returns {AppThunk} Thunk action function.
 */
export const getUserData = (payload) => {
  return async (dispatch) => {
    try {
      const responseData = await tradeApi.userDataGet(payload);
      const action = {
        type: GET_USER_DATA,
        payload: responseData,
      };

      dispatch(action);
      dispatch(initUserExchanges(payload.token, responseData.exchanges));
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

/**
 * Remove exchange from user exchanges list.
 *
 * @param {boolean} twoFAEnable Flag to enable 2 FA.
 * @returns {Object} return action object.
 */
export const enable2FA = (twoFAEnable) => {
  return {
    type: ENABLE_TWO_FA,
    payload: twoFAEnable,
  };
};
