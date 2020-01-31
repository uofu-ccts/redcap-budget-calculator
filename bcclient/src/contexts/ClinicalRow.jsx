import React, { Component } from 'react';

import TrashIcon from '../components/budgetcalculator/icons/TrashIcon';
import InfoCircleIcon from '../components/budgetcalculator/icons/InfoCircleIcon';
import CheckIcon from '../components/budgetcalculator/icons/CheckIcon';

class ClinicalRow extends Component {
  constructor(props) {
    super(props);
    this.state = {   }
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

  render() { 
    return ( 
      <tr className="service-line-item" onInput={this.handleUpdateTotals}>
          <td style={{borderRightStyle:'hidden'}}> <span> <button className="delete btn btn-link" title="Delete" data-toggle="tooltip" onClick={this.handleTrash}><TrashIcon /></button> </span> </td>
          <td className="service-title"> <small>{this.props.core} &gt; {this.props.category} </small> <br /><span> {this.props.service} </span> <InfoCircleIcon description={this.props.description} /> </td>
          <td className="base-cost">{this.toDollars(this.props.industryrate)}</td>
          <td className="your-cost">{(this.props.fundingType=='federal_rate') ? this.toDollars(this.props.federalrate) : this.toDollars(this.props.industryrate)}  </td>
          <td>
              <input className="qty-count" type="number" min="1" value="20" onChange={this.handleSubjectsChange} />
          </td>
          <td>Q. Type</td>
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
     );
  }
}
 
export default ClinicalRow;