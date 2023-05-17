import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import Main from "../../Common/Main";
import "./CreatePool.css";
import { connect, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useInput from "../../hook/useInput";
import { getMatches, createPool } from "../../../redux/actions";
import {
  getMaxPoolSize,
  roundNumber,
  timestampToLocalDate,
  getCalAmount,
  formatTimezone,
  getPoolSizeLimit,
  getPoolSizeMax,
} from "../../../utils/Utils";
import WhiteListPanel from "./WhiteListPanel/WhiteListPanel";
import { StartShibsFee, SupportedCoins, ZeroAddress } from "../../../const/Const";
import {
  getPoolManager,
  getCal,
  getOracle,
  getSigner,
} from "../../../utils/Contracts";
import { getWei } from "../../../utils/Web3Utils";
import { toast } from "react-toastify";
import Addresses from "../../../const/Address";
import TutorialPopup from "../../Common/TutorialPopup";
import { LogisticConst } from "../../../const/Const";
import { toHaveFormValues } from "@testing-library/jest-dom";

const CreatePool = (props) => {
  const { getMatches, createPool } = props;

  const [gameType, bindGameType] = useInput("epl");
  const [match, bindMatch, resetMatch] = useInput("0");
  const [isPrivate, setIsPrivate] = useState(false);
  const [hasHandicap, setHasHandicap] = useState(false);
  const [whitelist, setWhitelist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coin, bindCoin] = useInput(ZeroAddress);
  const [price, setPrice] = useState(1);
  const [priceChange, setPriceChange] = useState(false);
  const [title, bindTitle] = useInput("");
  const [description, bindDescription] = useInput("Starting your Gaming Pool");
  const [fee, bindFee] = useInput("10");
  const [minPoolSize, bindMinPoolSize] = useInput("0");
  const [minBet, bindMinBet] = useInput("0");
  const [approved, setApproved] = useState(false);
  const history = useHistory();
  const [isGameTypeDisabled, setisGameTypeDisabled] = useState(false);
  const [handicapSide, bindHandicapSide] = useInput("-1");
  const [handicapWholeValue, setHandicapWholeValue] = useState(0);
  const [handicapFractionalValue, setHandicapFractionalValue] = useState(0);
  const [isZeroHandicap, setIsZeroHandicap] = useState(false);
  const [handicapType, bindHandicapType] = useInput("0");
  const [charsLeft, setCharsLeft] = useState(200);

  const calcMaxPoolSize = (label) => {
    return String(roundNumber(getPoolSizeLimit(label)));
    // return String(roundNumber(getPoolSizeLimit(label) / price));
  };

  // const calcCalAmount = () => {
  //   let maxPoolSizeLimit = Math.floor(
  //     roundNumber((LogisticConst.upperLimit - 1) / price)
  //   );
  //   let num = maxPoolSize > maxPoolSizeLimit ? maxPoolSizeLimit : maxPoolSize;
  //   return roundNumber(getCalAmount(num * price));
  // };

  const [calAmount, setCalAmount] = useState("50");
  const [maxPoolSize, setMaxPoolSize] = useState(calcMaxPoolSize(SupportedCoins[0].label));

  const PoolManagerSigner =
    getPoolManager() && getPoolManager().connect(getSigner());
  const CalSigner = getCal() && getCal().connect(getSigner());
  const Oracle = getOracle();

  const matches = useSelector((state) => state.matches) || [];
  const gameTypes = useSelector((state) => state.gameTypes) || [];
  const address = useSelector((state) => state.address) || "";

  const getAccounts = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    setWhitelist([account]);
  };

  const filterMatches = useMemo(
    () => matches.filter((el) => el.game === gameType || el.type === gameType),
    [matches, gameType]
  );
  const game = useMemo(() => {
    const matchNum = Number(match);
    if (filterMatches.length && filterMatches.length > matchNum) {
      return filterMatches[matchNum];
    }
    return {};
  }, [filterMatches, match]);

  const selectedCoin = useMemo(
    () => SupportedCoins.find((el) => el.value === coin) || SupportedCoins[0],
    [coin]
  );

  useEffect(() => {
    // if (coin === ZeroAddress) {
    //   // Oracle && Oracle.getEthPrice().then((val) => setPrice(val / 1e8));
    // } else {
    //   setPrice(0);
    //   setPriceChange(!priceChange);
    // }
    Oracle && Oracle.getEthPrice().then((val) => {
      console.log(`getEthPrice`, val / 1e8)
    });
    setPrice(0);
    setPriceChange(!priceChange);
  }, [coin]);

  useEffect(() => {
    if (document.activeElement.id == "calAmountInput") {
      setMaxPoolSize(calcMaxPoolSize(selectedCoin.label));
    }
  }, [calAmount]);

  useEffect(() => {
    if (document.activeElement.id != "calAmountInput") {
      let _calcCalAmount = 0
      if(selectedCoin.label == SupportedCoins[2].label){
        _calcCalAmount = maxPoolSize / getPoolSizeMax(SupportedCoins[2].label) ;
      }else{
        _calcCalAmount = (maxPoolSize / getPoolSizeMax(selectedCoin.label)) * StartShibsFee
      }
      _calcCalAmount = _calcCalAmount < 1 ? 1 : _calcCalAmount;
      setCalAmount(_calcCalAmount);
    }
  }, [maxPoolSize]);

  useEffect(() => {
    setMaxPoolSize(getPoolSizeMax(selectedCoin.label));
  }, [price, priceChange]);

  useEffect(() => {
    getMatches();
  }, []);

  useEffect(() => {
    resetMatch();
  }, [gameType]);

  useEffect(() => {
    setCharsLeft(200 - description.length);
  }, [description]);

  useEffect(() => {
    getAccounts();
  }, []);

  const approveCal = async () => {
    if (calAmount < 1) {
      setLoading(false);
      toast.error("Pool creation fee cannot be lesser or equal then 1");
      return;
    }
    setLoading(true);
    CalSigner &&
      CalSigner.approve(Addresses.poolManager, getWei(calAmount.toString()))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApproved(true);
            setisGameTypeDisabled(true);
            toast.success(
              <div>
                Approved Successfully!
                <br />
                Please click the Create Pool button
              </div>
            );
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const clickCreatePool = async () => {
    try {
      setLoading(true);
      const selectMatch = filterMatches[Number(match)];
      const endDate = selectMatch.date - 60 * 60;
      const poolFee = Math.round(fee * 100);
      if (poolFee > 9500) {
        setLoading(false);
        toast.error("Pool Fee should not be bigger then 95%");
        return;
      }
      if (minPoolSize > maxPoolSize) {
        setLoading(false);
        toast.error("Min pool size cannot be bigger than max pool size");
        return;
      }
      if (calAmount < 1) {
        setLoading(false);
        toast.error("Pool creation fee cannot be lesser or equal then 1");
        return;
      }
      const handicap = [
        handicapWholeValue * parseInt(handicapSide) * 100,
        handicapFractionalValue * parseInt(handicapSide) * 100,
      ];

      const currencyDetails = [
        poolFee,
        getWei(calAmount.toString()),
        getWei(minBet.toString()),
        getWei(minPoolSize.toString()),
        getWei(maxPoolSize.toString()),
      ];

      // const isUnlimited =
      //   maxPoolSize >=
      //   Math.floor(roundNumber((LogisticConst.upperLimit - 1) / price));
      const isUnlimited = getPoolSizeLimit(selectedCoin.label) == maxPoolSize

      const bools = [hasHandicap, isUnlimited];
      debugger

      console.log("title", title)
      console.log("description", description)
      console.log("selectMatch.gameId", selectMatch.gameId)
      console.log("selectMatch.game", selectMatch.game)
      console.log("endDate", endDate)
      console.log("coin", coin)
      console.log("currencyDetails", currencyDetails)
      console.log("isPrivate ? whitelist : []", isPrivate ? whitelist : [])
      console.log("bools", bools)
      console.log("handicap", handicap)
      const tx = await PoolManagerSigner.createBettingPool(
        title,
        description,
        selectMatch.gameId,
        selectMatch.game,
        endDate,
        coin,
        currencyDetails,
        isPrivate ? whitelist : [],
        bools,
        handicap
      );
   
      debugger
      await tx.wait();
      const poolAddress = await getPoolManager().getLastOwnPool(0, {
        from: address,
      });

      debugger
      await createPool({
        _id: poolAddress,
        owner: address,
        title,
        description,
        depositedCal: calAmount,
        maxCap: maxPoolSize,
        poolFee: fee,
        endDate,
        isPrivate,
        whitelist: isPrivate ? whitelist : [],
        currency: coin,
        game: {
          ...selectMatch,
        },
        minBet,
        hasHandicap,
        handicap:
          (handicapWholeValue + handicapFractionalValue) *
          parseInt(handicapSide),
        minPoolSize,
        isUnlimited: isUnlimited,
      });
      setLoading(false);
      toast.success("Pool was created!");
      history.push("/pools");
    } catch (err) {
      debugger
      setLoading(false);
      toast.error(err.message);
    }
  };

  const gameTypeOptions = gameTypes.map((el, id) => {
    return (
      <option key={id} value={el.type}>
        {el.name}
      </option>
    );
  });

  const fillSpace = (el) => {
    let longest = 0;

    for (let n = 0; n < filterMatches.length; n++) {
      if (
        filterMatches[n].team1.length + filterMatches[n].team2.length >
        longest
      ) {
        longest = filterMatches[n].team1.length + filterMatches[n].team2.length;
      }
    }
    let space = ``;
    if (longest - el.team1.length - el.team2.length > 0) {
      space = `\xa0`.repeat(longest - el.team1.length - el.team2.length);
    }

    // if (longest - el.team1.length - el.team2.length > 10) {
    //   let strSpace =
    //     el.team1.split(" ").length -
    //     1 +
    //     (el.team2.split(" ").length - 1) +
    //     (el.team1.split("-").length - 1) +
    //     (el.team2.split("-").length - 1);
    //   space += "\xa0".repeat(parseInt(strSpace));
    // }
    return space;
  };

  const matchOptions = filterMatches.map((el, id) => {
    const s = `\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0`;
    return (
      <option
        key={id}
        value={String(id)}
        //style={{ direction: "rtl", textAlign: "right" }}
        style={{ fontFamily: "Roboto Mono", fontSize: "15px" }}
      >
        {el.team1} - {el.team2}
        {s}
        {fillSpace(el)}
        {timestampToLocalDate(el.date, "DD MMM YYYY")}{" "}
        {timestampToLocalDate(el.date, "H:mm UTC").padStart(9, "0")}{" "}
        {formatTimezone(el.date)}
      </option>
    );
  });

  const supportedCoinOptions = SupportedCoins.map((el) => {
    return (
      <option key={el.value} value={el.value}>
        {el.label}
      </option>
    );
  });

  const canApproveCreate = !isPrivate || (isPrivate && whitelist.length > 0);
  return (
    <Main loading={loading} setLoading={setLoading}>
      <div
        className="container-fluid fees-box-2 fadeInUp margin-body-section "
        data-wow-duration="1s"
        data-wow-delay="0s"
        style={{ height: 340, backgroundSize: "cover" }}
      >
        <div className="container" align="center">
          <h2 className="bold white">Starting your Gaming Pool</h2>
          {(game.date != undefined && (
            <>
              <div
                className="white d-flex mt-md-5 mt-4"
                style={{
                  height: "60px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", width: 200 }}
                >
                  <p className="m-0 mr-2 bold" style={{ textAlign: "right" }}>
                    {game.team1}
                  </p>
                  <img
                    className="team-img mr-3 bg-white"
                    style={{
                      height: 70,
                      width: 70,
                      padding: 4,
                      borderRadius: 70,
                    }}
                    src={game.logo1}
                  />
                </div>
                <div
                  style={{ paddingLeft: 24, paddingRight: 24 }}
                  className="white d-none d-md-block"
                >
                  <p className="bold" style={{ marginBottom: 4 }}>
                    {timestampToLocalDate(game.date, "D MMM YYYY")}{" "}
                  </p>
                  <p style={{ color: "#00E3FF" }} className="bold m-0">
                    {timestampToLocalDate(game.date, "H:mm UTC").padStart(
                      9,
                      "0"
                    )}{" "}
                    {formatTimezone(game.date)}
                  </p>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", width: 200 }}
                >
                  <img
                    className="team-img ml-3 bg-white"
                    style={{
                      height: 70,
                      width: 70,
                      padding: 4,
                      borderRadius: 70,
                    }}
                    src={game.logo2}
                  />
                  <p className="m-0 ml-2 bold" style={{ textAlign: "left" }}>
                    {game.team2}
                  </p>
                </div>
              </div>
              <div
                  style={{ paddingLeft: 24, paddingRight: 24 }}
                  className="white d-block d-md-none mt-3"
                >
                  <span className="bold" style={{ marginBottom: 4 }}>
                    {timestampToLocalDate(game.date, "D MMM YYYY")}{" "}
                  </span>
                  <span style={{ color: "#00E3FF" }} className="bold m-0">
                    {timestampToLocalDate(game.date, "H:mm UTC").padStart(
                      9,
                      "0"
                    )}{" "}
                    {formatTimezone(game.date)}
                  </span>
                </div>
            </>
          )) || (
              <div className="white">
                Please begin by selecting the type of games from the drop down box
                below
              </div>
            )}
        </div>
      </div>
      <div className="container test-res create-pool" align="center">
        <br />
        <div className="row">
          <div className="col-md-6 col-12">
            <form className="grey">
              <p className="m-0" style={{ textAlign: "left" }}>
                Please select types of games
              </p>
              <select
                disabled={isGameTypeDisabled}
                className="select-input"
                name="Type of games"
                {...bindGameType}
              >
                {gameTypeOptions}
              </select>
              <br />
              <p className="m-0" style={{ textAlign: "left" }}>
                Please select which game to create Pool for
              </p>
              {(matchOptions.length > 0 && (
                <select
                  className="select-input"
                  name="Game"
                  {...bindMatch}
                  style={{ textAlignLast: "left" }}
                >
                  {matchOptions}
                </select>
              )) || (
                  <>
                    <br />
                    <h6 style={{ color: "red" }}>
                      No matches found at the moment.
                    </h6>
                  </>
                )}
              <br />
              <div className="row">
                <div className="col form-check" style={{ textAlign: "left" }}>
                  <input
                    disabled={matchOptions.length == 0}
                    className="form-check-input"
                    style={{ margin: 0 }}
                    type="checkbox"
                    value={hasHandicap}
                    onChange={(e) => {
                      setHasHandicap(e.target.checked);
                    }}
                  ></input>

                  <label className="form-check-label black ml-4">
                    Enable Handicap
                  </label>
                </div>

                {hasHandicap && (
                  <div className="col form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={isZeroHandicap}
                      onChange={(e) => {
                        setIsZeroHandicap(e.target.checked);
                        setHandicapWholeValue(0);
                        setHandicapFractionalValue(0);
                      }}
                    ></input>
                    <label className="form-check-label black">
                      <TutorialPopup content="Plays are refunded on a draw result.">
                        <span>Set Handicap to 0</span>
                      </TutorialPopup>
                    </label>
                  </div>
                )}
              </div>
              {hasHandicap && (
                <>
                  <div>
                    <input
                      className="text-input"
                      type="text"
                      disabled
                      value={filterMatches[Number(match)].team1}
                    ></input>
                  </div>
                  <div>
                    <select className="select-input" {...bindHandicapType}>
                      <option key="0" value="0">
                        Asian Handicap
                      </option>
                      <option key="1" value="1">
                        Point Spread
                      </option>
                    </select>
                  </div>
                  <div className="row">
                    <div className="col">
                      <select
                        className="select-input"
                        disabled={isZeroHandicap}
                        {...bindHandicapSide}
                      >
                        <option key="1" value="-1">
                          -
                        </option>
                        <option key="2" value="1">
                          +
                        </option>
                      </select>
                    </div>
                    <div className="col">
                      <select
                        className="select-input"
                        disabled={isZeroHandicap}
                        value={handicapWholeValue}
                        onChange={(e) => {
                          setHandicapWholeValue(parseInt(e.target.value));
                        }}
                      >
                        <option key="0" value="0">
                          0
                        </option>
                        <option key="1" value="1">
                          1
                        </option>
                        <option key="2" value="2">
                          2
                        </option>
                        <option key="3" value="3">
                          3
                        </option>
                        <option key="4" value="4">
                          4
                        </option>
                        <option key="5" value="5">
                          5
                        </option>
                        <option key="6" value="6">
                          6
                        </option>
                        <option key="7" value="7">
                          7
                        </option>
                        <option key="8" value="8">
                          8
                        </option>
                        <option key="9" value="9">
                          9
                        </option>
                        <option key="10" value="10">
                          10
                        </option>
                      </select>
                    </div>
                    <div className="col">
                      <select
                        className="select-input"
                        disabled={isZeroHandicap}
                        value={handicapFractionalValue}
                        onChange={(e) => {
                          setHandicapFractionalValue(
                            parseFloat(e.target.value)
                          );
                        }}
                      >
                        <option key="0" value="0">
                          0
                        </option>
                        {handicapType == "0" && (
                          <option key="0.25" value="0.25">
                            0.25
                          </option>
                        )}

                        <option key="0.5" value="0.5">
                          0.5
                        </option>

                        {handicapType == "0" && (
                          <option key="0.75" value="0.75">
                            0.75
                          </option>
                        )}
                      </select>
                    </div>
                  </div>
                </>
              )}
              <br />
              <p className="m-0" style={{ textAlign: "left" }}>
                Title
              </p>
              <input
                className="text-input"
                maxLength="100"
                type="text"
                {...bindTitle}
              ></input>
              <br />
              <p className="m-0" style={{ textAlign: "left" }}>
                Description
              </p>
              <textarea
                className="form-control description-box"
                rows="5"
                id="description"
                placeholder="Type something..."
                {...bindDescription}
                cols="200"
                maxLength="200"
              ></textarea>
              <div align="right">
                <p className="small-text mt-2">*{charsLeft} characters left</p>
              </div>
            </form>
          </div>
          <div className="col-md-6 col-12">
            <form className="grey">
              <TutorialPopup content="This is the cryptocurrency which players can play with.">
                <p className="m-0" style={{ textAlign: "left" }}>
                  Please select the currency for the Pool
                </p>
              </TutorialPopup>
              <select className="select-input" name="Crypto" {...bindCoin}>
                {supportedCoinOptions}
              </select>
              <br />
              <TutorialPopup content="The amount of FZL staked will determine the Max Pool Size. 50% of your FZL will be burnt and another 50% will be sent to stakers after the match has ended successfully.">
                <p className="m-0" style={{ textAlign: "left" }}>
                  Pool Creation Fee in FZL
                </p>
              </TutorialPopup>
              <input
                className="text-input"
                type="number"
                value={calAmount}
                id="calAmountInput"
                min="0"
                onChange={(e) => {
                  setCalAmount(e.target.value);
                }}
              />
              <br />
              <TutorialPopup content="This is the maximum amount of cryptocurrency from all players which the Pool can accept.">
                <p className="m-0" style={{ textAlign: "left" }}>
                  Max Pool Size in {selectedCoin.label}{" "}
                </p>
              </TutorialPopup>
              <div className="form-inline">
                <input
                  className="text-input"
                  type="number"
                  value={maxPoolSize}
                  id="maxPoolSizeInput"
                  min="0"
                  onChange={(e) => {
                    setMaxPoolSize(e.target.value);
                  }}
                  style={{ maxWidth: "300px", marginBottom: 0 }}
                />
                <button
                  className="btn btn-warning"
                  type="button"
                  onClick={() =>
                    setMaxPoolSize(
                      getPoolSizeLimit(selectedCoin.label)
                    )
                  }
                  style={{
                    marginTop: "10px",
                    minWidth: "90px",
                    marginLeft: "10px",
                  }}
                >
                  <small className="px-2">UNLIMITED</small>
                </button>
              </div>
              <br />
              <div className="row">
                <input
                  type="range"
                  className="form-range ml-5"
                  style={{ width: "500px" }}
                  max={getPoolSizeLimit(selectedCoin.label)}
                  min={getPoolSizeMax(selectedCoin.label)}
                  step="0.005"
                  value={maxPoolSize}
                  onChange={(e) => {
                    setMaxPoolSize(e.target.value);
                  }}
                />
              </div>
              <br />
              <TutorialPopup content="All plays will be refunded if pool does not reach this size.">
                <p className="m-0" style={{ textAlign: "left" }}>
                  Min pool size
                </p>
              </TutorialPopup>
              <input
                className="text-input"
                type="number"
                min="0"
                {...bindMinPoolSize}
              />
              <br />
              <TutorialPopup content="This is the percentage of the Winning plays given to you as a reward for starting the pool. Please note that it is NOT based on total plays played in the pool.">
                <p className="m-0" style={{ textAlign: "left" }}>
                  Pool Fee (%), max: 95%
                </p>
              </TutorialPopup>
              <input
                className="text-input"
                type="number"
                min="0"
                {...bindFee}
                max="95"
              />
              <br />
              <TutorialPopup content="The minimum amount of cryptocurrencies a player can play with.">
                <p className="m-0" style={{ textAlign: "left" }}>
                  Minimum Play Size in {selectedCoin.label} per player
                </p>
              </TutorialPopup>
              <input
                className="text-input"
                type="number"
                {...bindMinBet}
                min="0"
              />
              <br />

              <div className="form-check" style={{ textAlign: "left" }}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  id="flexCheckDefault"
                ></input>
                <TutorialPopup content=" If enabled, this pool can only be played by addresses which you have whitelisted. Only whitelisted addresses can view and join this private pool.">
                  <label
                    className="form-check-label black"
                    htmlFor="flexCheckDefault"
                  >
                    Private Pool
                  </label>
                </TutorialPopup>
              </div>
              {isPrivate && (
                <WhiteListPanel
                  whitelist={whitelist}
                  updateWhitelist={setWhitelist}
                />
              )}
            </form>
          </div>
        </div>
        <div style={{ marginBottom: 100 }}>
          <button
            disabled={canApproveCreate ? false : true}
            className={`${canApproveCreate ? "yellow" : "grey"}-btn`}
            style={{
              marginBottom: 100,
              width: "-webkit-fill-available",
              padding: "8px 4px",
              margin: "24px 48px",
            }}
            onClick={approved ? clickCreatePool : approveCal}
          >
            {approved ? "Create Pool" : "Approve FZL"}
          </button>
        </div>
      </div>
    </Main>
  );
};

export default connect(null, { getMatches, createPool })(CreatePool);
