import React from "react";
import { Container, Row, Col, Table  } from 'react-bootstrap';
import { getDataByWeek } from "./../api/info";
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faCloudRain, faWind, faTemperatureHalf, faHandHoldingDroplet, faBinoculars, faCloud, faCompass, faSnowflake, faPlay,  } from '@fortawesome/free-solid-svg-icons'
import './Inicio.css';

import Header from "../Components/Header";
//import Chart from '../Components/Chart'
//import Geolocation from './../Components/Geolocation'

class Inicio extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      location: '',
      cities: [],
      latitude: null,
      longitude: null,
      error: null,
      searching: 0,
      currentData: [],
      locationData: [],
      weekData: [],
      units: {
        temp: 'c',
        wind: 'kph',
        precip: 'mm',
        pressure: 'mb',
        vis: 'km',
      },
      daySelected: [],
    }
  }
    
  componentDidMount(){
    // Verifica si el navegador admite la geolocalización
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Obtiene la latitud y longitud de la posición actual
          this.selectCity(position.coords.latitude, position.coords.longitude)      
        },
        (error) => {
          // Maneja errores, si los hay
          this.setState({ error: error.message });
        }
      );
    }else {
      //Mostrar Clima de Madrid como generico porque no se puede acceder a la geolocalizacion del navegador
      this.setState({ error: 'La geolocalización no está disponible en tu navegador.' });
    }

  }

  handleChange(e, input) {
    const value = e.target.value;
    this.setState({
      [input]:value
    })
  }

  changeUnits = (e, name) => {
    const value = e.target.value;
    let newUnits = this.state.units
    newUnits[name] = value

    this.setState({
      units: newUnits
    })
  }

  convertDate(time){
    // Convertir Año-Mes-Día en formato cadena a Día Mes Año
    const fecha = new Date(time); // Crear un objeto Date
    const partes = fecha.toString().split(" "); // Dividir la cadena en partes usando "-"
    const semDia = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date(time)); //Obtengo el dia de la semana y lo traduzco al español
    const año = parseInt(partes[3], 10); // Convertir el año a entero
    const mes = new Intl.DateTimeFormat('es-ES', { month: 'short'}).format(new Date(time)); // Obtengo el mes y lo traduzco al español
    const dia = parseInt(partes[2], 10); // Convertir el día a entero
    const horaOriginal = partes[4].split(':'); //Obtener la hora en formato HH:MM:SS y convertirlo en array
    const horas = horaOriginal[0]; //Obtener hora
    const minutos = horaOriginal[1]; //Obtener minutos
    const hora = `${horas}:${minutos}`; //Convertir a formato HH:MM

    return {
      semDia: semDia,
      dia: dia,
      mes: mes,
      año: año,
      hora: hora
    }
  }

  selectCity = async(lat, lon)  => {
    //Luego de hacer clic en la busqueda seleccionada (en Header.jsx) extrae de la api el clima actual y el pronostico de la semana de la ciudad
    let localtime = [], daytime = [], hour = []
    let weatherWeek = await getDataByWeek(lat, lon) //Obtener los datos semanales deacuerdo a la ubicacion que se pasa con latitud y longitud

    localtime = this.convertDate(weatherWeek.location.localtime) //Cambiar el formato de la hora y fecha de los dias de la semana para poder mostrarlos
    weatherWeek.location.localtime = localtime //Sustituir el anterior formato con el array que contiene [dia,mes,año,hora]

    weatherWeek.forecast.forecastday.map((day, i) => {
      //Cambiar el formato de la hora y fecha de los dias de la semana para poder mostrarlos
      daytime = this.convertDate(day.date)
      weatherWeek.forecast.forecastday[i].date = daytime //Sustituir el anterior formato con el array que contiene [dia,mes,año,hora]

      day.hour.map((h, i) => {
        hour = this.convertDate(h.time) //Cambiar el formato de cada hora del dia para mostrarlo
        day.hour[i].time = hour //Sustituir el anterior formato
        return true
      })
      return true
    })
    this.setState({
      locationData: weatherWeek.location,
      currentData: weatherWeek.current,
      weekData: weatherWeek.forecast.forecastday,
      
    })

    this.selectDayWeather(weatherWeek.forecast.forecastday[0], 0) //Mostrar el pronostico de las 24 horas del dia actual por default
  }

  selectDayWeather(day){
    //Mostrar los datos de meteorologicos del dia de la semana seleccinado
    this.setState({
      daySelected: day.hour
    })
  }

  render() {
    const { locationData, currentData, weekData, units, daySelected} = this.state
    if(currentData.length !== 0){
      return(<>
        <Header selectCity={this.selectCity} units={units} changeUnits={this.changeUnits}/>
        <Container className="mt-5">
          <Row className="center justify-content-around">
            <Col md="10" className="p-4 center data-container">
              <Row>
                <Col md="12">
                  <h4>Tiempo en {locationData.name}</h4>
                  <h6 className="capitalize">{`${locationData.localtime.hora} | ${locationData.localtime.semDia} ${locationData.localtime.dia} ${locationData.localtime.mes}` }</h6>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md="5" className="border p-3">
                  <div className="w-100">
                    <span> {currentData.condition.text}</span>
                    <br />
                    <span className="current-temp bold"><img src={currentData.condition.icon} alt="Icon" /> {currentData[`temp_${units.temp}`]}°{units.temp.toLocaleUpperCase()}</span>
                    <br />
                    <span className="current-feelslike">Sensasión de {currentData[`feelslike_${units.temp}`]}°{units.temp.toLocaleUpperCase()}</span>
                  </div>
                </Col>

                <Col md="6" className="border p-3">
                  <div className="row-description">
                    <span className="single-current">
                      <FontAwesomeIcon className="m-1" icon={faCloudRain} /> 
                      <span>
                        <span>Lluvia</span>
                         <br />
                        <span className="bold">{currentData[`precip_${units.precip}`]} {units.precip}</span>
                      </span>
                     </span>
                    <span className="single-current">
                      <FontAwesomeIcon className="m-1" icon={faHandHoldingDroplet} /> 
                      <span>
                        <span>Humedad</span>
                        <br />
                        <span className="bold">{currentData.humidity}%</span>
                      </span>
                    </span>
                    <span className="single-current">
                      <FontAwesomeIcon className="m-1" icon={faBinoculars} /> 
                      <span>
                        <span>Visibilidad</span>
                        <br />
                        <span className="bold">{currentData[`vis_${units.vis}`]} {units.vis}</span>
                      </span>
                    </span>
                  </div>
                  <div className="row-description mt-4">
                    <span className="single-current">
                      <FontAwesomeIcon className="m-1" icon={faWind} /> 
                      <span>
                        <span>Viento</span>
                        <br />
                        <span className="bold">{`${currentData['wind_'+units.wind]} ${units.wind}`} </span>
                      </span>
                    </span>
                    <span className="single-current">
                      <FontAwesomeIcon className="m-1" icon={faCompass} /> 
                      <span>
                        <span>Dirección</span>
                        <br />
                        <span className="bold">{currentData.wind_dir}</span>
                      </span>
                    </span>
                    <span className="single-current">
                      <FontAwesomeIcon className="m-1" icon={faCloud} /> 
                      <span>
                        <span>Nubosidad</span>                      
                        <br />
                        <span className="bold">{currentData.cloud}%</span>
                      </span>
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col md="10" className="center" >
              <Row className="center justify-content-around">
                {
                  weekData.map((day, i) => {
                    return(
                      <Col 
                      id={`day${i}`} 
                      className='p-2 m-1 center data-container text-center pointer weekData-grid'
                      key={i} 
                      onClick={() => {this.selectDayWeather(day, i); {}}}
                      >
                        <span className="bold capitalize weekData-semDia">
                          {day.date.semDia}
                        </span>
                        <span className="weekData-fecha">
                          {`${day.date.dia} ${day.date.mes}`}
                        </span>
                        <span className="weekData-condicion">
                          <img src={day.day.condition.icon} alt={day.day.condition.text} />
                        </span>
                        <span className="weekData-rangoTemp bold">
                          <span className="max-temp">{`${day.day['maxtemp_'+units.temp]}°`}</span> / <span className="min-temp">{`${day.day['mintemp_'+units.temp]}°`}</span>
                        </span>
                      </Col>
                    )
                  })
                }
              </Row>
            </Col>

            <Col md="10" className="overflow">
              <Table hover className="text-center" id="week-data-table">
                <thead>
                  <tr>
                    <th colSpan={9}></th>
                  </tr>
                </thead>
                <tbody>
                  {
                   daySelected.map((h, i) => {
                    return(
                      <tr key={i}>
                        <td>{h.time.hora.split(':')[0] === locationData.localtime.hora.split(':')[0] ? <span className="bold"><FontAwesomeIcon className="" icon={faPlay} /> {h.time.hora}</span> : h.time.hora}</td>
                        <td><img src={h.condition.icon} alt={h.condition.text} className="w-50"/></td>
                        <td className="temp-por-hora">{h[`temp_${units.temp}`]}°{units.temp.toLocaleUpperCase()}</td>

                        <td className="text-center">
                          <span className="bold">{h.condition.text}</span>
                          <span className="sensacion-hora center">
                            <FontAwesomeIcon className="m-1" icon={faTemperatureHalf} /> 
                            Sensación {h[`feelslike_${units.temp}`]}°{units.temp.toLocaleUpperCase()}
                          </span>
                        </td>

                        <td className="icon-text-table-hora">
                          <span title="Probabilidad de lluvia">
                            <FontAwesomeIcon className="m-1" icon={faCloudRain} />{h.chance_of_rain}%
                          </span>
                            <br />
                          <span title="Probabilidad de nieve">
                            <FontAwesomeIcon className="m-1" icon={faSnowflake} />{h.chance_of_snow}%
                          </span>
                        </td>

                        <td title="Humedad">
                          <FontAwesomeIcon className="m-1" icon={faHandHoldingDroplet} /> 
                          <span>{h.humidity}%</span>
                        </td>
                        <td title="Viento">
                          <FontAwesomeIcon className="m-1" icon={faWind} /> 
                          <span>{`${h['wind_'+units.wind]} ${units.wind}`} </span>
                        </td>
                        <td title="Nubosidad">
                          <FontAwesomeIcon className="m-1" icon={faCloud} /> 
                          <span >{h.cloud}%</span>
                        </td>
                        <td title="Visibilidad">
                          <FontAwesomeIcon className="m-1" icon={faBinoculars} /> 
                          <span>{h[`vis_${units.vis}`]} {units.vis}</span>
                        </td>
                      </tr>
                    )
                   }) 
                  }
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </>)  
    }
  }
}

export default Inicio;