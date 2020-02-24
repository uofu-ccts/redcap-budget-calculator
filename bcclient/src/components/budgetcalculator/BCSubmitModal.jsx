import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class BCSubmitModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showBCSubmit: props.showBCSubmit,
      handleBCSubmitCallback: props.handleBCSubmitCallback,
      handleBCSubmitHide: props.handleBCSubmitHide,
      validated: false
    }
    this.budgetTitle = React.createRef();
    this.username = React.createRef();
    this.firstName = React.createRef();
    this.lastName = React.createRef();
    this.email = React.createRef();
    this.irbNumber = React.createRef();
  }

  handleSaveConfirmSubmission = (e) => {
    e.preventDefault();

    //validate fields
    this.setState({validated: true});

    if (this.saveSubmissionForm.checkValidity()) {
      //save state
      this.state.handleBCSubmitCallback(
        {
          budgetTitle: this.budgetTitle.current.value,
          username: this.username.current.value,
          firstName: this.firstName.current.value,
          lastName: this.lastName.current.value,
          email: this.email.current.value,
          irbNumber: this.irbNumber.current.value,
        } );
      this.setState({showBCSubmit: false});

      //hide the modal
      this.state.handleBCSubmitHide();
    }

  };


  handleClose = (e) => {
    // If called from the closeButton, you won't have an 'e'
    // Otherwise, you will have 'e' from the Close button
    if (e) {
      e.preventDefault();
    }
    this.state.handleBCSubmitHide();
  }

  render() {
    return ( 
      <Modal id="submitModal" centered show={this.props.showBCSubmit} onHide={this.handleClose} role="dialog" aria-labelledby="submitModal" aria-hidden="true">
        <div role="document">
          <Modal.Header closeButton>
            <Modal.Title>Confirm Submission</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              <div>
                <p>We require some additional information before your request can be submitted.</p>
              </div>
              <Form id="submissionForm" ref={form => this.saveSubmissionForm = form} onSubmit={this.handleSaveConfirmSubmission} validated={this.state.validated} >
                <Form.Row>
                  <Form.Label htmlFor="userTitleInputSubmit">
                    <b>Budget Title (for future reference):</b>
                  </Form.Label>
                  <Form.Control type="text" ref={this.budgetTitle} id="userTitleInputSubmit" name="userTitleInputSubmit" className="info-field" />
                </Form.Row>
                <Form.Row>
                  <Form.Group className="requester-info">
                    <Form.Label htmlFor="username">
                      <b>Username</b>
                    </Form.Label>
                    <Form.Control type="text" ref={this.username} id="username" name="username" className="info-field" />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group className="requester-info">
                    <Form.Label htmlFor="first_name">
                      <b>First Name</b>
                    </Form.Label>
                    <Form.Control type="text" ref={this.firstName} id="first_name" name="first_name" className="info-field" />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group className="requester-info">
                    <Form.Label htmlFor="last_name">
                      <b>Last Name</b>
                    </Form.Label>
                    <Form.Control type="text" ref={this.lastName} id="last_name" name="last_name" className="info-field" />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group className="requester-info">
                    <Form.Label htmlFor="email">
                      <b>Email</b>
                    </Form.Label>
                    <Form.Control type="email" ref={this.email} id="email" name="email" className="info-field" />
                    <Form.Control.Feedback type="invalid">
                      Any text in this field must be a valid email.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group className="requester-info">
                    <Form.Label htmlFor="irb">
                      <b>IRB Number</b>
                    </Form.Label>
                    <Form.Control type="input" pattern=".+" ref={this.irbNumber} id="irb" name="irb" className="info-field" required />
                    <Form.Control.Feedback type="invalid">
                      This field is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
                <input type="hidden" name="redcap_csrf_token" value="" />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button id="cancelSaveBtn" variant="secondary" onClick={this.handleClose} >Back</Button>
              <Button id="confirmSaveBtn" variant="primary" type="submit" onClick={this.handleSaveConfirmSubmission}>Save</Button>
            </Modal.Footer>
        </div>
      </Modal>
     );
  }
}
 
export default BCSubmitModal;