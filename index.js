const BTC_TRADE = "btcusdt@trade";
const BTC_TICKER = "btcusdt@ticker";
const ETH_TRADE = "ethusdt@trade";
const ETH_TICKER = "ethusdt@ticker";

const ws = new WebSocket(
  `wss://stream.binance.com:9443/stream?streams=${BTC_TRADE}/${BTC_TICKER}/${ETH_TRADE}/${ETH_TICKER}`
);

//BTC - global declaration
let btc = document.querySelector("#btc");
let btcTicker = document.querySelector("#btc-ticker");
let lastBtcPrice = null;

//ETH - global declaration
let eth = document.querySelector("#eth");
let ethTicker = document.querySelector("#eth-ticker");
let lastEthPrice = null;

const triggerStream = (streams, data) => {
  if (streams.stream === data.trade) {
    let price = parseFloat(streams.data.p).toFixed(2);
    data.type.innerText = price;
    data.type.style.color =
      !data.last || data.last === price
        ? "black"
        : price > data.last
        ? "green"
        : "red";
  }

  if (streams.stream === data.typeTicker) {
    let priceTicker = parseFloat(streams.data.P).toFixed(2);
    data.ticker.innerText = priceTicker;
  }
};

ws.onmessage = (event) => {
  const streams = JSON.parse(event.data);
  console.log(streams);
  if (streams.stream === BTC_TRADE || streams.stream === BTC_TICKER) {
    const data = {
      trade: BTC_TRADE,
      ticker: btcTicker,
      type: btc,
      last: lastBtcPrice,
      typeTicker: BTC_TICKER,
    };
    triggerStream(streams, data);
    lastBtcPrice = parseFloat(streams.data.p).toFixed(2);
  }

  if (streams.stream === ETH_TRADE || streams.stream === ETH_TICKER) {
    const data = {
      trade: ETH_TRADE,
      ticker: ethTicker,
      type: eth,
      last: lastEthPrice,
      typeTicker: ETH_TICKER,
    };
    triggerStream(streams, data);
    lastEthPrice = parseFloat(streams.data.p).toFixed(2);
  }
};
