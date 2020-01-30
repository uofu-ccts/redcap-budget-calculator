import React, { Component } from 'react';

class ClinicalRow extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    console.log("test2...");

    return ( 
      <p>
        id={this.props.id}; 
        service={this.props.service}; 
        description={this.props.description}; 
        industryrate={this.props.industryrate}; 
        federalrate={this.props.federalrate}; 
        clinical={this.props.clinical}; 
      </p>
     );
  }
}
 
export default ClinicalRow;