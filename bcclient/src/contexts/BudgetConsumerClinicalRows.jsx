import React, {Component} from 'react';
import BudgetContext from './BudgetContext';
import ClinicalRow from './ClinicalRow';

class BudgetClinicalRowsConsumer extends Component {

  isClinical = obj => {
      return parseInt(obj.clinical);
  }

  render() { 
    return ( 
      <BudgetContext.Consumer>
          {context => (
              <>
                  <h4>Clinical Rows:</h4>
                  {console.log("test1...",context.bcrows)}
                  {Object.values(context.bcrows).filter(this.isClinical).map(obj => (
                      <ClinicalRow
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
 
export default BudgetClinicalRowsConsumer;