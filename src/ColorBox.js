import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles/ColorBoxStyles";

class ColorBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOverlay: false,
    };
    this.handleCopy = this.handleCopy.bind(this);
  }

  handleCopy() {
    this.setState({ showOverlay: !this.state.showOverlay }, () => {
      setTimeout(() => {
        this.setState({ showOverlay: !this.state.showOverlay });
      }, 1500);
    });
  }

  render() {
    const {
      background,
      name,
      moreUrl,
      showingFullPalette,
      classes,
    } = this.props;
    const { showOverlay } = this.state;

    return (
      <CopyToClipboard text={background} onCopy={this.handleCopy}>
        <div className={classes.colorBox} style={{ background }}>
          <div
            className={classNames(classes.copyOverlay, {
              [classes.showOverlay]: showOverlay,
            })}
            style={{ background }}
          />
          <div
            className={classNames(classes.copyMsg, {
              [classes.showMsg]: showOverlay,
            })}
          >
            <h1>Copied!</h1>
            <p className={classes.copyText}>{background}</p>
          </div>
          <div>
            <div className={classes.boxContent}>
              <span className={classes.colorName}>{name}</span>
            </div>
            <button className={classes.copyButton}>Copy</button>
          </div>
          {showingFullPalette && (
            <Link to={moreUrl} onClick={(evt) => evt.stopPropagation()}>
              <span className={classes.showMore}>More</span>
            </Link>
          )}
        </div>
      </CopyToClipboard>
    );
  }
}

export default withStyles(styles)(ColorBox);
