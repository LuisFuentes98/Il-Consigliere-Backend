import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import DefaultComponent from '../../helpers/DefaultComponent';
import { myAlert } from '../../helpers/alert';
import { Loading } from '../../helpers/Loading';

export default class Registro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cedula: '',
      nombre: '',
      apellido: '',
      segundo_apellido: '',
      clave: '',
      confirmacion: '',
      correo: '',
      permisos: [],
      isLoading: true,
      invalido: true,
      registrado: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const token = this.props.match.params.token;
    axios.get(`/usuario/validar_link/${token}`)
      .then(res => {
        if (res.data.success) {
          this.setState({
            isLoading: false,
            invalido: false,
            permisos: res.data.links
          });
        } else {
          this.setState({
            isLoading: false,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  updateStatePasswords() {
    this.setState({
      clave: '',
      confirmacion: ''
    });
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    if ((name === 'cedula') && (!Number(value)) && (value !== '')) {
      return;
    }
    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.clave === this.state.confirmacion) {
      const user = {
        cedula: this.state.cedula,
        nombre: this.state.nombre,
        apellido: this.state.apellido,
        segundo_apellido: this.state.segundo_apellido,
        clave: this.state.clave,
        id_tipo_convocado: this.state.permisos[0].id_tipo_convocado
      };
      axios.get(`/usuario/${this.state.cedula}`)
        .then(res => {
          if (res.data.success) {
            myAlert('Atención', 'Ya existe un usuario en el sistema con la cédula proporcionada.', 'warning');
            this.updateStatePasswords();
          } else {
            axios.post('/correo/verificar_correo', { correo: this.state.correo })
              .then(respo => {
                if (!respo.data.taken) {
                  axios.post('/usuario/', user)
                    .then(async resp => {
                      if (resp.data.success) {
                        try {
                          for (let i = 0; i < this.state.permisos.length; i++) {
                            if (this.state.permisos[i].id_permiso === 1) {
                              await axios.post('/usuario_permiso', { cedula: this.state.cedula, id_permiso: 1 });
                            }
                            if (this.state.permisos[i].id_permiso === 2) {
                              await axios.post('/usuario_permiso', { cedula: this.state.cedula, id_permiso: 2 });
                            }
                          }
                        } catch (err) {
                          console.log(err);
                        }
                        axios.post(`/correo/${this.state.cedula}`, { correo: this.state.correo })
                          .then(respon => {
                            if (respon.data.success) {
                              myAlert('Registro Exitoso', 'Ahora puede iniciar sesión y utilizar el sistema.', 'success');
                              this.setState({
                                registrado: true
                              });
                            } else {
                              myAlert('Oh no!', 'Error interno del servidor.', 'error');
                              this.updateStatePasswords();
                            }
                          })
                          .catch((err) => console.log(err));
                      } else {
                        myAlert('Oh no!', 'Error interno del servidor.', 'error');
                        this.updateStatePasswords();
                      }
                    })
                    .catch((err) => console.log(err));
                } else {
                  myAlert('Atención', 'Ya existe un usuario con este correo en el sistema.', 'warning');
                  this.updateStatePasswords();
                }
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    } else {
      myAlert('Atención', 'Las contraseñas no coinciden.', 'warning');
      this.updateStatePasswords();
    }
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    } else if (this.state.invalido) {
      return <DefaultComponent />;
    } else if (this.state.registrado) {
      return <Redirect to='/' />
    } else {
      return (
        <div className="row m-0" style={{ height: '100vh' }}>
          <div className="col-md-5 m-auto">
            <div className="card border-primary mb-3">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Registro de Usuarios</h4>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input type="text" required maxLength="20" name="cedula"
                      placeholder="Cédula" autoComplete="off" className="form-control"
                      autoFocus onChange={this.handleInputChange} value={this.state.cedula} />
                  </div>
                  <div className="form-group">
                    <input type="text" required maxLength="50" name="nombre"
                      placeholder="Nombre" className="form-control"
                      onChange={this.handleInputChange} value={this.state.nombre} />
                  </div>
                  <div className="form-group">
                    <input type="text" required maxLength="50" name="apellido"
                      placeholder="Apellido" className="form-control"
                      onChange={this.handleInputChange} value={this.state.apellido} />
                  </div>
                  <div className="form-group">
                    <input type="text" required maxLength="50" name="segundo_apellido"
                      placeholder="Segundo Apellido" className="form-control"
                      onChange={this.handleInputChange} value={this.state.segundo_apellido} />
                  </div>
                  <div className="form-group">
                    <input type="email" required maxLength="200" name="correo"
                      placeholder="Correo electrónico" className="form-control"
                      onChange={this.handleInputChange} value={this.state.correo} />
                    <p className='my-muted'>*Escribe el correo al que desea recibir la información de los consejos.</p>
                  </div>
                  <div className="form-group">
                    <input type="password" required maxLength="20" name="clave"
                      placeholder="Contraseña" className="form-control"
                      onChange={this.handleInputChange} value={this.state.clave} />
                  </div>
                  <div className="form-group">
                    <input type="password" required minLength="4" maxLength="20" name="confirmacion"
                      placeholder="Confirme contraseña" className="form-control"
                      onChange={this.handleInputChange} value={this.state.confirmacion} />
                    <p className='my-muted'>*La contraseña debe tener un largo mínimo de 4 caracteres y tiene un máximo de 20 caracteres.</p>
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-outline-primary btn-block mt-4">Registrarme</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
