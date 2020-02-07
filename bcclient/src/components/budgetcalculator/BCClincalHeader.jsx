import React, { Component } from 'react';

import BudgetContext from '../../contexts/BudgetContext';

import TimesIcon from './icons/TimesIcon';
import MinusIcon from './icons/MinusIcon';
import CheckIcon from './icons/CheckIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

import Button from 'react-bootstrap/Button';

/**
 * State for this component must be kept in the BudgetProvider (context),
 * because is needs to be modified based off the state of the clinical service rows.
 */
class BCClincalHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {  }
  }

  getColumButtons = (buttonStates) => {
    let retval = [];
    let rowCount = buttonStates.length;

    let variant;// "success", "secondary" or "danger"
    let disabled;
    let icon;//<CheckIcon />, <TimesIcon /> or <MinusIcon />

    for (let i=0; i<rowCount; i++) {
      if (buttonStates[i] === "select") {
        variant = "success";
        disabled = false;
        icon = <CheckIcon />;
      }
      else if (buttonStates[i] === "deselect") {
        variant = "danger";
        disabled = false;
        icon = <TimesIcon />;
      }
      else if (buttonStates[i] === "disabled") {
        variant = "secondary";
        disabled = true;
        icon = <MinusIcon />;
      }
      retval.push(<td key={i}><Button variant={variant} disabled={disabled} className="check-column-button" style={{width: '40px'}}>{icon}</Button></td>);
    }
    
    return retval;
  }

  getColumNumbers = (baseIndex) => {
    let retval = [];
    let rowCount = 5;

    for (let i=0; i<rowCount; i++) {
      retval.push(<td key={i}><b className="visit-header">{baseIndex + i}</b></td>);
    }
    
    return retval;
  }

  render() { 
    return ( 
      <BudgetContext.Consumer>
          {context => (
              <>
                <tr className="clinicalHeaders">
                  <th rowSpan="3" style={{borderRightStyle: 'hidden', width: '3%'}}> </th>
                  <th rowSpan="3" style={{width: '25%'}}> Clinical Service </th>
                  <th rowSpan="3"> Base Cost </th>
                  <th rowSpan="3"> Your Cost </th>
                  <th rowSpan="3"> Subjects </th>
                  <th rowSpan="3"> Quantity Type </th>
                  <th className="hide-border">
                      <div>
                        <Button variant="primary" disabled={context.chsLeftNavState === 'disabled' ? true : false}><ArrowLeftIcon /></Button>
                      </div>
                  </th>
                  <th className="hide-border" colSpan="4">Visits</th>
                  <th className="hide-border">
                      <div>
                        <Button variant="primary" disabled={context.chsRightNavState === 'disabled' ? true : false}><ArrowRightIcon /></Button>
                      </div>
                  </th>
                  <th rowSpan="3"> Cost Per Subject </th>
                  <th rowSpan="3" style={{width: '10%'}}> Total Cost </th>
                </tr>
                <tr className="visit-header-row">
                    <td rowSpan="2"></td>
                    {this.getColumNumbers(context.chsVisitIndex)}
                </tr>
                <tr>
                    {this.getColumButtons(context.chsBtnStates)}
                </tr>
              </>
          )}
      </BudgetContext.Consumer>
     );
  }
}
 
export default BCClincalHeader;