import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import auth from '../../helpers/auth';
import { myAlert } from '../../helpers/alert';

export default class AdministrarCorreo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      correo: '',
      correos: [],
      redirect: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteEmail = this.deleteEmail.bind(this);
  }

  componentDidMount() {
    this.getEmails();
  }

  getEmails() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          const cedula = auth.getInfo().cedula;
          axios.get(`/correo/${cedula}`)
            .then(res => {
              if (res.data.success) {
                this.setState({
                  correos: res.data.emails
                });
              } else {
                this.setState({
                  correos: []
                })
              }
            })
            .catch((err) => console.log(err));
        } else {
          this.setState({
            redirect: true
          });
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

  deleteEmail(e, email) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {

          swal({
            title: "Confirmación",
            text: `Se eliminará ${email}`,
            icon: "warning",
            buttons: ["Cancelar", "Confirmar"],
            dangerMode: true,
          })
            .then((willDelete) => {
              if (willDelete) {
                axios.delete('/correo', { data: { correo: email } })
                  .then(() => {
                    this.getEmails();
                  })
                  .catch((err) => console.log(err));
              }
            });
        } else {
          this.setState({
            redirect: true
          });
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  handleSubmit(e) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.post('/correo/verificar_correo', { correo: this.state.correo })
            .then(res => {
              if (!res.data.taken) {
                const cedula = auth.getInfo().cedula;
                axios.post(`/correo/${cedula}`, { correo: this.state.correo })
                  .then(() => {
                    this.getEmails()
                    this.setState({
                      correo: ''
                    })
                  })
                  .catch((err) => console.log(err));
              } else {
                myAlert("Atención", "El correo que se digitó ya se encuentra registrado en el sistema.", "warning");

              }
            })
            .catch((err) => console.log(err));
        } else {
          this.setState({
            redirect: true
          });
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  emailsList() {
    const emails = [];
    for (let i = 0; i < this.state.correos.length; i++) {
      const correo = this.state.correos[i].correo;
      emails.push(
        <div className="d-flex my-div mx-auto" key={i}>
          <div className="my-email2 mx-auto special-border">{correo}</div>
          <button className="fas fa-trash-alt my-icon fa-lg my-auto my-button" type="button" onClick={(e) => this.deleteEmail(e, correo)} />
        </div>
      );
    }
    return emails;
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      // <div className="container especial">
      <>
        <h4 className="mb-4 text-center">Administración de Correos</h4>
        <form onSubmit={this.handleSubmit}>
          <div className="d-flex my-div mx-auto justify-content-between">
            <div className="form-group my-email m-auto d-block">
              <input type="email" required maxLength="200" name="correo"
                placeholder="Nuevo correo" autoComplete="off" className="form-control"
                onChange={this.handleInputChange} value={this.state.correo} />
            </div>
            <div className="form-group my-auto d-block">
              <button className="fas fa-save my-icon fa-lg my-button" type="submit" />
            </div>
          </div>
        </form>
        {this.state.correos.length === 0 &&
          <div className="my-div mx-auto">
            <p className="my-muted">Registre al menos un correo, no podrá recuperar su contraseña sin un correo asociado a su cuenta ni recibir actualizaciones de consejos.</p>
          </div>
        }
        <div className="email-container">
          {this.emailsList()}
        </div>
      </>
      // </div>
    );
  }
}
