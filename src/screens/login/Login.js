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

    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
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

        // If login credentials are correct then store the access-token and go to home page
        if(this.state.username === username && this.state.password === password){
            sessionStorage.setItem("access-token", accessToken);
            ReactDOM.render(<div>Home Page</div>, document.getElementById('root'));
        } else {
            this.setState({invalidCredentials: "dispBlock"});
        }
    }

    render() {
        return <div>
            <Header />
            <Card className="cardStyle">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  LOGIN
                </Typography>
                <FormControl required className="formControl"> 
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input id="username" type="text" username={this.state.username} onChange={this.inputUsernameChangeHandler}/>
                </FormControl><br/><br/>
                <FormControl required className="formControl">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input id="password" type="password" password={this.state.password} onChange={this.inputPasswordChangeHandler}/>
                </FormControl><br/><br/>
                <FormHelperText className={this.state.invalidCredentials}><span className="red">Incorrect username and/or password</span></FormHelperText>
                <br/>
                <Button variant="contained" color="primary" onClick={this.loginClickHandler}>
                    LOGIN
                </Button>
              </CardContent>
            </Card>
          </div>;
    }
}

export default Login;
