import React, { Component } from 'react';

import Dropdown from 'react-bootstrap/Dropdown';


class ServiceDDItem extends Component {
  constructor(props) {
    super(props);
    this.state = { serviceObj: this.props.service }
  }

  createMarkup() 
  {
    return {__html: this.props.service_description};
  }

  render() { 
    return (
      <li id="bc-dropdown-li"><a className="dropdown-item" href={"#/"+this.props.servicerecordid}>{this.props.service}</a></li>

      // <div className="my-4">
      // <Card>
      //   <Card.Header className="font-weight-bold">{this.props.service}</Card.Header>
      //   <Card.Body>
      //     <div dangerouslySetInnerHTML={this.createMarkup()} />
      //     <br />
      //     <div className="small">
      //     <span className="font-weight-bold">Core:</span> {this.props.core}<br />
      //     <span className="font-weight-bold">Category:</span> {this.props.category}
      //     </div>
      //   </Card.Body>
      // </Card>
      // </div>
    );
  }
}
 
export default ServiceDDItem;