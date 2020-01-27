import React, { Component } from 'react';
class ServiceMenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }

  render() { 
    return ( 
      <li id="bc-dropdown-li"><a className="dropdown-item" href="#" onClick={this.props.addBCService}>this one's live!!</a></li>
     );
  }
}
 
export default ServiceMenuItem;