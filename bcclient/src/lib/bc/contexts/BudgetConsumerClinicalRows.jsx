import React, {Component} from 'react';
import BudgetContext from './BudgetContext';
import ClinicalRow from './ClinicalRow';
import BCInfoModal from '../components/budgetcalculator/BCInfoModal';

import BudgetUtils from '../js/BudgetUtils';


class BudgetClinicalRowsConsumer extends Component {
  constructor(props) {
    super(props);
    let bu = new BudgetUtils();
    this.isClinical = bu.isClinical;
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
                          yourCost={context.fundingType === 'federal_rate' ?  obj.federal_rate : obj.industry_rate}
                          federalrate={obj.federal_rate}
                          clinical={obj.clinical}
                          removeBCService={context.removeBCService}
                          fundingType={context.fundingType}
                          subjectCount={obj.subjectCount}
                          visitCount={obj.visitCount}
                          anyVistsNotSelected={obj.anyVistsNotSelected}
                          costPerSubject={obj.costPerSubject}
                          totalCost={obj.totalCost}
                          perService={obj.per_service}

                          bcrows={context.bcrows}
                          csUpdateSubjectCountById={context.csUpdateSubjectCountById}
                          chsVisitIndex={context.chsVisitIndex}
                          bcimShowInfoVisitCount={context.bcimShowInfoVisitCount}
                          csVisitChanged={context.csVisitChanged}
                          handleVisitRowButtonClicked={context.handleVisitRowButtonClicked}
                          perServiceReadable={context.perService}
                      />
                  ))}

                <BCInfoModal
                    showInfo={context.bcimShowInfo}
                    showInfoSubjectCount={context.bcimShowInfoSubjectCount}
                    showInfoVisitCount={context.bcimShowInfoVisitCount}
                    infoCallback={context.bcimInfoCallback}
                    hideInfoCallback={context.bcimHandleHideInfo} />
              </>
          )}
      </BudgetContext.Consumer>
     );
  }
}
 
export default BudgetClinicalRowsConsumer;