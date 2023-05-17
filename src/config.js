export const etherscan = "https://etherscan.io";
//== Dev
const hostDev = "http://localhost:4000/api/";
const addressesDev = {
  usdc: "0x7A2bbbAe421Cd178a906dF372C33D37510851EE5",
  usdt: "0xa7da1d0237FF435d15e2880fdCb80D950Ac029E1",
  wbtc: "0x7610b6F11223C1a098E63A050F2fBfaeE52a44B2",
  cal: "0xa5e23e0191605241f11854816ad5971ef6919f4c",
  calSwap: "0x60D5789666dcad8C039FAe53727DED93ede8Cf51",
  poolManager: "0xA9731FAD0eA3f17A682B96e4CE4bBfc86c92330C",
  testFaucet: "0x313d962D5F385A81C562CC0eB3445aE92ddEa4c2",
  oracle: "0xC30587fcA21B472F2c330C96102F15Ff3335888B",
  staking: "0x35a15Eea058800049B94CfeEAd5E1970F190afa3",
  affiliate: "0x377bBb7f924cB389fA64DD23739e5947B0650447",
  lotteryManager: "0x934e865ba62f900FEbc2e42c6B229b5f13898C3a",
};
const CHAIN_ID_DEV = 1337;
//== Prod
const hostProd = process.env.REACT_APP_HOST || "/api/";

// //All contracts are using proxies now. NEVER change the addresses here.
// //To upgrade any SC we should use upgradeProxy in Truffle.

// Goerli
// const addressesProd = {
//   usdc: "0x61C821D7BF2Bb2700704BA7637D015c11A63b2d6",
//   usdt: "0x8B2FE2987A873669785578DDAC1762e9A30B9207",
//   wbtc: "0xc3C9E3650a1Bbb8e3Fcea132Df74EC901a9E85eA",
//   cal: "0xa5e23e0191605241f11854816ad5971ef6919f4c",
//   calSwap: "0x783484945bfA9046DC6B776C2f21a36Cb2124131",
//   poolManager: "0xAc1aFfBb721E85Db477112F0E0BBB88213cDCfF9",
//   testFaucet: "0xDE017C4Cf1E2b05b227e9138477C80eD66475738",
//   oracle: "0xd879D22D743e6844a5bA6b2e7F0165744D314029",
//   staking: "0xad19B6cE82D48156B2af82E5B09527E73623D322",
//   affiliate: "0xD5cc1f5eA241593f4cC51c0803300f7e46D78e37",
//   lotteryManager: "0x9B7277b9582651e6E4199caE85C8a4a66a160df1",
// };
// const CHAIN_ID_PROD = 5;

const addressesProd = {
  usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  wbtc: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  cal: "0xa5e23E0191605241F11854816aD5971EF6919F4C",
  calSwap: "0x783484945bfA9046DC6B776C2f21a36Cb2124131",
  poolManager: "0x74f50154846C81d8ee86f31737BC7b4209B0e075",
  testFaucet: "0xDE017C4Cf1E2b05b227e9138477C80eD66475738",
  oracle: "0xC24E7748D8d25D9f921564298999471F34ea5B95",
  staking: "0xA631A6cCe4D2B0E7A80cC694d3c010f627D7535F",
  affiliate: "0xD5cc1f5eA241593f4cC51c0803300f7e46D78e37",
  lotteryManager: "0x9B7277b9582651e6E4199caE85C8a4a66a160df1",
};
const CHAIN_ID_PROD = 1;

const isDev = process.env.NODE_ENV === "development";
const testContractProd = true;
const testApiProd = true;

export const host = isDev && !testApiProd ? hostDev : hostProd;
export const addresses =
  isDev && !testContractProd ? addressesDev : addressesProd;
export const CHAIN_ID =
  isDev && !testContractProd ? CHAIN_ID_DEV : CHAIN_ID_PROD;
