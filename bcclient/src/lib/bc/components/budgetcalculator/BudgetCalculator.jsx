import React, { Component } from 'react';

import './css/bc_custom_2020.scss';

import BCJumbotron from './BCJumbotron';
import BCInfoModal from './BCInfoModal';
import BCSaveModal from './BCSaveModal';

import BCNav from './BCNav';
import BCServicesTable from './BCServicesTable';

class BudgetCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfo: false,
      showSave: false,
      showInfoSubjectCount: "",
      showInfoVisitCount: ""
    }
  }

  handleHideInfo = () => this.setState({showInfo: false});

  showInfoCallback = () => {
    console.log("edit handled... setting state");
    this.setState({showInfo: true});
  }

  submitSaveCallback = (values) => {
    console.log("submitSaveCallback ... budget title: " + values.budgetTitle);
    this.setState({showSave: true});
  }

  handleHideSave = () => this.setState({showSave: false});

  showSubmitCallback = () => {
    console.log("edit hide submit handled... setting state");
    this.setState({showSubmit: true});
  }

  infoCallback = (values) => {
    //TODO: finish this method
    console.log("infoCallback ... Subject Count: " + values.subjectCount + "; Subject Count: " + values.visitCount);
    this.setState({showInfo: false, showInfoSubjectCount:values.subjectCount, showInfoVisitCount:values.visitCount})
  }

  handleHideWelcome = () => this.setState({showWelcome: false});

  render() { 
    return ( 
      <div id="pagecontainer" className="container-fluid" role="main">
        <div id="container">
          <div id="pagecontent">
            <BCJumbotron />
            <br />
            <br />
            <BCInfoModal
              showInfo={this.state.showInfo}
              showInfoSubjectCount={this.state.showInfoSubjectCount}
              showInfoVisitCount={this.state.showInfoVisitCount}
              infoCallback={this.infoCallback}
              hideInfoCallback={this.handleHideInfo} />

            <BCSaveModal
              showSave={this.state.showSave}
              submitSaveCallback={this.submitSaveCallback}
              handleHideSave={this.handleHideSave} />

            <BCNav 
              showInfoCallback={this.showInfoCallback}  
              bcstate={this.props.bcstate}/>
            <br />
            <br />

            <BCServicesTable />

            <div id="disclaimer">
              This is a work in progress and not representative of the final product. Pricing data is for testing purposes only.
            </div>
          </div>
        </div>
      </div>
      );
  }
}
 
export default BudgetCalculator;
