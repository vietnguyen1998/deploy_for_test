import React, { useState, useEffect } from "react";
import Main from "../Common/Main";
import useInput from "../hook/useInput";
import { getStaking, getCal, getSigner } from "../../utils/Contracts";
import { getEther, getWei } from "../../utils/Web3Utils";
import { connect, useSelector } from "react-redux";
import Addresses from "../../const/Address";
import { toast } from "react-toastify";

const Staking = () => {
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [totalPool, setTotalPool] = useState("0");
  const [stakeAmount, setStakeAmount] = useState("0");
  const [stakeIncome, setStakeIncome] = useState("0");
  const [stakeIncomeEth, setStakeIncomeEth] = useState("0");
  const [stakeIncomeUsdt, setStakeIncomeUsdt] = useState("0");
  const [amount, bindAmount, resetAmount] = useInput("0");
  const [approved, setApproved] = useState(false);

  const signer = getSigner();
  const stakingSC = getStaking();
  const calSC = getCal() && getCal().connect(signer);
  const stakingSigner = stakingSC && stakingSC.connect(signer);
  const address = useSelector((state) => state.address);

  useEffect(() => {
    getStakingDetail();
    const interval = setInterval(() => {
      getStakingDetail();
    }, 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [address, stakingSC, reload]);

  const getStakingDetail = () => {
    stakingSC &&
      address &&
      stakingSC.getCurrentState(address).then((res) => {
        setTotalPool(getEther(res._total));
        setStakeAmount(getEther(res._stakeAmount));
        setStakeIncome(getEther(res._stakeIncome));
        setStakeIncomeEth(getEther(res._stakeIncomeEth));
        setStakeIncomeUsdt(getEther(res._stakeIncomeUsdt));
      });
  };

  const approveCal = () => {
    setLoading(true);
    calSC &&
      address &&
      calSC
        .approve(Addresses.staking, getWei(amount))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApproved(true);
            toast.info("Approved successfully, can stake now.");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const stakeCal = () => {
    setLoading(true);
    stakingSigner &&
      address &&
      stakingSigner
        .stake(getWei(amount))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApproved(false);
            resetAmount();
            getStaking();
            setReload(!reload);
            toast.info("You staked successfully.");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const claimStake = () => {
    setLoading(true);
    stakingSigner &&
      address &&
      stakingSigner
        .claimTokens()
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            getStaking();
            setReload(!reload);
            toast.info("Claim stake successfully.");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };
  return (
    <Main reload={reload} loading={loading} setLoading={setLoading}>
      <div className="container body-section">
        <h2 className="bold white mb-4">Earn Rewards</h2>
        <p style={{color: "#ffe5e5"}}>
          Earn Rewards allows you to Stake FZL in Fuzanglong DeFi and be rewarded
          with FZL
        </p>
        <br />
        <span className="bold white">Stake Now</span>
        <div className="row">
          <div className="col-md-6 col-12">
            <form className="mt-3"  style={{color: "#ffe5e5"}}>
              <span>Input Amount Of FZL to Stake</span>
              <br />
              <input
                style={{ width: "90%" }}
                className="text-input mr-2"
                type="number"
                placeholder="Enter number"
                {...bindAmount}
                min="0"
              ></input>
              <span className="white">FZL</span>
              <br />
            </form>
            <div>
              <button
                className={`yellow-btn mt-2 mr-3`}
                style={{height: 35}}
                onClick={approved ? stakeCal : approveCal}
              >
                {approved ? "Stake" : "Approve FZL"}
              </button>
            </div>
            <br />
            <br />
            <hr />
            <span className="mr-3"  style={{color: "#ffe5e5"}}>Total Pool:</span>
            <span className="white bold">{totalPool} FZL</span>
            <br />
            <span className="mr-3"  style={{color: "#ffe5e5"}}>Your Current FZL Staked:</span>
            <span className="white bold">
              {stakeAmount} FZL (
              {(totalPool == 0 ? 0 : (stakeAmount * 100) / totalPool).toFixed(
                2
              )}
              %)
            </span>
            <br />
            <span className="mr-3"  style={{color: "#ffe5e5"}}>Your Earned FZL:</span>
            <span className="white bold">{stakeIncome} FZL</span>
            <br />
            <span className="mr-3"  style={{color: "#ffe5e5"}}>Your Earned ETH:</span>
            <span className="white bold">{stakeIncomeEth} ETH</span>
            <br />
            <span className="mr-3" style={{color: "#ffe5e5"}}>Your Earned USDT:</span>
            <span className="white bold">{stakeIncomeUsdt} USDT</span>
            <br />
            <br />
            {stakeAmount > 0 && (
              <button className={`yellow-btn mt-2`} onClick={claimStake}>
                Claim Stake
              </button>
            )}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default connect(null)(Staking);
