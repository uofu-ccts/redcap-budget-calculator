import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

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
      <>
      <Navbar href="#addservice" style={{backgroundColor: "#3092c0", borderRadius: "8px"}}>
        <NavDropdown className="bc-nav-items" title="Add Service" id="bc-nav-items"></NavDropdown>
        <Nav className="mr-auto">
          <Nav.Link href="#editbudgetinfo" className="bc-nav-items" onSelect={this.handleEditBudgetInfoClick}>Edit Budget Information</Nav.Link>
          <Nav.Link href="#downloadaspdf" className="bc-nav-items">Download as PDF</Nav.Link>
        </Nav>
      </Navbar>
      <div className="d-flex mt-3 btn-group-budgetcalc">
      <ButtonGroup toggle className="btn-group">
        <ToggleButton className="btn btn-lg font-weight-bolder btn-budgetcalc " type="radio" name="radio" value="1">
          Add Service
        </ToggleButton>
        <ToggleButton className="btn btn-default btn-lg font-weight-bolder btn-budgetcalc" type="radio" name="radio" value="2" onChange={this.handleEditBudgetInfoClick}>
          Edit Budget Information
        </ToggleButton>
        <ToggleButton className="btn btn-default btn-lg font-weight-bolder btn-budgetcalc" type="radio" name="radio" value="3">
          Download as PDF
        </ToggleButton>
      </ButtonGroup>
      </div>
      </>
     );
  }
}

export default BCNav;
