import React, { Component } from 'react';
import BudgetCalculator from './budgetcalculator/BudgetCalculator';

import BudgetProvider from '../contexts/BudgetProvider';
import BCWelcomeModal from './budgetcalculator/BCWelcomeModal';

import BudgetContext from '../contexts/BudgetContext';

class BudgetCalculatorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWelcome: true,//TODO: Set to false for debugging. Set to true for production
    }
  }

  welcomeCallback = (fundingType) => {
    this.setState({showWelcome: false})
  }

  render() { 
    return ( 
      <BudgetProvider>
        <BudgetCalculator />
        <BudgetContext.Consumer>
          {context => (
              <BCWelcomeModal 
                showWelcome={this.state.showWelcome} 
                welcomeCallback={this.welcomeCallback} 
                hideWelcome={this.handleHideWelcome} 
                setFundingType={context.setFundingType}/>
          )}
        </BudgetContext.Consumer>

        
      </BudgetProvider>
     );
  }
}
 
export default BudgetCalculatorPage;