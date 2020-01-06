import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class BCInfoModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      infoCallback: props.infoCallback,
      hideInfoCallback: props.hideInfoCallback,
      subjectCountInvalid: "false",
      visitCountInvalid: "false",
      validated: false
    };
    this.subjectCount = React.createRef();
    this.visitCount = React.createRef();
  }

  componentDidUpdate() {
    try {
      this.subjectCount.current.value=this.props.showInfoSubjectCount;
      this.visitCount.current.value=this.props.showInfoVisitCount;
    }
    catch(error) {
      //ignore ... 'current' not there yet
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    //validate fields
    this.setState({validated: true});

    if (this.infoForm.checkValidity()) {
      //save state
      this.state.infoCallback( {subjectCount: this.subjectCount.current.value,  visitCount: this.visitCount.current.value});
    }
  };

  handleCancel = (e) => {
    e.preventDefault();
    this.state.hideInfoCallback();
  };


  render() {
    return ( 
      <Modal show={this.props.showInfo} id="budgetInfoModal" centered backdrop="static" role="dialog" aria-labelledby="budgetInfoModal" aria-hidden="true">
        <Form  ref={form => this.infoForm = form} onSubmit={this.handleConfirm} validated={this.state.validated} >
          <Modal.Body>
            <p>Before adding clinical services, please supply this additional information:</p>
                <Form.Row>
                  <Form.Group>
                    <Form.Label htmlFor="subject_count">
                      <b>Subject Count:</b>
                    </Form.Label>
                    <Form.Control type="number" id="subject_count" name="subject_count" min="1" step="1" ref={this.subjectCount} className="info-field" required />
                    <Form.Control.Feedback type="invalid">
                      This field is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group>
                    <Form.Label htmlFor="visit_count_default">
                      <b>Visit Count:</b>
                    </Form.Label>
                    <Form.Control type="text" pattern="\d+" id="visit_count_default" name="visit_count_default" ref={this.visitCount} className="info-field" required />
                    <Form.Control.Feedback type="invalid">
                      This field is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
              <input type="hidden" name="redcap_csrf_token" value="" />
          </Modal.Body>
          <Modal.Footer>
            <Button id="welcomeConfirmBtn" variant="secondary" onClick={this.handleCancel}>Cancel</Button>
            <Button id="welcomeConfirmBtn" variant="primary" type="submit" onClick={this.handleSubmit}>Confirm</Button>
          </Modal.Footer>
        </Form>
      </Modal>
     );
  }
}
 
export default BCInfoModal;