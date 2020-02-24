import React, { Component } from 'react';
import TrashIcon from '../components/budgetcalculator/icons/TrashIcon';
import InfoCircleIcon from '../components/budgetcalculator/icons/InfoCircleIcon';
import BudgetUtils from '../js/BudgetUtils';

class NonClinicalRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      yourcost: ((props.fundingType=='federal_rate') ? props.federalrate : props.industryrate),
      quantity: 1,
      totalcost: 0
    }

    let bu = new BudgetUtils();
    this.toDollars = bu.toDollars;
  }

  componentDidMount() {
    // add total cost for non-clinical total
    this.setState(
      (state, props)=>{
        return {totalcost: this.validateTotalCost(state.yourcost * state.quantity)}
      },
      ()=>{
        this.props.addNonclinicalCost(this.state.id, this.state.totalcost);
      }
    );
  }

  handleTrash = (e) => {
    e.persist();
    this.props.removeBCService(e, this.props.id)

    //remove total cost from non-clinical total
    this.props.removeNonclinicalCost(this.props.id)
  }


  validateTotalCost = total => {
    return isNaN(total) ? 0 : total;
  }

  handleQtyCountChange = event => {
    let total = this.state.yourcost * event.target.value;
    let actualTotal = this.validateTotalCost(total);
    this.setState({
      quantity: event.target.value, 
      totalcost: actualTotal});

    //update total cost for non-clinical total
    this.props.addNonclinicalCost(this.props.id, actualTotal)

  }

  render() { 
    return ( 
      <tr className="service-line-item" onInput={this.handleUpdateTotals}>
        <td style={{borderRightStyle:'hidden'}}> <span> <button className="delete btn btn-link" title="Delete" data-toggle="tooltip" onClick={this.handleTrash}><TrashIcon /></button> </span> </td>
        <td className="service-title"> <small>{this.props.core} &gt; {this.props.category} </small> <br /><span> {this.props.service} </span> <InfoCircleIcon description={this.props.description} /> </td>
        <td className="base-cost">{this.toDollars(this.props.industryrate)}</td>
        <td className="your-cost">{this.toDollars(this.state.yourcost)}  </td>
        <td>
            <input className="qty-count" type="number" min="1" value={this.state.quantity} onChange={this.handleQtyCountChange}/>
        </td>
        <td>Q. Type</td>
        <td className="non_clinical-blank" colSpan="7"></td>
        <td className="line-total">{this.toDollars(this.state.totalcost)}</td>
      </tr>

     );
  }
}
 
export default NonClinicalRow;