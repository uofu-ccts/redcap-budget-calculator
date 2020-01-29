import React, { useState, useEffect } from 'react';

import SearchBox from '../tools/SearchBox';

import ServiceData from '../../js/ServiceData';

import Dropdown from 'react-bootstrap/Dropdown'
import ServiceMenuItem from './ServiceMenuItem';
import ServiceSubMenus from './ServiceSubMenus';

function ServicesDDList(props) {

  const [data, setData] = useState('Loading Service Catalog ...');
  const [serviceDataObj] = useState(new ServiceData(data, setData));//don't need the setter for the ServiceData

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

        <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <li className="bc-dropdown-li-search"><SearchBox searchFunction={serviceDataObj.filterServiceInstancesByKeyword} /></li>
          <li id="bc-dropdown-li"><Dropdown.Divider /></li>
          <li className="dropdown-submenu"><a className="dropdown-item dropdown-toggle" href="#">Core</a>
            <ul className="dropdown-menu">
              <li className="dropdown-submenu"><a className="dropdown-item dropdown-toggle" href="#">Category 1</a>
                <ul className="dropdown-menu">
                  <ServiceMenuItem addBCService={props.addBCService} service={{serviceversion: 'niftyversion2', name: 'my service2', description: 'my description2'}} />
                  <li id="bc-dropdown-li"><a className="dropdown-item" href="#">name2</a></li>
                </ul>
              </li>
              <li className="dropdown-submenu"><a className="dropdown-item dropdown-toggle" href="#">Category 2</a>
                <ul className="dropdown-menu">
                  <li id="bc-dropdown-li"><a className="dropdown-item" href="#">name1</a></li>
                  <li id="bc-dropdown-li"><a className="dropdown-item" href="#">name2</a></li>
                </ul>
              </li>
            </ul>
          </li>


          <li id="bc-dropdown-li"><Dropdown.Divider /></li>

          <ServiceSubMenus addBCService={props.addBCService} bcServiceData={data} />
        </ul>

        
    </>
  );
}
 
export default ServicesDDList;