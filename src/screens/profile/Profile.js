import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Profile.css';
import Header from '../../common/header/Header';
import { Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import Modal from '@material-ui/core/Modal';
import InputLabel from "@material-ui/core/InputLabel";
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const styles = theme => ({
    fab: {
        margin: theme.spacing(1.5),
        marginTop: 0,
    },
    paper: {
        backgroundColor: "#fff",
        boxShadow: theme.shadows[5],
        padding: '25px 20px',
    },
    modal: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridListMain: {
        transform: 'translateZ(0)',
        cursor: 'pointer',
    },
    modalStyle: {
        display: 'flex',
        flexDirection: 'row',
        width: 800,
        height: 400,
        marginTop: 100,
        marginLeft: 300,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: "30px",
    },
})

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0}}>{props.children}</Typography>
    );
}

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            accessToken:sessionStorage.getItem("access-token"),
            imageData: [],
            profilePicture: "",
            username: "tejas_cricketer",
            fullName: "Tejas S",
            noOfPosts: 10,
            follows: 100,
            followedBy: 100,
            modalIsOpen: false,
            fullNameRequired: "dispNone",
            newName: "",
            imageModalIsOpen: false,
            currentImageId: "",
            currentImage: "",
            currentProfilePicture: "",
            currentImgName: "",
            currentCaption: "",
            currentTags: "",
            userLiked: false,
            currentLikeStatus: "",
            defaultLikes: 1,
            likeCounts: "",
        }
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

                        if(i === 0) { // Since there is no Api to get profile picture, used 1st image from the response as profile picture
                            this.setState({ profilePicture: json.media_url });
                        }
                    })
                })
            })
        } 
    }

    // Sets state of modalIsOpen to true when EditIcon button is clicked
    fullNameEditOpenModalHandler = () => {
        this.setState({modalIsOpen: true});
    };

    // Sets state of modalIsOpen to false when clicked anywhere outside modal
    fullNameEditCloseModalHandler = () => {
        this.setState({modalIsOpen: false, fullNameRequired: "dispNone"});
    };

    // Stores User input for full name in the newName state variable
    editFullNameHandler = (e) => {
        this.setState({ newName: e.target.value });
    }

    // On click of the update button, the name input is saved to fullName and close the modal and if input is empty then "required" is displayed
    updateFullNameHandler = () => {
        this.state.newName === "" ? this.setState({ fullNameRequired: "dispBlock" }) : this.setState({
            fullNameRequired: "dispNone",
            fullName: this.state.newName,
            newName: "",
            modalIsOpen: false
        });
    }

    // Sets the clicked image details in the state variable
    imageClickHandler = (image) => {
        this.setState({
            imageModalIsOpen: true,
            currentImageId: image.id,
            currentImage: image.media_url,
            currentProfilePicture: this.state.profilePicture,
            currentImgName: this.state.fullName,
            currentCaption: image.caption,
            currentTags: image.hastags,
            currentLikeStatus: this.state.userLiked, //***change needed
            likeCounts: this.state.defaultLikes, //***changes needed
        });
    }

    // Sets imageCloseModalHandler to false when clicked outside the modal
    imageCloseModalHandler = () => {
        this.setState({ imageModalIsOpen: false });
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
                                    <div><span className="profile-fullname">{this.state.fullName}</span>
                                        <Fab color="secondary" aria-label="edit" className={classes.fab} onClick={this.fullNameEditOpenModalHandler}>
                                            <EditIcon />
                                        </Fab>
                                    </div>
                                </Typography>

                                {/* Edit Icon modal */}
                                <Modal className={classes.modal} open={this.state.modalIsOpen} onClose={this.fullNameEditCloseModalHandler} aria-labelledby="edit-icon">
                                    <div className={classes.paper}>
                                        <h2 className="heading-h2">Edit</h2>
                                        <TabContainer>
                                            <FormControl required>
                                                <InputLabel htmlFor="fullname">Full Name</InputLabel>
                                                <Input id="fullname" type="text" fullname={this.state.fullName} onChange={this.editFullNameHandler} />
                                                <FormHelperText className={this.state.fullNameRequired}><span className="red">required</span></FormHelperText>
                                            </FormControl><br />
                                        </TabContainer><br />
                                        <Button variant="contained" color="primary" onClick={this.updateFullNameHandler}>UPDATE</Button>
                                    </div>
                                </Modal> 
                            </div>
                            <div className="images-container">
                                <GridList cellHeight={350} cols={3} className={classes.gridListMain}>
                                    {this.state.imageData.map(image => (
                                        <GridListTile onClick={() => this.imageClickHandler(image)} className="image-grid-item" key={"grid" + image.id}>
                                            <img src={image.media_url} alt={image.id} />
                                        </GridListTile>
                                    ))}
                                </GridList>
                                <Modal className={classes.imageModal} open={this.state.imageModalIsOpen} onClose={this.imageCloseModalHandler} aria-labelledby="individual-image-modal">
                                    <div className={classes.modalStyle}>
                                        <div className="image-modal-left">
                                            <img className="clicked-image" src={this.state.currentImage} alt={this.state.currentImgName} />
                                        </div>
                                        <div className="image-modal-right">
                                            <img className="image-modal-profile-icon" src={this.state.currentProfilePicture} alt={this.state.fullName} />
                                            <span className="image-modal-username">{this.state.username}</span>
                                            <div className="horizontal-line"></div>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withStyles(styles)(Profile);