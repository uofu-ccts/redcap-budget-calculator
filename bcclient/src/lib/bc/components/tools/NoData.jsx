import React, { Component } from 'react';
import Card from 'react-bootstrap/Card'

class NoData extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return ( 
            <div className="my-4">
      <Card>
        <Card.Header className="font-weight-bold">Not Found</Card.Header>
        <Card.Body>
          No information available.
        </Card.Body>
      </Card>
      </div>
     );
  }

}

export default NoData;