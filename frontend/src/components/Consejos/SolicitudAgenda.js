import React, { Component } from "react";
import axios from "axios";
import auth from "../../helpers/auth";
import { Redirect } from "react-router-dom";
import $ from 'jquery';

export default class SolicitudAgenda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.consecutivo,
      solicitudes: new Map(),
      redirect: false
    }

    this.makeEditable = this.makeEditable.bind(this);
    this.acceptDiscussion = this.acceptDiscussion.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.getRequestsFromDB();
  }

  getRequestsFromDB() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get(`/punto/solicitud/${this.state.consecutivo}`)
            .then(res => {
              if (res.data.success) {
                let solicitudes = new Map();
                for (let i = 0; i < res.data.discussions.length; i++) {
                  let solicitud = res.data.discussions[i];
                  solicitud.editable = false;
                  solicitudes.set(solicitud.id_punto, solicitud);
                }
                this.setState({
                  solicitudes: solicitudes
                });
              } else {
                this.setState({
                  solicitudes: new Map()
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
    let id_punto = parseInt(e.target.name);
    let value = e.target.value;
    let solicitud = this.state.solicitudes.get(id_punto);
    solicitud.asunto = value;
    this.setState(prevState => ({ solicitudes: prevState.solicitudes.set(id_punto, solicitud) }));
  }

  makeEditable(e, id_punto) {
    e.preventDefault();
    let solicitud = this.state.solicitudes.get(id_punto);
    solicitud.editable = true;
    this.setState(prevState => ({ solicitudes: prevState.solicitudes.set(id_punto, solicitud) }));
  }

  acceptDiscussion(e, id_punto) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.put(`/punto/${id_punto}`, { id_tipo_punto: 1, asunto: this.state.solicitudes.get(id_punto).asunto })
            .then(res => {
              if (res.data.success) {
                let solicitudes = this.state.solicitudes;
                solicitudes.delete(id_punto);
                this.setState({
                  solicitudes: solicitudes
                });
                this.props.updateParent();
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

  getRequests() {
    const requests = [];
    for (let value of this.state.solicitudes.values()) {
      if (value.editable) {
        requests.push(
          <div className='d-flex justify-content-between align-items-center my-2' key={value.id_punto}>
            <div style={{ width: '95%' }}>
              <p className='m-0 text-justify'>{value.nombre + ' ' + value.apellido}:</p>
              <textarea name={value.id_punto} className="form-control" onChange={this.handleInputChange} value={value.asunto} style={{ width: 'inherited' }} />
            </div>
            <button className="far fa-check-circle my-icon fa-lg mx-2 my-button" type="button" onClick={(e) => this.acceptDiscussion(e, value.id_punto)} />
          </div>
        );
      } else {
        requests.push(
          <div className='d-flex justify-content-between align-items-center my-2' key={value.id_punto}>
            <p className='m-0 text-justify'>{value.nombre + ' ' + value.apellido}: {value.asunto}</p>
            <div className='d-flex justify-content-between align-items-center'>
              <button className="fas fa-edit my-icon fa-lg ml-4 my-button" type="button" onClick={(e) => this.makeEditable(e, value.id_punto)} />
              <button className="far fa-check-circle my-icon fa-lg mx-2 my-button" type="button" onClick={(e) => this.acceptDiscussion(e, value.id_punto)} />
            </div>
          </div>
        );
      }
    }
    return requests;
  }

  render() {
    $('#solicitudes').on('shown.bs.modal', function () {
      $('#modal-input').focus();
    });
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        {this.props.ordenar ?
          <button className="fas fa-tasks my-disabled disabled fa-lg my-button" type="button" />
          :
          <button className="fas fa-tasks my-icon fa-lg my-button" type="button" data-toggle="modal" data-target="#solicitudes" />
        }
        <div className="modal fade" id="solicitudes" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content modal-border">
              <div className="modal-body">
                <i className="fas fa-times fa-lg m-2 ubicar-salida my-icon" data-dismiss="modal"></i>
                <h4 className="modal-title text-center mb-4">Solicitudes de Agenda</h4>
                {this.state.solicitudes.size === 0 && <p className='my-muted'>No hay solicitudes de agenda para este consejo.</p>}
                {this.getRequests()}
                <div className='d-flex justify-content-center'>
                  <button type="button" className="btn btn-outline-primary my-size mt-4" data-dismiss="modal">Listo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}