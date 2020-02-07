import React, {Component} from 'react';
import BudgetContext from './BudgetContext';

class BudgetProvider extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      fundingType: '',
      bcrows: {},
      
      nonclinicalRowTotals: {},
      clinicalRowsTotal: {},

      nonclinicalTotals: 0,
      clinicalTotals: 0,
      grandTotal: 0,

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

  addBCService = (e, serviceRow) => {
            e.persist();
            e.preventDefault();

            // Good for a few thousand budget items without worrying about collisions.
            let oneTimeUseId = '_' + Math.random().toString(36).substr(2, 9);

            let serviceObj = JSON.parse(serviceRow)[0];
            serviceObj["id"] = oneTimeUseId;
            serviceObj["key"] = oneTimeUseId;

            this.setState({
              bcrows: 
              { 
                ...this.state.bcrows, 
                [oneTimeUseId]:serviceObj
              }
            })
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
          cshButtonClicked: this.cshButtonClicked

        }}>
        {this.props.children}
      </BudgetContext.Provider>
     );
  }
}
 
export default BudgetProvider;