import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

class TrashIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return ( 
      <FontAwesomeIcon icon={faTrash} size='lg' color='red' />
     );
  }
}
 
export default TrashIcon;