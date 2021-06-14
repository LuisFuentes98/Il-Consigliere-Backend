import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import auth from '../../helpers/auth';
import { myAlert } from '../../helpers/alert';

export default class BuscadorConsejos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: '',
      encontrado: false,
      ruta: '',
      redirect: false
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e) {
    let value = e.target.value;
    let name = e.target.name;
    if(name === "consecutivo"){
      value = value.toUpperCase();
    }
    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get(`/consejo/${this.state.consecutivo}`)
              .then(res => {
                if (res.data.success) {
                  if(this.props.edit === true && Date.parse(res.data.council.fecha) > Date.now()){
                    this.setState({
                      ruta: `/gConsejos/editar/${this.state.consecutivo}`,
                      encontrado: true
                    });
                  } else{
                    this.setState({
                      ruta: `/consejos/${this.state.consecutivo}`,
                      encontrado: true
                    });
                  }
                } else {
                  let consecutivo = this.state.consecutivo;
                  myAlert('No se encontró el consejo.', `Revisa el número de consecutivo, ya que no se encontraron datos de ${consecutivo}.`, 'warning');
                  this.setState({
                    consecutivo: ''
                  });
                }
              })
              .catch((err) => console.log(err));
        } else {
          axios.get(`/consejo/${this.state.consecutivo}`)
              .then(res => {
                if (res.data.success) {
                  this.setState({
                    ruta: `/iConsejos/${this.state.consecutivo}`,
                    encontrado: true
                  });
                } else {
                  let consecutivo = this.state.consecutivo;
                  myAlert('No se encontró el consejo.', `Revisa el número de consecutivo, ya que no se encontraron datos de ${consecutivo}.`, 'warning');
                  this.setState({
                    consecutivo: ''
                  });
                }
              })
              .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> : this.state.encontrado ? <Redirect to={this.state.ruta} /> :
      <>
        <div className='d-flex justify-content-around align-items-center'>
          <p>¿Buscás un consejo en específico?</p>
          <form onSubmit={this.handleSubmit}>
            <div className='d-flex align-items-center'>
              <div className='form-group'>
                <input type="text" required maxLength="10" name="consecutivo"
                  placeholder="Buscar por consecutivo" autoComplete="off" className="form-control"
                  onChange={this.handleInputChange} value={this.state.consecutivo} />
              </div>
              <div className='form-group'>
                <button className="fas fa-search my-icon fa-lg ml-2 my-button" type="submit" />
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }
}