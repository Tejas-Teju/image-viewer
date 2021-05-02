import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './home/Home';
import Login from './login/Login';

//Creating controller class for routing
class Controller extends Component{
    constructor(){
        super()
        this.baseUrl = "https://graph.instagram.com/"; //setting the baseUrl of the api to pass down to components
    }

    render(){
        return(
            <Router>
                <div className = 'main-container'>
                    {/* Route to login Page */}
                    <Route exact path = '/' render={(props) => <Login {...props} baseUrl = {this.baseUrl}/>}/> 
                    {/* Route to home Page */}          
                    <Route exact path = '/home' render={(props) => <Home {...props} baseUrl = {this.baseUrl}/>}/>            
                </div>
            </Router>
        )
    }
}

export default Controller;