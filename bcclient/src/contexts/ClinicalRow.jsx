import React, { Component } from 'react';

class ClinicalRow extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return ( 
      <p>
        id = {this.props.id}; name = {this.props.name}; description = {this.props.description}; serviceversion = {this.props.serviceversion} 
      </p>
     );
  }
}
 
export default ClinicalRow;