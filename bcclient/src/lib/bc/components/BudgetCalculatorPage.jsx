import React, { Component } from 'react';
import BudgetCalculator from './budgetcalculator/BudgetCalculator';

import BudgetProvider from '../contexts/BudgetProvider';
import BCWelcomeModal from './budgetcalculator/BCWelcomeModal';

import BudgetContext from '../contexts/BudgetContext';

import { bcConfig } from '../js/config';

class BudgetCalculatorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // welcome modal conditional on presetFundingType
      showWelcome: bcConfig.presetFundingType === 'federal_rate' || bcConfig.presetFundingType === 'industry_rate' ? false : true
      // showWelcome: true,//TODO: Set to false for debugging. Set to true for production
    }
  }

  welcomeOpenCallback = () => {
    this.setState({showWelcome: true})
  }

  welcomeCallback = (fundingType) => {
    this.setState({showWelcome: false})
  }
  render() { 
    return ( 
      <BudgetProvider>
        <BudgetContext.Consumer>
          {context => (
            <>
              <BudgetCalculator
                welcomeOpenCallback={this.welcomeOpenCallback} 
                bcstate={context.bcstate}/>
              <BCWelcomeModal 
                showWelcome={this.state.showWelcome} 
                welcomeCallback={this.welcomeCallback} 
                hideWelcome={this.handleHideWelcome} 
                setFundingType={context.setFundingType}/>
          {/* {console.log('bcrows in BC Page', context.bcrows)} */}
            </>
          )}
        </BudgetContext.Consumer>

      </BudgetProvider>
     );
  }
}
 
export default BudgetCalculatorPage;