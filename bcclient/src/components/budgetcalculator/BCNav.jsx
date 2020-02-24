import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Dropdown from 'react-bootstrap/Dropdown';

import ServiceCatalogDDMenu from '../servicecatalog/ServiceCatalogDDMenu';

import * as jsPDF from 'jspdf';

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

  handleDownloadAsPdfClick = () => {
    console.log("PDF will download ... soon");

    // Default export is a4 paper, portrait, using milimeters for units
    var doc = new jsPDF();
    
    doc.text('Hello world!', 10, 10);
    doc.save('a4.pdf');
  }

  render() { 
    return (
<nav className="navbar navbar-expand-sm">
  <div className="collapse navbar-collapse" id="navbarNavDropdown">
    <ul className="navbar-nav">
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Add Service
        </a>
        <ServiceCatalogDDMenu />
      </li>
      <li className="nav-item">
        <a className="nav-link btn btn-lg font-weight-bolder" id="bdgtcalc-nav" href="#" onClick={this.handleEditBudgetInfoClick}>Edit Budget Information</a>
      </li>
      <li className="nav-item">
        <a className="nav-link btn btn-lg font-weight-bolder" id="bdgtcalc-nav" href="#" onClick={this.handleDownloadAsPdfClick}>Download as PDF</a>
      </li>

    </ul>
  </div>
</nav>
      // <div className="d-flex mt-3 btn-group-budgetcalc">
      // <ButtonGroup toggle className="btn-group">
      //   <Dropdown>
      //     <Dropdown.Toggle className="btn btn-lg font-weight-bolder btn-budgetcalc " type="radio" name="radio" value="1">
      //       Add Service
      //     </Dropdown.Toggle>

      //     <ServiceCatalogDDMenu />

      //   </Dropdown>
      //   <ToggleButton className="btn btn-default btn-lg font-weight-bolder btn-budgetcalc" type="radio" name="radio" value="2" onChange={this.handleEditBudgetInfoClick}>
      //     Edit Budget Information
      //   </ToggleButton>
      //   <ToggleButton className="btn btn-default btn-lg font-weight-bolder btn-budgetcalc" type="radio" name="radio" value="3">
      //     Download as PDF
      //   </ToggleButton>
      // </ButtonGroup>
      // </div>
     );
  }
}

export default BCNav;
