import React from "react";
import {Modal, Button} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import "./Components.css";


class ModalPremium extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <>  
          <Modal show={this.props.show} className="mt-5">
            <Modal.Header>
              <Modal.Title>
                <FontAwesomeIcon icon={faCrown} /> ¡Hazte Premium!
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="justify">
              <p>Queremos informarte que tu prueba gratuita ha llegado a su fin. 
                Si deseas seguir disfrutando de todos los beneficios y características de nuestro servicio, 
                te invitamos a suscribirte a nuestra membresía premium.</p> 
              <p>Con la suscripción premium, obtendrás acceso ilimitado a todas nuestras funciones.</p>
              <a href="#" onClick={() => this.props.modalFunc()}>Has click aquí</a>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-header' onClick={() => this.props.modalFunc()}>Cerrar</Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
  }
  
  export default ModalPremium;