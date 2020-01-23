import React, { Component } from 'react';

import Services from './ServicesDDList';
import Dropdown from 'react-bootstrap/Dropdown';

/**
 * This component is the guts of the Add Service.
 * 
 * NOTE: This component used to do a lot more than it currently does. It may be refactored out at some point.
 */
class ServiceCatalogDDMenu extends Component {
  render() { 
    return (
        <Services />
     );
  }
}
 
export default ServiceCatalogDDMenu;