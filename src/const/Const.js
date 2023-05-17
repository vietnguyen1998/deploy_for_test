import Addresses from "./Address";

export const ZeroAddress = "0x0000000000000000000000000000000000000000";

export const SupportedCoins = [
  { label: "ETH", value: ZeroAddress },
  { label: "USDT", value: Addresses.usdt },
  { label: "FZL", value: Addresses.cal },
  { label: "USDC", value: Addresses.usdc },
  { label: "WBTC", value: Addresses.wbtc },
];

export const BetSides = {
  team1: 1,
  team2: 2,
  draw: 3,
};

export const StartShibsFee = 100000;

export const ShibsRange = {
  min: 0,
  max: 1000000,
  limit: 1000000000000,
};

export const USDTRange = {
  min: 0,
  max: 100,
  limit: 1000000,
};

export const ETHRange = {
  min: 0,
  max: 0.2,
  limit: 625,
};

export const BTCRange = {
  min: 0,
  max: 0.004,
  limit: 40,
};

export const LogisticConst = {
  upperLimit: 1000000,
  rateK: 0.09,
  inflectionPoint: 50,
};
