import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Profile.css';
import Header from '../../common/header/Header';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            accessToken:sessionStorage.getItem("access-token"),
        }
    }

    render() {
        return(
            <div>
                {this.state.isLoggedIn === false ?
                    <Redirect to= "/"/>
                    :
                    <div>
                        <Header profilePicture={this.state.profilePicture} showSearchBox={false} showProfileIcon={this.state.isLoggedIn ? true : false} showMyAccount={false} />
                        Profile Page
                    </div>
                }
            </div>
        );
    }
}

export default Profile;