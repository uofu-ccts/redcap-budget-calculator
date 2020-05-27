import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class BCSaveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSaveSuccess: props.showSaveSuccess,
      submitSaveCallback: props.submitSaveCallback,
      handleHideSave: props.handleHideSave,
      validated: false
    }
    this.budgetTitle = React.createRef();
  }

  handleSubmit = (e) => {
    e.preventDefault();

    //validate fields
    this.setState({validated: true});

    if (this.saveForm.checkValidity()) {
      //save state
      this.state.submitSaveCallback( {budgetTitle: this.budgetTitle.current.value} );
      this.setState({showWelcome: false});

      //hide the modal
      this.state.handleHideSave();
    }
  };

  handleClose = (e) => {
    try {
      //only used when hide comes from the cancel/close button
      e.preventDefault();
    } catch (e) {
      // not needed
    }
    this.state.handleHideSave();
  };

  render() {
    return ( 
      <Modal id="saveModal" centered show={this.props.showSave} onHide={this.handleClose} role="dialog" aria-labelledby="saveModal" aria-hidden="true">
        <div role="document">
            <Modal.Body>
              <div>
                <p>Please provide a title for your budget before saving. This is for personal reference only.</p>
              </div>
              <Form ref={form => this.saveForm = form} onSubmit={this.handleConfirm} validated={this.state.validated}>
                  <Form.Row>
                    <Form.Group>
                      <Form.Label htmlFor="userTitleInput">
                        <b>Budget Title:</b>
                      </Form.Label>
                      <Form.Control type="input" id="userTitleInput" name="userTitleInput" ref={this.budgetTitle} className="title-field" required />
                      <Form.Control.Feedback type="invalid">
                        This field is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                <input type="hidden" name="redcap_csrf_token" value="" />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button id="cancelSaveBtn" variant="secondary" onClick={this.handleClose} >Close</Button>
              <Button id="confirmSaveBtn" variant="primary" type="submit" onClick={this.handleSubmit}>Save</Button>
            </Modal.Footer>
        </div>
      </Modal>
     );
  }
}
 
export default BCSaveModal;