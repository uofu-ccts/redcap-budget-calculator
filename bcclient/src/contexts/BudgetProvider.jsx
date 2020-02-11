import React, {Component} from 'react';
import BudgetContext from './BudgetContext';

class BudgetProvider extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      bcInfoModalUsedOnce: false,
      bcimShowInfo: false,
      bcimShowSave: false,
      bcimShowInfoSubjectCount: "", //the info modal populates this field
      bcimShowInfoVisitCount: "", //the info modal populates this field
      bcInfoModalNeeded: false, // when needed, the ID of the row that needs the info is populated in this attribute.

      fundingType: '', //determines the "Your Cost" column
      bcrows: {}, // All clinical and non-clinical rows for virtual DOM to display. //TODO: State **SHOULD BE** preserved in the row components.
      
      nonclinicalRowTotals: {}, // calculated totals associated with rows' ID (for speed)
      clinicalRowsTotal: {}, // calculated totals associated with rows' ID (for speed)

      nonclinicalTotals: 0, // for display in UI
      clinicalTotals: 0, // for display in UI
      grandTotal: 0, // for display in UI

      chsLeftNavState: 'disabled', //nav states, ... 'active' and 'disabled'
      chsRightNavState: 'disabled',
      chsBtnStates: ['disabled','disabled','disabled','disabled','disabled'], //button states, ... 'select', 'deselect' and 'disabled'
      chsVisitIndex: 1, //base index is 1, not 0. Changes in increments of 5
      chsVisitLength: 0 //number of columns of visits that can be selected
     }
  }

  //////////////////////////////////////////
  //
  // BEGIN: Clinical Services Header Context (CSH)

  cshNavLeft = () => {
    console.log("cshNavLeft clicked");
  }

  cshNavRight = () => {
    console.log("cshNavRight clicked");
  }

  /**
   * Five displayed buttons in the clinical services header.
   * The first is 1 and the 5th is 5, ... not 0 based.
   */
  cshButtonClicked = (btnIndex) => {
    console.log("Button "+btnIndex+" clicked", btnIndex);
  }

  // END:  Clinical Services Header Context
  //
  //////////////////////////////////////////




  //////////////////////////////////////////
  //
  // BEGIN: Clinical Services (CS) section

  cshSubjectsAndVisitsNeeded = (id) => {
    console.log("cshSubjectsAndVisitsNeeded called with "+id);
    this.setState({
      bcInfoModalUsedOnce:true,
      bcimShowInfo:true,
      bcInfoModalNeeded:id
      });
  }
  
  /**
   * This method should only be called once, just after the creation of the
   * first clinical service row.
   */
  bcimInfoCallback = (values) => {
    // console.log("infoCallback ... Subject Count: " + values.subjectCount + "; visit Count: " + values.visitCount);//TODO: remove this log
    this.setState({
      bcimShowInfo: false, 
      bcimShowInfoSubjectCount:values.subjectCount, 
      bcimShowInfoVisitCount:values.visitCount
      }, ()=>{this.bcimUpdateAllSubjectCountsAndVisitCounts( values.subjectCount, values.visitCount);});
  }

  bcimHandleHideInfo = () => this.setState({bcimShowInfo: false});

  isClinical = obj => {//TODO: move to *.js library
      return parseInt(obj.clinical);
  }


  bcimUpdateAllSubjectCountsAndVisitCounts = (subjectCount, visitCount) => {
    // console.log("subjectCount should be " + this.state.bcimShowInfoSubjectCount + " and vist counts should be "+this.state.bcimShowInfoVisitCount);
    let bcrowsCopy = {...this.state.bcrows};

    Object.values(bcrowsCopy).filter(this.isClinical).forEach(obj => {
      bcrowsCopy[obj.id].subjectCount = subjectCount;
      //TODO: update the visit counts too
    });

    this.setState({ bcrowsCopy });
  }

  csUpdateSubjectCountById = (e, id) => {
    // console.log("subjectCount: " + e.target.value + " for id: " + id);

    let bcrowsCopy = {...this.state.bcrows};
    bcrowsCopy[id].subjectCount = e.target.value;
    this.setState({ bcrowsCopy });
  }

  // END:  Clinical Services (CS) section
  //
  //////////////////////////////////////////





  calculateGrandTotals = () => {
    this.setState((state, props) => {return {
      grandTotal: (state.nonclinicalTotals + state.clinicalTotals)
    }});
  }

  calculateNonclinicalTotals = () => {
    //console.log("calculateNonclinicalTotals()", this.state);//TODO: remove this log
    let reducer = (acc, cur) => {return acc + cur;}
    let ncrt = {...this.state.nonclinicalRowTotals};
    let newClinicalTotal = Object.values( ncrt ).reduce( reducer, 0 );
    //console.log("newClinicalTotal="+newClinicalTotal);//TODO: remove this log

    this.setState({nonclinicalTotals: newClinicalTotal},this.calculateGrandTotals);
  }

  addNonclinicalCost = (id, cost) => {
    let addedToNCC = {nonclinicalRowTotals: 
        {
          ...this.state.nonclinicalRowTotals,
        [id]:cost}}

    this.setState(
      addedToNCC,
      this.calculateNonclinicalTotals
    );
  }

  removeNonclinicalCost = (id) => {
    let updatedNCRT = {...this.state.nonclinicalRowTotals};
    delete updatedNCRT[id];
    this.setState({
              nonclinicalRowTotals: updatedNCRT
            }, this.calculateNonclinicalTotals);
  }



  setFundingType = (e, fundingType) => {
    this.setState({ fundingType: fundingType });
  }

  removeBCService = (e, serviceId) => {
    let updatedBCRows = {...this.state.bcrows};
    delete updatedBCRows[serviceId];
    this.setState({
              bcrows: updatedBCRows
            });
  }

  /**
   * ServiceMenuItems call this context method to add instances of service rows to state.bcrows for display in the UI.
   */
  addBCService = (e, serviceRow) => {
            e.persist();
            e.preventDefault();

            // Good for a few thousand budget items without worrying about collisions.
            let oneTimeUseId = '_' + Math.random().toString(36).substr(2, 9);

            let serviceObj = JSON.parse(serviceRow)[0];
            serviceObj["id"] = oneTimeUseId;
            serviceObj["key"] = oneTimeUseId;
            serviceObj["subjectCount"] = this.state.bcimShowInfoSubjectCount;

            // The first time a clinical row is added a modal asks for the subject and visit count.
            if ((! this.state.bcInfoModalUsedOnce) && parseInt(serviceObj["clinical"])) {
              this.setState({
                bcrows: 
                { 
                  ...this.state.bcrows, 
                  [oneTimeUseId]:serviceObj
                }
              }, ()=>{this.cshSubjectsAndVisitsNeeded(oneTimeUseId);}); 
            }
            else {
              this.setState({
                bcrows: 
                { 
                  ...this.state.bcrows, 
                  [oneTimeUseId]:serviceObj
                }
              }); 
            }

          }

  render() { 
    return ( 
      <BudgetContext.Provider
        value={{
          bcrows: this.state.bcrows,
          fundingType: this.state.fundingType,

          nonclinicalTotals: this.state.nonclinicalTotals,
          clinicalTotals: this.state.clinicalTotals,
          grandTotal: this.state.grandTotal,

          addNonclinicalCost: this.addNonclinicalCost,
          removeNonclinicalCost: this.removeNonclinicalCost,

          addBCService: this.addBCService, 
          removeBCService: this.removeBCService,
          setFundingType: this.setFundingType,

          chsLeftNavState: this.state.chsLeftNavState,
          chsRightNavState: this.state.chsRightNavState,
          chsBtnStates: this.state.chsBtnStates,
          chsVisitIndex: this.state.chsVisitIndex,
          chsVisitAllSelected: this.state.chsVisitAllSelected,

          cshNavLeft: this.cshNavLeft,
          cshNavRight: this.cshNavRight,
          cshButtonClicked: this.cshButtonClicked,

          bcimShowInfo: this.state.bcimShowInfo,
          bcimShowInfoSubjectCount: this.state.bcimShowInfoSubjectCount,
          bcimShowInfoVisitCount: this.state.bcimShowInfoVisitCount,
          bcimInfoCallback: this.bcimInfoCallback,
          bcimHandleHideInfo: this.bcimHandleHideInfo,

          csUpdateSubjectCountById: this.csUpdateSubjectCountById

        }}>
        {this.props.children}
      </BudgetContext.Provider>
     );
  }
}
 
export default BudgetProvider;