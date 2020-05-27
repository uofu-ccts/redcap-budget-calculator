import React, { Component } from 'react';
import TrashIcon from '../components/budgetcalculator/icons/TrashIcon';
import InfoCircleIcon from '../components/budgetcalculator/icons/InfoCircleIcon';
import BudgetUtils from '../js/BudgetUtils';

class NonClinicalRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id
    }

    let bu = new BudgetUtils();
    this.toDollars = bu.toDollars;
    this.validateTotalCost = bu.validateTotalCost;
  }

  handleTrash = (e) => {
    e.persist();
    this.props.removeBCService(e, this.props.id);
  }

  handleQtyCountChange = event => {
    event.persist();
    this.props.handleQtyCountChange(this.state.id, event.target.value);
  }

  render() { 
    return ( 
      <tr className="service-line-item" onInput={this.handleUpdateTotals}>
        <td style={{borderRightStyle:'hidden'}}> <span> <button className="delete btn btn-link" title="Delete" data-toggle="tooltip" onClick={this.handleTrash}><TrashIcon /></button> </span> </td>
        <td className="service-title"> <small>{this.props.core} &gt; {this.props.category} </small> <br /><span> {this.props.service} </span> <InfoCircleIcon description={this.props.description} /> </td>
        <td className="base-cost">{this.toDollars(this.props.industryrate)}</td>
        <td className="your-cost">{this.toDollars(this.props.yourCost)}  </td>
        <td>
            <input className="qty-count" type="number" min="1" value={this.props.quantity} onChange={this.handleQtyCountChange}/>
        </td>
        <td>{this.props.perServiceReadable[this.props.perService]}</td>
        <td className="non_clinical-blank" colSpan="7"></td>
        <td className="line-total">{this.toDollars(this.props.totalCost)}</td>
      </tr>

     );
  }
}
 
export default NonClinicalRow;