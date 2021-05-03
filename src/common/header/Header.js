import React, { Component } from "react";
import "./Header.css";
import SearchIcon from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { MenuList } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  searchText: {
    //styling for text inside search box
    position: "relative",
    width: "100%",
    padding: "5px 0px 0px 5px",
  },
  menuList: {
    //Styling for the menulist
    width: "150px",
    padding: "0px",
  },
  menuItems: {
    //Styling for the menu items
    textDecoration: "none",
    color: "#000",
  },
});

class Header extends Component {
  constructor() {
    super();
    this.state = {
      menuIsOpen: false,
      isLoggedIn: true,
    };
  }

  //This function is called when the profile icon is clicked
  profileButtonClickedHandler = (e) => {
    this.state.anchorEl
      ? this.setState({ anchorEl: null })
      : this.setState({ anchorEl: e.currentTarget });
    this.openMenuHandler();
  };

  //Handle the open/close menu when profile icon is clicked
  openMenuHandler = () =>
    this.setState({
      ...this.state,
      menuIsOpen: !this.state.menuIsOpen,
    });

  //This method is called when log out is clicked and clears access token in session storage
  onLogOutClickedHandler = () => {
    sessionStorage.removeItem("access-token"); //Clear access-token
    this.setState({
      isLoggedIn: false,
    });
  };

  // This is called when there are any changes in search box
  onSearchChangeHandler = (e) => {
    this.props.onSearchTextChange(e.target.value);
  };

  render() {
    //custom Styles are stored in classes
    const { classes } = this.props;

    return (
      <div>
        {this.state.isLoggedIn === false ? ( //If logged out then redirect to login page
          <Redirect to="/" />
        ) : (
          <div>
            <header className="app-header">
              <a href="/home" id="logo">
                Image Viewer
              </a>
              {/* Search box shown only when showSearchBox is true */}
              {this.props.showSearchBox ? (
                <span className="header-searchbox">
                  <SearchIcon id="search-icon" />
                  <Input
                    className={classes.searchText}
                    placeholder="Search…"
                    disableUnderline={true}
                    onChange={this.onSearchChangeHandler}
                  />
                </span>
              ) : (
                ""
              ) //Do not display search box
              }

              {/* Profile picture is shown only when showProfileIcon is true */}
              {this.props.showProfileIcon ? (
                <span>
                  <IconButton
                    id="profile-icon"
                    onClick={this.profileButtonClickedHandler}
                  >
                    <img
                      src={this.props.profilePicture}
                      alt="profileImage"
                      id="profile-picture"
                    />
                  </IconButton>
                  <Menu
                    id="profile-menu"
                    anchorEl={this.state.anchorEl}
                    open={this.state.menuIsOpen}
                    onClose={this.profileButtonClickedHandler}
                  >
                    <MenuList className={classes.menuList}>
                      {this.props.showMyAccount === true ? (
                        <div>
                          {/* Go to Profile page on clicking "My Account" */}
                          <Link
                            to={"/profile"}
                            className={classes.menuItems}
                            underline="none"
                            color={"default"}
                          >
                            <MenuItem className={classes.menuItems}>
                              My Account
                            </MenuItem>
                          </Link>
                          <div className="horizontal-line"> </div>
                        </div>
                      ) : (
                        ""
                      )}
                      {/* Go to Login page on clicking "Logout" */}
                      <MenuItem
                        className="menu-items"
                        onClick={this.onLogOutClickedHandler}
                      >
                        Logout
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </span>
              ) : (
                ""
              ) //Do not display profile picture
              }
            </header>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Header);
