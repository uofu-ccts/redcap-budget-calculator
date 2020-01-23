import React, { Component } from 'react';
import BudgetCalculator from './budgetcalculator/BudgetCalculator';
import BudgetProvider from '../contexts/BudgetProvider';

class BudgetCalculatorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return ( 
      <BudgetProvider>
        <BudgetCalculator />
      </BudgetProvider>
     );
  }
}
 
export default BudgetCalculatorPage;