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
    }
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
            profilePicture: "https://scontent.cdninstagram.com/v/t51.29350-15/116007663_2971510962975451_2540312586520375176_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=8ae9d6&_nc_ohc=jHT5B84rqzgAX-H9hA8&_nc_ht=scontent.cdninstagram.com&oh=61c7422cbaf470935836a5af0f890b0e&oe=60B2788B",
            username: "tejas_cricketer",
            fullName: "Tejas S",
            noOfPosts: 10,
            follows: 100,
            followedBy: 100,
            modalIsOpen: false,
            fullNameRequired: "dispNone",
            newName: "",
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
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withStyles(styles)(Profile);