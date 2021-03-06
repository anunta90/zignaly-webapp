import React from "react";
import { Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import moment from "moment";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Trial Period compoennt for CT profile Header.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const TrialPeriod = ({ provider }) => {
  const currentTime = new Date().getTime();

  const getTime = () => {
    return moment.duration(parseInt(provider.stripe.cancelDate) - currentTime).humanize();
  };

  const Expiry = () => {
    return (
      <>
        {parseInt(provider.stripe.cancelDate) - currentTime > 0 ? (
          <Typography variant="h4">
            <b>
              <FormattedMessage id="srv.text.expires" />
              {getTime()}
            </b>
          </Typography>
        ) : (
          <Typography className="red" variant="h4">
            <b>
              <FormattedMessage id="srv.text.expired" />
            </b>
          </Typography>
        )}
      </>
    );
  };

  return (
    <>
      {provider.exchangeInternalId && !provider.disable ? (
        <Expiry />
      ) : (
        <Typography variant="h4">
          <FormattedMessage id="copyt.trial" />
          <b>
            {provider.internalPaymentInfo.trial ? provider.internalPaymentInfo.trial : 0}
            <b>
              <FormattedMessage id="srv.text.days" />
            </b>
          </b>
        </Typography>
      )}
    </>
  );
};

export default TrialPeriod;
