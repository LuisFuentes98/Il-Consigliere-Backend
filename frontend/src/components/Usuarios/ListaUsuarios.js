import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import Navegacion from '../Navegacion/Navegacion';
import auth from '../../helpers/auth';
import './ListaUsuarios.css';
import InvitarUsuario from './InvitarUsuario';

export default class ListaUsuarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarios: [],
      redirect: false
    };
    this.deleteUser = this.deleteUser.bind(this);
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get('/usuario/')
            .then(res => {
              if (res.data.success) {
                this.setState({
                  usuarios: res.data.users
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

  deleteUser(e, cedula, nombre, apellido) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          swal({
            title: "Confirmación",
            text: `Se eliminará la información de ${nombre} ${apellido}`,
            icon: "warning",
            buttons: ["Cancelar", "Confirmar"],
            dangerMode: true,
          })
            .then((willDelete) => {
              if (willDelete) {
                axios.delete(`/usuario_permiso/${cedula}`)
                  .then(() => {
                    axios.delete(`/correo/${cedula}`)
                      .then(() => {
                        axios.delete(`/usuario/${cedula}`)
                          .then(() => {
                            this.getUsers();
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              }
            });
        } else {
          this.setState({
            redirect: true
          })
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  userList() {
    const tableRows = [];
    for (let i = 0; i < this.state.usuarios.length; i++) {
      let user = this.state.usuarios[i];
      let { cedula, nombre, apellido, segundo_apellido } = user;
      if (cedula !== auth.getInfo().cedula) {
        tableRows.push(
          <tr key={i}>
            <td className='special-border align-middle'>{cedula}</td>
            <td className='special-border align-middle'>{nombre}</td>
            <td className='special-border align-middle'>{apellido}</td>
            <td className='special-border align-middle'>{segundo_apellido}</td>
            <td className='special-border align-middle'>
              <Link to={`/gUsuarios/${cedula}`}><i className="far fa-eye fa-lg mr-4" style={{ color: "navy" }}></i></Link>
              <i className='fas fa-trash-alt my-icon fa-lg' onClick={(e) => this.deleteUser(e, cedula, nombre, apellido)} />
            </td>
          </tr>
        );
      }
    }
    return tableRows;
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <Navegacion />
        <div className="container">
          <div className="d-flex justify-content-between">
            <h3 className="mb-4">Lista de Usuarios</h3>
            <InvitarUsuario />
          </div>
          {this.state.usuarios.length === 1 &&
            <p className="my-muted">No hay más usuarios en el sistema.</p>}
          <table className="table m-auto">
            <tbody>
              {this.userList()}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
