import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Profile.css';
import Header from '../../common/header/Header';
import { Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';

const styles = theme => ({
    fab: {
        margin: theme.spacing(1.5),
        marginTop: 0,
    },
})

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            accessToken:sessionStorage.getItem("access-token"),
            profilePicture: "https://scontent.cdninstagram.com/v/t51.29350-15/116007663_2971510962975451_2540312586520375176_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=8ae9d6&_nc_ohc=jHT5B84rqzgAX-H9hA8&_nc_ht=scontent.cdninstagram.com&oh=61c7422cbaf470935836a5af0f890b0e&oe=60B2788B",
            username: "tejas_cricketer",
            fullName: "Tejas S",
            noOfPosts: 10,
            follows: 100,
            followedBy: 100,
        }
    }

    render() {
        //custom Styles are stored in classes
        const { classes } = this.props;

        return(
            <div>
                {this.state.isLoggedIn === false ?
                    <Redirect to= "/"/>
                    :
                    <div>
                        <Header profilePicture={this.state.profilePicture} showSearchBox={false} showProfileIcon={this.state.isLoggedIn ? true : false} showMyAccount={false} />
                        <div className="flex-container">
                            <div className="profile-picture">
                                <img className="profile-image" src={this.state.profilePicture} alt={this.state.fullName} />
                            </div>
                            <div className="profile-picture-summary">
                                <Typography id="profile-username" variant="h5" component="h5">{this.state.username}</Typography>
                                <Typography>
                                    <span> Posts: {this.state.noOfPosts} </span>
                                    <span className="spacing" > Follows: {this.state.follows} </span>
                                    <span className="spacing"> Followed By: {this.state.followedBy} </span>
                                </Typography>
                                <Typography variant="h6" component="h6">
                                    <div>{this.state.fullName}
                                        <Fab color="secondary" aria-label="edit" className={classes.fab}>
                                            <EditIcon />
                                        </Fab>
                                    </div>
                                </Typography>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withStyles(styles)(Profile);