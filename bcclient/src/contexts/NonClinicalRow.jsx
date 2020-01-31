import React, { Component } from 'react';
import TrashIcon from '../components/budgetcalculator/icons/TrashIcon';
import InfoCircleIcon from '../components/budgetcalculator/icons/InfoCircleIcon';

class NonClinicalRow extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }

  handleTrash = (e) => {
    e.persist();
    this.props.removeBCService(e, this.props.id)
  }

  render() { 
    // console.log("test2...");

    return ( 
      <tr className="service-line-item" onInput={this.handleUpdateTotals}>
        <td style={{borderRightStyle:'hidden'}}> <span> <button className="delete btn btn-link" title="Delete" data-toggle="tooltip" onClick={this.handleTrash}><TrashIcon /></button> </span> </td>
        <td className="service-title"> <small>{this.props.core} &gt; {this.props.category} </small> <br /><span> {this.props.service} </span> <InfoCircleIcon data-toggle="tooltip" title={this.props.description} /> </td>
        <td className="base-cost">${this.props.industryrate}</td>
        <td className="your-cost">${this.props.federalrate}  </td>
        <td>
            <input className="qty-count" type="number" min="1" value="1" onChange={this.handleQtyCountChange}/>
        </td>
        <td>Q. Type</td>
        <td className="non_clinical-blank" colSpan="7"></td>
        <td className="line-total">$100.00</td>
      </tr>

     );
  }
}
 
export default NonClinicalRow;