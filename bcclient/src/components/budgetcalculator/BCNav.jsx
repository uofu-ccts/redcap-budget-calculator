import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Dropdown from 'react-bootstrap/Dropdown';

import ServiceCatalogDDMenu from '../servicecatalog/ServiceCatalogDDMenu';

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
      <div className="d-flex mt-3 btn-group-budgetcalc">
      <ButtonGroup toggle className="btn-group">
        <Dropdown>
          <Dropdown.Toggle className="btn btn-lg font-weight-bolder btn-budgetcalc " type="radio" name="radio" value="1">
            Add Service
          </Dropdown.Toggle>

          <ServiceCatalogDDMenu />
          {/* <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu> */}
        </Dropdown>
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
