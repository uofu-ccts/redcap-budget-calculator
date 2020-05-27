import React, { Component } from 'react';
import ServiceCatalogDDMenu from '../servicecatalog/ServiceCatalogDDMenu';

import DownloadPdf from '../../js/DownloadPdf'

class BCNav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showInfoCallback: this.props.showInfoCallback
    };
  }

  handleEditBudgetInfoClick = () => {
    this.state.showInfoCallback();
  }

  handleDownloadAsPdfClick = () => {
    let downloader = new DownloadPdf();
    downloader.savePdf(this.props.bcstate);
  }

  render() { 
    return (
<nav className="navbar navbar-expand-sm">
  <div className="collapse navbar-collapse" id="navbarNavDropdown">
    <ul className="navbar-nav">
      <li className="nav-item dropdown">
        <a className="nav-link btn btn-lg dropdown-toggle" href="#/" role="button" id="navbarDropdownMenuLink dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Add a Service
        </a>
        <ServiceCatalogDDMenu />
      </li>
      <li className="nav-item">
        <a className="nav-link btn btn-lg font-weight-bolder" id="bdgtcalc-nav" href="#/" onClick={this.handleEditBudgetInfoClick}>Edit Budget Information</a>
      </li>
      <li className="nav-item">
        <a className="nav-link btn btn-lg font-weight-bolder" id="bdgtcalc-nav" href="#/" onClick={this.handleDownloadAsPdfClick}>Download as PDF</a>
      </li>

    </ul>
  </div>
</nav>
     );
  }
}

export default BCNav;
