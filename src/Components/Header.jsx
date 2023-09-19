import React from 'react';
import { Container, Row, Col, Button, Form, FormGroup  } from 'react-bootstrap';
import { searchData } from "./../api/info";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import ModalPremium from './ModalPremium';
import logo from './../assets/lm.png'
import "./Components.css";
import "./../Inicio/Inicio.css";



class Header extends React.Component{
  constructor(props){
    super(props);
    this.outSiteClickSeccion = React.createRef();
    this.state = {
      searchLocaltion: '',
      units: this.props.units,
      premiumModal: false,
      theme: 'ligth',
      cities: [] ,
      suggestionsLocation: [],
      displaySearching: 'hide',
      displayChangeUnits: 'hide',
      count: localStorage.getItem('count') === null ? 0 : localStorage.getItem('count'),
      messsage: `Te quedan ${5 - (localStorage.getItem('count') === null ? 0 : parseInt(localStorage.getItem('count')))} busquedas con la versión gratuita`,
      showModal: false,
      isChecked: localStorage.getItem('theme') === null ? false : JSON.parse(localStorage.getItem('theme')),
    }
  }

  componentDidMount(){
    //Comprobar si el usuario activó el tema oscuro
    if(this.state.isChecked === true){
      document.body.classList.add('dark-theme');
    }

    // Agrega el evento onMouseLeave cuando el componente se monta.
    this.outSiteClickSeccion.current.addEventListener('mouseleave', this.handleMouseLeave);

    // Agrega el evento de clic al documento global.
    document.addEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    // Verifica si el clic ocurrió fuera de la sección.
    if (this.outSiteClickSeccion.current && !this.outSiteClickSeccion.current.contains(event.target) && (this.state.displayChangeUnits === 'show' || this.state.displaySearching === 'show')) {
      this.setState({
        displayChangeUnits: 'hide',
        displaySearching: 'hide'
      })
    }
  };

  handleChange(e, input) {
    const value = e.target.value;
    this.setState({
      [input]:value
    })
  }

  //Genera sugerencias mediante el buscador, recibe el valor desde el input "location" 
  async searchLocation(e){
    const value = e.target.value;
    let displaySearching = 'hide', res = []
    if(value !== ""){
      res = await searchData(value); //Busca sugerencias que concuerden con el valor ingresado en el input "location"
      displaySearching = 'show' //Muestra la caja con las sugerencias
    }else{
      displaySearching = 'hide' //Esconde la caja con las sugerencias
    }
    this.setState({
        suggestionsLocation: res,
        displaySearching: displaySearching,
    })
  }

  //Verificar que no ha realizado 5 consultas y generar sugerencias
  counting(lat, lon){
    let message = '', count = ''
    let consultas = localStorage.getItem('count') === null ? 1 : parseInt(localStorage.getItem('count'))
    if(consultas < 5){
      localStorage.setItem('count', consultas + 1) //Sumar una consulta al localstorage
      count = localStorage.getItem('count')
      message = `Te quedan ${5 - count} busquedas con la versión gratuita`
      this.props.selectCity(lat, lon); //Enviar latitud y longitud para la busqueda de los datos si ha realizado menos de 5 consultas
    }else{
      message = 'Has agotado las busquedas de la versión gratuita'
      this.modal() //Modal para volverse premium
    }

    this.setState({
      count: count,
      messsage: message
    })
  }

  //Funcion para mostrar u ocultar el modal Premium
  modal = () => {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  //Switch de cambio de tema
  toggleSwitch(){
    let theme = JSON.parse(localStorage.getItem('theme'))
    if(theme === false){
      theme = true
      document.body.classList.add('dark-theme'); //Agregar clase de tema oscuro al cuerpo del docuemnto
    }else{
      theme = false
      document.body.classList.remove('dark-theme'); //Quitar clase de tema oscuro al cuerpo del docuemnto
    }
    localStorage.setItem('theme', JSON.stringify(theme))
    this.setState({
      isChecked: theme
    })
  }

  changeUnitsWindow(){
    this.setState({
      displayChangeUnits: this.state.displayChangeUnits === 'show' ? 'hide' : 'show'
    })
  }

  componentWillUnmount(){
    // Elimina el evento onMouseLeave cuando el componente se desmonta.
    this.outSiteClickSeccion.current.removeEventListener('mouseleave', this.handleMouseLeave);

    // Elimina el evento de clic al documento global para evitar pérdidas de memoria.
    document.removeEventListener('click', this.handleClickOutside);
  }
  
  render(){
    return(
      <>
        <Container fluid className='p-4 nav-container'>
          <Row className='text-center'>
            <Col md={2} id='logo'>
              <img src={logo} alt="LM" className='w-25 mb-1'/>
            </Col>
            <Col md={5} className='relative mb-2' id="busqueda" ref={this.outSiteClickSeccion}>
              <Form className="center">
                <FormGroup> 
                  <Form.Control 
                  autoComplete="off"
                  placeholder="Busca una Ciudad"
                  name='location'
                  value={this.state.location}
                  onChange={event => {this.searchLocation(event); this.handleChange(event, "location")}}
                  />
                </FormGroup>
              </Form>
              <div id='location-suggestions' className={this.state.displaySearching}>
                <ul>
                  {
                    this.state.suggestionsLocation.map((suggestion, i) => (
                      <li 
                      className="pointer" 
                      key={i} 
                      onClick={() => {this.setState({displaySearching: 'hide', location: ''}); this.counting(suggestion.lat, suggestion.lon)}}>
                        <FontAwesomeIcon icon={faLocationDot} /> &nbsp;
                        <span className='sugg-localidad'>
                          <span className='sugg-ciudad'>{suggestion.name}</span>
                          <span className="sugg-pais">{suggestion.country}</span>
                        </span>
                        <span className="sugg-region">{suggestion.region}</span> 
                      </li>
                    ))
                  }
                </ul>
              </div>
            </Col>  
            <Col md={2} xs={6} className='relative' id="cambiar-unidades-tema">
              <div id='change-units-section' ref={this.outSiteClickSeccion}>
                <Button 
                  className='btn-header' 
                  onClick={() => this.setState({displayChangeUnits: this.state.displayChangeUnits === 'show' ? 'hide' : 'show'})}
                >Unidades / Tema</Button>
                <div id='window-change-units' className={this.state.displayChangeUnits} >
                  <Form className='center'>
                    <Col md="12">
                      <Form.Label>Temperatura:</Form.Label>
                      <Form.Select 
                      aria-label="Cambiar unidad de temperatura" 
                      size="sm"
                      value={this.state.units.temp}
                      onChange={(event) => this.props.changeUnits(event, "temp")}
                      >
                        <option value="c">Celsius (°C)</option>
                        <option value="f">Fahrenheit (°F)</option>
                      </Form.Select>
                    </Col>
                    <Col md="12" className='mt-1'>
                    <Form.Label>Viento:</Form.Label>
                      <Form.Select 
                      aria-label="Cambiar unidad de viento" 
                      size="sm"
                      value={this.state.units.wind}
                      onChange={(event) => this.props.changeUnits(event, "wind")}
                      >
                        <option value="kph">Kph</option>
                        <option value="mph">mph</option>
                      </Form.Select>
                    </Col>
                    <Col md="12" className='mt-1'>
                      <Form.Label>Lluvia:</Form.Label>
                      <Form.Select 
                      aria-label="Cambiar unidad de lluvia" 
                      size="sm"
                      value={this.state.units.precip}
                      onChange={(event) => this.props.changeUnits(event, "precip")}
                      >
                        <option value="in">in</option>
                        <option value="mm">mm</option>
                      </Form.Select>
                    </Col>
                    <Col md="12" className='mt-1'>
                      <Form.Label>Visibilidad:</Form.Label>
                      <Form.Select 
                      aria-label="Cambiar unidad de visibilidad" 
                      size="sm"
                      value={this.state.units.vis}
                      onChange={(event) => this.props.changeUnits(event, "vis")}
                      >
                        <option value="km">km</option>
                        <option value="miles">miles</option>
                      </Form.Select>
                    </Col>
                    <Col md="12" className='mt-1'>
                      <Form.Label>Tema:</Form.Label>
                      <Form.Check
                        type="switch"
                        id="tema-switch"
                        label="Claro/Oscuro"
                        checked={this.state.isChecked}
                        onChange={() => this.toggleSwitch()}
                      />
                    </Col>
                  </Form>
                </div>
              </div>
            </Col>
            <Col md={3} xs={6} id='hazte-premium'>
              <Button className='btn-header'>
                <FontAwesomeIcon icon={faCrown} />  Hazte Premium
              </Button>
            </Col>
          </Row>
        </Container>
        <Row className="center justify-content-around mt-3">
          <Col md="10">
            <span><i>{this.state.messsage}</i></span>
          </Col>
        </Row>
        <ModalPremium show={this.state.showModal} modalFunc={this.modal}/>
      </>
    )
  }

}

export default Header;