import React, { Component } from 'react';

import CheckIcon from './icons/CheckIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';
import TrashIcon from './icons/TrashIcon';
import InfoCircleIcon from './icons/InfoCircleIcon';

import BCSubmitModal from './BCSubmitModal';
import BCSubmitSuccessModal from './BCSubmitSuccessModal';

import Button from "react-bootstrap/Button";


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
                                <tr className="clinicalHeaders">
                                    <th rowSpan="3" style={{borderRightStyle: 'hidden', width: '3%'}}> </th>
                                    <th rowSpan="3" style={{width: '25%'}}>
                        Clinical Service </th>
                                    <th rowSpan="3">
                        Base Cost </th>
                                    <th rowSpan="3">
                        Your Cost </th>
                                    <th rowSpan="3">
                        Subjects </th>
                                    <th rowSpan="3">
                        Quantity Type </th>
                                    <th className="hide-border">
                                        <div>
                                            <button id="prevVisitsBtn" disabled="" className="btn btn-primary"><ArrowLeftIcon /></button>
                                        </div>
                                    </th>
                                    <th className="hide-border" colSpan="4">Visits</th>
                                    <th className="hide-border">
                                        <div>
                                            <button id="nextVisitsBtn" className="btn btn-primary"><ArrowRightIcon /></button>
                                        </div>
                                    </th>
                                    <th rowSpan="3">
                        Cost Per Subject </th>
                                    <th rowSpan="3" style={{width: '10%'}}>
                        Total Cost </th>
                                </tr>
                                <tr className="visit-header-row">
                                    <td rowSpan="2"></td>
                                    <td><b className="visit-header">1</b></td>
                                    <td><b className="visit-header">2</b></td>
                                    <td><b className="visit-header">3</b></td>
                                    <td><b className="visit-header">4</b></td>
                                    <td><b className="visit-header">5</b></td>
                                </tr>
                                <tr>
                                    <td className="check-all-column" data-id="1">
                                        <button className="btn btn-success check-column-button" style={{width: '40px'}} value="all"><CheckIcon /></button>
                                    </td>
                                    <td className="check-all-column" data-id="2">
                                        <button className="btn btn-success check-column-button" style={{width: '40px'}} value="all"><CheckIcon /></button>
                                    </td>
                                    <td className="check-all-column" data-id="3">
                                        <button className="btn btn-success check-column-button" style={{width: '40px'}} value="all"><CheckIcon /></button>
                                    </td>
                                    <td className="check-all-column" data-id="4">
                                        <button className="btn btn-success check-column-button" style={{width: '40px'}} value="all"><CheckIcon /></button>
                                    </td>
                                    <td className="check-all-column" data-id="5">
                                        <button className="btn btn-success check-column-button" style={{width: '40px'}} value="all"><CheckIcon /></button>
                                    </td>
                                </tr>
                            </tbody>
                            <tbody id="clinical">
                                <tr id="clinicalEmpty" style={{display: 'none'}}>
                                    <td colSpan="14">No services added</td>
                                </tr>
                                <tr className="service-line-item" onInput={this.handleUpdateTotals}>
                                    <td style={{borderRightStyle:'hidden'}}> <span> <button className="delete btn btn-link" title="Delete" data-toggle="tooltip"><TrashIcon /></button> </span> </td>
                                    <td className="service-title"> <small>Clinical Research Unit &gt; Bionutrition </small> <br /><span> Beverage Service </span> <InfoCircleIcon data-toggle="tooltip" title=" Meal service for 1 beverage (soda pop, juice, coffee, tea). " /> </td>
                                    <td className="base-cost">$70.00</td>
                                    <td className="your-cost">$70.00  </td>
                                    <td>
                                        <input className="qty-count" type="number" min="1" value="20" onChange={this.handleSubjectsChange} />
                                    </td>
                                    <td>Beverages</td>
                                    <td className="allVisits">
                                        <button className="btn btn-success check-row-button" style={{width: '40px'}} value="all"><CheckIcon /></button>
                                    </td>
                                    <td className="visit-column">
                                        <input type="checkbox" className="visit-checkbox" data-id="0" />
                                    </td>
                                    <td className="visit-column">
                                        <input type="checkbox" className="visit-checkbox" data-id="1" />
                                    </td>
                                    <td className="visit-column">
                                        <input type="checkbox" className="visit-checkbox" data-id="2" />
                                    </td>
                                    <td className="visit-column">
                                        <input type="checkbox" className="visit-checkbox" data-id="3" />
                                    </td>
                                    <td className="visit-column">
                                        <input type="checkbox" className="visit-checkbox" data-id="4" />
                                    </td>
                                    <td className="line-total-per-patient">$0.00</td>
                                    <td className="line-total">$0.00</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr className="bg-secondary text-white">
                                    <td colSpan="13" style={{textAlign: 'right', borderRightStyle:'hidden'}}>Clinical Total:</td>
                                    <td id="clinicalTotal">$0.00</td>
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
                                <tr id="non_clinicalEmpty" style={{display: 'none'}}>
                                    <td colSpan="14">No services added</td>
                                </tr>
                                <tr className="service-line-item" onInput={this.handleUpdateTotals}>
                                    <td style={{borderRightStyle:'hidden'}}> <span> <button className="delete btn btn-link" title="Delete" data-toggle="tooltip"><TrashIcon /></button> </span> </td>
                                    <td className="service-title"> <small>Clinical Research Coordination and Study Management &gt; Coordinator Core </small> <br /><span> Budget and Contract Development Services </span> <InfoCircleIcon data-toggle="tooltip" title=" Experienced staff will assist with the  industry contract, prepare a budget in accordance with institutional and funding entity guidelines; assist with budget negotiation; create a study-tracking; and perform periodic post-award financial monitoring. " /> </td>
                                    <td className="base-cost">$100.00</td>
                                    <td className="your-cost">$100.00  </td>
                                    <td>
                                        <input className="qty-count" type="number" min="1" value="1" onChange={this.handleQtyCountChange}/>
                                    </td>
                                    <td>Hours</td>
                                    <td className="non_clinical-blank" colSpan="7"></td>
                                    <td className="line-total">$100.00</td>
                                </tr>
                                <tr className="service-line-item" onInput={this.handleUpdateTotals}>
                                    <td style={{borderRightStyle:'hidden'}}> <span> <button className="delete btn btn-link" title="Delete" data-toggle="tooltip"><TrashIcon /></button> </span> </td>
                                    <td className="service-title"> <small>Biomedical Informatics Core &gt; REDCap (Research Electronic Data Capture) </small> <br /><span> REDCap ICON Course (Training) </span> <InfoCircleIcon data-toggle="tooltip" title=" Take our self paced online REDCap training in ICON.     The REDCap course prepares you for the basics of form and survey design in REDCap.     A certificate of completion is awarded upon successful completion of the course. " /> </td>
                                    <td className="base-cost">$0.00</td>
                                    <td className="your-cost">$0.00  </td>
                                    <td>
                                        <input className="qty-count" type="number" min="1" value="1" onChange={this.handleQtyCountChange}/>
                                    </td>
                                    <td>Consult</td>
                                    <td className="non_clinical-blank" colSpan="7"></td>
                                    <td className="line-total">$0.00</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr className="bg-secondary text-white">
                                    <td colSpan="13" style={{textAlign: 'right', borderRightStyle:'hidden'}}>Non-Clinical Total:</td>
                                    <td id="non_clinicalTotal">$100.00</td>
                                </tr>
                                <tr className="total-row">
                                    <td className="total-header" colSpan="13" style={{textAlign: 'right', borderRightStyle:'hidden'}}>Grand Total:</td>
                                    <td className="total">$100.00</td>
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