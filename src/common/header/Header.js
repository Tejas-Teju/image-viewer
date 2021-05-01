import React, { Component } from "react";
import './Header.css';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme => ({
    searchText: {  //seach text styling 
        position: "relative",
        width: "100%",
        padding: "5px 0px 0px 5px",
    },
}));

class Header extends Component {
    render() {
        //custom Styles are stored in classes
        const { classes } = this.props;

        return (
            <div>
                <header className="app-header">
                    <a href='/' id="logo">Image Viewer</a>
                    {/* Search box shown only when showSearchBox is true */} 
                    {this.props.showSearchBox ?                  
                        <span className="header-searchbox">
                            <SearchIcon id="search-icon"></SearchIcon>
                            <Input className={classes.searchText} placeholder="Search…" disableUnderline={true} />
                        </span>
                        : <span></span> //Do not display search box
                    }
                </header>
            </div>
        )
    }
}

export default withStyles(styles)(Header);