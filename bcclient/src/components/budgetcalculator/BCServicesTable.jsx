import React, { Component } from 'react';

import BCSubmitModal from './BCSubmitModal';
import BCSubmitSuccessModal from './BCSubmitSuccessModal';

import Button from "react-bootstrap/Button";

import BudgetClinicalRowsConsumer from '../../contexts/BudgetConsumerClinicalRows';
import BudgetNONClinicalRowsConsumer from '../../contexts/BudgetNONClinicalRowsConsumer';
import BCClincalHeader from './BCClincalHeader';

import BudgetTotal from '../../contexts/BudgetTotal';


class BCServicesTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSubmitSuccess:false,
      showBCSubmit: false
    }
  }


  //callback from the submit success modal
  submitSuccessCallback = () => {
    this.setState({showSubmitSuccess: false})
  }


  /////////////////////////////////////
  //BEGIN: submit button modal methods

  handleBCSubmitHide = () => this.setState({showBCSubmit: false});

  handleBCSubmitCallback = (values) => {
    //TODO: finish this method
    console.log(
      "handleBCSubmitCallback ... budgetTitle: " + values.budgetTitle + "; " +
      "username: " + values.username + "; " +
      "firstName: " + values.firstName + "; " +
      "lastName: " + values.lastName + "; " +
      "email: " + values.email + "; " +
      "irbNumber: " + values.irbNumber
    );
  }

  handleSubmitButtonClick = (e) => {
    this.setState({showBCSubmit:true});
  }

  //END: submit button modal methods
  /////////////////////////////////////



  handleSubjectsChange = (e) =>  {
    e.preventDefault();
    this.state.myCallback(this.textInput.current.value);
    this.state.myHide();
  }




  //"UIOWA_BudgetCalculator.updateTotals()"
  handleUpdateTotals = (e) =>  {
    e.preventDefault();
    this.state.myCallback(this.textInput.current.value);
    this.state.myHide();
  }

  handleQtyCountChange = (e) =>  {
    e.preventDefault();
    this.state.myCallback(this.textInput.current.value);
    this.state.myHide();
  }

  //"UIOWA_BudgetCalculator.updateTotals()"
  handleUpdateTotals = (e) =>  {
    e.preventDefault();
    this.state.myCallback(this.textInput.current.value);
    this.state.myHide();
  }


  render() {
    return ( 
      <div>
                        <table id="servicesTable" className="table table-bordered table-striped">
                            <tbody>
            <BCClincalHeader />
                            </tbody>
                            <tbody id="clinical">
            <BudgetClinicalRowsConsumer />
                            </tbody>
                            <tbody>
                                <tr className="bg-secondary text-white">
                                    <td colSpan="13" style={{textAlign: 'right', borderRightStyle:'hidden'}}>Clinical Total:</td>
                                    <td id="clinicalTotal"><BudgetTotal clinical /></td>
                                </tr>
                                <tr className="nonClinicalHeaders">
                                    <th style={{borderRightStyle:'hidden', width: '3%'}}> </th>
                                    <th style={{width: '25%'}}>
                    Non-Clinical Service </th>
                                    <th>
                    Base Cost </th>
                                    <th>
                    Your Cost </th>
                                    <th>
                    Quantity </th>
                                    <th>
                    Quantity Type </th>
                                    <th colSpan="7"> </th>
                                    <th>
                    Total Cost </th>
                                </tr>
                            </tbody>
                            <tbody id="non_clinical">
            <BudgetNONClinicalRowsConsumer />
                            </tbody>
                            <tbody>
                                <tr className="bg-secondary text-white">
                                    <td colSpan="13" style={{textAlign: 'right', borderRightStyle:'hidden'}}>Non-Clinical Total:</td>
                                    <td id="non_clinicalTotal"><BudgetTotal nonclinical /></td>
                                </tr>
                                <tr className="total-row">
                                    <td className="total-header" colSpan="13" style={{textAlign: 'right', borderRightStyle:'hidden'}}>Grand Total:</td>
                                    <td className="total"><BudgetTotal grand /></td>
                                </tr>
                            </tbody>
                        </table>
                        <form id="dirtyCheck" name="dirtyCheck" onSubmit={this.handleSubmit} className="dirty">
                            <input type="hidden" name="redcap_csrf_token" value="" />
                        </form>
                        <div className="action-button">
                            {/* <Button type="submit" variant="success" id="submit" onClick={this.handleSubmitButtonClick}>Submit</Button> */}
                        </div>

                        <BCSubmitModal showBCSubmit={this.state.showBCSubmit} handleBCSubmitCallback={this.handleBCSubmitCallback} handleBCSubmitHide={this.handleBCSubmitHide} />

                        <BCSubmitSuccessModal showSubmitSuccess={this.state.showSubmitSuccess} submitSuccessCallback={this.submitSuccessCallback} />

                    </div>
     );
  }
}
 
export default BCServicesTable;