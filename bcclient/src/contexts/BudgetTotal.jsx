import React, {Component} from 'react';
import BudgetContext from './BudgetContext';

class BudgetTotal extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  toDollars = dollars => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(dollars);
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