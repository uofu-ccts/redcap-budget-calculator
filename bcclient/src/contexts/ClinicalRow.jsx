import React, { Component } from 'react';

import TrashIcon from '../components/budgetcalculator/icons/TrashIcon';
import InfoCircleIcon from '../components/budgetcalculator/icons/InfoCircleIcon';
import CheckIcon from '../components/budgetcalculator/icons/CheckIcon';

class ClinicalRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      yourcost: ((props.fundingType=='federal_rate') ? props.federalrate : props.industryrate),
      totalcost: 0
    }
  }

  handleTrash = (e) => {
    e.persist();
    this.props.removeBCService(e, this.props.id)
  }

  toDollars = dollars => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(dollars);
  }

  handleSubjectCountChange = event => {

    event.persist();
    this.props.csUpdateSubjectCountById(event, this.state.id);

    //let total = this.state.yourcost * event.target.value;//TODO: uncomment
    //let actualTotal = this.validateTotalCost(total);//TODO: uncomment
    //this.setState({
      //subjectCount: event.target.value//, //TODO: set callback value in budget context
      //totalcost: actualTotal//TODO: uncomment
      //});

    //update total cost for non-clinical total
    //this.props.addNonclinicalCost(this.props.id, actualTotal)//TODO: uncomment
    // console.log("changed state of ClincalRow.state.subjectCount to "+event.target.value)
  }

  chooseCheckboxType = (index, visitIndex, visitCount) => {
    if ((visitIndex + index) <= visitCount) {
      return(<input type="checkbox" className="visit-checkbox" />);
    } 
    else {
      return ' ';
    }
  }

  getCheckboxes = (visitIndex, visitCount) => {
    // console.log("m1 visitIndex="+visitIndex+"; visitCount="+visitCount);
    let cells = [];
    for (let i=0; i<5; i++) {
      cells.push(
        <td className="visit-column">
          {this.chooseCheckboxType(i, visitIndex, visitCount)}
        </td>
      );
    }
    return cells;
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
              <button className="btn btn-success check-row-button" style={{width: '40px'}} value="all"><CheckIcon /></button>
          </td>
          {this.getCheckboxes(this.props.chsVisitIndex, this.props.bcimShowInfoVisitCount)}
          <td className="line-total-per-patient">$0.00</td>
          <td className="line-total">$0.00</td>
      </tr>
     );
  }
}
 
export default ClinicalRow;