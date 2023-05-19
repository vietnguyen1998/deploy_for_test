import React from "react";

export const TabItems = {
  all: "all",
  epl: "epl",
  laliga: "laliga",
  bundesliga: "bundesliga",
  italiaseriea: "italiaseriea",
  lol: "lol",
  dota: "dota 2",
  nba: "nba",
  rugby: "rugby",
  mma: "mma",
  valorant: "valorant",
  "cs:go": "cs:go"
};

export const TabName = {
  all: "All matches",
  epl: "English Premier League",
  laliga: "La Liga",
  bundesliga: "Bundesliga",
  italiaseriea: "Italia Serie A",
  lol: "League of Legends",
  dota: "Dota 2",
  nba: "NBA",
  rugby: "Rugby",
  mma: "MMA",
  valorant: "Valorant",
  "cs:go": "CS GO"
};

const Sidebar = (props) => {
  const { value, setValue } = props;
  return (
    <div
      className="tab wow fadeInUp"
      data-wow-duration="1s"
      data-wow-delay="0s"
    >
      <div className="row ">
        <button
          className={`tablinks ${value === TabItems["all"] ? "active" : ""}`}
          onClick={() => setValue && setValue(TabItems["all"])}
        >
          <span className="tab-list bold">{TabName["all"]}</span>
        </button>
      </div>

      <div className="row ">
        <button
          type="button"
          className={`dropdown-toggle tablinks ${value === TabItems["epl"] ||
              value === TabItems["laliga"] ||
              value === TabItems["bundesliga"] ||
              value === TabItems["italiaseriea"]
              ? "active"
              : ""
            }`}
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span className="tab-list bold">Soccer</span>
        </button>
        <div className="dropdown-menu" style={{ backgroundColor: "#1E1E1E" }}>
          <button
            className={`tablinks ${value === TabItems["epl"] ? "active" : ""}`}
            onClick={() => setValue && setValue(TabItems["epl"])}
          >
            <span className="tab-list bold">{TabName["epl"]}</span>
          </button>
          <button
            className={`tablinks ${value === TabItems["laliga"] ? "active" : ""
              }`}
            onClick={() => setValue && setValue(TabItems["laliga"])}
          >
            <span className="tab-list bold">{TabName["laliga"]}</span>
          </button>
          <button
            className={`tablinks ${value === TabItems["bundesliga"] ? "active" : ""
              }`}
            onClick={() => setValue && setValue(TabItems["bundesliga"])}
          >
            <span className="tab-list bold">{TabName["bundesliga"]}</span>
          </button>
          <button
            className={`tablinks ${value === TabItems["italiaseriea"] ? "active" : ""
              }`}
            onClick={() => setValue && setValue(TabItems["italiaseriea"])}
          >
            <span className="tab-list bold">{TabName["italiaseriea"]}</span>
          </button>
        </div>
      </div>
      {/* nba */}
      <div className="row ">
        <button
          className={`tablinks ${value === TabItems["nba"] ? "active" : ""}`}
          onClick={() => setValue && setValue(TabItems["nba"])}
        >
          <span className="tab-list bold">{TabName["nba"]}</span>
        </button>
      </div>

      {/* mma */}
      <div className="row ">
        <button
          className={`tablinks ${value === TabItems["mma"] ? "active" : ""}`}
          onClick={() => setValue && setValue(TabItems["mma"])}
        >
          <span className="tab-list bold">{TabName["mma"]}</span>
        </button>
      </div>
      {/* rugby */}
      <div className="row ">
        <button
          className={`tablinks ${value === TabItems["rugby"] ? "active" : ""}`}
          onClick={() => setValue && setValue(TabItems["rugby"])}
        >
          <span className="tab-list bold">{TabName["rugby"]}</span>
        </button>
      </div>
      <div className="row">
        <button
          type="button"
          className={`dropdown-toggle tablinks ${value === TabItems["lol"] || value === TabItems["dota"]
              ? "active"
              : ""
            }`}
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span className="tab-list bold">Esports</span>
        </button>
        <div className="dropdown-menu" style={{ backgroundColor: "#1E1E1E" }}>
          <button
            className={`tablinks ${value === TabItems["dota"] ? "active" : ""}`}
            onClick={() => setValue && setValue(TabItems["dota"])}
          >
            <span className="tab-list bold">{TabName["dota"]}</span>
          </button>
          <button
            className={`tablinks ${value === TabItems["lol"] ? "active" : ""}`}
            onClick={() => setValue && setValue(TabItems["lol"])}
          >
            <span className="tab-list bold">{TabName["lol"]}</span>
          </button>
          <button
            className={`tablinks ${value === TabItems["valorant"] ? "active" : ""}`}
            onClick={() => setValue && setValue(TabItems["valorant"])}
          >
            <span className="tab-list bold">{TabName["valorant"]}</span>
          </button>
          <button
            className={`tablinks ${value === TabItems["cs:go"] ? "active" : ""}`}
            onClick={() => setValue && setValue(TabItems["cs:go"])}
          >
            <span className="tab-list bold">{TabName["cs:go"]}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
