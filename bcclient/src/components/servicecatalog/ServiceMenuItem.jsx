import React, { Component } from 'react';
class ServiceMenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      serviceobj: this.props.serviceobj
     }
  }

  render() {
    console.log("service object ...",this.state.serviceobj);
    // let oneService = Object.values(this.state.serviceTree)[0];

    return ( 
      <li id="bc-dropdown-li"><a className="dropdown-item" href="#" onClick={(e) => this.props.addBCService(e, this.state.serviceTree)}>this one's live!!</a></li>
     );
  }
}
 
export default ServiceMenuItem;