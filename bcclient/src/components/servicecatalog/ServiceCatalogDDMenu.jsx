import React, { Component } from 'react';

import Services from './ServicesDDList';
import BudgetContext from '../../contexts/BudgetContext';


/**
 * This component is the guts of the Add Service. 
 * A function for adding rows is provided from the BudgetContext.
 */
class ServiceCatalogDDMenu extends Component {
  render() { 
    return (
      <BudgetContext.Consumer>
        {context => (
          <Services addBCService = {(e) => context.addBCService(e)} />
        )}
      </BudgetContext.Consumer>
     );
  }
}
 
export default ServiceCatalogDDMenu;