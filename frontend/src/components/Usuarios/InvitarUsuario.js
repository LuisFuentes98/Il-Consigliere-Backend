import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import auth from '../../helpers/auth';
import { myAlert } from '../../helpers/alert';
import $ from 'jquery';
import 'bootstrap';

export default class InvitarUsuario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      correo: '',
      permisos: new Map(),
      id_tipo_convocado: 1,
      tipos_convocado: [],
      redirect: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.button = React.createRef();
  }

  componentDidMount() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get('/permiso')
            .then(res => {
              if (res.data.success) {
                let permisos = new Map();
                for (let i = 0; i < res.data.roles.length; i++) {
                  let permiso = res.data.roles[i];
                  permiso.seleccionado = false;
                  permisos.set(permiso.id_permiso, permiso);
                }
                this.setState({
                  permisos: permisos
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
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  handleCheckboxChange(e) {
    const name = parseInt(e.target.name);
    const value = e.target.checked;
    let permiso = this.state.permisos.get(name);
    permiso.seleccionado = value;
    this.setState(prevState => ({ permisos: prevState.permisos.set(name, permiso) }));
  }

  handleOptionChange(e) {
    this.setState({
      id_tipo_convocado: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          this.button.current.setAttribute('disabled', 'disabled');
          this.button.current.style.cursor = 'progress';
          const permisos = [];
          for (let value of this.state.permisos.values()) {
            if (value.seleccionado) {
              permisos.push(value.id_permiso);
            }
          }
          const info = {
            correo: this.state.correo,
            id_tipo_convocado: this.state.id_tipo_convocado,
            permisos: permisos
          };
          axios.post('/usuario/enviar_link/', info)
            .then(resp => {
              if (resp.data.success) {
                myAlert("Invitación Exitosa", `Se ha enviado un link con la invitación de registro a ${this.state.correo}`, "success");
              } else {
                myAlert("Oh no!", "Error interno del servidor.", "error");
              }
              for (let value of this.state.permisos.values()) {
                value.seleccionado = false;
                this.setState(prevState => ({ permisos: prevState.permisos.set(value.id_permiso, value) }));
              }
              this.setState({
                correo: '',
                id_tipo_convocado: 1,
              });
              $('#invitar').modal('hide');
              this.button.current.removeAttribute('disabled', 'disabled');
              this.button.current.style.cursor = 'default';
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

  getPermisos() {
    const checks = [];
    for (let value of this.state.permisos.values()) {
      checks.push(
        <div className="custom-control custom-checkbox" key={value.id_permiso}>
          <input type="checkbox" className="custom-control-input"
            id={value.nombre} checked={value.seleccionado}
            onChange={this.handleCheckboxChange} name={value.id_permiso} />
          <label className="custom-control-label" htmlFor={value.nombre}>
            {value.nombre}
          </label>
        </div>
      );
    }
    return checks;
  }

  getTipoConvocado() {
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
    $('#invitar').on('shown.bs.modal', function () {
      $('#modal-input').focus();
    });
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <button type="button" className="btn btn-outline-primary py-0 altura-button" data-toggle="modal" data-target="#invitar">
          Invita a un usuario
        </button>
        <div className="modal fade" id="invitar" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content modal-border">
              <div className="modal-body">
                <i className="fas fa-times fa-lg m-2 ubicar-salida my-icon" data-dismiss="modal"></i>
                <h4 className="modal-title text-center mb-4">Invitación</h4>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input type="email" id='modal-input' required maxLength="200" name="correo"
                      placeholder="Correo electrónico" autoComplete="off" className="form-control"
                      onChange={this.handleInputChange} value={this.state.correo} />
                  </div>
                  <div className="form-group">
                    <p className="lead">Permisos que le asocia:</p>
                    {this.getPermisos()}
                  </div>
                  <div className="form-group">
                    <p className="lead">Se convoca como:</p>
                    <select className="custom-select" value={this.state.id_tipo_convocado} onChange={this.handleOptionChange}>
                      {this.getTipoConvocado()}
                    </select>
                  </div>
                  <div className="form-group d-flex justify-content-around">
                    <button ref={this.button} type="submit" className="btn btn-outline-primary mt-4 my-size">Invitar</button>
                    <button type="button" className="btn btn-outline-secondary my-size mt-4" data-dismiss="modal">Cancelar</button>
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
