import React, {Component} from 'react';
import Header from '../../common/header/Header';
import './Home.css';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';

// Custom Styles to over ride material ui default styles
const styles = (theme => ({
    grid: { //style for the grid component 
        padding: "20px",
        marginLeft: "10%",
        marginRight: "10%",
    },
    card: { //style for the card component 
        maxWidth: "100%",
    },
    avatar: { //style for the avatar in the card header 
        margin: 10,
        width: 60,
        height: 60,
    },
    title: { //Style for the title of the card 
        'font-weight': '600',
    },
    media: { // style for the image in the card
        height: "56.25%",
        width: "100%",
    },
}));

class Home extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            profilePicture: "",
            accessToken: sessionStorage.getItem("access-token"),
            mediaIdsAndCaptions: [],
            imageData: [],
            defaultCount: 1,
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

    // This method increments and decrements the number of like and adds the userLiked and count to object
    likeBtnHandler = (imageId) => {
        let obj = this.state.imageData.find(element => element.id === imageId);

        if (obj.userLiked === true) { // if user already liked the image then decrement the count
            obj.count = obj.count - 1;
            obj.userLiked = false;
            this.setState({});
        } else { // if user didn't like the image then increment the count and set userLiked to true
            obj.count = this.state.defaultCount + 1;
            obj.userLiked = true;
            this.setState({});
        }
    }

    render() {
        // custom styles are stored in the const classes
        const { classes } = this.props;
        var { defaultCount } = this.state;

        return(
            <div>
                {this.state.isLoggedIn === false ?
                    <Redirect to= "/"/>
                    :
                    <div>
                        <Header profilePicture={this.state.profilePicture} showSearchBox={this.state.isLoggedIn ? true : false} showProfileIcon={this.state.isLoggedIn ? true : false}/>
                        <div className="flex-container">
                            <Grid container spacing={3} wrap="wrap" alignContent="center" className={classes.grid}>
                                {/* Iteration over imageData array and render each element of array */}
                                {this.state.imageData.map(image => (           
                                    <Grid key={image.id} item xs={12} sm={6}>
                                        <Card className={classes.card}>
                                            <CardHeader classes={{ title: classes.title,}}
                                                avatar={ <Avatar src={this.state.profilePicture} className={classes.avatar}></Avatar>}
                                                title={image.username} subheader={image.date + " " + image.time} className={classes.cardheader}
                                            />
                                            <CardContent id="card-content">
                                                <img src={image.media_url} alt="profileImage" className={classes.media} />
                                                <div className="horizontal-line"></div>
                                                <div className="image-caption">
                                                    {image.caption.split("\n#")[0]}
                                                </div>
                                                <div className="image-hashtags">
                                                    {image.caption.split("\n#")[1] !== undefined ? "#"+image.caption.split("\n#")[1] : image.caption.split("\n#")[1]}
                                                </div>

                                                {/* like button */}
                                                <div>
                                                    <IconButton id="like-button" aria-label="like-button" onClick={() => this.likeBtnHandler(image.id)}>
                                                        {/* Border is red if user already liked the image else border is displayed */}
                                                        {image.userLiked === undefined || image.userLiked === false ? 
                                                            <FavoriteBorderIcon className="like-icon" fontSize="large" /> : <FavoriteIcon className="liked-icon" fontSize="large" />}
                                                    </IconButton>
                                                    {/* if count is 1, like is displayed else likes is displayed*/}
                                                    {image.count === undefined ? 
                                                        defaultCount === 1 ? <span>{defaultCount} like</span> : <span>{defaultCount} likes</span> 
                                                        : 
                                                        image.count === 1 ? <span>{image.count} like</span> : <span>{image.count} likes</span>
                                                    }
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>  
                        </div> 
                    </div> 
                }
            </div>
        );
    }
}

export default withStyles(styles)(Home);