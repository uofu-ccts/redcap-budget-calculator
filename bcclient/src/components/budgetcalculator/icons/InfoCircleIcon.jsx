import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'


class InfoCircleIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return ( 
      <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={<Popover id={`popover-positioned-right`}>
          <Popover.Content>
            {this.props.description}
          </Popover.Content>
        </Popover>}
          ><FontAwesomeIcon icon={faInfoCircle} color='#3E72A8' /></OverlayTrigger>
     );
  }
}
 
export default InfoCircleIcon;