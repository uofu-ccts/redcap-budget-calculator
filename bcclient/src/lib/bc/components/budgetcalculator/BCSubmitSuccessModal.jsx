import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";

class BCSubmitSuccessModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSubmitSuccess: props.showSubmitSuccess,
      submitSuccessCallback: props.submitSuccessCallback
    }
  }

  handleClose = (e) => {
    // If called from the closeButton, you won't have an 'e'
    // Otherwise, you will have 'e' from the Close button
    if (e) {
      e.preventDefault();
    }
    this.state.submitSuccessCallback();
  }

  render() { 
    return ( 
      <Modal id="submitSuccessModal" centered show={this.props.showSubmitSuccess} onHide={this.handleClose} role="dialog" aria-labelledby="submitSuccessModal" aria-hidden="true">
        <div role="document">
          <Modal.Header closeButton>
            <Modal.Title>Submitted</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              Success!
          </Modal.Body>
          <Modal.Footer className="modal-footer">
              <Button variant="secondary" onClick={ this.handleClose}>Close</Button>
          </Modal.Footer>
        </div>
    </Modal>
     );
  }
}
 
export default BCSubmitSuccessModal;