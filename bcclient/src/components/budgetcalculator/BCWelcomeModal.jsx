import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';

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
    this.state.setFundingType(e, this.selection.current.value);
    this.state.welcomeCallback( this.selection.current.value );
    this.setState({showWelcome: false})

  }

  render() { 
    return (
      <Modal id="welcomeModal" centered backdrop="static" show={this.props.showWelcome} aria-labelledby="welcomeModal" aria-hidden="true">
          <div role="document">
            <Form id="welcomeForm" onSubmit={this.handleSubmit}>
            <Modal.Body>
              <p>Thank you for using the Budget Calculator! Please provide the following information to get started.</p>

                <Form.Row>
                    <Form.Group className="initial-info">
                      <Form.Label htmlFor="fundingType">
                        <b>Funding Type:</b>
                      </Form.Label>
                      <Form.Control className="info-field" as="select" id="fundingType" name="fundingType" ref={this.selection} required>
                        <option value="">---Select---</option>
                        <option value="industry_rate">Industry Rate</option>
                        <option value="federal_rate">Federal Rate</option>
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
              <Button variant="primary" disabled={! this.state.buttonActive} type="submit">Create New Budget</Button>
            </Modal.Footer>
          </Form>

      </div>
      </Modal>
     );
  }
}


 
export default BCWelcomeModal;