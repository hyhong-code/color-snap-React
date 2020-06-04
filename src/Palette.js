import React, { Component } from "react";
import ColorBox from "./ColorBox";
import Navbar from "./Navbar";
import PaletteFooter from "./PaletteFooter";
import "./Palette.css";

class Palette extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 500,
      format: "hex",
    };
    this.changeLevel = this.changeLevel.bind(this);
    this.changeFormat = this.changeFormat.bind(this);
  }

  changeLevel(level) {
    this.setState({ level });
  }

  changeFormat(format) {
    this.setState({ format });
  }

  render() {
    const { colors, emoji, paletteName, id } = this.props.palette;
    const { level, format } = this.state;

    const colorBoxes = () => {
      return colors[level].map((color) => (
        <ColorBox
          key={color.id}
          background={color[format]}
          name={color.name}
          moreUrl={`/palette/${id}/${color.id}`}
          showLink
        />
      ));
    };

    return (
      <div className="Palette">
        <Navbar
          level={level}
          changeLevel={this.changeLevel}
          changeFormat={this.changeFormat}
          showSlider
        />
        <div className="Palette-colors">{colorBoxes()}</div>
        <PaletteFooter paletteName={paletteName} emoji={emoji} />
      </div>
    );
  }
}

export default Palette;
