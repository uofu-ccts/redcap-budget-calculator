import React, { Component } from 'react';

import ServiceMenuItem from './ServiceMenuItem';
import NoData from '../tools/NoData';

class ServiceSubMenus extends Component {

  constructor(props) {
    super(props);
    this.state = {  }
  }

  reduceToTree = (serviceTree, serviceobj) => {

    if (! (serviceobj.core && serviceobj.category && serviceobj.service))
    {
      console.log("A service missing core ("+serviceobj.category+"), category ("+serviceobj.core+"), or service ("+serviceobj.service+") property was omited.");
      return serviceTree;
    }

    //getting this far means that we have everything we need to construction the tree that will become the submenu tree

    let coreKey = serviceobj["core"];
    if (!serviceTree[coreKey]) {
      serviceTree[coreKey] = [];
    }

    let categoryKey = serviceobj["category"];
    if (!serviceTree[coreKey][categoryKey]) {
      serviceTree[coreKey][categoryKey] = [];
    }

    let serviceKey = serviceobj["service"];
    if (!serviceTree[coreKey][categoryKey][serviceKey]) {
      serviceTree[coreKey][categoryKey][serviceKey] = [];
    }
    
    serviceTree[coreKey][categoryKey][serviceKey].push(serviceobj);

    return serviceTree;
  }

  createMenuTree = (data) => {
    let menuTreeObj = Object.values(data).reduce(this.reduceToTree, {});

    //NOTE: The names of submenus are unique so can be used as keys. Service names could be non-unique, but in practice generally are so for now are used for keys
    return Object.entries(menuTreeObj).map(coreobj => (
            <li key={coreobj} className="dropdown-submenu"><a className="dropdown-item dropdown-toggle" href="#">{coreobj[0]}</a>
              <ul className="dropdown-menu">
                {
                  Object.entries(coreobj[1]).map(categoryobj => (
                  <li key={categoryobj} className="dropdown-submenu"><a className="dropdown-item dropdown-toggle" href="#">{categoryobj[0]}</a>
                    <ul className="dropdown-menu">
                      {
                      Object.entries(categoryobj[1]).map(serviceobj => (
                      <ServiceMenuItem key={serviceobj} addBCService={this.props.addBCService} serviceobj={JSON.stringify(serviceobj[1])} servicename={serviceobj[0]} />
                      ))}
                    </ul>
                  </li>))
                }
              </ul>
            </li>
        ));
  }


  render() {
    const data = {...this.props.bcServiceData};

    return ( 
      <>
        {Object.entries(data).length===0?<NoData />:""}
        
        {this.createMenuTree(data)}
      </>

     );
  }
}
 
export default ServiceSubMenus;