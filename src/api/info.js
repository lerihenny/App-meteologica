import axios from "axios";
import * as cons from './constants'; //Importa todas las url declaradas en api/constans.js

//Obtiene el pronostico del dia actual
//Utiliza como parametros la latitud y longitud
export async function getDataByDay(lat, lon) {
  try {
    const res = await axios.get(`${cons.dataByDay}&q=${lat},${lon}&lang=es`);
    return res.data;
  }
  catch(err) {
    return err;
  }
}

//Obtiene el pronostico de los proximos 7 dias, incluyendo el actual
//Utiliza como parametros la latitud y la longitud
export async function getDataByWeek(lat, lon) {
    try {
      const res = await axios.get(`${cons.dataByWeek}&q=${lat},${lon}&days=7&lang=es`);
      return res.data;
    }
    catch(err) {
      return err;
    }
}

//Recibe el valor que se va ingresando en el buscador y busca semejantes en la API
export async function searchData(string) {
    try {
      const res = await axios.get(`${cons.searchData}&q=${string}&lang=es`);
      return res.data;
    }
    catch(err) {
      return err;
    }
}



