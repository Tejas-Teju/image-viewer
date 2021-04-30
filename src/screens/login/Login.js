import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from '../common/header/Header';
import './Login.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';

class Login extends Component {

    //constructor to set the states of variables initially
    constructor() {
        super();

        this.state = {
            username: "",
            password: "",
            reqUsername: "dispNone",
            reqPassword: "dispNone",
            invalidCredentials: "dispNone",
        };
    }

    // Function that handles any changes in the username field and updates state accordingly
     inputUsernameChangeHandler = (e) => {
        this.setState({ username: e.target.value });
    }

    // Function that handles any changes in the password field and updates state accordingly
    inputPasswordChangeHandler = (e) => {
        this.setState({ password: e.target.value });
    }

    loginClickHandler = () => {
        //Setting credentials in the login handler
        let username = "upgrad";
        let password = "upgrad@123";

        let accessToken = "8661455776.d0fcd39.39f63ab2f88d4f9c92b0862729ee2784";

        if(this.state.username === "" || this.state.password === "") {
            // Check for empty fields of username and password and display required if clicked on Login button
            this.state.username === "" ? this.setState({reqUsername: "dispBlock"}): this.setState({reqUsername:"dispNone"});
            this.state.password === "" ? this.setState({reqPassword: "dispBlock"}): this.setState({reqPassword:"dispNone"});
            this.setState({invalidCredentials: "dispNone"});
        }
        // If login credentials are correct then store the access-token and go to home page
        else if(this.state.username === username && this.state.password === password){
            sessionStorage.setItem("access-token", accessToken);
            ReactDOM.render(<div>Home Page</div>, document.getElementById('root'));
        } else {
            //Do not display required on entering invalid credentials after filling up the username and password fields
            this.setState({reqUsername:"dispNone", reqPassword:"dispNone", invalidCredentials: "dispBlock"});
        }
    }

    render() {
        return (
            <div>
                <Header />

                <Card className="cardStyle">
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            LOGIN
                        </Typography>
                        <FormControl required className="formControl"> 
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input id="username" type="text" username={this.state.username} onChange={this.inputUsernameChangeHandler}/>
                            <FormHelperText className={this.state.reqUsername}><span className="red">required</span></FormHelperText>
                        </FormControl><br/><br/>
                        <FormControl required className="formControl">
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input id="password" type="password" password={this.state.password} onChange={this.inputPasswordChangeHandler}/>
                            <FormHelperText className={this.state.reqPassword}><span className="red">required</span></FormHelperText>
                        </FormControl><br/><br/>
                        <FormHelperText className={this.state.invalidCredentials}><span className="red">Incorrect username and/or password</span></FormHelperText>
                        <br/>
                        <Button variant="contained" color="primary" onClick={this.loginClickHandler}>
                            LOGIN
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default Login;
