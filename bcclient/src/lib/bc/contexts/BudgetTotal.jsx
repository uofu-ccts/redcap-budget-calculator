import React, {Component} from 'react';
import BudgetContext from './BudgetContext';

import BudgetUtils from '../js/BudgetUtils';

class BudgetTotal extends Component {
  constructor(props) {
    super(props);
    this.state = {}

    let bu = new BudgetUtils();
    this.toDollars = bu.toDollars;
  }

  render() { 
    return ( 
      <BudgetContext.Consumer>
          {context => (
              <>
                  {this.props.grand ? this.toDollars(context.grandTotal) : ''}
                  {this.props.clinical ? this.toDollars(context.clinicalTotals) : ''}
                  {this.props.nonclinical ? this.toDollars(context.nonclinicalTotals) : ''}
              </>
          )}
      </BudgetContext.Consumer>
     );
  }
}
 
export default BudgetTotal;