import React, {Component} from 'react';
import BudgetContext from './BudgetContext';

class BudgetProvider extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      bcrows: {
        abc123: {name: 'service1', description: 'first service'},
        xyz789: {name: 'service2', description: 'second service'}
      }
     }
  }

  addBCService = (e, serviceRow) => {
            e.persist();
            e.preventDefault();
            this.setState({
              bcrows: 
              { 
                ...this.state.bcrows, 
                anotherRow:{name: serviceRow.name, description: serviceRow.description, serviceversion: serviceRow.serviceversion}
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