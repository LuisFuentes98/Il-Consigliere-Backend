import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import Navegacion from '../Navegacion/Navegacion';
import BuscadorConsejos from './BuscadorConsejos';
import auth from '../../helpers/auth';

export default class ConsejosPrincipal extends Component {
  constructor(props) {
    super(props);
    const info = auth.getInfo()
    this.state = {
      cedula: info.cedula,
      nombre: info.nombre,
      apellido: info.apellido,
      segundo_apellido: info.segundo_apellido,
      consejos: [],
      anteriores: [],
      redirect: false
    }
  }

  componentDidMount() {
    this.getAllCouncils();
  }

  getAllCouncils() {
        axios.get('/consejo')
        .then(res => {
          if (res.data.success) {
            this.setState({
              consejos: res.data.councils
            });
          } else {
            this.setState({
              consejos: []
            });
          }
        })
        .catch((err) => console.log(err));
  }

  getCouncils() {
    const councils = [];
    for (let i = 0; i < this.state.consejos.length; i++) {
      let consejo = this.state.consejos[i];
      let consecutivo = consejo.consecutivo;
      let institucion = consejo.institucion;
      let carrera = consejo.carrera;
      let campus = consejo.campus;
      let nombre_consejo = consejo.nombre_consejo;
      let lugar = consejo.lugar;
      let fecha = consejo.fecha;
      let hora = consejo.hora;
      let id_tipo_sesion = consejo.id_tipo_sesion;
      councils.push(
        <div className="col-md-4 fila-mis-consejos" key={i}>
          <div className="card border-primary mb-3">
            <div className="card-body p-2">
              <div className='d-flex justify-content-between align-items-center'>
                <p className="card-title m-0">{consecutivo}</p>
                
                <Link to={`/iConsejos/${consecutivo}`}><i className="far fa-eye fa-lg ml-2" style={{ color: "navy" }}></i></Link>
              </div>
              <p className='m-0'>{institucion}</p>
              <p className='m-0'>{campus}</p>
              <p className='m-0'>{carrera}</p>
              <p className='m-0'>{nombre_consejo}</p>
              <p className='m-0'>Sesión {id_tipo_sesion === 1 ? 'Ordinaria' : id_tipo_sesion === 2 ? 'Extraordinaria' : 'Consulta Formal'} </p>
              <p className='m-0'>Lugar: {lugar}</p>
              <p className='m-0'>Fecha: {fecha}</p>
              <p className='m-0'>Hora: {hora}</p>
            </div>
          </div>
        </div>
      );
    }
    return councils;
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <Navegacion />
        <div className='container'>
          {this.state.consejos.length > 0 ? <p className='text-center lead'>Próximos Consejos</p> : <p className='my-muted text-center'>No hay próximos consejos para mostrar.</p>}
        </div>
        <div className="row m-0 mt-4">
          {this.getCouncils()}
        </div>
          <BuscadorConsejos />
      </>
    );
  }
}
