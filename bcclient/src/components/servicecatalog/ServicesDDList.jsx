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

  //to use a context do something like this in return ... <pre>--&gt;{serviceCtx}&lt;--</pre>
  return (
    <>

        <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <li className="bc-dropdown-li-search"><SearchBox searchFunction={serviceDataObj.filterServiceInstancesByKeyword} /></li>
          <li id="bc-dropdown-li"><Dropdown.Divider /></li>
          <ServiceSubMenus addBCService={props.addBCService} bcServiceData={data} />
        </ul>

        
    </>
  );
}
 
export default ServicesDDList;