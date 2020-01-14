import React, { useState, useEffect } from 'react';

//import React, { useContext, useState, useEffect } from 'react';
//import {ServiceContext} from '../../contexts/ServiceContext';//needed a named, rather than default, import here ... *sigh*
import SearchBox from '../tools/SearchBox';

import ServiceData from '../../js/ServiceData';
import ServiceDDItem from './ServiceDDItem';

import NoData from '../tools/NoData';

import Dropdown from 'react-bootstrap/Dropdown'


function ServicesDDList() {

  const [data, setData] = useState('Loading Service Catalog ...');
  const [serviceDataObj] = useState(new ServiceData(data, setData));//don't need the setter for the ServiceData
  
  //const serviceCtx = useContext(ServiceContext);

  // Passing the empty array as the second argument of
  // useEffect() forces it to behave like componentDidMount()
  // lifecyle method.
  useEffect( 
    () => {
      serviceDataObj.fetchServicesFromApi();
      },
    // Purists won't like this, but ...
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  //use context something like this ... console.log("working..."+serviceCtx);

  //TODO: refactor key in ServiceListing to be usable
  //TODO: refactor error message to be reusable, generic component
  //to use a context do something like this in return ... <pre>--&gt;{serviceCtx}&lt;--</pre>
  return (
    <>

      <div align='left'>
        <SearchBox searchFunction={serviceDataObj.filterServiceInstancesByKeyword} />
      </div>

      <Dropdown.Divider />

<ul className="nav navbar-nav"><li className="menu-item dropdown"><a href="#" className="dropdown-toggle" data-toggle="dropdown">Drop Down<b className="caret"></b></a>
      <ul className="dropdown-menu">
          <li className="menu-item dropdown dropdown-submenu">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">Level 2</a>
              <ul className="dropdown-menu">
                  <li>
                      <a href="#" className="bc-service-to-add">Link 3</a>
                  </li>
                  <li>
                      <a href="#" className="bc-service-to-add">Link 4</a>
                  </li>
              </ul>
          </li>
      </ul>
</li></ul>

      <Dropdown.Divider />

      {Array.from(data).length===0?<NoData />:""}
      {(Array.from(data).map(serviceobj => (
        <ServiceDDItem key={Math.floor(Math.random() * 100000000)} servicerecordid={Math.floor(Math.random() * 100000000)} {...serviceobj} />
      )))}
        
    </>
  );
}
 
export default ServicesDDList;