const constants = {
  websocket: {
    BINANCE_FUTURE:'wss://stream.binancefuture.com/ws/',
    MARK_PRICE: "wss://fstream.binance.com/ws/!markPrice@arr",
    CONTRACT_INFO:'wss://fstream.binance.com/ws/!contractInfo@arr'
  },
  api:{
    BASE_URL:'https://fapi.binance.com/fapi/v1',
    LISTEN_KEY:'/listenKey',
    TIMESTAMP:'https://api.binance.com/api/v3/time',
    ACCOUNT_INFO:'https://fapi.binance.com/fapi/v2/account'
  },
  PRICE_PATH: "/home/linhdv/Documents/prices",
  kafka: {
    HOSTS: ["172.16.147.212:9092"],
    topics: {
      MARK_PRICE: "mark_price",
    },
  },
};

module.exports = constants;
