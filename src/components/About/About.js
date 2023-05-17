import React from "react";
import Main from "../Common/Main";

const About = () => {
  return (
    <Main>
      <div className="container body-section">
        <h3 className="black bold">What Is Fuzanglong</h3>
        <p className="grey mt-4">
        Fuzanglong is a Gaming-as-a-DeFi (GAAD) platform. We are not operators
          nor do we hold any database of players. Decentralization is the main
          theme in Fuzanglong. All pools are started by individuals who are keen to
          setup their own game. Fuzanglong GaaD platform gives freedom for anyone
          to operate their own gaming community.
          <br />
          <br />
          Use Fuzanglong at your own risk. Only play with what you can afford to
          lose.
        </p>
        <a href="https://drive.google.com/file/d/16Q8BBtqAQfM_U0aX4iVNWA9WiVu7cFw4/view?usp=share_link" target="_blank">
          [Download Whitepaper]
        </a>
      </div>
    </Main>
  );
};

export default About;
