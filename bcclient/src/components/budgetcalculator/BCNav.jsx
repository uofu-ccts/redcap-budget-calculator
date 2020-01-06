import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class BCNav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showInfoCallback: this.props.showInfoCallback
    }
  }

  handleEditBudgetInfoClick = () => {
    this.state.showInfoCallback();
  }

  render() { 
    return (
      <Navbar style={{backgroundColor: "#3092c0", borderRadius: "8px"}}>
        <Nav className="mr-auto">
          <Nav.Link href="#service" style={{fontSize:"large", fontWeight: "bold", color: "white"}}>Add Service</Nav.Link>
          <Nav.Link href="#edit" style={{fontSize:"large", fontWeight: "bold", color: "white"}} onSelect={this.handleEditBudgetInfoClick}>Edit Budget Information</Nav.Link>
          <Nav.Link href="#download" style={{fontSize:"large", fontWeight: "bold", color: "white"}}>Download as PDF</Nav.Link>
        </Nav>
      </Navbar>
     );
  }
}

export default BCNav;