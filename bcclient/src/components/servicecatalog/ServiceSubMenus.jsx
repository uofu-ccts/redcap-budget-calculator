import React, { Component } from 'react';

import ServiceMenuItem from './ServiceMenuItem';
import ServiceDDItem from './ServiceDDItem';
import NoData from '../tools/NoData';

class ServiceSubMenus extends Component {

  constructor(props) {
    super(props);
    this.state = {  }
  }

  reduceToTree = (serviceTree, serviceobj) => {
    // console.log("serviceobj.core=", serviceobj.core)
    // console.log("serviceobj.category=", serviceobj.category)
    // console.log("serviceobj.service=", serviceobj.service)


    // console.log("-->", Object.keys(serviceobj));

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

    // if (! serviceMap.has(serviceobj.core))
    // {
    //   serviceMap.set(serviceobj.core, new Map());
    // }

    // let coremap = serviceMap.get(serviceobj.core);
    // // console.log("serviceobj.core...",serviceobj.core);
    // // console.log("serviceMap.get(serviceobj.core)...",serviceMap.get(serviceobj.core));
    // if (! coremap.has(serviceobj.category))
    // {
    //   serviceMap.get(serviceobj.core).set(serviceobj.category,  new Map());
    // }

    // serviceMap.get(serviceobj.core).get(serviceobj.category).set(serviceobj.service, {...serviceobj});

    // return serviceMap.set(serviceobj.core, {...serviceobj});//[serviceobj.category][serviceobj.service] = {...serviceobj}
  }

  createMenuTree = (data) => {
    let menuTreeObj = Object.values(data).reduce(this.reduceToTree, {});
    console.log( "menuTreeObj ... ", menuTreeObj );
    console.log( "menuTreeObj size ... ", Object.entries(menuTreeObj).length );
    // console.log( "---------------" );
    // console.log( "data size ... ", Object.values(data).length );
    // console.log( "data size ... ", Object.values(data)[0].service );

    return Object.entries(menuTreeObj).map(serviceobj => (
          <>
            {/* <ServiceDDItem key={Math.floor(Math.random() * 100000000)} serviceTree={menuTreeObj} /> */}
            <ServiceMenuItem key={Math.floor(Math.random() * 100000000)} serviceobj={serviceobj} />
          </>
        ));
  }//addBCService={this.props.addBCService} service={{serviceversion: 'niftyversion2', name: 'my service2', description: 'my description3'}} 


  render() {
    const data = {...this.props.bcServiceData};
    // console.log( "data ... ", data );
    // console.log( "data[0] ... ", data[0] );
    // console.log( "data[0].service ... ", data[0].service );
    // console.log( "Object.values(data) ... ", Object.values(data) );

    return ( 
      <>
        {Object.entries(data).length===0?<NoData />:""}
        
        {this.createMenuTree(data)}
      </>

     );
  }
}
 
export default ServiceSubMenus;