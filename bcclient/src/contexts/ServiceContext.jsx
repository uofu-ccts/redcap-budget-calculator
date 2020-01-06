import React, { createContext} from 'react';

// A great overview of Contexts used with Hooks was made by "The Net Ninja" at https://youtu.be/v1s_rbZbqQI

export const ServiceContext = createContext(42);

//TODO: update service objects to reflect data from redcap
function ServiceContextProvider(props) {
  // const [services, setServices] = useState({name: 'Bob'});

  return (
    <ServiceContext.Provider value={'43'}>
      {props.children}
    </ServiceContext.Provider>
  )
}

export default ServiceContextProvider;