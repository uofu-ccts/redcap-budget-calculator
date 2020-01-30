import React, {Component} from 'react';
import BudgetContext from './BudgetContext';
import NonClinicalRow from './NonClinicalRow';

class BudgetNONClinicalRowsConsumer extends Component {

  isNonClinical = obj => {
      return parseInt(obj.clinical) == 0;
  }

  render() { 
    return ( 
      <BudgetContext.Consumer>
          {context => (
              <>
                  <h4>Non-Clinical Rows:</h4>
                  {/* {console.log("test1...",context.bcrows)} */}
                  {Object.values(context.bcrows).filter(this.isNonClinical).map(obj => (
                      <NonClinicalRow
                          key={obj.key}
                          id={obj.id}
                          core={obj.core}
                          category={obj.category}
                          service={obj.service}
                          description={obj.service_description}
                          industryrate={obj.industry_rate}
                          federalrate={obj.federal_rate}
                          clinical={obj.clinical}
                      />
                  ))}
              </>
          )}
      </BudgetContext.Consumer>
     );
  }
}
 
export default BudgetNONClinicalRowsConsumer;