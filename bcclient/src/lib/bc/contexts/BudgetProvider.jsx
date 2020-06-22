import React, {Component} from 'react';
import BudgetContext from './BudgetContext';

import BudgetUtils from '../js/BudgetUtils';
import PerServiceData from '../js/PerServiceData';

import {bcConfig} from '../js/config';

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

        fundingType: bcConfig.presetFundingType ? bcConfig.presetFundingType : '', // Determines the "Your Cost" column. Set by the BCWelcomeModal.
        bcrows: {}, // All clinical and non-clinical rows for virtual DOM to display. Authoritative row state **SHOULD BE** preserved here, and not in the row components.
        
        // nonclinicalRowsTotal: {}, // calculated totals associated with rows' ID //TODO: Old design. Planning to refactor into bcrows
        // clinicalRowsTotal: {}, // calculated totals associated with rows' ID //TODO: Old design. Planning to refactor into bcrows

        nonclinicalTotals: 0, // for display in UI
        clinicalTotals: 0, // for display in UI
        grandTotal: 0, // for display in UI

        chsLeftNavState: 'disabled', //nav states, ... 'active' and 'disabled'
        chsRightNavState: 'disabled',
        chsBtnStates: ['disabled','disabled','disabled','disabled','disabled'], //button states, ... 'select', 'deselect' and 'disabled'
        chsVisitIndex: 1, // Current index being display (the visit page we're on). Base index is 1, not 0. Changes in increments of 5

        perService: {} // human readable quantity types
      }

    this.perServiceData = new PerServiceData();
    this.perServiceData.fetchPerServicesFromApi(this.psdSetPerService);

    let bu = new BudgetUtils();
    this.isClinical = bu.isClinical;
    this.isNotClinical = bu.isNotClinical;
  }
  
  
  //////////////////////////////////////////
  //
  // BEGIN: Per Service Data

  psdSetPerService = (perServiceArray) => {
    this.setState((state, props) =>{
      return {perService:perServiceArray};
    });
  }

  // END:  Per Service Data
  //
  //////////////////////////////////////////


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
    ()=>{this.csHeaderUpdate();});//update header check buttons and update row check button *AND* totals.
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

    //limit searched bcrows to the clinical rows
    let clinicalRows = Object.values(state.bcrows).filter(this.isClinical);


    for (let i=0; i<5; i++) {
      let columnExists = (state.bcimShowInfoVisitCount >= (state.chsVisitIndex + i));

      if (columnExists && clinicalRows.length > 0) {
        //check for select and deselect
        //TODO: if display optimization is needed, improve perfomance by finding any 'false' instead of all 'false' visitCount
        let visitCountIndex = state.chsVisitIndex + i - 1;
        let deselectedCheckboxFound = Object.values(clinicalRows).filter(obj=>{return (! obj.visitCount[ visitCountIndex ]);}).length > 0;

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

    },  ()=>{this.cshUpdateAllClinicalTotals()});
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
      console.log("pts-69:csUpdateColumnCheckButtonState->visitIndex",visitIndex);
      console.log("pts-69:csUpdateColumnCheckButtonState->state",state);

      let rowsArray = Object.values(state.bcrows);
      let foundNotSelected = false;

      for (let i=0; i<rowsArray.length; i++) {
        if (! rowsArray[i].visitCount[visitIndex]) {
          foundNotSelected = true;
          break;
        }
      }

      let visibleColumn = visitIndex % 5;
      if (foundNotSelected !== state.chsBtnStates[visibleColumn]) {
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

      if (foundNotSelected !== state.bcrows[rowId].anyVistsNotSelected) {
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
      console.log("pts-69:csVisitChange->state",state);
      console.log("pts-69:csVisitChange->visitIndex",visitIndex);
      console.log("pts-69:csVisitChange->value",value);

      let bcrowsCopy = {...state.bcrows};
      bcrowsCopy[id].visitCount[visitIndex] = value;
      return { bcrows:bcrowsCopy } 
    }, 
    ()=>{this.csUpdateColumnCheckButtonState(visitIndex); this.csUpdateRowCheckButtonState(id)});//update header check buttons and update row check button.
  }

  handleVisitRowButtonClicked = (id, select) => {
    this.setState((state, props)=>{
      let visitCountLength = state.bcrows[id].visitCount.length;
      let bcrowsCopy = {...state.bcrows};


      for (let i=0; i<visitCountLength; i++) {
        if (state.bcrows[id].visitCount[i] !== select) {
          bcrowsCopy[id].visitCount[i] = select;
        }
      }
      return { bcrows:bcrowsCopy };
    }, 
    ()=>{this.csHeaderUpdate(); this.csUpdateRowCheckButtonState(id)});//update header check buttons and update row check button.

  }

  csSetRowTotal = (rowId, bcrowsCopy) => {

    // let numberOfVisits = bcrowsCopy[rowId].visitCount.filter(v=>(v)).length;
    let rowCostPerSubject = bcrowsCopy[rowId].costPerSubject;
    let subjectCount = bcrowsCopy[rowId].subjectCount;

    let totalRowCost = rowCostPerSubject * subjectCount;

    bcrowsCopy[rowId].totalCost = totalRowCost;
    return bcrowsCopy;
  }

  csTotalPerSubject = (state, rowId, bcrowsCopy) => {

      let costPerSubject = 0.00;
      let currentRow = state.bcrows[rowId];
      let yourCost = (state.fundingType==='federal_rate') ? currentRow.federal_rate : currentRow.industry_rate;
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

    return newClinicalTotal;
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

  cshUpdateAllClinicalTotals = () => {//TODO: move to correct section or rename

    this.setState((state,props) => {

      let bcrowsCopy = {...state.bcrows};
      let clinicalRows = Object.values(bcrowsCopy).filter(this.isClinical);

      // console.log("names are ... ",clinicalRows);

      for (let i=0; i<clinicalRows.length; i++) {
        bcrowsCopy = this.csTotalPerSubject(state, clinicalRows[i].key, bcrowsCopy);
        bcrowsCopy = this.csSetRowTotal(clinicalRows[i].key, bcrowsCopy);
      }

      let newClinicalTotal = this.csCalculateClinicalTotals(bcrowsCopy);

      return { 
        bcrows:bcrowsCopy, 
        clinicalTotals:newClinicalTotal };
    }, this.calculateGrandTotals);
  }

  // END:  Clinical Services (CS) section
  //
  //////////////////////////////////////////



  //////////////////////////////////////////
  //
  // BEGIN: NON-Clinical Services (NCS) section


  /**
   * Non-Clinical Totals for Budget
   */
  ncsCalculateNonclinicalTotals = () => {
    let reducer = (acc, cur) => {return acc + cur.totalCost;}

    this.setState((state, props) => {
      let ncrt = Object.values(state.bcrows).filter(this.isNotClinical);
      let newClinicalTotal = ncrt.reduce( reducer, 0 );
      return {nonclinicalTotals: newClinicalTotal}
    },
    this.calculateGrandTotals);
  }

  // END:  NON-Clinical Services (NCS) section
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
  // calculateNonclinicalTotals = () => {
  //   let reducer = (acc, cur) => {return acc + cur;}
  //   let ncrt = {...this.state.nonclinicalRowsTotal};
  //   let newClinicalTotal = Object.values( ncrt ).reduce( reducer, 0 );

  //   this.setState({nonclinicalTotals: newClinicalTotal},this.calculateGrandTotals);
  // }

  // addNonclinicalCost = (id, cost) => {
  //   let addedToNCC = {nonclinicalRowsTotal: 
  //       {
  //         ...this.state.nonclinicalRowsTotal,
  //       [id]:cost}}

  //   this.setState(
  //     addedToNCC,
  //     this.calculateNonclinicalTotals
  //   );
  // }

  // removeNonclinicalCost = (id) => {
  //   let updatedNCRT = {...this.state.nonclinicalRowsTotal};
  //   delete updatedNCRT[id];
  //   this.setState({
  //             nonclinicalRowsTotal: updatedNCRT
  //           }, this.calculateNonclinicalTotals);
  // }




  /**
   * Used as callback from BCWelcomeModal.
   */
  setFundingType = (e, fundingType) => {
    this.setState({ fundingType: fundingType });
    if (this.state.bcrows !== {}) {
      this.cshUpdateAllClinicalTotals();
      this.ncsCalculateNonclinicalTotals();
    }
  }


  handleQtyCountChange = (rowId, value) => {
    let rowNotClinical;

    this.setState((state, props) => {
      let updatedBCRows = {...state.bcrows};

      rowNotClinical = this.isNotClinical(updatedBCRows[rowId]);

      updatedBCRows[rowId].quantity = value;

      if (rowNotClinical) { // this might cause an issue with rate changing for yourCost
        updatedBCRows[rowId].totalCost = updatedBCRows[rowId].yourCost * updatedBCRows[rowId].quantity;
      }
      else {
        //TODO: handle clinical total change
      }
 
      return {bcrows: updatedBCRows};
    }, () => {
      //call the correct function based off the clinical type
      if (rowNotClinical) {
        this.ncsCalculateNonclinicalTotals();
      }
      else {
        //TODO: calculate the clinical totals and grand total for UI
      }
    });

  }


  /**
   * Removes a row from the bcrows state.
   * Don't forget to update totals and grand total.
   */
  removeBCService = (e, serviceId) => {
    let rowIsClinical;

    this.setState((state, props) => {
      let updatedBCRows = {...state.bcrows};

      rowIsClinical = this.isNotClinical(updatedBCRows[serviceId]);

      delete updatedBCRows[serviceId];
      return {bcrows: updatedBCRows};
    }, () => {
      //call the correct function based off the clinical type
      if (rowIsClinical) {
        this.ncsCalculateNonclinicalTotals();
      }
      else {
        //calculate the clinical totals and grand total for UI
        this.cshUpdateAllClinicalTotals();
        //update column buttons
        this.csHeaderUpdate();
      }
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
      if (serviceObj.clinical === "1") {
        this.csHeaderUpdate();
      }
    }
  }

  /**
   * ServiceMenuItems call this context method to add instances of 
   * service rows to state.bcrows for display in the UI.
   */
  addBCService = (e, serviceRow) => {
    e.persist();
    e.preventDefault();

    let bu = new BudgetUtils();

    // Creating an ID/key for this service row
    // Good for a few thousand budget items without worrying about collisions.
    let oneTimeUseId = '_' + Math.random().toString(36).substr(2, 9);

    let serviceObj = JSON.parse(serviceRow)[0];//NOTE: snake case property names will end up in the object

    // If this is a clinical service, then it needs subjects and visits pre-populated to defaults
    // Use of this.state won't cause issues because the value used here does not change.
    let needsSubjectsAndVisits = (! this.state.bcInfoModalUsedOnce) && parseInt(serviceObj["clinical"]);

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

      serviceObj["yourCost"] = bu.findYourRate(state.fundingType, serviceObj.federal_rate, serviceObj.industry_rate);
      serviceObj["quantity"] = 1;
      serviceObj["totalCost"] = serviceObj.yourCost * serviceObj.quantity;

      return ({
        bcrows: 
        { 
          ...state.bcrows, 
          [oneTimeUseId]:serviceObj
        }
      });
    }, () => {
      this.addServiceUpdates(needsSubjectsAndVisits, serviceObj, oneTimeUseId);
    
      //call the correct function based off the clinical type
      if (this.isNotClinical(serviceObj)) {
        this.ncsCalculateNonclinicalTotals();
      }
      else {
        //TODO: calculate the clinical totals and grand total for UI
      }
    });
  }

  render() { 
    
    return ( 
      <BudgetContext.Provider
        value={{
          bcstate: this.state,
          bcrows: this.state.bcrows,
          fundingType: this.state.fundingType,
          // toggleFundingType: this.toggleFundingType,

          nonclinicalTotals: this.state.nonclinicalTotals,
          clinicalTotals: this.state.clinicalTotals,
          grandTotal: this.state.grandTotal,

          perService: this.state.perService,

          // addNonclinicalCost: this.addNonclinicalCost,
          // removeNonclinicalCost: this.removeNonclinicalCost,

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

          handleQtyCountChange: this.handleQtyCountChange

        }}>
        {this.props.children}
      </BudgetContext.Provider>
     );
  }
}
 
export default BudgetProvider;