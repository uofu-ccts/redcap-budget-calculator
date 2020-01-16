import React, { Component } from 'react';

import Services from './ServicesDDList';
import ServiceContextProvider from '../../contexts/ServiceContext';

import Dropdown from 'react-bootstrap/Dropdown';

/**
 * This component is the guts of the Add Service.
 */
class ServiceCatalogDDMenu extends Component {

  // constructor(props) {
  //   super(props);
  // }

//TODO: move the ServiceContextProvider higher up the tree so its available to the datatables
  render() { 
    return (
      //<Dropdown.Menu>
      <ServiceContextProvider>
        <Services />
      </ServiceContextProvider>
      //</Dropdown.Menu>
     );
  }
}
 
export default ServiceCatalogDDMenu;