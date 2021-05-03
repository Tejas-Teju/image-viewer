import React, {Component} from 'react';
import Header from '../../common/header/Header';
import './Home.css';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Custom Styles to over ride material ui default styles
const styles = (theme => ({
    grid: { //style for the grid component 
        padding: "20px",
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
        fontWeight: '600',
    },
    media: { // style for the image in the card
        height: "56.25%",
        width: "100%",
    },
    comment: { //for the form control
        flexDirection: "row",
        marginTop: "10px",
        alignItems: "baseline",
        justifyContent: "center",
    },
    addCommentBtn: { // ADD button styling 
        marginLeft: "15px",
    },
    commentUsername: {  //style for the userName of the comment
        fontSize: "inherit",
        fontWeight: '600',
    }
}));

class Home extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            profilePicture: "https://scontent.cdninstagram.com/v/t51.29350-15/116007663_2971510962975451_2540312586520375176_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=8ae9d6&_nc_ohc=jHT5B84rqzgAX-H9hA8&_nc_ht=scontent.cdninstagram.com&oh=61c7422cbaf470935836a5af0f890b0e&oe=60B2788B",
            accessToken: sessionStorage.getItem("access-token"),
            mediaIdsAndCaptions: [],
            imageData: [],
            defaultCount: 1,
            commentText: "",
            currentCommentId: "",
            searchOn: false,
            copyOfImageData: {},
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
                        json.caption = image.caption.split("\n#")[0]; // add a property caption to the current object by extracting it from mediaIdsAndCaptions array 
                        json.hastags = "";
                        image.caption.split(" ").forEach((element) => {
                            if(element[0] === "#") {
                                json.hastags = json.hastags + " " + element;
                            }
                        });
                        this.setState({ imageData: this.state.imageData.concat(json) }); // add each object to array imageData
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

    // This method sets the state of commentText using text entered
    onCommentTextChangeHandler = (e, imageId) => {
        this.setState({commentText: e.target.value, currentCommentId: imageId});
    }

    // On ADD button clicked, comments and comment count are added to comments array as JSON objects 
    AddBtnHandler = (imageId) => {
        let obj = this.state.imageData.find(element => element.id === imageId);

        if (this.state.commentText !== ""){ // Do not add comments if it is empty
            if(obj.comments === undefined) {
                obj.commentCount = 1;
                obj.comments = [{comment : this.state.commentText, commentCount : obj.commentCount, commentId: obj.id}];
                this.setState({commentText: ""});
            } else {
                obj.comments = [...obj.comments, {comment : this.state.commentText, commentCount : obj.commentCount + 1, commentId: obj.id}];
                obj.commentCount = obj.commentCount + 1;
                this.setState({commentText: ""});
            }
        }
    }

    // This method updates the imageData array based on "keyword" search
    onSearchTextChange = (keyword) => {
        if (!(keyword === "")) { //check if search input keyword value is empty
            var copyOfImageData = []; 
            /* copy of imagaData array based on searchOn value
               SearchOn value is true when any character is entered in search box and is true until keyword is null
               updatedImageArr - updated image array based on keyword
            */
            this.state.searchOn ? copyOfImageData = this.state.copyOfImageData : copyOfImageData = this.state.imageData;
            var updatedImageArr = []; 
            var searchOn = true; // 
            keyword = keyword.toLowerCase(); 
            
            copyOfImageData.forEach((element) => {
                var caption = element.caption.split("\n#")[0]; // extracting the caption
                caption = caption.toLowerCase();
                if (caption.match(keyword)) {  //matching keyword with caption 
                    updatedImageArr.push(element); //if any character matches push it to updatedImageArr 
                }
            })
            if (!this.state.searchOn) { // For the first search
                this.setState({
                    searchOn: searchOn,
                    images: updatedImageArr,
                    copyOfImageData: copyOfImageData,

                })
            } else { // Until keyword is null
                this.setState({                 
                    imageData: updatedImageArr,
                })
            }
        } else { // If keyword is null then search is false and assign copyOfImageData to imageData array and set copyOfImageData to empty array
            this.setState({
                searchOn: false,
                imageData: this.state.copyOfImageData,
                copyOfImageData: [],
            })

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
                        <Header profilePicture={this.state.profilePicture} showSearchBox={this.state.isLoggedIn ? true : false} showProfileIcon={this.state.isLoggedIn ? true : false} onSearchTextChange={this.onSearchTextChange} showMyAccount={true} />
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
                                                    {image.caption}
                                                </div>
                                                <div className="image-hashtags">
                                                    {image.hastags}
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
                                                
                                                {image.commentCount === undefined ? // if comment count is undefined then do not display anything
                                                    "" :
                                                    image.comments.map(element => (         //Iterating over comments array to show the comments to the corresponding image 
                                                        <div className="comment-display" key={element.commentCount}>
                                                            <Typography variant="subtitle2" className={classes.commentUsername} gutterbottom="true" >
                                                                {image.username}:
                                                            </Typography>
                                                            <Typography variant="body1" id="comment-text-alt" className="comment-text" gutterbottom="true">
                                                                {element.comment}
                                                            </Typography>
                                                        </div>
                                                    ))
                                                }

                                                {/* Input to add comment consist of Input ,InputLabel and ADD button */}
                                                <FormControl className={classes.comment} fullWidth={true}>
                                                    <InputLabel htmlFor={image.id} >Add a comment</InputLabel>
                                                    <Input id={image.id} className="comment-text" type="text" onChange={(event) => this.onCommentTextChangeHandler(event, image.id)} value={image.id === this.state.currentCommentId? this.state.commentText : ""}/>
                                                    <Button variant="contained" color="primary" className={classes.addCommentBtn} onClick={() => this.AddBtnHandler(image.id)}>
                                                        ADD
                                                    </Button>
                                                </FormControl>
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