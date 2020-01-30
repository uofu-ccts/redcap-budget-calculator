import React, {Component} from 'react';
import BudgetContext from './BudgetContext';

class BudgetProvider extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      bcrows: {}
     }
  }

  addBCService = (e, serviceRow) => {
            e.persist();
            e.preventDefault();

            // Good for a few thousand budget items without worrying about collisions.
            let oneTimeUseId = '_' + Math.random().toString(36).substr(2, 9);

            let serviceObj = JSON.parse(serviceRow)[0];
            {console.log("test serviceObj...",serviceObj)}
            serviceObj["id"] = oneTimeUseId;
            serviceObj["key"] = oneTimeUseId;

            this.setState({
              bcrows: 
              { 
                ...this.state.bcrows, 
                [oneTimeUseId]:serviceObj
              }
            })
          }

  render() { 
    return ( 
      <BudgetContext.Provider
        value={{
          bcrows: this.state.bcrows,
          addBCService: this.addBCService 
        }}>
        {this.props.children}
      </BudgetContext.Provider>
     );
  }
}
 
export default BudgetProvider;