import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron'

import Services from './servicecatalog/Services';
import ServiceContextProvider from '../contexts/ServiceContext';

/**
 * This component is the Service Catalog page used by the React Router.
 */
class ServiceCatalogPage extends Component {

  // constructor(props) {
  //   super(props);
  // }

  render() { 
    return ( 
      <ServiceContextProvider>
        <Jumbotron style={{backgroundImage: 'url(/img/home/header-dep-bg.jpg)', backgroundSize: 'auto 100%'}}>
          <h1>Center for Clinical &amp; Translational Science</h1>
        </Jumbotron>
        <Container>
          <Services />
        </Container>
      </ServiceContextProvider>
     );
  }
}
 
export default ServiceCatalogPage;