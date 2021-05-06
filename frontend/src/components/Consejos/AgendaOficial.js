import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import SolicitudAgenda from './SolicitudAgenda';
import AgregarArchivo from './AgregarArchivo';
import auth from "../../helpers/auth";
import { myAlert } from "../../helpers/alert";

export default class AgendaOficial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.consecutivo,
      punto: '',
      puntos: [],
      archivosVisibles: [],
      tipoPunto: [],
      puntoSeleccionado: 1,
      ordenar: false,
      orden: 0,
      comentario: '',
      redirect: false
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addDiscussion = this.addDiscussion.bind(this);
    this.deleteDiscussion = this.deleteDiscussion.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.sort = this.sort.bind(this);
    this.doneSorting = this.doneSorting.bind(this);
    this.up = this.up.bind(this);
    this.down = this.down.bind(this);
    this.button = React.createRef();
  }

  componentDidMount() {
    this.getDiscussionsFromBD();
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

  downloadFile(filename) {
    console.log("opening: ", filename);
    const newWindow = window.open("https://storage.googleapis.com/il-consigliere-files/"+filename, '_blank', 'noopener,noreferrer')
    if(newWindow) newWindow.opener = null
  }

  deleteFile(filename) {
    axios.delete(`/punto/deleteFile/${filename}`)
    .then(res =>{
      if (res.data.success) {
        console.log('file deleted')
        window.location.reload()
      }else{
        console.log(res.data.msg);
      }
    });
  }

  getDiscussionsFromBD() {
    axios.get(`/punto/aprobado/${this.state.consecutivo}`)
      .then(resp => {
        if (resp.data.success) {
          let archivosVisibles = [];
          let puntos = [];
          if(this.state.archivosVisibles.length !== 0){
            archivosVisibles = this.state.archivosVisibles;
          }
          else{
            for(let i=0; i<resp.data.discussions.length; i++){
              archivosVisibles.push(false);
              let punto = resp.data.discussions[i];
              punto.editable = false;
              puntos.push(punto);
            }
          }
          this.setState({
            archivosVisibles: archivosVisibles,
            puntos: puntos,
            orden: resp.data.discussions.length
          });
        } else {
          this.setState({
            puntos: []
          });
        }
      }).then(() =>{
        for (let i = 0; i < this.state.puntos.length; i++) {
          this.getDiscussionFiles(this.state.puntos[i], i);
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

  addDiscussion(e) {
    e.preventDefault();
    if (this.state.punto !== '') {
      auth.verifyToken()
        .then(value => {
          if (value) {
            axios.post('/punto', { asunto: this.state.punto, consecutivo: this.state.consecutivo, id_estado_punto: 1, cedula: auth.getInfo().cedula, orden: this.state.orden, id_tipo_punto: this.state.puntoSeleccionado })
              .then(res => {
                if (res.data.success) {
                  this.getDiscussionsFromBD();
                  let archivosVisibles = this.state.archivosVisibles;
                  archivosVisibles.push(false);
                  this.setState({
                    archivosVisibles: archivosVisibles,
                    punto: '',
                    orden: this.state.orden + 1
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
  }

  deleteDiscussion(e, id_punto) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.delete(`/punto/${id_punto}`)
            .then(res => {
              if (res.data.success) {
                this.getDiscussionsFromBD();
                this.setState({
                  orden: this.state.orden - 1
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

  doneSorting(e) {
    e.preventDefault();
    axios.put('/punto/ordenar/', { puntos: this.state.puntos })
      .then(res => {
        if (res.data.success) {
          this.setState({
            ordenar: !this.state.ordenar
          });
          this.button.current.removeAttribute('disabled', 'disabled');
          this.button.current.style.color = 'navy';
        }
      })
      .catch((err) => console.log(err));
  }

  sort(e) {
    e.preventDefault();
    this.setState({
      ordenar: !this.state.ordenar
    });
    this.button.current.setAttribute('disabled', 'disabled');
    this.button.current.style.color = 'grey';
  }

  up(e, i) {
    e.preventDefault();
    let puntos = this.state.puntos;
    let archivosVisibles = this.state.archivosVisibles;
    [puntos[i - 1], puntos[i]] = [puntos[i], puntos[i - 1]];
    [archivosVisibles[i - 1], archivosVisibles[i]] = [archivosVisibles[i], archivosVisibles[i - 1]];
    this.setState({
      puntos: puntos,
      archivosVisibles: archivosVisibles
    });
  }

  down(e, i) {
    e.preventDefault();
    let puntos = this.state.puntos;
    let archivosVisibles = this.state.archivosVisibles;
    [puntos[i + 1], puntos[i]] = [puntos[i], puntos[i + 1]];
    [archivosVisibles[i + 1], archivosVisibles[i]] = [archivosVisibles[i], archivosVisibles[i + 1]];
    this.setState({
      puntos: puntos,
      archivosVisibles: archivosVisibles
    });
  }

  handleUpdate() {
    this.getDiscussionsFromBD();
  }

  getDiscussions() {
    const discussions = [];
    for (let i = 0; i < this.state.puntos.length; i++) {
      let punto = this.state.puntos[i];
      discussions.push(
        <div key={i}>
          <div className='d-flex justify-content-between align-items-center my-2'>
            {this.state.puntos[i].editable ?
            <div>
              <li className='text-justify m-0'>Asunto:</li>
              <textarea className="form-control" onChange={e => this.handleDiscussionSubjectChange(e, i)} value={punto.asunto} style={{ width: '200%' }} />
              {punto.id_tipo_punto === 1 && <p className='text-justify m-0 my-muted'>*Este punto es votativo</p>}
              <p className='text-justify m-0'>Comentario:</p>
              <textarea className="form-control" onChange={e => this.handleDiscussionCommentChange(e, i)} value={punto.comentario} style={{ width: 'inherit' }} />
            </div>
            :
            <div>
              <li className='text-justify m-0'>{punto.asunto}</li>
              {punto.id_tipo_punto === 1 && <p className='text-justify m-0 my-muted'>*Este punto es votativo</p>}
              {punto.comentario && <p className='text-justify m-0 my-muted'>Comentario: {punto.comentario}</p>}
            </div>
            }
            {this.state.ordenar ?
              <div className='d-flex'>
                {i !== 0 && <button className="far fa-caret-square-up my-icon fa-lg mx-1 my-button" type="button" onClick={(e) => this.up(e, i)} />}
                {i !== (this.state.puntos.length - 1) && <button className="far fa-caret-square-down my-icon fa-lg mx-1 my-button" type="button" onClick={(e) => this.down(e, i)} />}
              </div>
              :
              <div>
                {this.state.puntos[i].editable ?
                  <div>
                    <button className="fas fa-check-circle my-icon fa-lg mx-4 my-button" type="button" onClick={(e) => this.acceptDiscussionChanges(e, i)} />
                  </div>
                  :
                  <div>
                    <button className="fas fa-edit my-icon fa-lg mx-4 my-button" type="button" onClick={(e) => this.makeEditable(e, i)} />
                    <AgregarArchivo consecutivo={this.state.consecutivo} punto={this.state.puntos[i]} modelName={"subir_archivo"+i} />
                    <button className="fas fa-trash-alt my-icon fa-lg mx-4 my-button" type="button" onClick={(e) => this.deleteDiscussion(e, punto.id_punto)} />
                  </div>
                }
              </div>
            }
          </div>
          {!this.state.puntos[i].editable ?
            <div>
              <div className='d-flex align-items-center my-2'>
                {!this.state.archivosVisibles[i] && <button className="fas fas fa-chevron-right fa-lg mx-1 my-button" type="button" onClick={(e) => this.handleFileVisibility(e, i)}/>}
                {this.state.archivosVisibles[i] && <button className="fas fas fa-chevron-down fa-lg mx-1 my-button" type="button" onClick={(e) => this.handleFileVisibility(e, i)}/>}
                {!this.state.archivosVisibles[i] && <p className='text-justify m-0 my-muted'>Mostrar archivos</p>}
                {this.state.archivosVisibles[i] && <p className='text-justify m-0 my-muted'>Ocultar archivos</p>}
              </div>
              {this.state.archivosVisibles[i] && this.displayFiles(punto)}
            </div>
            :
            <div></div>
          }
          
        </div>
      );
    }
    return discussions;
  }

  acceptDiscussionChanges(e, i) {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.post(`/punto/modificar/${this.state.puntos[i].id_punto}`, {asunto: this.state.puntos[i].asunto, comentario: this.state.puntos[i].comentario})
            .then(response => {
              this.disableEditable(e, i);
              myAlert("Listo", "Se ha modificado el punto de agenda con exito.", "success");
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

  handleDiscussionSubjectChange(e, i) {
    let puntos = this.state.puntos;
    let value = e.target.value;
    let punto = puntos[i];
    punto.asunto = value;
    this.setState({ puntos: puntos});
  }

  handleDiscussionCommentChange(e, i) {
    let puntos = this.state.puntos;
    let value = e.target.value;
    let punto = puntos[i];
    punto.comentario = value;
    this.setState({ puntos: puntos});
  }

  makeEditable(e, i) {
    e.preventDefault();
    let puntos = this.state.puntos;
    puntos[i].editable = true;
    this.setState({ puntos: puntos });
  }

  disableEditable(e, i) {
    e.preventDefault();
    let puntos = this.state.puntos;
    puntos[i].editable = false;
    this.setState({ puntos: puntos });
  }

  handleFileVisibility(e, i){
    let archivosVisibles = this.state.archivosVisibles;
    archivosVisibles[i] = !this.state.archivosVisibles[i];
    this.setState({
      archivosVisibles: archivosVisibles
    });
  }

  getDiscussionFiles(punto, i){
    const files = [];
    axios.get(`/punto/getFiles/${this.state.consecutivo.split(' ').join('_')}/${punto.id_punto}`)
      .then(res => {
        if (res.data.success) {
          if (res.data.files.length > 0) {
            for (let i = 0; i < res.data.files.length; i++) {
              files.push(res.data.files[i])
            };
          }
          punto['files'] = files;
          this.setState(state => {
            const puntos = state.puntos;
            puntos[i] = punto;
            return {
              puntos,
            };
          });
        }
      })
      .catch((err) => console.log(err));
      return true;
  }

  displayFiles(punto){
    const fileData = [];
    if(punto.files.length > 0){
      for(let i = 0; i < punto.files.length; i++){
        fileData.push(
          <div key={punto.files[i].filename} className='d-flex justify-content-around align-items-center my-2'>
            <div>
              <p className='text-justify m-0 my-muted'>{punto.files[i].filename}</p>
            </div>
            <div>
              <button className="fas fa-arrow-alt-circle-down my-icon fa-lg mx-0 my-button" type="button"  onClick={() => this.downloadFile(punto.files[i].filename)} />
              <button className="fas fa-trash-alt my-icon fa-lg mx-4 my-button" type="button" onClick={() => this.deleteFile(punto.files[i].filename)}/>
            </div>
          </div>
        );
      }
    }else{
      fileData.push(
        <div key='noFiles' className='d-flex justify-content-around align-items-center my-2'>
          <div>
            <p className='text-justify m-0 my-muted'>No hay archivos adjuntos.</p>
          </div>
        </div>
      );
    }
    return fileData;
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

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <div className='d-flex justify-content-center align-items-center mb-2'>
          <p className='text-center m-0 pr-2'>Puntos de Agenda Oficiales y Solicitudes de Agenda</p>
          <SolicitudAgenda consecutivo={this.state.consecutivo} updateParent={this.handleUpdate} ordenar={this.state.ordenar} />
        </div>
        <div className="form-group">
          <div className='d-flex align-items-center'>
            <textarea placeholder='Punto de agenda (opcional)' name='punto' className="form-control mr-2" onChange={this.handleInputChange} value={this.state.punto} />
            <button className="fas fa-plus-square my-icon fa-lg my-button" type="button" onClick={this.addDiscussion} ref={this.button} />
          </div>
          <div className="form-group d-flex align-items-center">
            {this.getDiscussionTypes()}
          </div>
          {this.state.puntos.length === 0 && <p className='my-muted'>No se han agregado puntos de agenda.</p>}
          <div className='punto-editable mt-2'>
            <ol className='pl-4 m-0'>
              {this.getDiscussions()}
            </ol>
          </div>
        </div>
        {this.state.puntos.length > 1 &&
          <div className='d-flex align-items-center justify-content-end'>
            {this.state.ordenar ?
              <>
                <p className='m-0 mr-2'>Aplicar Orden</p>
                <button className="far fa-check-circle my-icon fa-lg my-button" type="button" onClick={this.doneSorting} />
              </>
              :
              <>
                <p className='m-0 mr-2'>Ordenar</p>
                <button className="fas fa-sort my-icon fa-lg my-button" type="button" onClick={this.sort} />
              </>
            }
          </div>
        }
      </>
    );
  }
}
