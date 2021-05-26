import React, { Component } from "react";
import axios from "axios";
import auth from "../../helpers/auth";
import { Redirect } from "react-router-dom";
import $ from 'jquery';
import ArchivosDePunto from './ArchivosDePunto';

export default class SolicitudAgenda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.consecutivo,
      tiposDePunto: [],
      solicitudes: new Map(),
      redirect: false
    }

    this.makeEditable = this.makeEditable.bind(this);
    this.acceptDiscussion = this.acceptDiscussion.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  componentDidMount() {
    this.getRequestsFromDB();
    axios.get('/tipo_punto')
      .then(res => {
        if (res.data.success) {
          this.setState({
            tiposDePunto: res.data.discussionTypes
          });
        }
      })
      .catch((err) => console.log(err));
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

  handleSubjectChange(e) {
    let id_punto = parseInt(e.target.name);
    let value = e.target.value;
    let solicitud = this.state.solicitudes.get(id_punto);
    solicitud.asunto = value;
    this.setState(prevState => ({ solicitudes: prevState.solicitudes.set(id_punto, solicitud) }));
  }

  handleCommentChange(e) {
    let id_punto = parseInt(e.target.name);
    let value = e.target.value;
    let solicitud = this.state.solicitudes.get(id_punto);
    solicitud.comentario = value;
    this.setState(prevState => ({ solicitudes: prevState.solicitudes.set(id_punto, solicitud) }));
  }

  handleCheckChange(e) {
    let id_punto = parseInt(e.target.name);
    let value = e.target.value;
    let solicitud = this.state.solicitudes.get(id_punto);
    solicitud.id_tipo_punto = value;
    this.setState(prevState => ({ solicitudes: prevState.solicitudes.set(id_punto, solicitud) }));
  }

  makeEditable(e, id_punto) {
    e.preventDefault();
    let solicitud = this.state.solicitudes.get(id_punto);
    solicitud.editable = true;
    this.setState(prevState => ({ solicitudes: prevState.solicitudes.set(id_punto, solicitud) }));
  }

  disableEditable(e, id_punto) {
    e.preventDefault();
    let solicitud = this.state.solicitudes.get(id_punto);
    solicitud.editable = false;
    this.setState(prevState => ({ solicitudes: prevState.solicitudes.set(id_punto, solicitud) }));
  }

  acceptDiscussion(e, id_punto) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get(`/punto/aprobado/${this.state.consecutivo}`)
            .then(response => {
              let orden = 0;
              if(response.data.succes){
                orden = response.data.discussions.length;
              }
              axios.put(`/punto/${id_punto}`, { id_estado_punto: 1, asunto: this.state.solicitudes.get(id_punto).asunto, comentario:  this.state.solicitudes.get(id_punto).comentario, orden: orden })
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

  deleteDiscussion(e, id_punto) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.delete(`/punto/${id_punto}`)
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

  getDiscussionTypes(punto) {
    const info = [];
    for (let i = 0; i < this.state.tiposDePunto.length; i++) {
      let tipo_punto = this.state.tiposDePunto[i];
      info.push(
        <div className="custom-control custom-radio mx-auto" key={i}>
          <input type="radio" id={"radio"+punto.id_punto+i} name={punto.id_punto} value={tipo_punto.id_tipo_punto} onChange={this.handleCheckChange}
            checked={Number(punto.id_tipo_punto) === Number(tipo_punto.id_tipo_punto)} className="custom-control-input" />
          <label className="custom-control-label" htmlFor={"radio"+punto.id_punto+i}>
            {tipo_punto.descripcion}
          </label>
        </div>
      );
    }
    return info;
  }

  getRequests() {
    const requests = [];
    for (let value of this.state.solicitudes.values()) {
      if (value.editable) {
        requests.push(
          <div className='d-flex justify-content-between align-items-center my-2' key={value.id_punto}>
            <div style={{ width: '95%' }}>
              <p className='m-0 text-justify'>{value.nombre + ' ' + value.apellido}:</p>
              <input type='text' name={value.id_punto} className="form-control" onChange={this.handleSubjectChange} value={value.asunto} style={{ width: 'inherited' }} />
              <textarea name={value.id_punto} className="form-control" onChange={this.handleCommentChange} value={value.comentario} style={{ width: 'inherited' }} />
              <div className="form-group d-flex align-items-center">
                {this.getDiscussionTypes(value)}
              </div>
            </div>
            <button className="fas fa-edit my-disabled fa-lg ml-4 my-button" type="button" onClick={(e) => this.disableEditable(e, value.id_punto)} />
            <button className="fas fa-check-circle my-icon fa-lg mx-2 my-button" type="button" onClick={(e) => this.acceptDiscussion(e, value.id_punto)} />
          </div>
        );
      } else {
        requests.push(
          <div key={value.id_punto}>
            <div className='d-flex justify-content-between align-items-center my-2' key={value.id_punto}>
              <p className='m-0 text-justify'>{value.nombre + ' ' + value.apellido}: {value.asunto}</p>
              <div className='d-flex justify-content-between align-items-center'>
                <button className="fas fa-edit my-icon fa-lg ml-4 my-button" type="button" onClick={(e) => this.makeEditable(e, value.id_punto)} />
                <button className="fas fa-check-circle my-icon fa-lg mx-2 my-button" type="button" onClick={(e) => this.acceptDiscussion(e, value.id_punto)} />
                <button className="fas fa-trash-alt my-icon fa-lg mx-1 my-button" type="button" onClick={(e) => this.deleteDiscussion(e, value.id_punto)}/>
              </div>
            </div>
            {value.id_tipo_punto === 1 && <p className='text-justify m-0 my-muted ml-4'>*Este punto es votativo*</p>}
            {value.comentario && <p className='text-justify m-0 my-muted ml-4'>Comentario: {value.comentario}</p>}
            <ArchivosDePunto consecutivo={this.state.consecutivo} punto={value} editable={true}/>
            <div className='mt-4'></div>
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