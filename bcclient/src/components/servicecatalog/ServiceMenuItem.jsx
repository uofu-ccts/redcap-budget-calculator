import React, { Component } from 'react';
class ServiceMenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      service: this.props.service
     }
  }

  render() { 
    return ( 
      <li id="bc-dropdown-li"><a className="dropdown-item" href="#" onClick={(e) => this.props.addBCService(e, this.state.service)}>this one's live!!</a></li>
     );
  }
}
 
export default ServiceMenuItem;