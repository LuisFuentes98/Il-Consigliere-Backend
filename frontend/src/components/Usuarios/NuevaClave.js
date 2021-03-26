import React, { Component } from 'react';
import axios from 'axios';
import { myAlert } from '../../helpers/alert';
import { Loading } from '../../helpers/Loading';
import DefaultComponent from '../../helpers/DefaultComponent';

export default class NuevaClave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cedula: '',
      nueva: '',
      confirmacion: '',
      invalido: true,
      isLoading: true
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios.get(`/usuario/validar_recuperacion/${this.props.match.params.token}`)
      .then(res => {
        if (res.data.success) {
          this.setState({
            invalido: false,
            isLoading: false,
            cedula: res.data.cedula
          });
        } else {
          this.setState({
            isLoading: false
          })
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
    if (this.state.nueva === this.state.confirmacion) {
      axios.post('/usuario/cambiar_clave', { clave: this.state.nueva, cedula: this.state.cedula })
        .then(res => {
          if (res.data.success) {
            myAlert('Éxito', 'La contraseña se ha cambiado satisfactoriamente.', 'success');
            this.setState({
              actual: '',
              nueva: '',
              confirmacion: ''
            });
            this.props.history.push('/acceso');
          } else {
            myAlert('Error', 'Error interno del servidor.', 'error');
            this.setState({
              actual: '',
              nueva: '',
              confirmacion: ''
            });
          }
        })
        .catch((err) => console.log(err));
    } else {
      myAlert('Verifique', 'La contraseña nueva y su confirmación son distintas.', 'error');
      this.setState({
        actual: '',
        nueva: '',
        confirmacion: ''
      });
    }
  }

  render() {
    return (this.state.isLoading ? <Loading /> : this.state.invalido ? <DefaultComponent /> :
      <>
        <div className="row m-0 my-row">
          <div className="col-md-5 m-auto">
            <div className="card border-primary mb-3">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Nueva Contraseña</h4>
                <p className="my-muted">La contraseña debe tener un largo mínimo de 4 caracteres.</p>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input type="password" autofocus required minLength="4" maxLength="20" name="nueva"
                      placeholder="Contraseña nueva" className="form-control"
                      onChange={this.handleInputChange} value={this.state.nueva} />
                  </div>
                  <div className="form-group">
                    <input type="password" required minLength="4" maxLength="20" name="confirmacion"
                      placeholder="Confirme contraseña nueva" className="form-control"
                      onChange={this.handleInputChange} value={this.state.confirmacion} />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-outline-primary btn-block mt-4">Guardar</button>
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
