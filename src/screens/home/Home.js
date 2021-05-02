import React, {Component} from 'react';
import Header from '../../common/header/Header';
import { Redirect } from 'react-router-dom';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            profilePicture: "",
            accessToken: sessionStorage.getItem("access-token"),
            mediaIdsAndCaptions: [],
            imageData: [],
        };
    }

    componentDidMount = () => {  
        // fetch data only when user is logged In
        if (this.state.isLoggedIn) {
            // fetch media ID and Caption using 1st Api
            fetch(this.props.baseUrl + "me/media?fields=id,caption&access_token=" + this.state.accessToken) 
            .then(function(response) {
                return response.json();
            })
            .then((json) => {
                // Storing media objects as an array of objects in state variable called mediaIdsAndCaptions
                this.setState({ mediaIdsAndCaptions: json.data });
                
                // loop through each object in mediaIdsAndCaptions array to get imageData
                this.state.mediaIdsAndCaptions.forEach((image, i) => {
                    // fetch id, media_type, media_url, username, timestamp using 2nd Api
                    fetch(this.props.baseUrl + image.id + "?fields=id,media_type,media_url,username,timestamp&access_token=" + this.state.accessToken)
                    .then(function(response) {
                        return response.json();
                    })
                    .then((json) => {
                        var d = new Date(json.timestamp); // extract timestamp from the json response
                        d = d.toLocaleString('en-GB').split(","); // convert it to local string in 24 hrs format and split it
                        json.date = d[0]; // after splitting data in 0th index is date, add a property date to the current object
                        json.time = d[1].trim(); // after splitting data in 1st index is time, add a property time to the current object
                        json.caption = image.caption; // add a property caption to the current object by extracting it from mediaIdsAndCaptions array 
                        this.setState({ imageData: this.state.imageData.concat(json) }); // add each object to array imageData

                        if(i === 0) { // Since there is no Api to get profile picture, used 1st image from the response as profile picture
                            this.setState({ profilePicture: json.media_url });
                        }
                    })
                })
            })
        } 
    }

    render() {
        const { imageData } = this.state;

        return(
            <div>
                {this.state.isLoggedIn === false ?
                    <Redirect to= "/"/>
                    :
                    <div>
                        <Header profilePicture={this.state.profilePicture} showSearchBox={this.state.isLoggedIn ? true : false} showProfileIcon={this.state.isLoggedIn ? true : false}/>
                        { imageData.map(e => {
                            return <img key={e.id} src={e.media_url} alt="Profile"/>   
                        })}   
                    </div> 
                }
            </div>
        );
    }
}

export default Home;