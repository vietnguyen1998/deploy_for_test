import React from 'react';
import Main from '../Common/Main';

const Tutorial = () => {
  return (
    <Main>
      <div className="container body-section">
        <h2 className="white bold mb-4">How to Play</h2>
        <p className="" style={{color: "#ffe5e5"}}>We assume players will have the basic knowledge of transferring Ethereum-based digital tokens.</p>
        <p className="" style={{color: "#ffe5e5"}}>To play Fuzanglong, you will need the following:</p>
        <div className="row">
          <div className="col-md-1 col-1 mt-3" align="right" style={{ color: "#10C35C" }}>
            <i style={{ fontSize: '23px' }} className="fa fa-check"></i>
          </div>
          <div className="col-md-8 col-11">
            <p className="py-3 px-3 mb-2" style={{ backgroundColor: '#F7F7F8' }}>
              at least one of the three supported digital tokens:<br />
              1) ETH<br />
              2) FZL<br />
              3) USDT
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-1 col-1 mt-3" align="right" style={{ color: "#10C35C" }}>
            <i style={{ fontSize: '23px' }} className="fa fa-check"></i>
          </div>
          <div className="col-md-8 col-11">
            <p className="py-3 px-3 mb-2" style={{ backgroundColor: '#F7F7F8' }}>
              a metamask wallet (installed on Chrome browser)
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-1 col-1 mt-3" align="right" style={{ color: "#10C35C" }}>
            <i style={{ fontSize: '23px' }} className="fa fa-check"></i>
          </div>
          <div className="col-md-8 col-11">
            <p className="py-3 px-3 mb-0" style={{ backgroundColor: '#F7F7F8' }}>
              Chrome browser
            </p>
          </div>
        </div>
        <br /><br />
        <h3 className="white bold">How to Install Metamask on Chrome</h3>
        <p className="white">Go to <a href="https://metamask.io/" target="_blank">metamask.io</a></p>
      </div>
    </Main>
  );
}

export default Tutorial;