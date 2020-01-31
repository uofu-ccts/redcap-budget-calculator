import React, {Component} from 'react';
import BudgetContext from './BudgetContext';
import ClinicalRow from './ClinicalRow';

class BudgetClinicalRowsConsumer extends Component {

  isClinical = obj => {
      return parseInt(obj.clinical);
  }

  displayRows = rows => {
    
    if (rows > 0) {
        return;
    }

    return (
        <tr id="clinicalEmpty">
            <td colSpan="14">No services added</td>
        </tr>
    );
  }

  render() { 
    return ( 
      <BudgetContext.Consumer>
          {context => (
              <>
                  {
                    this.displayRows( Object.values(context.bcrows).filter(this.isClinical).length )
                  }

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