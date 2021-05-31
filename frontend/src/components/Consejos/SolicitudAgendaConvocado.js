import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import auth from '../../helpers/auth';
import ArchivosDePunto from './ArchivosDePunto';
import AgregarArchivo from './AgregarArchivo';
import { myAlert } from "../../helpers/alert";

export default class SolicitudAgendaConvocado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.consecutivo,
      solicitudes: [],
      punto: '',
      puntoSeleccionado: 2,
      tipoPunto: [],
      cedula: auth.getInfo().cedula,
      orden: 0,
      comentario: '',
      redirect: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this.getRequestsFromBD();
    axios.get('/tipo_punto')
      .then(res => {
        if (res.data.success) {
          this.setState({
            tipoPunto: res.data.discussionTypes
          });
        }
      })
      .catch((err) => console.log(err));
  }

  handleUpdate(){
    this.setState({ solicitudes: [] });
    this.getRequestsFromBD();
    myAlert("Listo", "Se han adjuntado los archivos seleccionados.", "success");
  }

  getRequestsFromBD() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get(`/punto/solicitud/${this.state.cedula}/${this.state.consecutivo}`)
            .then(res => {
              if (res.data.success) {
                this.setState({
                  solicitudes: res.data.discussions,
                  orden: res.data.discussions.length
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
    let value = e.target.value;
    let name = e.target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.punto !== '') {
      auth.verifyToken()
        .then(value => {
          if (value) {
            const info = {
              id_tipo_punto: this.state.puntoSeleccionado,
              id_estado_punto: 2,
              asunto: this.state.punto,
              comentario: this.state.comentario,
              cedula: this.state.cedula,
              consecutivo: this.state.consecutivo,
              orden: this.state.orden
            };
            axios.post('/punto', info)
              .then(res => {
                if (res.data.success) {
                  this.getRequestsFromBD();
                }
              })
              .catch((err) => console.log(err));
            this.setState({
              punto: '',
              comentario: ''
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

  getDiscussionTypes() {
    const info = [];
    for (let i = 0; i < this.state.tipoPunto.length; i++) {
      let tipo_punto = this.state.tipoPunto[i];
      info.push(
        <div className="custom-control custom-radio mx-auto" key={i}>
          <input type="radio" id={tipo_punto.descripcion} name="puntoSeleccionado" value={tipo_punto.id_tipo_punto} onChange={this.handleInputChange}
            checked={parseInt(this.state.puntoSeleccionado, 10) === tipo_punto.id_tipo_punto} className="custom-control-input" />
          <label className="custom-control-label" htmlFor={tipo_punto.descripcion}>
            {tipo_punto.descripcion}
          </label>
        </div>
      );
    }
    return info;
  }

  getRequests() {
    const requests = [];
    for (let i = 0; i < this.state.solicitudes.length; i++) {
      let solicitud = this.state.solicitudes[i];
      requests.push(
        <div>
          <div className='d-flex justify-content-between align-items-center my-2' key={i}>
            <li className='text-justify'>{solicitud.asunto}</li>
            <div>
              <AgregarArchivo consecutivo={this.state.consecutivo} punto={solicitud} editable={true} deleteDiscussion={this.deleteRequest} modelName={"subir_archivo"+i} updateParent={this.handleUpdate}/>
            </div>
          </div>
          {solicitud.id_tipo_punto === 1 && <p className='text-justify m-0 my-muted'>*Este punto es votativo</p>}
          {solicitud.comentario && <p className='text-justify m-0 my-muted'>Comentario: {solicitud.comentario}</p>}
          <div>
            <ArchivosDePunto consecutivo={this.state.consecutivo} punto={solicitud} editable={true}/>
          </div>
        </div>
      );
    }
    if(requests.length > 0){
      return requests;
    }
    else{
      requests.push(
        <div>
          <p className='text-justify m-0 my-muted'>No ha ingresado solicitudes</p>
        </div>
      );
      return requests;
    }
  }

  deleteRequest(id_punto) {
    axios.delete(`/punto/${id_punto}`)
      .then(res => {
        if (res.data.success) {
          this.getRequestsFromBD();
        }
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <p className='mt-2'>Solicita puntos de agenda:</p>
        <form onSubmit={this.handleSubmit}>
          <div className="w-75 border-line">
            <div>
              <input type='text' placeholder='Punto de agenda (opcional)' name='punto' className="form-control mr-2 mt-1 " onChange={this.handleInputChange} value={this.state.punto} />
              <textarea placeholder='Comentario (opcional)' name='comentario' className="form-control mr-2 mt-1" onChange={this.handleInputChange} value={this.state.comentario} />
            </div>
            <div className="form-group d-flex align-items-center">
              {this.getDiscussionTypes()}
            </div>
            <button type="submit" className="btn btn-outline-primary my-size mt-3 mx-2">Solicitar</button>
          </div>
          <div className='solicitud-container'>
            <p className='mt-3'>Solicitudes:</p>
            <ol className='pl-4 m-0'>
              {this.getRequests()}
            </ol>
          </div>
        </form>
      </>
    );
  }

}