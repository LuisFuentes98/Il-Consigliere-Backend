import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import Navegacion from '../Navegacion/Navegacion';
import auth from '../../helpers/auth';
import DefaultComponent from '../../helpers/DefaultComponent';
import { Loading } from '../../helpers/Loading';
import './Usuario.css';

export default class Usuario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      cedula: this.props.match.params.cedula,
      usuario: {},
      permisos: new Map(),
      tipos_convocado: [],
      correos: [],
      encontrado: true,
      redirect: false
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.state.cedula !== auth.getInfo().cedula) {
      auth.verifyToken()
        .then(value => {
          if (value) {
            axios.get(`/usuario/${this.state.cedula}`)
              .then(user => {
                if (user.data.success) {
                  this.setState({
                    isLoading: false,
                    usuario: user.data.user
                  });
                  axios.get(`/correo/${this.state.cedula}`)
                    .then(emails => {
                      if (emails.data.success) {
                        this.setState({
                          correos: emails.data.emails
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                  axios.get('/tipo_convocado')
                    .then(res => {
                      if (res.data.success) {
                        this.setState({
                          tipos_convocado: res.data.attendantTypes
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                  axios.get('/permiso')
                    .then(res => {
                      if (res.data.success) {
                        const permisos = new Map();
                        let permiso = {};
                        for (let i = 0; i < res.data.roles.length; i++) {
                          permiso = res.data.roles[i];
                          permiso.seleccionado = false;
                          permisos.set(permiso.id_permiso, permiso);
                        }
                        axios.get(`/usuario/permisos/${this.state.cedula}`)
                          .then(roles => {
                            if (roles.data.success) {
                              for (let i = 0; i < roles.data.roles.length; i++) {
                                permiso = permisos.get(roles.data.roles[i].id_permiso);
                                permiso.seleccionado = true;
                                permisos.set(permiso.id_permiso, permiso);
                              }
                            }
                            this.setState({
                              permisos: permisos
                            });
                          })
                          .catch((err) => console.log(err));
                      }
                    })
                    .catch((err) => console.log(err));
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
    } else {
      this.setState({
        isLoading: false,
        encontrado: false
      });
    }
  }

  handleInputChange(e) {
    const name = parseInt(e.target.name);
    const value = e.target.checked;
    let permiso = this.state.permisos.get(name);
    permiso.seleccionado = value;
    this.setState(prevState => ({ permisos: prevState.permisos.set(name, permiso) }));
  }

  handleOptionChange(e) {
    let usuario = this.state.usuario;
    usuario.id_tipo_convocado = e.target.value;
    this.setState({
      usuario: usuario
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.delete(`/usuario_permiso/${this.state.cedula}`);
      let info = {}
      for (let value of this.state.permisos.values()) {
        if (value.seleccionado) {
          info = {
            id_permiso: value.id_permiso,
            cedula: this.state.cedula
          }
          await axios.post('/usuario_permiso', info);
        }
      }
      await axios.put(`/usuario/convocado/${this.state.cedula}`, { id_tipo_convocado: this.state.usuario.id_tipo_convocado });
    } catch (err) {
      console.log(err);
    }
    this.props.history.push('/gUsuarios');
  }

  getEmails() {
    const emails = [];
    for (let i = 0; i < this.state.correos.length; i++) {
      emails.push(<p key={i}>{this.state.correos[i].correo}</p>);
    }
    return emails;
  }

  checks() {
    const checks = [];
    for (let value of this.state.permisos.values()) {
      checks.push(
        <div className="custom-control custom-checkbox" key={value.id_permiso}>
          <input type="checkbox" className="custom-control-input"
            id={value.nombre} checked={value.seleccionado}
            onChange={this.handleInputChange} name={value.id_permiso} />
          <label className="custom-control-label" htmlFor={value.nombre}>
            {value.nombre}
          </label>
        </div>
      );
    }
    return checks;
  }

  getAttendantType() {
    const tipo_convocado = [];
    for (let i = 0; i < this.state.tipos_convocado.length; i++) {
      let id = this.state.tipos_convocado[i].id_tipo_convocado;
      let descripcion = this.state.tipos_convocado[i].descripcion;
      tipo_convocado.push(
        <option value={id} key={i}>{descripcion}</option>
      );
    }
    return tipo_convocado;
  }

  render() {
    return (this.state.isLoading ? <Loading /> : this.state.redirect ? <Redirect to='/' /> : !this.state.encontrado ? <DefaultComponent /> :
      <>
        <Navegacion />
        <div className="row m-0 my-row">
          <div className="col-md-6 m-auto">
            <div className="card border-primary">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Información de {this.state.usuario.nombre} {this.state.usuario.apellido} {this.state.usuario.segundo_apellido}</h4>
                <p>Cédula: {this.state.cedula}</p>
                {this.state.correos.length === 0 ? <p>Este usuario no tiene correos registrados.</p> : <h5>Correos asociados:</h5>}
                {this.getEmails()}
                <hr />
                <h4 className="text-center mb-4">Edición de permisos asociados</h4>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    {this.checks()}
                  </div>
                  <hr />
                  <div className="form-group">
                    <p className="lead">Se convoca como:</p>
                    <select className="custom-select" value={this.state.usuario.id_tipo_convocado} onChange={this.handleOptionChange}>
                      {this.getAttendantType()}
                    </select>
                  </div>
                  <div className="form-group d-flex justify-content-around">
                    <button type="submit" className="btn btn-outline-primary my-width mt-2">Guardar Cambios</button>
                    <Link to='/gUsuarios' className="btn btn-outline-secondary my-width mt-2">Cancelar</Link>
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
