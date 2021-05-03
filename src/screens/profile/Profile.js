import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";
import "./Profile.css";
import Header from "../../common/header/Header";
import { Typography, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import Modal from "@material-ui/core/Modal";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

const styles = (theme) => ({
  fab: {
    margin: theme.spacing(1.5),
    marginTop: 0,
  },
  paper: {
    backgroundColor: "#fff",
    boxShadow: theme.shadows[5],
    padding: "25px 20px",
  },
  modal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  gridListMain: {
    transform: "translateZ(0)",
    cursor: "pointer",
  },
  modalStyle: {
    display: "flex",
    flexDirection: "row",
    width: 800,
    height: 400,
    marginTop: "7%",
    margin: "auto",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: "30px",
  },
  comment: {
    flexDirection: "row",
    marginTop: "5px",
    alignItems: "baseline",
    justifyContent: "center",
  },
  addCommentBtn: {
    marginLeft: "15px",
  },
  commentUsername: {
    fontSize: "inherit",
    fontWeight: "bolder",
  },
});

const TabContainer = function(props) {
  return (
    <Typography component="div" style={{ padding: 0 }}>
      {props.children}
    </Typography>
  );
};

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: sessionStorage.getItem("access-token") == null ? false : true,
      accessToken: sessionStorage.getItem("access-token"),
      imageData: [],
      profilePicture:
        "https://scontent.cdninstagram.com/v/t51.29350-15/116007663_2971510962975451_2540312586520375176_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=8ae9d6&_nc_ohc=jHT5B84rqzgAX-H9hA8&_nc_ht=scontent.cdninstagram.com&oh=61c7422cbaf470935836a5af0f890b0e&oe=60B2788B",
      username: "",
      fullName: "Tejas S",
      noOfPosts: "",
      follows: 100,
      followedBy: 100,
      modalIsOpen: false,
      fullNameRequired: "dispNone",
      newName: "",
      imageModalIsOpen: false,
      currentImage: {},
      currentProfilePicture: "",
      userLiked: false,
      defaultLikes: 2,
      commentText: "",
      currentCommentId: "",
    };
  }

  componentDidMount = () => {
    // fetch data only when user is logged In
    if (this.state.isLoggedIn) {
      // fetch media ID and Caption using 1st Api
      fetch(
        this.props.baseUrl +
          "me/media?fields=id,caption&access_token=" +
          this.state.accessToken
      )
        .then(function(response) {
          return response.json();
        })
        .then((json) => {
          // Storing media objects as an array of objects in state variable called mediaIdsAndCaptions
          this.setState({ mediaIdsAndCaptions: json.data });

          //count the number of posts and set noOfPosts state variable
          let postCount = 0;
          this.state.mediaIdsAndCaptions.forEach(() => {
            postCount += 1;
          });
          this.setState({ noOfPosts: postCount });

          // loop through each object in mediaIdsAndCaptions array to get imageData
          this.state.mediaIdsAndCaptions.forEach((image, i) => {
            // fetch id, media_type, media_url, username, timestamp using 2nd Api
            fetch(
              this.props.baseUrl +
                image.id +
                "?fields=id,media_type,media_url,username,timestamp&access_token=" +
                this.state.accessToken
            )
              .then(function(response) {
                return response.json();
              })
              .then((json) => {
                var d = new Date(json.timestamp); // extract timestamp from the json response
                d = d.toLocaleString("en-GB").split(","); // convert it to local string in 24 hrs format and split it
                json.date = d[0]; // after splitting data in 0th index is date, add a property date to the current object
                json.time = d[1].trim(); // after splitting data in 1st index is time, add a property time to the current object
                json.caption = image.caption.split("\n#")[0]; // add a property caption to the current object by extracting it from mediaIdsAndCaptions array
                json.hastags = "";
                image.caption.split(/\s+/).forEach((element) => {
                  if (element[0] === "#") {
                    json.hastags = json.hastags + " " + element;
                  }
                });
                this.setState({ imageData: this.state.imageData.concat(json) }); // add each object to array imageData

                if (i === 0) {
                  // Set username from the API response - here we get same username for all the posts
                  this.setState({ username: json.username });
                }
              });
          });
        })
        .catch((ex) => {
          ReactDOM.render(
            <div style={{ margin: "10% auto" }}>
              <h1>403 Request Limit Error: come back later :)</h1>
              <p>Message: Default Instagram request limit exceeded.....</p>
            </div>,
            document.getElementsByClassName("flex-container")[0]
          );
        });
    }
  };

  // Sets state of modalIsOpen to true when EditIcon button is clicked
  fullNameEditOpenModalHandler = () => {
    this.setState({ modalIsOpen: true });
  };

  // Sets state of modalIsOpen to false when clicked anywhere outside modal
  fullNameEditCloseModalHandler = () => {
    this.setState({ modalIsOpen: false, fullNameRequired: "dispNone" });
  };

  // Stores User input for full name in the newName state variable
  editFullNameHandler = (e) => {
    this.setState({ newName: e.target.value });
  };

  // On click of the update button, the name input is saved to fullName and close the modal and if input is empty then "required" is displayed
  updateFullNameHandler = () => {
    this.state.newName === ""
      ? this.setState({ fullNameRequired: "dispBlock" })
      : this.setState({
          fullNameRequired: "dispNone",
          fullName: this.state.newName,
          newName: "",
          modalIsOpen: false,
        });
  };

  // Sets the clicked image details in the state variable
  imageClickHandler = (image) => {
    this.setState({
      imageModalIsOpen: true,
      currentImage: image,
      currentProfilePicture: this.state.profilePicture,
    });
  };

  // Sets imageCloseModalHandler to false when clicked outside the modal
  imageCloseModalHandler = () => {
    this.setState({ imageModalIsOpen: false });
  };

  // This method increments and decrements the number of like and adds the userLiked and count to object
  likeBtnHandler = (imageId) => {
    let obj = this.state.imageData.find((element) => element.id === imageId);

    if (obj.userLiked === true) {
      // if user already liked the image then decrement the count
      obj.count = obj.count - 1;
      obj.userLiked = false;
      this.setState({});
    } else {
      // if user didn't like the image then increment the count and set userLiked to true
      obj.count = this.state.defaultLikes + 1;
      obj.userLiked = true;
      this.setState({});
    }
  };

  // This method sets the state of commentText using text entered
  onCommentTextChangeHandler = (e, imageId) => {
    this.setState({ commentText: e.target.value, currentCommentId: imageId });
  };

  // On ADD button clicked, comments and comment count are added to comments array as JSON objects
  AddBtnHandler = (imageId) => {
    let obj = this.state.imageData.find((element) => element.id === imageId);

    if (this.state.commentText !== "") {
      // Do not add comments if it is empty
      if (obj.comments === undefined) {
        obj.commentCount = 1;
        obj.comments = [
          {
            comment: this.state.commentText,
            commentCount: obj.commentCount,
            commentId: obj.id,
          },
        ];
        this.setState({ commentText: "" });
      } else {
        obj.comments = [
          ...obj.comments,
          {
            comment: this.state.commentText,
            commentCount: obj.commentCount + 1,
            commentId: obj.id,
          },
        ];
        obj.commentCount = obj.commentCount + 1;
        this.setState({ commentText: "" });
      }
    }
  };

  render() {
    //custom Styles are stored in classes
    const { classes } = this.props;
    const { currentImage, defaultLikes } = this.state;
    return (
      <div>
        {this.state.isLoggedIn === false ? (
          <Redirect to="/" />
        ) : (
          <div>
            <Header
              profilePicture={this.state.profilePicture}
              showSearchBox={false}
              showProfileIcon={this.state.isLoggedIn ? true : false}
              showMyAccount={false}
            />
            <div className="flex-container">
              <div className="profile-picture">
                <img
                  className="profile-image"
                  src={this.state.profilePicture}
                  alt={this.state.fullName}
                />
              </div>
              <div className="profile-picture-summary">
                <Typography id="profile-username" variant="h5" component="h5">
                  {this.state.username}
                </Typography>
                <Typography>
                  <span> Posts: {this.state.noOfPosts} </span>
                  <span className="spacing">
                    {" "}
                    Follows: {this.state.follows}{" "}
                  </span>
                  <span className="spacing">
                    {" "}
                    Followed By: {this.state.followedBy}{" "}
                  </span>
                </Typography>
                <Typography variant="h6" component="h6">
                  <div>
                    <span className="profile-fullname">
                      {this.state.fullName}
                    </span>
                    <Fab
                      color="secondary"
                      aria-label="edit"
                      className={classes.fab}
                      onClick={this.fullNameEditOpenModalHandler}
                    >
                      <EditIcon />
                    </Fab>
                  </div>
                </Typography>

                {/* Edit Icon modal */}
                <Modal
                  className={classes.modal}
                  open={this.state.modalIsOpen}
                  onClose={this.fullNameEditCloseModalHandler}
                  aria-labelledby="edit-icon"
                >
                  <div className={classes.paper}>
                    <h2 className="heading-h2">Edit</h2>
                    <TabContainer>
                      <FormControl required>
                        <InputLabel htmlFor="fullname">Full Name</InputLabel>
                        <Input
                          id="fullname"
                          type="text"
                          fullname={this.state.fullName}
                          onChange={this.editFullNameHandler}
                        />
                        <FormHelperText className={this.state.fullNameRequired}>
                          <span className="red">required</span>
                        </FormHelperText>
                      </FormControl>
                      <br />
                    </TabContainer>
                    <br />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.updateFullNameHandler}
                    >
                      UPDATE
                    </Button>
                  </div>
                </Modal>
              </div>
              <div className="images-container">
                <GridList
                  cellHeight={350}
                  cols={3}
                  className={classes.gridListMain}
                >
                  {this.state.imageData.map((image) => (
                    <GridListTile
                      onClick={() => this.imageClickHandler(image)}
                      className="image-grid-item"
                      key={"grid" + image.id}
                    >
                      <img src={image.media_url} alt={image.id} />
                    </GridListTile>
                  ))}
                </GridList>
                <Modal
                  className={classes.imageModal}
                  open={this.state.imageModalIsOpen}
                  onClose={this.imageCloseModalHandler}
                  aria-labelledby="individual-image-modal"
                >
                  <div className={classes.modalStyle}>
                    <div className="image-modal-left">
                      <img
                        className="clicked-image"
                        src={this.state.currentImage.media_url}
                        alt={this.state.fullName}
                      />
                    </div>
                    <div className="image-modal-right">
                      <div className="right-top">
                        <div className="right-top-image-username-container">
                          <img
                            className="image-modal-profile-icon"
                            src={this.state.currentProfilePicture}
                            alt={this.state.fullName}
                          />
                          <span className="image-modal-username">
                            {this.state.username}
                          </span>
                        </div>
                        <div className="horizontal-line" />
                      </div>
                      <div className="right-middleBottom-container">
                        <div className="right-middle">
                          <div>{this.state.currentImage.caption}</div>
                          <div className="image-hashtags">
                            {this.state.currentImage.hastags}
                          </div>
                          <div className="comments-container">
                            {currentImage.commentCount === undefined // if comment count is undefined then do not display anything
                              ? ""
                              : currentImage.comments.map((
                                  element //Iterating over comments array to show the comments to the corresponding image
                                ) => (
                                  <div
                                    className="comment-display"
                                    key={element.commentCount}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      className={classes.commentUsername}
                                      gutterbottom="true"
                                    >
                                      {currentImage.username}:
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      id="comment-text-alt"
                                      className="comment-text"
                                      gutterbottom="true"
                                    >
                                      {element.comment}
                                    </Typography>
                                  </div>
                                ))}
                          </div>
                        </div>
                        <div>
                          {/* Like button */}
                          <IconButton
                            id="like-button"
                            aria-label="like-button"
                            onClick={() =>
                              this.likeBtnHandler(this.state.currentImage.id)
                            }
                          >
                            {/* Border is red if user already liked the image else border is displayed */}
                            {currentImage.userLiked === undefined ||
                            currentImage.userLiked === false ? (
                              <FavoriteBorderIcon
                                className="like-icon"
                                fontSize="large"
                              />
                            ) : (
                              <FavoriteIcon
                                className="liked-icon"
                                fontSize="large"
                              />
                            )}
                          </IconButton>
                          {/* if count is 1, like is displayed else likes is displayed*/}
                          {currentImage.count === undefined ? (
                            defaultLikes === 1 ? (
                              <span>{defaultLikes} like</span>
                            ) : (
                              <span>{defaultLikes} likes</span>
                            )
                          ) : currentImage.count === 1 ? (
                            <span>{currentImage.count} like</span>
                          ) : (
                            <span>{currentImage.count} likes</span>
                          )}
                          {/* add comments section */}
                          <FormControl
                            className={classes.comment}
                            fullWidth={true}
                          >
                            <InputLabel htmlFor="comment">
                              Add a comment
                            </InputLabel>
                            <Input
                              id="comment"
                              className="comment-text"
                              type="text"
                              onChange={(event) =>
                                this.onCommentTextChangeHandler(
                                  event,
                                  currentImage.id
                                )
                              }
                              value={
                                currentImage.id === this.state.currentCommentId
                                  ? this.state.commentText
                                  : ""
                              }
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.addCommentBtn}
                              onClick={() =>
                                this.AddBtnHandler(currentImage.id)
                              }
                            >
                              ADD
                            </Button>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Profile);
