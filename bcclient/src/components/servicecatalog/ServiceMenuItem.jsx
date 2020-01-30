import React, { Component } from 'react';
class ServiceMenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      serviceobj: this.props.serviceobj,
      servicename: this.props.servicename
     }
  }

  render() {
    // console.log("service object ...",this.state.serviceobj);
    return ( 
      <li id="bc-dropdown-li"><a className="dropdown-item" href="#" onClick={(e) => this.props.addBCService(e, this.state.serviceobj)}>{this.state.servicename}</a></li>
     );
  }
}
 
export default ServiceMenuItem;