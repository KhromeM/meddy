import React, { Component } from "react";

import Starfield from 'react-starfield'

export default class CustomStarfield extends Component {
  render() {
    return (
      <div>
        <Starfield
          starCount={1000}
          starColor={[255, 255, 255]}
          speedFactor={0.05}
          backgroundColor="black"
        />
      </div>
    );
  }
}
