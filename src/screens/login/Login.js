import React, { Component } from 'react';
import Header from '../common/header/Header';
import './Login.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class Login extends Component {
    render() {
        return <div>
            <Header />
            <Card className="cardStyle">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  LOGIN
                </Typography>
              </CardContent>
            </Card>
          </div>;
    }
}

export default Login;
