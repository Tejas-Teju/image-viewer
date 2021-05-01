import React, {Component} from 'react';
import Header from '../../common/header/Header';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: sessionStorage.getItem("access-token") == null ? false : true,
        };

    }

    render() {
        return(
            <div>
                <Header showSearchBox={this.state.isLoggedIn ? true : false} showProfileIcon={this.state.isLoggedIn ? true : false} />
            </div>
        );
    }
}

export default Home;