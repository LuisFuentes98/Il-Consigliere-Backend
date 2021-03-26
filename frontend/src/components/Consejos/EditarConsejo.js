import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Navegacion from '../Navegacion/Navegacion';
import AgendaOficial from './AgendaOficial';
import axios from 'axios';
import auth from '../../helpers/auth';
import { getTodaysDate } from '../../helpers/dates';
import { Loading } from '../../helpers/Loading';
import DefaultComponent from '../../helpers/DefaultComponent';
import './Consejos.css';

export default class EditarConsejo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      consecutivo: this.props.match.params.consecutivo,
      lugar: '',
      fecha: '',
      hora: '',
      hoy: getTodaysDate(),
      tipoSesion: [],
      sesionSeleccionada: 1,
      encontrado: true,
      redirect: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get('/tipo_consejo')
            .then(res => {
              if (res.data.success) {
                this.setState({
                  tipoSesion: res.data.councilTypes
                });
              }
            })
            .catch((err) => console.log(err));
          axios.get(`/consejo/${this.state.consecutivo}`)
            .then(res => {
              if (res.data.success) {
                this.setState({
                  isLoading: false,
                  lugar: res.data.council.lugar,
                  fecha: res.data.council.fecha,
                  hora: res.data.council.hora,
                  sesionSeleccionada: res.data.council.id_tipo_sesion
                });
              } else {
                this.setState({
                  isLoading: false,
                  encontrado: false
                });
              }
            })
            .catch((err) => console.log(err));
        } else {
          this.setState({
            redirect: true
          })
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  handleInputChange(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          const consejo = {
            id_tipo_sesion: this.state.sesionSeleccionada,
            lugar: this.state.lugar,
            fecha: this.state.fecha,
            hora: this.state.hora
          }
          axios.put(`/consejo/${this.state.consecutivo}`, consejo)
            .then(res => {
              if (res.data.success) {
                this.props.history.push('/gConsejos');
              }
            })
            .catch((err) => console.log(err));
        } else {
          this.setState({
            redirect: true
          })
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  getCouncilTypes() {
    const info = [];
    for (let i = 0; i < this.state.tipoSesion.length; i++) {
      let id_tipo_sesion = this.state.tipoSesion[i].id_tipo_sesion;
      let descripcion = this.state.tipoSesion[i].descripcion;
      info.push(
        <div className="custom-control custom-radio" key={i}>
          <input type="radio" id={descripcion} name="sesionSeleccionada" value={id_tipo_sesion} onChange={this.handleInputChange}
            checked={parseInt(this.state.sesionSeleccionada, 10) === id_tipo_sesion} className="custom-control-input" />
          <label className="custom-control-label" htmlFor={descripcion}>
            {descripcion}
          </label>
        </div>
      );
    }
    return info;
  }

  render() {
    return (this.state.isLoading ? <Loading /> : this.state.redirect ? <Redirect to='/' /> : !this.state.encontrado ? <DefaultComponent /> :
      <>
        <Navegacion />
        <div className="row m-0">
          <div className="col-md-10 m-auto">
            <div className="card border-primary consejo-card">
              <div className="card-body">
                <Link to='/gConsejos'><i className="fas fa-times fa-lg m-2 ubicar-salida" style={{ color: 'navy' }}></i></Link>
                <form onSubmit={this.handleSubmit}>
                  <div className='todo-registro'>
                    <div className='registro-container izq'>
                      <p className='text-center m-0 mb-2'>Edición Básica del Consejo {this.state.consecutivo}</p>
                      <div className="form-group">
                        <input type="text" required maxLength="100" name="lugar" autoFocus
                          placeholder="Lugar" autoComplete="off" className="form-control"
                          onChange={this.handleInputChange} value={this.state.lugar} />
                        <p className='my-muted'>*Lugar donde se llevará a cabo el consejo.</p>
                      </div>
                      <p className='m-0'>Seleccione el tipo de sesión:</p>
                      <div className="form-group">
                        {this.getCouncilTypes()}
                      </div>
                      <div className="form-group">
                        <input type="date" required name="fecha" min={this.state.hoy} className="form-control"
                          onChange={this.handleInputChange} value={this.state.fecha} />
                        <p className="my-muted">*Fecha en la que se llevará a cabo el consejo.</p>
                      </div>
                      <div className="form-group">
                        <input type="time" required name="hora" min='07:00' max='20:00' step='900' className="form-control"
                          onChange={this.handleInputChange} value={this.state.hora} />
                        <p className='my-muted'>*Hora en la que se llevará a cabo el consejo.</p>
                      </div>
                    </div>
                    <div className='registro-container der'>
                      <AgendaOficial consecutivo={this.state.consecutivo} />
                    </div>
                  </div>
                  <div className="form-group d-flex justify-content-around">
                    <button type="submit" className="btn btn-outline-primary mt-4 editar-button">Guardar Cambios</button>
                    <Link className="btn btn-outline-secondary mt-4 editar-button" to='/gConsejos'>Cancelar</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
