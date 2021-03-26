import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Navegacion from '../Navegacion/Navegacion';
import axios from 'axios';
import auth from '../../helpers/auth';
import { myAlert } from '../../helpers/alert';
import { getTodaysDate } from '../../helpers/dates';
import './Consejos.css';

export default class RegistroConsejos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: '',
      lugar: '',
      fecha: '',
      hora: '',
      hoy: getTodaysDate(),
      tipoSesion: [],
      tipoPunto: [],
      sesionSeleccionada: 1,
      puntoSeleccionado: 1,
      ordenar: false,
      punto: '',
      puntos: [],
      redirect: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addDiscussion = this.addDiscussion.bind(this);
    this.deleteDiscussion = this.deleteDiscussion.bind(this);
    this.sort = this.sort.bind(this);
    this.up = this.up.bind(this);
    this.down = this.down.bind(this);
    this.button = React.createRef();
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
          axios.get('/tipo_punto')
            .then(res => {
              if (res.data.success) {
                this.setState({
                  tipoPunto: res.data.discussionTypes
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

  addDiscussion(e) {
    e.preventDefault();
    if (this.state.punto !== '') {
      let puntos = this.state.puntos;
      puntos.push({ asunto: this.state.punto, id_tipo_punto: parseInt(this.state.puntoSeleccionado) });
      this.setState({
        punto: '',
        puntos: puntos
      });
    }
  }

  sort(e) {
    e.preventDefault();
    if (!this.state.ordenar) {
      this.button.current.setAttribute('disabled', 'disabled');
      this.button.current.style.color = 'grey';
    } else {
      this.button.current.removeAttribute('disabled', 'disabled');
      this.button.current.style.color = 'navy';
    }
    this.setState({
      ordenar: !this.state.ordenar
    });
  }

  up(e, i) {
    e.preventDefault();
    let puntos = this.state.puntos;
    [puntos[i - 1], puntos[i]] = [puntos[i], puntos[i - 1]];
    this.setState({
      puntos: puntos
    });
  }

  down(e, i) {
    e.preventDefault();
    let puntos = this.state.puntos;
    [puntos[i + 1], puntos[i]] = [puntos[i], puntos[i + 1]];
    this.setState({
      puntos: puntos
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get(`/consejo/${this.state.consecutivo}`)
            .then(resp => {
              if (resp.data.success) {
                myAlert('Atención', `El número de consecutivo: ${this.state.consecutivo} ya existe en el sistema.`, 'warning');
              } else {
                const consejo = {
                  consecutivo: this.state.consecutivo,
                  lugar: this.state.lugar,
                  fecha: this.state.fecha,
                  hora: this.state.hora,
                  id_tipo_sesion: this.state.sesionSeleccionada,
                  puntos: this.state.puntos,
                  cedula: auth.getInfo().cedula,
                  id_estado_punto: 1
                };
                axios.post('/consejo', consejo)
                  .then(res => {
                    if (res.data.success) {
                      this.props.history.push('/gConsejos');
                    } else {
                      myAlert('Oh no!', 'Error interno del servidor.', 'error');
                    }
                  })
                  .catch((err) => console.log(err));
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

  deleteDiscussion(e, i) {
    e.preventDefault();
    let puntos = this.state.puntos;
    puntos.splice(i, 1);
    this.setState({
      puntos: puntos
    });
  }

  getDiscussions() {
    let formatoPuntos = [];
    if (this.state.puntos.length === 0) {
      return <p className='my-muted'>No se han agregado puntos de agenda</p>;
    }
    for (let i = 0; i < this.state.puntos.length; i++) {
      formatoPuntos.push(
        <div className='d-flex justify-content-between align-items-center my-2' key={i}>
          <div>
            <p className='m-0 text-justify'>{(i + 1) + '. ' + this.state.puntos[i].asunto}</p>
            {this.state.puntos[i].id_tipo_punto === 1 && <p className='my-muted m-0 text-justify'>*Este punto es votativo</p>}
          </div>
          {this.state.ordenar ?
            <div className='d-flex'>
              {i !== 0 && <button className="far fa-caret-square-up my-icon fa-lg mx-1 my-button" type="button" onClick={(e) => this.up(e, i)} />}
              {i !== (this.state.puntos.length - 1) && <button className="far fa-caret-square-down my-icon fa-lg mx-1 my-button" type="button" onClick={(e) => this.down(e, i)} />}
            </div>
            :
            <button className="fas fa-trash-alt my-icon fa-lg mx-1 my-button" type="button" onClick={(e) => this.deleteDiscussion(e, i)} />
          }
        </div>
      );
    }
    return formatoPuntos;
  }

  getCouncilTypes() {
    const info = [];
    for (let i = 0; i < this.state.tipoSesion.length; i++) {
      let tipoSesion = this.state.tipoSesion[i];
      info.push(
        <div className="custom-control custom-radio" key={i}>
          <input type="radio" id={tipoSesion.descripcion} name="sesionSeleccionada" value={tipoSesion.id_tipo_sesion} onChange={this.handleInputChange}
            checked={parseInt(this.state.sesionSeleccionada, 10) === tipoSesion.id_tipo_sesion} className="custom-control-input" />
          <label className="custom-control-label" htmlFor={tipoSesion.descripcion}>
            {tipoSesion.descripcion}
          </label>
        </div>
      );
    }
    return info;
  }

  getDiscussionTypes() {
    const info = [];
    for (let i = 0; i < this.state.tipoPunto.length; i++) {
      let tipoPunto = this.state.tipoPunto[i];
      info.push(
        <div className="custom-control custom-radio mx-auto" key={i}>
          <input type="radio" id={tipoPunto.descripcion} name="puntoSeleccionado" value={tipoPunto.id_tipo_punto} onChange={this.handleInputChange}
            checked={parseInt(this.state.puntoSeleccionado, 10) === tipoPunto.id_tipo_punto} className="custom-control-input" />
          <label className="custom-control-label" htmlFor={tipoPunto.descripcion}>
            {tipoPunto.descripcion}
          </label>
        </div>
      );
    }
    return info;
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <Navegacion />
        <div className="row m-0">
          <div className="col-md-10 m-auto">
            <div className="card border-primary consejo-card">
              <div className="card-body">
                <Link to='/gConsejos'><i className="fas fa-times fa-lg m-2 ubicar-salida" style={{ color: 'navy' }}></i></Link>
                <h3 className="card-title text-center mb-4">Nuevo Consejo</h3>
                <form onSubmit={this.handleSubmit}>
                  <div className='todo-registro'>
                    <div className='registro-container izq'>
                      <div className="form-group">
                        <input type="text" required maxLength="10" name="consecutivo"
                          placeholder="Consecutivo" autoComplete="off" className="form-control"
                          autoFocus onChange={this.handleInputChange} value={this.state.consecutivo} />
                      </div>
                      <div className="form-group">
                        <input type="text" required maxLength="100" name="lugar"
                          placeholder="Lugar" autoComplete="off" className="form-control"
                          onChange={this.handleInputChange} value={this.state.lugar} />
                      </div>
                      <p className='lead'>Seleccione el tipo de sesión:</p>
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
                      <p className='text-center m-0'>
                        Puntos de Agenda Iniciales
                      </p>
                      <div className="form-group">
                        <div className='d-flex align-items-center'>
                          <textarea placeholder='Punto de agenda (opcional)' name='punto' className="form-control mr-2" onChange={this.handleInputChange} value={this.state.punto} />
                          <button className="fas fa-plus-square my-icon fa-lg my-button" type="button" onClick={this.addDiscussion} ref={this.button} />
                        </div>
                        <div className="form-group d-flex align-items-center">
                          {this.getDiscussionTypes()}
                        </div>
                        <div className='punto-nuevo mt-2'>
                          {this.getDiscussions()}
                        </div>
                        {this.state.puntos.length > 1 &&
                          <div className='d-flex align-items-center justify-content-end'>
                            {this.state.ordenar ?
                              <>
                                <p className='m-0 mr-2'>Aplicar Orden</p>
                                <button className="far fa-check-circle my-icon fa-lg my-button" type="button" onClick={this.sort} />
                              </>
                              :
                              <>
                                <p className='m-0 mr-2'>Ordenar</p>
                                <button className="fas fa-sort my-icon fa-lg my-button" type="button" onClick={this.sort} />
                              </>
                            }
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="form-group d-flex justify-content-around">
                    <button type="submit" className="btn btn-outline-primary mt-4 editar-button">Crear Consejo</button>
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
