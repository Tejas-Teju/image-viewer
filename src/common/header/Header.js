import React, { Component } from "react";
import './Header.css';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
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
                        : "" //Do not display search box
                    }

                    {/* Profile picture is shown only when showProfileIcon is true */} 
                    {this.props.showProfileIcon ?  
                        <span>
                            <IconButton id="profile-icon">
                                <img src="https://scontent.cdninstagram.com/v/t51.29350-15/133727129_826954304812183_722079783531579720_n.jpg?_nc_cat=110&ccb=1-3&_nc_sid=8ae9d6&_nc_ohc=rdMfksgtV_cAX85t6nn&_nc_ht=scontent.cdninstagram.com&oh=74ab3881a52024243b3f4ab9ac0e2f2d&oe=60B12CC4" alt="profileImage" id="profile-picture" />
                            </IconButton>
                        </span>
                        : "" //Do not display profile picture
                    }
                </header>
            </div>
        )
    }
}

export default withStyles(styles)(Header);