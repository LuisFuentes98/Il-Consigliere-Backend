import React, { Component } from 'react';
import axios from 'axios';
import Navegacion from '../Navegacion/Navegacion';
import { Link } from 'react-router-dom';
import { myAlert } from '../../helpers/alert';
import auth from '../../helpers/auth';
import { requestDay } from '../../helpers/dates';
import './Consejos.css';

export default class Convocar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.match.params.consecutivo,
      usuarios: [],
      convocados: new Map(),
      convocadosAnteriormente: [],
      seleccionarTodos: false,
      redirect: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.button = React.createRef();
  }

  componentDidMount() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          let convAntCantidad = 0;
          let usuariosCantidad = 0;
          let convAnt = [];
          let usuarios = [];
          axios.get('/usuario')
            .then(res => {
              if (res.data.success) {
                this.setState({
                  usuarios: res.data.users
                });
                usuariosCantidad = res.data.users.length;
                usuarios = res.data.users;
                let convocados = new Map();
                for (let i = 0; i < usuariosCantidad; i++) {
                  convocados.set(usuarios[i].cedula, false);
                }
                axios.get(`/convocado/por_consejo/${this.state.consecutivo}`)
                  .then(res => {
                    if (res.data.success) {
                      this.setState({
                        convocadosAnteriormente: res.data.convocados
                      });
                      convAntCantidad = res.data.convocados.length;
                      convAnt = res.data.convocados;
                      if (convAntCantidad === usuariosCantidad) {
                        this.setState({
                          seleccionarTodos: true
                        });
                      }
                      for (let i = 0; i < usuariosCantidad; i++) {
                        for (let j = 0; j < convAntCantidad; j++) {
                          if (usuarios[i].cedula === convAnt[j].cedula) {
                            convocados.set(usuarios[i].cedula, true);
                          }
                        }
                      }
                    }
                    this.setState({
                      convocados: convocados
                    });
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

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.checked;
    if (name === 'seleccionarTodos') {
      this.setState({
        seleccionarTodos: value
      });
      let convocados = new Map();
      if (value) {
        let arrVerdaderos = Array(this.state.usuarios.length).fill(true);
        this.state.usuarios.map((e, i) => {
          return convocados.set(e.cedula, arrVerdaderos[i]);
        });
      } else {
        let arrFalsos = Array(this.state.usuarios.length).fill(false);
        this.state.usuarios.map((e, i) => {
          return convocados.set(e.cedula, arrFalsos[i]);
        });
      }
      this.setState({
        convocados: convocados
      });
    } else {
      let convocados = this.state.convocados;
      let values = convocados.set(name, value).values();
      this.checkSelectAll(values);
      this.setState(prevState => ({ convocados: prevState.convocados.set(name, value) }));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    auth.verifyToken()
      .then(async value => {
        if (value) {
          try {
            const convocados = this.state.convocados;
            const convoque = [];
            for (let i = 0; i < this.state.convocadosAnteriormente.length; i++) {
              if (convocados.get(this.state.convocadosAnteriormente[i].cedula)) {
                convocados.delete(this.state.convocadosAnteriormente[i].cedula);
              } else {
                await axios.delete(`/convocado/por_usuario/${this.state.consecutivo}/${this.state.convocadosAnteriormente[i].cedula}`);
              }
            }
            for (let [key, value] of convocados.entries()) {
              if (value) {
                convoque.push(key);
              }
            }
            if (convoque.length > 0) {
              this.button.current.setAttribute('disabled', 'disabled');
              this.button.current.style.cursor = 'progress';
              const res = await axios.post('/convocado', { convocados: convoque, consecutivo: this.state.consecutivo, limite_solicitud: requestDay() });
              if (res.data.success) {
                this.button.current.removeAttribute('disabled', 'disabled');
                this.button.current.style.cursor = 'default';
                myAlert('Éxito', 'Se han convocado todos los usuarios que se escogieron.', 'success');
                this.props.history.push('/gConsejos');
              } else {
                myAlert('Oh no', 'Ha ocurrido un error en el sistema.', 'error');
              }
            } else {
              myAlert('Éxito', 'Se han convocado todos los usuarios que se escogieron.', 'success');
              this.props.history.push('/gConsejos');
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          this.setState({
            redirect: true
          })
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  checkSelectAll(values) {
    for (let value of values) {
      if (!value) {
        if (this.state.seleccionarTodos) {
          this.setState({
            seleccionarTodos: false
          });
        }
        return;
      }
    }
    if (!this.state.seleccionarTodos) {
      this.setState({
        seleccionarTodos: true
      });
    }
    return;
  }

  getUsers() {
    const users = [];
    for (let i = 0; i < this.state.usuarios.length; i++) {
      let usuario = this.state.usuarios[i];
      users.push(
        <div className="custom-control custom-checkbox" key={i}>
          <input type="checkbox" className="custom-control-input" id={usuario.cedula} name={usuario.cedula}
            checked={!!this.state.convocados.get(usuario.cedula)} onChange={this.handleInputChange} />
          <label className="custom-control-label" htmlFor={usuario.cedula}>{usuario.nombre} {usuario.apellido} {usuario.segundo_apellido}</label>
        </div>
      );
    }
    return users;
  }

  render() {
    return (
      <>
        <Navegacion />
        <div className="row m-0" style={{ height: '80vh' }}>
          <div className="col-md-6 m-auto">
            <div className="card border-primary mb-3">
              <div className="card-body">
                <Link to='/gConsejos'><i className="fas fa-times fa-lg m-2 ubicar-salida" style={{ color: 'navy' }}></i></Link>
                <h4 className="card-title text-center mb-4">Administrar participantes</h4>
                <form onSubmit={this.handleSubmit}>
                  <div className='form-group convocado-div'>
                    <div className="custom-control custom-checkbox">
                      <input type="checkbox" className="custom-control-input" id='default' name="seleccionarTodos"
                        checked={this.state.seleccionarTodos} onChange={this.handleInputChange} />
                      <label className="custom-control-label" htmlFor='default'>Seleccionar todos los usuarios</label>
                      <hr />
                    </div>
                    {this.getUsers()}
                  </div>
                  <div className="form-group d-flex justify-content-around">
                    <button ref={this.button} type="submit" className="btn btn-outline-primary mt-4 convocar-button">Aceptar</button>
                    <Link className="btn btn-outline-secondary mt-4 convocar-button" to='/gConsejos'>Descartar</Link>
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
