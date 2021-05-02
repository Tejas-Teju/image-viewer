import React, {Component} from 'react';
import Header from '../../common/header/Header';
import { Redirect } from 'react-router-dom';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            profile_picture_id: "",
            profile_picture: "",
            accessToken: sessionStorage.getItem("access-token"),
        };
    }

    componentDidMount = () => {  
        // fetch data only when user is logged In
        if (this.state.isLoggedIn) {
            // fetch using 1st Api's URL
            fetch(this.props.baseUrl + "me/media?fields=id,caption&access_token=" + this.state.accessToken) 
            .then(function(response) {
                return response.json();
            })
            .then((json) => {
                // Since there is no Api to fetch profile picture used 1st image from the response as profile picture
                // used image Id to get profile picture
                this.setState({ profile_picture_id: json.data[0].id });
                // fetch using second Api's URL
                fetch(this.props.baseUrl + this.state.profile_picture_id + "?fields=id,media_type,media_url,username,timestamp&access_token=" + this.state.accessToken)
                .then(function(response) {
                    return response.json();
                })
                .then((json) => {
                    // set media url to send it to header for displaying profile picture
                    this.setState({ profile_picture: json.media_url });
                })
            })
        } 
    }

    render() {
        return(
            <div>
                {this.state.isLoggedIn === false ?
                    <Redirect to= "/"/>
                    :
                    <div>
                        <Header profile_picture={this.state.profile_picture} showSearchBox={this.state.isLoggedIn ? true : false} showProfileIcon={this.state.isLoggedIn ? true : false}/>
                    </div> 
                }
            </div>
        );
    }
}

export default Home;