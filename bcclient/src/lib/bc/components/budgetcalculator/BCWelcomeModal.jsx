import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import { bcConfig } from '../../js/config';

class BCWelcomeModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showWelcome: props.showWelcome,
      welcomeCallback: props.welcomeCallback,
      buttonActive: false,
      setFundingType: props.setFundingType
    }
    this.selection = React.createRef();
  }

  handleCheck = (e) => this.setState({buttonActive: e.target.checked});

  handleSubmit = (e) => {
    e.preventDefault();
    this.state.setFundingType(e, this.selection.current.value === bcConfig.fundingLabels[0] ? 'industry_rate' : 'federal_rate');
    this.state.welcomeCallback( this.selection.current.value );
    this.setState({showWelcome: false})

  }

  render() { 
    
    const optionRows = bcConfig.fundingLabels.map( label => {
      return <option key={label} value={label}>{label}</option>
    })

    return (
      <Modal id="welcomeModal" centered backdrop="static" show={this.props.showWelcome} aria-labelledby="welcomeModal" aria-hidden="true">
          <div role="document">
            <Form id="welcomeForm" onSubmit={this.handleSubmit}>
            <Modal.Body>
              <p>Please set or update your funding type below.</p>
              {/* reword this for using it both at the beginning and when changing */}
                {/* Thank you for using the Budget Calculator!  */}

                <Form.Row>
                    <Form.Group className="initial-info">
                      <Form.Label htmlFor="fundingType">
                        <b>Funding Type:</b>
                      </Form.Label>
                      <Form.Control className="info-field" as="select" id="fundingType" name="fundingType" ref={this.selection} required>
                        <option value="">---Select---</option>
                        {optionRows}
                        {/* <option value="industry_rate">Industry Rate</option>
                        <option value="federal_rate">Federal Rate</option> */}
                      </Form.Control>
                    </Form.Group>
                </Form.Row>

                <Form.Row className="welcomeOnly">
                  <Form.Check>
                    <FormCheck.Input type="checkbox" id="termsCheckbox" name="termsCheckbox"  onChange={this.handleCheck} />
                    <Form.Label htmlFor="termsCheckbox">
                      I understand that this tool is intended for budgeting purposes only and rates are subject to change.
                    </Form.Label>
                  </Form.Check>
                </Form.Row>

                <input type="hidden" name="redcap_csrf_token" value="" />
            </Modal.Body>
            <Modal.Footer>
              <Button id="blue" disabled={! this.state.buttonActive} type="submit">Set Rate</Button>
            </Modal.Footer>
          </Form>

      </div>
      </Modal>
     );
  }
}


 
export default BCWelcomeModal;