import React, {Component} from 'react';
import BudgetContext from './BudgetContext';
import ClinicalRow from './ClinicalRow';

class BudgetClinicalRowsConsumer extends Component {
  render() { 
    return ( 
      <BudgetContext.Consumer>
          {context => (
              <>
                  <h4>Clinical Rows:</h4>
                  {Object.keys(context.bcrows).map(rowID => (
                      <ClinicalRow
                          key={rowID}
                          id={rowID}
                          name={context.bcrows[rowID].name}
                          description={context.bcrows[rowID].description}
                      />
                  ))}
              </>
          )}
      </BudgetContext.Consumer>
     );
  }
}
 
export default BudgetClinicalRowsConsumer;