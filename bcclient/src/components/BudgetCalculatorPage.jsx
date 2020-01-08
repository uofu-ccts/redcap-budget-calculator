import React, { Component } from 'react';
import BudgetCalculator from './budgetcalculator/BudgetCalculator';

class BudgetCalculatorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return ( 
      <div>
        <BudgetCalculator />
      </div>
     );
  }
}
 
export default BudgetCalculatorPage;