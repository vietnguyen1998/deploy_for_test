import React, { useState, useEffect } from "react";
import Main from "../Common/Main";
import Sidebar, { TabItems } from "../Common/Sidebar";
import SortPanel, { SortItems, sortPools } from "../Common/SortPanel";
import "./Home.css";
import { connect, useSelector } from "react-redux";
import Pool from "../Pool/Pools/Pool";
import { getPools } from "../../redux/actions";
import InfoPanel from "./InfoPanel";
import FeaturePool from "./FeaturePool";

const Home = (props) => {
  const { getPools } = props;
  const [tab, setTab] = useState(TabItems.all);
  const [sort, setSort] = useState(SortItems.date);
  const pools = useSelector((state) => state.pools) || [];
  const address = useSelector((state) => state.address);
  const filterPools = pools
    .filter((el) => {
      if (!address || !el.isPrivate) return true;
      const whitelist =
        el.whitelist && el.whitelist.map((it) => it.toLowerCase());
      if (!whitelist) return true;
      return whitelist.includes(address.toLowerCase());
    })
    .filter((el) => (tab === TabItems.all ? true : tab === el.game.game))
    .sort((pool1, pool2) => {
      return sortPools(pool1, pool2, sort);
    });

  useEffect(() => {
    getPools();
  }, []);

  const poolItems = filterPools.slice(0, 6).map((el, id) => {
    return <Pool key={id} pool={el} delay={(id + 1) * 0.1} address={address} />;
  });

  const featurePoolItems = filterPools.slice(0, 3).map((el, id) => {
    return <FeaturePool key={id} pool={el} delay={(id + 1) * 0.2} />;
  });
  return (
    <Main>
      {/* <!-- Top banner --> */}
      <div
        className="bg-img banner-section"
        style={{
          backgroundPosition: "left",
          paddingTop: "84px"
        }}
      >
        <div className="container" style={{ paddingBottom: "400px" }}>
          <div className="row">
            <div className="col-md-6">
              <br />
              <br />
              <br />
              <br />
              <br />
              <p
                className="white banner-title wow fadeInLeft"
                data-wow-duration="1.2s"
                data-wow-delay="0s"
              >
                FUZANGLONG
              </p>
              <p
                className="white banner-bio wow fadeInLeft"
                data-wow-duration="1.2s"
                data-wow-delay="0.2s"
              >
                The world's first smart contract-based <br />  sports and e-sports prediction pool creator.{" "}
              </p>
              <br />
              <br />
              <div
                className="banner-btn wow fadeInLeft"
                data-wow-duration="1.2s"
                data-wow-delay="0.3s"
              >
                <a
                  href="/tutorials"
                  className="cus-btn bold"
                  style={{ padding: "16px 50px", textDecoration: "none" }}
                >
                  <span>Let's get started!</span>
                </a>
              </div>
            </div>
            <div className="col-md-6">
              <br />
              <img style={{ width: "570px" }} src="./images/FZL-Dragon.png" />
            </div>
          </div>

        </div>
      </div>

      {/* <!-- Pool section --> */}

      <div className="pool-section">
        <div className="container">
          <div className="row"  style={{paddingTop: 64, paddingBottom: 44}}>
            {/* <!-- Side bar -->  */}

            <div className="col-lg-3">
              <br />
              <div className="row mt-3">
                <div className="col-lg-2 col-1">
                  <img style={{ width: "40px" }} src="./images/icon.png" />
                </div>
                <div className="col-lg-10 col-11 my-auto">
                  <span
                    style={{
                      fontSize: "24px",
                      textTransform: "uppercase",
                      marginTop: "100px",
                    }}
                    className="white bold ml-2"
                  >
                    Hottest Pool
                  </span>
                </div>
              </div>
              <br />
              <div
                className="tab wow fadeInUp"
                data-wow-duration="1s"
                data-wow-delay="0s"
              >
                <Sidebar value={tab} setValue={setTab} />
              </div>
            </div>

            {/* <!--  Side bar contents --> */}

            <div className="col-lg-9">
              <br />
              <br />
              <h3 className="white bold mt-1">Featured Pools</h3>
              <br />
              <div id="q1" className="tabcontent">
                <div className="row">{featurePoolItems}</div>
                <br />

                {/* <!-- Other Pools -->  */}

                <div className="row">
                  <div className="col-md-5 col-5">
                    <h3 className="white bold">Other Pools</h3>
                  </div>

                  <div className="col-md-7 col-7" align="right">
                    <SortPanel value={sort} setValue={setSort} />
                  </div>
                </div>

                {/* <!-- Pool list table--> */}
                <div className="row">
                  <div className="col">
                    <div className="mx-3">{poolItems}</div>
                    <br />
                    <div align="right">
                      <a
                        href="/pools"
                        className="yellow yellow-link"
                        align="right"
                      >
                        See all Pools &gt;
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* // <!-- WHAT IS Fuzanglong.io? --> */}

        <InfoPanel />

        {/* <!-- FIXED BUTTON --> */}
        <div className="float">
          <a href="/create-pool">
            <button
              className="yellow-btn float-btn wow fadeInRight bold"
              data-wow-duration="1s"
              data-wow-delay="0.2s"
            >
              <span>Start Pool</span>
            </button>
          </a>
          <a href="/staking">
            <button
              className="yellow-btn float-btn wow fadeInRight bold"
              data-wow-duration="1s"
              data-wow-delay="0.4s"
            >
              <span>Earn Rewards</span>
            </button>
          </a>
          <a href="https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&outputCurrency=0xa5e23e0191605241f11854816ad5971ef6919f4c&inputCurrency=ETH" target="_blank">
            <button
              className="yellow-btn float-btn wow fadeInRight bold"
              data-wow-duration="1s"
              data-wow-delay="0.5s"
            >
              <span>Buy FZL Token</span>
            </button>
          </a>
        </div>
      </div>

      {/* <!-- Footer section  --> */}

      <footer style={{ backgroundColor: "#1E1E1E" }}>
        <div className="container" align="center">
          <br />
          <br />
          <br />
          <br />
          <img width="250px" src="/images/logo.png" />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </footer>
    </Main>
  );
};

export default connect(null, { getPools })(Home);
