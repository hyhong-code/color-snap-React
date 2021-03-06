import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import FormNav from "./FormNav";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Button from "@material-ui/core/Button";
import DraggableColorList from "./DraggableColorList";
import { ValidatorForm } from "react-material-ui-form-validator";
import { arrayMove } from "react-sortable-hoc";
import ColorPickerForm from "./ColorPickerForm";
import seedPalettes from "./seedPalettes";
import styles from "./styles/NewPaletteFormStyles";

class NewPaletteForm extends Component {
  static defaultProps = {
    paletteSize: 20,
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      curColor: "teal",
      newColorName: "",
      colors: seedPalettes[0].colors,
      newPaletteName: "",
    };
    this.updateCurColor = this.updateCurColor.bind(this);
    this.addNewColor = this.addNewColor.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeColorBox = this.removeColorBox.bind(this);
    this.clearPalette = this.clearPalette.bind(this);
    this.addRandomColor = this.addRandomColor.bind(this);
  }

  componentDidMount() {
    ValidatorForm.addValidationRule("isColorNameUnique", (value) => {
      return this.state.colors.every(
        (color) => color.name.toLowerCase() !== value.toLowerCase()
      );
    });
    ValidatorForm.addValidationRule("isColorUnique", (value) => {
      return this.state.colors.every(
        (color) => color.color !== this.state.curColor
      );
    });
    ValidatorForm.addValidationRule("isPeletteNameUnique", (value) => {
      return this.props.allPalettes.every(
        (palette) => palette.paletteName.toLowerCase() !== value.toLowerCase()
      );
    });
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  updateCurColor(newColor) {
    this.setState({ curColor: newColor.hex });
  }

  addNewColor() {
    const newColor = {
      color: this.state.curColor,
      name: this.state.newColorName,
    };
    this.setState((ps) => ({
      colors: [...ps.colors, newColor],
      newColorName: "",
    }));
  }

  handleChange(evt) {
    const { name, value } = evt.target;
    this.setState({ [name]: value });
  }

  handleSubmit(emoji) {
    const newColorName = this.state.newPaletteName;
    const newPalette = {
      paletteName: newColorName,
      id: newColorName.replace(/ /g, "-"),
      emoji,
      colors: this.state.colors,
    };
    this.props.savePalette(newPalette);
    this.props.history.push("/");
  }

  removeColorBox(removeColor) {
    const newColors = this.state.colors.filter(
      (color) => color.color !== removeColor
    );
    this.setState({ colors: newColors });
  }

  // For react-sortable-hoc
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ colors }) => ({
      colors: arrayMove(colors, oldIndex, newIndex),
    }));
  };

  clearPalette() {
    this.setState({ colors: [] });
  }

  addRandomColor() {
    const allColors = this.props.allPalettes.map((p) => p.colors).flat();
    let rand;
    let randomColor = allColors[rand];
    let isDuplicateColor = true;
    while (isDuplicateColor) {
      rand = Math.floor(Math.random() * allColors.length);
      randomColor = allColors[rand];
      isDuplicateColor = this.state.colors.some(
        (color) => color.name === randomColor.name
      );
    }

    this.setState({ colors: [...this.state.colors, randomColor] });
  }

  render() {
    const { classes, paletteSize } = this.props;
    const { open, colors, curColor, newColorName, newPaletteName } = this.state;
    const isPaletteFull = colors.length >= paletteSize;

    return (
      <div className={classes.root}>
        <FormNav
          open={open}
          newPaletteName={newPaletteName}
          handleDrawerOpen={this.handleDrawerOpen}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <div className={classes.container}>
            <Typography variant="h4" gutterBottom>
              SNAP A COLOR!
            </Typography>
            <div className={classes.buttons}>
              <Button
                className={classes.button}
                variant="contained"
                color="secondary"
                onClick={this.clearPalette}
              >
                Clear Palette
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={this.addRandomColor}
                disabled={isPaletteFull}
              >
                Random Color
              </Button>
            </div>
            <ColorPickerForm
              curColor={curColor}
              newColorName={newColorName}
              isPaletteFull={isPaletteFull}
              updateCurColor={this.updateCurColor}
              addNewColor={this.addNewColor}
              handleChange={this.handleChange}
            />
          </div>
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <DraggableColorList
            colors={colors}
            removeColorBox={this.removeColorBox}
            axis="xy"
            onSortEnd={this.onSortEnd}
            distance={15}
          />
        </main>
      </div>
    );
  }
}
export default withRouter(
  withStyles(styles, { withTheme: true })(NewPaletteForm)
);
