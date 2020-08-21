import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import useStoreSessionSelector from "./useStoreSessionSelector";
import useStoreSettingsSelector from "./useStoreSettingsSelector";
import useQuoteAssets from "./useQuoteAssets";
import useExchangesOptions from "./useExchangesOptions";
import useEffectSkipFirst from "./useEffectSkipFirst";
import { useIntl } from "react-intl";
import { uniqBy, assign } from "lodash";
import {
  setSort as setSortAction,
  setTimeFrame as setTimeFrameAction,
  setFilters as setFiltersAction,
} from "../store/actions/settings";
import { showErrorAlert } from "../store/actions/ui";
import { useDispatch } from "react-redux";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../store/actions/settings").ProviderPageType} ProviderPageType
 * @typedef {import("../store/actions/settings").ConnectedProviderPageType} ConnectedProviderPageType
 * @typedef {import("../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
 * @typedef {import("../services/tradeApiClient.types").ProviderEntity} ProviderEntity
 * @typedef {import("../services/tradeApiClient.types").ProvidersPayload} ProvidersPayload
 * @typedef {import("../components/CustomSelect/CustomSelect").OptionType} OptionType
 */

/**
 * @typedef {Object} ProvidersOptions
 * @property {boolean} copyTradersOnly
 * @property {boolean} connectedOnly
 */

/**
 * @typedef {Object} Filters
 * @property {string} quote
 * @property {string} exchange
 * @property {string} exchangeType
 * @property {string} fromUser
 */

/**
 * @typedef {Object} ProvidersData
 * @property {ProvidersCollection} providers
 * @property {number} timeFrame
 * @property {function} setTimeFrame
 * @property {Array<OptionType>} quotes
 * @property {Array<OptionType>} exchanges
 * @property {Array<OptionType>} exchangeTypes
 * @property {function} setExchangeType
 * @property {Array<OptionType>} fromUserOptions
 * @property {string} sort
 * @property {function} setSort
 * @property {function} clearFilters
 * @property {function} clearSort
 * @property {function} setFilters
 * @property {Filters} filters
 */

/**
 * Hook to generate the providers data fetching and filtering.
 *
 * @param {ProvidersOptions} options Hook options.
 * @returns {ProvidersData} Providers and filtering objects.
 */
const useProvidersList = (options) => {
  const intl = useIntl();
  const storeSettings = useStoreSettingsSelector();
  const internalExchangeId = storeSettings.selectedExchange.internalId;
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const { copyTradersOnly, connectedOnly } = options;

  /**
   * @type {{list: ProvidersCollection, filteredList: ProvidersCollection}} initialState
   */
  const initialState = { list: null, filteredList: null };
  const [providers, setProviders] = useState(initialState);

  /**
   * @type {ProviderPageType|ConnectedProviderPageType} Page shorthand
   */
  let page;
  if (connectedOnly) {
    page = copyTradersOnly ? "connectedCopyt" : "connectedSignalp";
  } else {
    page = copyTradersOnly ? "copyt" : "signalp";
  }

  // @ts-ignore
  const storeFilters = storeSettings.filters[page] || {};

  const [filters, setFilters] = useState({
    ...(!connectedOnly && {
      ...(copyTradersOnly && {
        quote: storeFilters.quote || "ALL",
        exchange: storeFilters.exchange || "ALL",
        exchangeType: storeFilters.exchangeType || "ALL",
      }),
      fromUser: storeFilters.fromUser || "ALL",
    }),
  });

  // Get quotes list unless connected providers only which don't need filters
  const quoteAssets = useQuoteAssets(!connectedOnly);
  const quotes = [
    {
      val: "ALL",
      label: intl.formatMessage({ id: "fil.allcoins" }),
    },
  ].concat(
    Object.keys(quoteAssets).map((label) => ({
      val: label,
      label,
    })),
  );

  const exchanges = useExchangesOptions(true);

  const exchangeTypes = [
    {
      val: "ALL",
      label: intl.formatMessage({
        id: "fil.allexchangeTypes",
      }),
    },
    { val: "spot", label: "Spot" },
    { val: "futures", label: "Futures" },
  ];

  const fromUserOptions = [
    { val: "ALL", label: "All Services" },
    { val: "userOwned", label: "My Services" },
  ];

  // Sort
  const initSort = () => {
    let val;
    if (!connectedOnly) {
      val = copyTradersOnly ? storeSettings.sort.copyt : storeSettings.sort.signalp;
    }
    return val || "RETURNS_DESC";
  };
  const [sort, setSort] = useState(initSort);

  // Reset filters
  const clearFilters = () => {
    setFilters({
      ...(copyTradersOnly && {
        quote: "ALL",
        exchange: "ALL",
        exchangeType: "ALL",
      }),
      fromUser: "ALL",
    });
  };

  const clearSort = () => {
    setSort("RETURNS_DESC");
  };

  // TimeFrame
  const initTimeFrame = storeSettings.timeFrame[page] || 90;
  const [timeFrame, setTimeFrame] = useState(initTimeFrame);

  // Save timeFrame to store once changed
  const saveTimeFrame = () => {
    dispatch(setTimeFrameAction({ timeFrame, page }));
  };
  useEffectSkipFirst(saveTimeFrame, [timeFrame]);

  /**
   * Sort providers by selected option
   *
   * @param {ProvidersCollection} list Providers collection.
   * @returns {void}
   */
  const sortProviders = (list) => {
    const [key, direction] = sort.split("_");
    const listSorted = [...list].sort((a, b) => {
      let res = 0;
      switch (key) {
        case "RETURNS":
          res = a.returns + a.floating - (b.returns + b.floating);
          break;
        case "DATE":
          res = a.createdAt - b.createdAt;
          break;
        case "NAME":
          res = a.name.localeCompare(b.name);
          break;
        case "FEE":
          res = a.price - b.price;
          break;
        default:
          break;
      }
      return direction === "ASC" ? res : -res;
    });

    setProviders((s) => ({ ...s, filteredList: listSorted }));
  };
  const saveSort = () => {
    if (!connectedOnly) {
      // @ts-ignore
      dispatch(setSortAction({ sort, page }));
    }
  };

  // Sort providers on sort option change
  useEffectSkipFirst(() => {
    if (providers.filteredList) {
      sortProviders(providers.filteredList);
    }
    saveSort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  /**
   * Filter providers by selected options
   *
   * @param {ProvidersCollection} list Providers collection.
   * @returns {void}
   */
  const filterProviders = (list) => {
    const matches = list.filter(
      (p) =>
        (!filters.quote || filters.quote === "ALL" || p.quote === filters.quote) &&
        (!filters.exchange ||
          filters.exchange === "ALL" ||
          p.exchanges.includes(filters.exchange.toLowerCase())) &&
        (!filters.exchangeType ||
          filters.exchangeType === "ALL" ||
          p.exchangeType.toLowerCase() === filters.exchangeType.toLowerCase()) &&
        (!filters.fromUser || filters.fromUser === "ALL" || p.isFromUser),
    );
    sortProviders(matches);
  };

  // Filter providers on filter change
  useEffect(() => {
    if (providers.list) {
      filterProviders(providers.list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadProviders = () => {
    /**
     * @type {ProvidersPayload}
     */
    const payload = {
      token: storeSession.tradeApi.accessToken,
      type: connectedOnly ? "connected" : "all",
      ro: true,
      copyTradersOnly,
      timeFrame,
      internalExchangeId,
    };

    tradeApi
      .providersGet(payload)
      .then((responseData) => {
        const uniqueProviders = uniqBy(responseData, "id");
        setProviders((s) => ({
          ...s,
          list: uniqueProviders,
        }));
        filterProviders(uniqueProviders);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };
  // Load providers at init and on timeframe change.
  useEffect(loadProviders, [
    timeFrame,
    connectedOnly,
    copyTradersOnly,
    storeSession.tradeApi.accessToken,
    internalExchangeId,
  ]);

  const modifiedFilters = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "ALL") {
        count++;
      }
    });
    return count;
  };

  /**
   * Combine external state filters with local state.
   *
   * @param {defaultFilters} values External filter values.
   *
   * @returns {Void} None.
   */
  const combineFilters = (values) => {
    const newFilters = assign({}, filters, values);
    setFilters(newFilters);

    dispatch(
      setFiltersAction({
        filters,
        // @ts-ignore
        page,
      }),
    );
  };

  return {
    providers: providers.filteredList,
    timeFrame,
    setTimeFrame,
    quotes,
    exchanges,
    exchangeTypes,
    fromUserOptions,
    filters,
    setFilters: combineFilters,
    sort,
    setSort,
    clearFilters,
    clearSort,
    modifiedFilters: modifiedFilters(),
  };
};

export default useProvidersList;
