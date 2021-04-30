import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './home/Home';
import Login from './login/Login';

//Creating controller class for routing
class Controller extends Component{

    render(){
        return(
            <Router>
                <div className = 'main-container'>
                    {/* Route to login Page */}
                    <Route exact path = '/' render={() => <Login />}/> 
                    {/* Route to home Page */}          
                    <Route exact path = '/home' render={() => <Home /> }/>            
                </div>
            </Router>
        )
    }
}

export default Controller;