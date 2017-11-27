import bityConfig from 'config/bity';
import { checkHttpStatus, parseJSON } from './utils';

export function getAllRates() {
  const mappedRates = {};
  return _getAllRates().then(bityRates => {
    bityRates.objects.forEach(each => {
      const pairName = each.pair;
      const from = { id: pairName.substring(0, 3) };
      const to = { id: pairName.substring(3, 6) };
      if (parseFloat(each.rate_we_sell)) {
        mappedRates[pairName] = {
          id: pairName,
          options: [from, to],
          rate: parseFloat(each.rate_we_sell)
        };
      }
    });
    return mappedRates;
  });
}

export function postOrder(
  amount: number,
  destAddress: string,
  mode: number,
  pair: string
) {
  return fetch(`${bityConfig.serverURL}/order`, {
    method: 'post',
    body: JSON.stringify({
      amount,
      destAddress,
      mode,
      pair
    }),
    headers: bityConfig.postConfig.headers
  })
    .then(checkHttpStatus)
    .then(parseJSON);
}

export function getOrderStatus(orderId: string) {
  return fetch(`${bityConfig.serverURL}/status`, {
    method: 'POST',
    body: JSON.stringify({
      orderid: orderId
    }),
    headers: bityConfig.postConfig.headers
  })
    .then(checkHttpStatus)
    .then(parseJSON);
}

function _getAllRates() {
  return fetch(`${bityConfig.bityURL}/v1/rate2/`)
    .then(checkHttpStatus)
    .then(parseJSON);
}
