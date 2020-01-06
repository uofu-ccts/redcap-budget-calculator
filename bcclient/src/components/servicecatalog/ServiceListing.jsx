import React, { Component } from 'react';
import Card from 'react-bootstrap/Card'

class ServiceListing extends Component {
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
      <div className="my-4">
      <Card>
        <Card.Header className="font-weight-bold">{this.props.service}</Card.Header>
        <Card.Body>
          <div dangerouslySetInnerHTML={this.createMarkup()} />
          <br />
          <div className="small">
          <span className="font-weight-bold">Core:</span> {this.props.core}<br />
          <span className="font-weight-bold">Category:</span> {this.props.category}
          </div>
        </Card.Body>
      </Card>
      </div>
    );
  }
}
 
export default ServiceListing;