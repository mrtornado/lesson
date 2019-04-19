import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import crypto from 'crypto';
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';


function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}

class ProfileX extends Component {
  constructor() {
    super();
    this.state = {
      isAuth: (window.localStorage.getItem("token") != undefined),
      secretInfo: "",
      dataLoaded: false
    }
  }

  componentDidMount() {
    axios.post('http://localhost:4000/get_secret_information', {
      jeton: window.localStorage.getItem("token")
    })
      .then(response => {
        this.setState({
          secretInfo: response.data.message,
          dataLoaded: true
        })
      })
      .catch(error => {
        this.setState({
          isAuth: false
        })
      })
  }

  render() {
    return (
      <div>
        {
          this.state.isAuth ? (<h1>Continutul secret: {this.state.dataLoaded ? this.state.secretInfo : "se asteapta datele"}</h1>) : <Redirect to="/"/>
        }
        <input placeholder="My new secret info"/>
        <button>Submit secret info</button>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      loginForm: true
    }
    this.message_status = React.createRef();
  }

  updateData = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  tryLogin = () => {
    //alert(checksum(this.state.password, "sha1"))
    axios.post('http://localhost:4000/login', {
      username: this.state.username,
      password: this.state.password
    })
      .then((response) => {
        if (response.data.token) {
          window.localStorage.setItem("token", response.data.token);
        }
      })
      .catch((response) => {
        this.message_status.current.innerHTML = "Eroare"
      })
  }

  LoginForm = () => {
    return (
      <>
        <h4>Login Form</h4>
        <input value={this.state.username} onChange={this.updateData}
          id="username" placeholder="Username" />
        <input value={this.state.password} onChange={this.updateData}
          id="password" placeholder="Password" type="password" />
        <button onClick={this.tryLogin}>Login</button>
        <label ref={this.message_status}></label>
      </>
    )
  }
  LoginForm = () => {
    return (
      <>
        <h4>Login Form</h4>
        <input value={this.state.username} onChange={this.updateData}
          id="username" placeholder="Username" />
        <input value={this.state.password} onChange={this.updateData}
          id="password" placeholder="Password" type="password" />
        <button onClick={this.tryLogin}>Login</button>
        <label ref={this.message_status}></label>
      </>
    )
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => (
            <div className="App">
              {
                this.state.loginForm ?
                  <this.LoginForm /> : null
              }
            </div>)} />
          <Route path="/profile" component={ProfileX} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
