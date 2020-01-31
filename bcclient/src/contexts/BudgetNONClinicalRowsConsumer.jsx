import React, {Component} from 'react';
import BudgetContext from './BudgetContext';
import NonClinicalRow from './NonClinicalRow';

class BudgetNONClinicalRowsConsumer extends Component {

  isNonClinical = obj => {
      return parseInt(obj.clinical) == 0;
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
                    this.displayRows( Object.values(context.bcrows).filter(this.isNonClinical).length )
                  }

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