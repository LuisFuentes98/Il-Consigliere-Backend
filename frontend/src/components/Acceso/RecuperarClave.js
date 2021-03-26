import React, { Component } from 'react';
import axios from 'axios';
import { myAlert } from '../../helpers/alert';
import $ from 'jquery';
import 'bootstrap';

export default class RecuperarClave extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cedula: 0,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.button = React.createRef();
  }

  componentDidMount() {
    this.setState({
      cedula: ''
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    axios.get(`/correo/${this.state.cedula}`)
      .then(res => {
        if (res.data.success) {
          this.button.current.setAttribute('disabled', 'disabled');
          this.button.current.style.cursor = 'progress';
          axios.post('/usuario/nueva_clave', { correos: res.data.emails, cedula: this.state.cedula })
            .then(resp => {
              if (resp.data.success) {
                myAlert('Éxito', 'Se ha enviado el correo solicitando el cambio de contraseña', 'success');
              } else {
                myAlert('Error', 'Ha ocurrido un error inesperado en el servidor.', 'error');
              }
              $('#recuperar').modal('hide');
              this.button.current.removeAttribute('disabled', 'disabled');
              this.button.current.style.cursor = 'default';
            })
            .catch((err) => console.log(err));
        } else {
          myAlert('Atención', 'Usted no tiene correos registrados.', 'warning');
        }
      })
      .catch((err) => console.log(err));
  }

  handleInputChange(e) {
    let value = e.target.value;
    let name = e.target.name;
    if ((!Number(value)) && (value !== '')) {
      return;
    }
    this.setState({
      [name]: value
    });
  }


  render() {
    $('#recuperar').on('shown.bs.modal', function () {
      $('#modal-input').focus();
    });
    return (
      <>
        <div className='d-flex justify-content-center mt-2'>
          <button type='button' className="my-link" data-toggle="modal" data-target="#recuperar">
            Olvidé mi contraseña
        </button>
        </div>
        <div className="modal fade" id="recuperar" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content modal-border">
              <div className="modal-body">
                <i className="fas fa-times fa-lg m-2 ubicar-salida my-icon" data-dismiss="modal"></i>
                <h4 className="modal-title text-center mb-4">Cambio de Contraseña de Acceso</h4>
                <p>Se enviará un link solicitando un cambio de contraseña a los correos que tenga asociados con su cuenta.</p>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input type="text" id='modal-input' required maxLength="20" name="cedula"
                      placeholder="Cédula" autoComplete="off" className="form-control"
                      onChange={this.handleInputChange} value={this.state.cedula} />
                  </div>
                  <div className="form-group d-flex justify-content-around">
                    <button type="submit" ref={this.button} className="btn btn-outline-primary mt-4 my-size">Enviar Correo</button>
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