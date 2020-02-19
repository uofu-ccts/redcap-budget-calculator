import React, {Component} from 'react';
import BudgetContext from './BudgetContext';

class BudgetProvider extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      bcInfoModalUsedOnce: false,
      bcimShowInfo: false,
      bcimShowSave: false,
      bcimShowInfoSubjectCount: 0, // The info modal populates this field.
      bcimShowInfoVisitCount: 0, // Number of columns of visits that can be selected. The info modal populates this field.
      bcInfoModalNeeded: false, // when needed, the ID of the row that needs the info is populated in this attribute.

      fundingType: '', //determines the "Your Cost" column
      bcrows: {}, // All clinical and non-clinical rows for virtual DOM to display. Authoritative row state **SHOULD BE** preserved here, and not in the row components.
      
      nonclinicalRowsTotal: {}, // calculated totals associated with rows' ID //TODO: Old design. Planning to refactor into bcrows
      clinicalRowsTotal: {}, // calculated totals associated with rows' ID //TODO: Old design. Planning to refactor into bcrows

      nonclinicalTotals: 0, // for display in UI
      clinicalTotals: 0, // for display in UI
      grandTotal: 0, // for display in UI

      chsLeftNavState: 'disabled', //nav states, ... 'active' and 'disabled'
      chsRightNavState: 'disabled',
      chsBtnStates: ['disabled','disabled','disabled','disabled','disabled'], //button states, ... 'select', 'deselect' and 'disabled'
      chsVisitIndex: 1, //Current index being display (the visit page we're on). Base index is 1, not 0. Changes in increments of 5
     }
  }

  //////////////////////////////////////////
  //
  // BEGIN: Clinical Services Header Context (CSH)

  cshNavLeft = () => {
    this.setState((state, props)=>{

      let visitIndex = state.chsVisitIndex;
      visitIndex = visitIndex-5;
      return {chsVisitIndex:visitIndex};

    },
    this.csHeaderUpdate);
  }

  cshNavRight = () => {
    this.setState((state, props)=>{
      let visitIndex = state.chsVisitIndex;
      visitIndex = visitIndex+5;

      return {chsVisitIndex:visitIndex};
    },
    this.csHeaderUpdate);

  }

  /**
   * Five displayed buttons in the clinical services header.
   * The first is 1 and the 5th is 5, ... not 0 based.
   */
  cshButtonClicked = (btnIndex, buttonState) => {

    let newVisitState = false;

    if (buttonState === "select") {
      newVisitState = true;
    }

    this.setState((state,props)=>{
      let columnIndex = state.chsVisitIndex+btnIndex-1;

      let bcrowsCopy = {...state.bcrows};
      Object.values(bcrowsCopy).filter(this.isClinical).forEach(obj => {

        bcrowsCopy[obj.id].visitCount[columnIndex] = newVisitState;

        //check if row button needs updating and update it
        bcrowsCopy[obj.id].anyVistsNotSelected = (obj.visitCount.filter(v=>(!v)).length > 0);
      });

      return { bcrows:bcrowsCopy };
    }, 
    ()=>{this.csHeaderUpdate(); });//update header check buttons and update row check button.
  }

  // END:  Clinical Services Header Context
  //
  //////////////////////////////////////////




  //////////////////////////////////////////
  //
  // BEGIN: Clinical Services (CS) section

  cshSubjectsAndVisitsNeeded = (id) => {
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


  /**
   * updates each row in bcrows with a subject count and visit count array
   */
  bcimUpdateAllSubjectCountsAndVisitCounts = (subjectCount, visitCount) => {
    let bcrowsCopy = {...this.state.bcrows};

    Object.values(bcrowsCopy).filter(this.isClinical).forEach(obj => {
      bcrowsCopy[obj.id].subjectCount = subjectCount;

      //update the visit counts in each clinical services row
      let vcArray = [];
      for (let i=0; i<visitCount; i++) {
        vcArray.push(false);
      }
      bcrowsCopy[obj.id].visitCount = vcArray;

    });

    this.setState({ bcrows:bcrowsCopy });

    //now, ... update the visits header
    this.csHeaderUpdate();
  }

  /**
   * Check for selection status of each column of checkboxes AND check for no column, too.
   */
  cshUpdateCheckButtons = (state) => {
    let btnStates = [];

    for (let i=0; i<5; i++) {
      let columnExists = (state.bcimShowInfoVisitCount >= (state.chsVisitIndex + i));

      if (columnExists) {
        //check for select and deselect
        //TODO: if display optimization is needed, improve perfomance by finding any 'false' instead of all 'false' visitCount
        let visitCountIndex = state.chsVisitIndex + i - 1;
        let deselectedCheckboxFound = Object.values(state.bcrows).filter(obj=>{return (! obj.visitCount[ visitCountIndex ]);}).length > 0;

        let stateToPush = 'deselect';
        if (deselectedCheckboxFound) {
          stateToPush = 'select';
        }
        btnStates.push(stateToPush);
      }
      else {
        btnStates.push('disabled');
      }
      
    }

    return btnStates;
  }

  /**
   * Updates all the buttons in the Visits header
   */
  csHeaderUpdate = () => {
    this.setState((state,props)=>{
      //update arrows
      let leftArrow = "disabled";
      let rightArrow = "disabled";

      if (state.chsVisitIndex > 5) {
        leftArrow = "active";
      }

      let hasMoreVisitsToNavigate = ((state.bcimShowInfoVisitCount - state.chsVisitIndex) >= 5);
      if (hasMoreVisitsToNavigate) {
        rightArrow = "active";
      }

      //update check buttons
      let btnStates = this.cshUpdateCheckButtons(state);

      //okay, ... technically this is where the real update happens
      return {
        chsLeftNavState:leftArrow,
        chsRightNavState:rightArrow,
        chsBtnStates:btnStates};

    });
  }

  csUpdateSubjectCountById = (e, id) => {

    let bcrowsCopy = {...this.state.bcrows};
    bcrowsCopy[id].subjectCount = e.target.value;
    this.setState(
      { bcrows:bcrowsCopy },
      this.csUpdateClinicalTotals(id));
  }

  csUpdateColumnCheckButtonState = (visitIndex) => {

    this.setState((state, props) => {
      let rowsArray = Object.values(state.bcrows);
      let foundNotSelected = false;

      for (let i=0; i<rowsArray.length; i++) {
        if (! rowsArray[i].visitCount[visitIndex]) {
          foundNotSelected = true;
          break;
        }
      }

      let visibleColumn = visitIndex % 5;
      if (foundNotSelected != state.chsBtnStates[visibleColumn]) {
        let chsBtnStatesCopy = [...state.chsBtnStates];

        chsBtnStatesCopy[visibleColumn] = (foundNotSelected ? 'select' : 'deselect');
        return { chsBtnStates:chsBtnStatesCopy};
      }
      else {
        return {};
      }

    });

  }

  /**
   * Updates a row's check button, then calls the fuction to set the total per subject.
   */
  csUpdateRowCheckButtonState = (rowId) => {

    //check what the current state is vs what it should be before consuming cycles on creating a copy of bcrows
    this.setState((state, props) => {
      let visitsArray = state.bcrows[rowId].visitCount;
      let foundNotSelected = false;

      for (let i=0; i<visitsArray.length; i++) {
        if (! visitsArray[i]) {
          foundNotSelected = true;
          break;
        }
      }

      if (foundNotSelected != state.bcrows[rowId].anyVistsNotSelected) {
        let bcrowsCopy = {...state.bcrows};
        bcrowsCopy[rowId].anyVistsNotSelected = foundNotSelected;
        return { bcrows:bcrowsCopy};
      }
      else {
        return {};
      }
    }, ()=>{this.csUpdateClinicalTotals(rowId);});


  }

  /**
   * Called when a visit checkbox is clicked. After the checkbox state is updated, 
   * the check buttons on the column and row are updated if updateButtonsState=true.
   */
  csVisitChanged = (id, visitIndex, value) => {

    this.setState((state, props) => {
      let bcrowsCopy = {...state.bcrows};
      bcrowsCopy[id].visitCount[visitIndex] = value;
      return { bcrows:bcrowsCopy } 
    }, 
    ()=>{this.csUpdateColumnCheckButtonState(visitIndex); this.csUpdateRowCheckButtonState(id)});//update header check buttons and update row check button.
  }

  handleVisitRowButtonClicked = (id, select) => {
    console.log("handleVisitRowButtonClicked...");

    this.setState((state, props)=>{
      let visitCountLength = state.bcrows[id].visitCount.length;
      let bcrowsCopy = {...state.bcrows};


      for (let i=0; i<visitCountLength; i++) {
        if (state.bcrows[id].visitCount[i] != select) {
          bcrowsCopy[id].visitCount[i] = select;
        }
      }
      return { bcrows:bcrowsCopy };
    }, 
    ()=>{this.csHeaderUpdate(); this.csUpdateRowCheckButtonState(id)});//update header check buttons and update row check button.

  }

  csSetRowTotal = (rowId, bcrowsCopy) => {

    let numberOfVisits = bcrowsCopy[rowId].visitCount.filter(v=>(v)).length;
    let rowCostPerSubject = bcrowsCopy[rowId].costPerSubject;
    let subjectCount = bcrowsCopy[rowId].subjectCount;

    let totalRowCost = rowCostPerSubject * numberOfVisits * subjectCount;

    bcrowsCopy[rowId].totalCost = totalRowCost;
    return bcrowsCopy;
  }

  csTotalPerSubject = (state, rowId, bcrowsCopy) => {

      let costPerSubject = 0.00;
      let currentRow = state.bcrows[rowId];
      let yourCost = (state.fundingType=='federal_rate') ? currentRow.federal_rate : currentRow.industry_rate;
      let numberOfVisits = currentRow.visitCount.filter(obj => {return obj;}).length;

      costPerSubject = yourCost * numberOfVisits;
      bcrowsCopy[rowId].costPerSubject = costPerSubject;
      return bcrowsCopy;
  }

  /**
   * Calculate and Set Clinical Total Cost
   */
  csCalculateClinicalTotals = (bcrowsCopy) => {

    let reducer = (acc, row) => {return acc + row.totalCost;}
    let clinicalRows = Object.values(bcrowsCopy).filter(this.isClinical);
    let newClinicalTotal = clinicalRows.reduce( reducer, 0 );

    console.log("clinicalRows=",clinicalRows);
    console.log("newClinicalTotal="+newClinicalTotal);

    return newClinicalTotal;

    // let crt = {...this.state.clinicalRowsTotal};
    // let newClinicalTotal = Object.values( crt ).reduce( reducer, 0 );

    // this.setState({clinicalTotals: newClinicalTotal},);
  }

  csUpdateClinicalTotals = (rowId) => {

    this.setState((state,props) => {

      let bcrowsCopy = {...state.bcrows};
 
      bcrowsCopy = this.csTotalPerSubject(state, rowId, bcrowsCopy);
      bcrowsCopy = this.csSetRowTotal(rowId, bcrowsCopy);
      let newClinicalTotal = this.csCalculateClinicalTotals(bcrowsCopy);

      return { 
        bcrows:bcrowsCopy, 
        clinicalTotals:newClinicalTotal };
    }, this.calculateGrandTotals);
  }

  // END:  Clinical Services (CS) section
  //
  //////////////////////////////////////////




  /**
   * Grand Total for Budget
   */
  calculateGrandTotals = () => {
    this.setState((state, props) => {return {
      grandTotal: (state.nonclinicalTotals + state.clinicalTotals)
    }});
  }


  /**
   * Non-Clinical Totals for Budget  ////TODO: REFACTOR NON-CLINICAL TOTALS METHODS!!!
   */
  calculateNonclinicalTotals = () => {
    let reducer = (acc, cur) => {return acc + cur;}
    let ncrt = {...this.state.nonclinicalRowsTotal};
    let newClinicalTotal = Object.values( ncrt ).reduce( reducer, 0 );

    this.setState({nonclinicalTotals: newClinicalTotal},this.calculateGrandTotals);
  }

  addNonclinicalCost = (id, cost) => {
    let addedToNCC = {nonclinicalRowsTotal: 
        {
          ...this.state.nonclinicalRowsTotal,
        [id]:cost}}

    this.setState(
      addedToNCC,
      this.calculateNonclinicalTotals
    );
  }

  removeNonclinicalCost = (id) => {
    let updatedNCRT = {...this.state.nonclinicalRowsTotal};
    delete updatedNCRT[id];
    this.setState({
              nonclinicalRowsTotal: updatedNCRT
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
   * Take care of updates related to adding a service, such as updating the visits header selection buttons.
   */
  addServiceUpdates = (needsSubjectsAndVisits, serviceObj, oneTimeUseId) => {
    //first time a clinical service is added, we need to get the visit count and the subject count
    if (needsSubjectsAndVisits) {
      this.cshSubjectsAndVisitsNeeded(oneTimeUseId);
    }
    else {
      //update header buttons if clinical service added
      if (serviceObj.clinical == "1") {
        this.csHeaderUpdate();
      }
    }
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
    let needsSubjectsAndVisits = (! this.state.bcInfoModalUsedOnce) && parseInt(serviceObj["clinical"]);//use of this.state not causing issues

    this.setState((state, props) => {

      serviceObj["id"] = oneTimeUseId;
      serviceObj["key"] = oneTimeUseId;
      serviceObj["subjectCount"] = state.bcimShowInfoSubjectCount;
      
      serviceObj["visitCount"] = [];
      for (let i=0; i<state.bcimShowInfoVisitCount; i++) 
      {
        serviceObj["visitCount"].push(false);
      }

      serviceObj["anyVistsNotSelected"] = true;
      serviceObj["costPerSubject"] = 0.00;
      serviceObj["totalCost"] = 0.00;

      return ({
        bcrows: 
        { 
          ...state.bcrows, 
          [oneTimeUseId]:serviceObj
        }
      });
    }, () => {this.addServiceUpdates(needsSubjectsAndVisits, serviceObj, oneTimeUseId);});
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

          csUpdateSubjectCountById: this.csUpdateSubjectCountById,
          csVisitChanged: this.csVisitChanged,
          handleVisitRowButtonClicked: this.handleVisitRowButtonClicked,

        }}>
        {this.props.children}
      </BudgetContext.Provider>
     );
  }
}
 
export default BudgetProvider;