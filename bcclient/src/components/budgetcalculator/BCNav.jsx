import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

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
      <Navbar href="#addservice" style={{backgroundColor: "#3092c0", borderRadius: "8px"}}>
        <NavDropdown className="bc-nav-items" title="Add Service" id="bc-nav-items"></NavDropdown>
        <Nav className="mr-auto">
          <Nav.Link href="#editbudgetinfo" className="bc-nav-items" onSelect={this.handleEditBudgetInfoClick}>Edit Budget Information</Nav.Link>
          <Nav.Link href="#downloadaspdf" className="bc-nav-items">Download as PDF</Nav.Link>
        </Nav>
      </Navbar>
     );
  }
}

export default BCNav;
