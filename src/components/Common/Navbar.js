import React, { useEffect } from "react";
import { shortenAddress } from "../../utils/Utils";
import { Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  updateCalBalance,
  updateAddress,
  updateChainId,
  updateEthBalance,
  updateUsdtBalance,
} from "../../redux/actions";
import { toast } from "react-toastify";
import "./Navbar.css";
import { getWeb3 } from "../../utils/Contracts";
import { CHAIN_ID } from "../../config";

const NavBar = (props) => {
  const {
    updateCalBalance,
    updateAddress,
    updateChainId,
    updateEthBalance,
    updateUsdtBalance,
    reload,
  } = props;
  const calBalance = useSelector((state) => state.calBalance);
  const usdtBalance = useSelector((state) => state.usdtBalance);
  const ethBalance = useSelector((state) => state.ethBalance);
  const address = useSelector((state) => state.address);
  const chainId = useSelector((state) => state.chainId);
  const ethereum = window.ethereum;
  const history = useHistory();

  const connectMetamask = () => {
    ethereum &&
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleAccountChange);
  };

  useEffect(() => {
    if (chainId && Number(chainId) != CHAIN_ID) {
      toast.error("We currently only support Ethereum Network");
    } else if (ethereum) {
      updateCalBalance(address);
      updateUsdtBalance(address);
      updateEthBalance(address);
    }
  }, [address, chainId, reload]);

  useEffect(() => {
    ethereum &&
      ethereum.request({ method: "eth_chainId" }).then((chainId) => {
        updateChainId(Number(chainId));
      });
    ethereum &&
      ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
      });
  }, []);

  const handleAccountChange = (accounts) => {
    if (accounts.length) {
      updateAddress(accounts[0]);
      getWeb3();
    }
  };

  useEffect(() => {
    ethereum &&
      ethereum.request({ method: "eth_accounts" }).then(handleAccountChange);

    ethereum && ethereum.on("accountsChanged", handleAccountChange);
    return () =>
      ethereum &&
      ethereum.removeListener("accountsChanged", handleAccountChange);
  }, []);

  if (!ethereum) {
    toast.error("Please install Metamask extension");
  }

  return (
    <div className="header" style={{ backgroundColor: "#7f0000" }}>
      {/*  header */}
      <div className="container" >
        <div className="row" style={{ alignItems: "center" }}>
          <div className="col-md-1 p-0">
            <div
              className="logo ml-3"
            >
              <a href="/">
                <img style={{ width: "64px" }} src="/images/cropped-cropped-cropped-Fuzanglong-Logo-1.png" />
              </a>
            </div>
          </div>
          <div className="col-md-8">
            <div className="container pt-1" >
              <div className="row">
                <div
                  className="col-md-12 my-auto p-0"
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="balance-box mt-2"
                    style={{ marginRight: 16 }}
                  >
                    <span>{address ? usdtBalance.toFixed(2) : "0.00"} USDT</span>
                  </div>
                  <div
                    className="balance-box mt-2"
                    style={{ marginRight: 16 }}
                  >
                    <span>{address ? ethBalance.toFixed(8) : "0.00"} ETH</span>
                  </div>
                  <div
                    className="balance-box mt-2"
                  >
                    <span>{address ? calBalance.toFixed(2) : "0.00"} FZL</span>
                  </div>
                  <button
                    className="yellow-btn d-none d-md-block ml-3 mt-2"
                    onClick={() => window.open("https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&outputCurrency=0xa5e23e0191605241f11854816ad5971ef6919f4c&inputCurrency=ETH")}
                    style={{ height: 33, borderRadius: 4, fontSize: 13, fontWeight: "bold", minWidth: 90 }}
                  >
                    BUY FZL
                  </button>
                  <a className="d-none d-md-block mt-2 ml-2" href="https://t.me/fuzanglongcave" target="_blank">
                    <img src="/images/reddit.png" style={{ width: 34, height: 34 }} />
                  </a>
                  <a className="d-none d-md-block mt-2" href="https://twitter.com/FUZANGLONGio" target="_blank">
                    <img
                      src="/images/twitter.png"
                      style={{ width: 32, marginRight: 16 }}
                    />
                  </a>
                </div>
              </div>
              <div className="row">
                <div style={{ marginLeft: "-8px" }}>
                  <div className="container" style={{ padding: 0 }}>
                    <nav className="navbar navbar-expand-lg navbar-light">

                      <button
                        className="navbar-toggler bg-white mr-3"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"

                      >
                        <span className="navbar-toggler-icon" />
                      </button>
                      <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav navbar-right mx-auto">
                          <li className="nav-item d-md-none">
                            <div className="d-flex px-2" style={{ justifyContent: "space-between", alignItems: "center" }}>
                              <button
                                className="yellow-btn"
                                onClick={() => window.open("https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&outputCurrency=0xa5e23e0191605241f11854816ad5971ef6919f4c&inputCurrency=ETH")}
                              >
                                <span>BUY FZL</span>
                              </button>
                              {address ? (
                                <div className="metamask-btn" align="right">
                                  <span className="address-head small-text">
                                    {shortenAddress(address)}
                                  </span>
                                </div>
                              ) : (
                                <div
                                  className="metamask-btn"
                                  align="right"
                                >
                                  <button
                                    className="yellow-btn"
                                    onClick={connectMetamask}
                                  >
                                    <span>Connect Metamask</span>
                                  </button>
                                </div>
                              )}
                            </div>

                          </li>
                          <li className="nav-item">
                            <div
                              className="nav-link-box dropdown-toggle "
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                              style={{ cursor: "pointer", color: "#ffffff" }}
                            >
                              <span className="tab-list bold">Pools</span>
                            </div>

                            <div
                              className="dropdown-menu"
                              style={{
                                backgroundColor: "#0f1f38",
                                marginLeft: "20%",
                              }}
                            >
                              <div className="col ">
                                <div className="row justify-content-center">
                                  <button
                                    className="border-btn"
                                    onClick={() => history.push("/pools")}
                                    style={{ width: "90%" }}
                                  >
                                    Join Pool
                                  </button>
                                </div>
                                <div className="row  justify-content-center">
                                  <button
                                    className="border-btn mt-2"
                                    onClick={() => history.push("/create-pool")}
                                    style={{ width: "90%" }}
                                  >
                                    Start Pool
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                          {/* <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/lottery" className="nav-link">
                      Lottery
                    </Link>
                  </div>
                </li> */}
                          <li className="nav-item">
                            <div className="nav-link-box">
                              <Link to="/tutorials" className="nav-link">
                                Tutorials
                              </Link>
                            </div>
                          </li>
                          <li className="nav-item">
                            <div className="nav-link-box">
                              <Link to="/staking" className="nav-link">
                                Earn Rewards
                              </Link>
                            </div>
                          </li>
                          {/*
                <li className="nav-item">
                  <div className="nav-link-box">
                    <Link to="/affiliate" className="nav-link">
                      Affiliates
                    </Link>
                  </div>
                </li> */}
                          <li className="nav-item">
                            <div className="nav-link-box">
                              <Link to="/about" className="nav-link">
                                About Us
                              </Link>
                            </div>
                          </li>
                          <li className="nav-item">
                            <div className="nav-link-box">
                              <Link to="/my-pool" className="nav-link">
                                My Pools
                              </Link>
                            </div>
                          </li>
                          <li className="nav-item">
                            <div className="nav-link-box">
                              <Link to="/my-page" className="nav-link">
                                My Page
                              </Link>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            {address ? (
              <div className="metamask-btn my-auto d-none d-md-block" align="right">
                <span className="address-head small-text">
                  {shortenAddress(address)}
                </span>
              </div>
            ) : (
              <div
                className="metamask-btn my-auto d-none d-md-block"
                align="right"
              >
                <button
                  className="connect-meta-button d-none d-md-block"
                  onClick={connectMetamask}
                >
                  <span>Connect Metamask</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    // <Row className='px-4 py-3 bg-secondary text-white justify-content-between'>
    //     <Col xs={4}>
    //         <Row>
    //             <Col xs={2}>
    //                 <Link to='/swap' className='text-white'>Swap</Link>
    //             </Col>
    //             <Col xs={2}>
    //                 <Link to='/pools' className='text-white'>Pools</Link>
    //             </Col>
    //             <Col xs={3}>
    //                 <Link to='/staking' className='text-white'>Staking</Link>
    //             </Col>
    //             <Col xs={3}>
    //                 <Link to='/affiliate' className='text-white'>Affiliate</Link>
    //             </Col>
    //             <Col xs={2}>
    //                 <Link to='/faucet' className='text-white'>Faucet</Link>
    //             </Col>

    //         </Row>
    //     </Col>
    //     <Col xs={8}>
    //         <Row>
    //             <Col xs={1}><Badge variant='info'>{getNetworkName(chainId)}</Badge></Col>
    //             <Col xs={2} className='justify-content-center'><Badge variant='info'>{usdtBalance.toFixed(1)} USDT</Badge></Col>
    //             <Col xs={2}><Badge variant='info'>{calBalance.toFixed(1)} FZL</Badge></Col>
    //             <Col xs={2}><Badge variant='info'>{ethBalance.toFixed(4)} ETH</Badge></Col>
    //             <Col xs={5} className='text-wrap'>
    //                 {   address ?
    //                     <Badge variant='info'>{address}</Badge> :
    //                     <Button variant='danger' onClick={connectMetamask}>Connect Metamask</Button>
    //                 }
    //             </Col>
    //         </Row>
    //     </Col>
    // </Row>
  );
};

export default connect(null, {
  updateCalBalance,
  updateAddress,
  updateChainId,
  updateEthBalance,
  updateUsdtBalance,
})(NavBar);
