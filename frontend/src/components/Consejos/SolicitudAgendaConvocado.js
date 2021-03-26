import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import auth from '../../helpers/auth';

export default class SolicitudAgendaConvocado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.consecutivo,
      solicitudes: [],
      punto: '',
      cedula: auth.getInfo().cedula,
      redirect: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
  }

  componentDidMount() {
    this.getRequestsFromBD();
  }

  getRequestsFromBD() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get(`/punto/solicitud/${this.state.cedula}/${this.state.consecutivo}`)
            .then(res => {
              if (res.data.success) {
                this.setState({
                  solicitudes: res.data.discussions
                });
              } else {
                this.setState({
                  solicitudes: []
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
    this.setState({
      punto: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.punto !== '') {
      auth.verifyToken()
        .then(value => {
          if (value) {
            const info = {
              id_tipo_punto: 2,
              asunto: this.state.punto,
              cedula: this.state.cedula,
              consecutivo: this.state.consecutivo
            };
            axios.post('/punto', info)
              .then(res => {
                if (res.data.success) {
                  this.getRequestsFromBD();
                }
              })
              .catch((err) => console.log(err));
            this.setState({
              punto: ''
            })
          } else {
            this.setState({
              redirect: true
            })
            auth.logOut();
          }
        })
        .catch((err) => console.log(err));
    }
  }

  getRequests() {
    const requests = [];
    for (let i = 0; i < this.state.solicitudes.length; i++) {
      let solicitud = this.state.solicitudes[i];
      requests.push(
        <div className='d-flex justify-content-between align-items-center my-2' key={i}>
          <li className='text-justify'>{solicitud.asunto}</li>
          <button className="fas fa-trash-alt my-icon fa-lg mx-1 my-button" type="button" onClick={(e) => this.deleteRequest(e, solicitud.id_punto)} />
        </div>
      );
    }
    return requests;
  }

  deleteRequest(e, id_punto) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.delete(`/punto/${id_punto}`)
            .then(res => {
              if (res.data.success) {
                this.getRequestsFromBD();
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

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <p className='mt-4'>Solicita puntos de agenda</p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <div className='d-flex align-items-center'>
              <textarea placeholder='Punto de agenda (opcional)' name='punto' className="form-control mr-2" onChange={this.handleInputChange} value={this.state.punto} />
              <button className="fas fa-plus-square my-icon fa-lg my-button" type="submit" />
            </div>
          </div>
          <div className='solicitud-container'>
            <ol className='pl-4 m-0'>
              {this.getRequests()}
            </ol>
          </div>
        </form>
      </>
    );
  }

}