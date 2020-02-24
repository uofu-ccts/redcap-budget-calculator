import React, { Component } from 'react';

import TrashIcon from '../components/budgetcalculator/icons/TrashIcon';
import InfoCircleIcon from '../components/budgetcalculator/icons/InfoCircleIcon';

import Button from 'react-bootstrap/Button';
import TimesIcon from '../components/budgetcalculator/icons/TimesIcon';
import CheckIcon from '../components/budgetcalculator/icons/CheckIcon';
import Form from 'react-bootstrap/Form';

import BudgetUtils from '../js/BudgetUtils';

class ClinicalRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      yourcost: ((props.fundingType=='federal_rate') ? props.federalrate : props.industryrate),
    }

    let bu = new BudgetUtils();
    this.toDollars = bu.toDollars;
  }

  handleTrash = (e) => {
    e.persist();
    this.props.removeBCService(e, this.props.id)
  }

  handleSubjectCountChange = event => {

    event.persist();
    this.props.csUpdateSubjectCountById(event, this.state.id);
  }

  chooseCheckboxType = (index, visitIndex, visitCount) => {//populate based off the context bcrow[<id>].visitCount

    //first, check to see if the current checkbox falls in the range of visits count, otherwise display a space instead of a checkbox
    if ((visitIndex + index) <= visitCount) {
      let checkOrNotCheck = [];
      let isChecked = false;

      let checkedStatusIndex = visitIndex + index - 1;

      try {
        if (
          (typeof this.props.bcrows !== 'undefined') && 
          (typeof this.props.bcrows[this.state.id] !== 'undefined') && 
          (typeof this.props.bcrows[this.state.id].visitCount !== 'undefined') ) {
          isChecked = this.props.bcrows[this.state.id].visitCount[checkedStatusIndex];
        }
      } catch(error) {
        console.log(error);
      }

      if (isChecked) {
        checkOrNotCheck.push(<Form.Check 
        key={index} 
        className="visit-checkbox" 
        checked={true} 
        onChange={() => this.props.csVisitChanged(this.state.id, checkedStatusIndex, false)}
        />);
      }
      else {
        checkOrNotCheck.push(<Form.Check 
        key={index} 
        className="visit-checkbox" 
        checked={false} 
        onChange={() => this.props.csVisitChanged(this.state.id, checkedStatusIndex, true)} />);
      }
      return checkOrNotCheck;
    } 
    else {
      return ' ';
    }
  }

  getCheckboxes = (visitIndex, visitCount) => {
    let cells = [];
    for (let i=0; i<5; i++) {
      cells.push(
        <td key={i} className="visit-column">
          {this.chooseCheckboxType(i, visitIndex, visitCount)}
        </td>
      );
    }
    return cells;
  }

  handleVisitButton = (select) =>{
    //For speed, only set the checkbox state if it is different than requested
    //      this prevents wasted cycles re-checking the column buttons' state
    //TODO: Optimization bonus points, ... only update the row button view when all 
    //      the visits have been changed
    this.props.handleVisitRowButtonClicked(this.state.id, select);
  }

  getCheckButton = () => {
    if (this.props.anyVistsNotSelected) {
      return (<Button variant="success" className="check-row-button" style={{width: '40px'}} onClick={()=>{this.handleVisitButton(true)}}><CheckIcon /></Button>);//TODO: add onClicked
    }
    else {
      return (<Button variant="danger" className="check-row-button" style={{width: '40px'}} onClick={()=>{this.handleVisitButton(false)}}><TimesIcon /></Button>);//TODO: add onClicked
    }
  }

  render() { 
    return ( 
      <tr className="service-line-item" onInput={this.handleUpdateTotals}>
          <td style={{borderRightStyle:'hidden'}}> <span> <button className="delete btn btn-link" title="Delete" data-toggle="tooltip" onClick={this.handleTrash}><TrashIcon /></button> </span> </td>
          <td className="service-title"> <small>{this.props.core} &gt; {this.props.category} </small> <br /><span> {this.props.service} </span> <InfoCircleIcon description={this.props.description} /> </td>
          <td className="base-cost">{this.toDollars(this.props.industryrate)}</td>
          <td className="your-cost">{(this.props.fundingType=='federal_rate') ? this.toDollars(this.props.federalrate) : this.toDollars(this.props.industryrate)}  </td>
          <td>
              <input className="qty-count" type="number" min="1" value={this.props.subjectCount} onChange={this.handleSubjectCountChange} />
          </td>
          <td>Q. Type</td>
          <td className="allVisits">
              {this.getCheckButton()}
          </td>
          {this.getCheckboxes(this.props.chsVisitIndex, this.props.bcimShowInfoVisitCount)}
          <td className="line-total-per-patient">{this.toDollars(this.props.costPerSubject)}</td>
          <td className="line-total">{this.toDollars(this.props.totalCost)}</td>
      </tr>
     );
  }
}
 
export default ClinicalRow;