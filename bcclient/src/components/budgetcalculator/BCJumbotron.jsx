import React, { Component } from 'react';
import logo from "./images/logo.png";


class BCJumbotron extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return ( 
            <div id="wrapper">
                <div id="title">
                    <h1>Budget Calculator (PROTOTYPE)</h1>
                    <br />
                    <br />
                    <div id="budgetTitleDisplay" style={{display: 'none'}}>
                        <h5>Title: <span id="budgetTitleText"></span></h5>
                        <small>Last saved <span id="lastSaveTime"></span></small>
                    </div>
                </div>
                <img id="logo" src={ logo } alt="Center for Clinical &amp; Translational Science" />
                <div style={{clear: 'both'}}></div>
            </div>
     );
  }
}
 
export default BCJumbotron;