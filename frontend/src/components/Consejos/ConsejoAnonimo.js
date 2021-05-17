import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import Convocados from './Convocados';
import Navegacion from '../Navegacion/Navegacion';
import DefaultComponent from '../../helpers/DefaultComponent';
import { Loading } from '../../helpers/Loading';
import { getTodaysDate } from '../../helpers/dates';
import './Consejos.css';
import SolicitudAgendaConvocado from './SolicitudAgendaConvocado';

export default class ConsejoAnonimo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      consecutivo: this.props.match.params.consecutivo,
      consejo: {},
      puntos: [],
      archivosVisibles: [],
      cedula: "0000000000",
      encontrado: true,
      redirect: false
    }
  }

  componentDidMount() {
    console.log("Consejo Principal ",this.state.consecutivo);
    axios.get(`/consejo/${this.state.consecutivo}`)
      .then(res => {
        if (res.data.success) {
          this.setState({
            isLoading: false,
            consejo: res.data.council
          });
          axios.get(`/punto/aprobado/${this.state.consecutivo}`)
            .then(resp => {
              if (resp.data.success) {
                let archivosVisibles = [];
                for(let i=0; i<resp.data.discussions.length; i++){
                  archivosVisibles.push(false);
                }
                this.setState({
                  puntos: resp.data.discussions,
                  archivosVisibles: archivosVisibles
                });
                for (let i = 0; i < this.state.puntos.length; i++) {
                  this.getDiscussionFiles(this.state.puntos[i], i);
                }
              }
            })
            .catch((err) => console.log(err));
        } else {
          console.log("No encontrado");
          this.setState({
            isLoading: false,
            encontrado: false
          });
        }
      })
      .catch((err) => console.log(err))
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

  getDiscussions() {
    const discussions = [];
    for (let i = 0; i < this.state.puntos.length; i++) {
      let punto = this.state.puntos[i];
      discussions.push(
        <div key={i}>
          <div className='justify-content-between align-items-center my-2'>
            <li className='text-justify m-0'>{punto.asunto}</li>
            <div>
              {punto.id_tipo_punto === 1 && <p className='text-justify m-0 my-muted'>*Este punto es votativo</p>}
              {punto.comentario && <p className='text-justify m-0 my-muted'>Comentario: {punto.comentario}</p>}
            </div>
          </div>
          <div>
            <div className='d-flex align-items-center my-2'>
              {!this.state.archivosVisibles[i] && <button className="fas fas fa-chevron-right fa-lg mx-1 my-button" type="button" onClick={(e) => this.handleFileVisibility(e, i)}/>}
              {this.state.archivosVisibles[i] && <button className="fas fas fa-chevron-down fa-lg mx-1 my-button" type="button" onClick={(e) => this.handleFileVisibility(e, i)}/>}
              {!this.state.archivosVisibles[i] && <p className='text-justify m-0 my-muted'>Mostrar archivos</p>}
              {this.state.archivosVisibles[i] && <p className='text-justify m-0 my-muted'>Ocultar archivos</p>}
            </div>
            {this.state.archivosVisibles[i] && this.displayFiles(punto)}
          </div>
        </div>
      );
    }
    return discussions;
  }

  handleFileVisibility(e, i){
    let archivosVisibles = this.state.archivosVisibles;
    archivosVisibles[i] = !this.state.archivosVisibles[i];
    this.setState({
      archivosVisibles: archivosVisibles
    });
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

  downloadFile(filename) {
    console.log("opening: ", filename);
    const newWindow = window.open("https://storage.googleapis.com/il-consigliere-files/"+filename, '_blank', 'noopener,noreferrer')
    if(newWindow) newWindow.opener = null
  }

  render() {
    const date = getTodaysDate();
    console.log("loading");
    return (this.state.isLoading ? <Loading /> : this.state.redirect ? <Redirect to='/' /> : !this.state.encontrado ? <DefaultComponent /> :
      <>
        <Navegacion />
        <div className="row m-0">
          <div className="col-md-10 m-auto">
            <div className="card border-primary consejo-card">
              <div className="card-body">
                <Link to='/iConsejos'><i className="fas fa-times fa-lg m-2 ubicar-salida" style={{ color: 'navy' }}></i></Link>
                <div className='todo-registro'>
                  <div className='registro-container izq'>
                    <p className="card-title text-center text-uppercase m-0">{this.state.consejo.institucion}</p>
                    <p className='text-uppercase text-center m-0'>{this.state.consejo.carrera}</p>
                    <p className='text-uppercase text-center m-0'>{this.state.consejo.campus}</p>
                    <p className='text-uppercase text-center m-0'>Convocatoria</p>
                    <p className='text-uppercase text-center m-0'>Sesión {this.state.consejo.id_tipo_sesion === 1 ? 'Ordinaria' : 'Extraordinaria'} {this.state.consecutivo}</p>
                    <p className='text-uppercase text-center m-0'>{this.state.consejo.nombre_consejo}</p>
                    <p className='text-center m-0'>FECHA: {this.state.consejo.fecha}</p>
                    <p className='text-center m-0'>HORA: {this.state.consejo.hora}</p>
                    <p className='text-center m-0'>LUGAR: {this.state.consejo.lugar}</p>
                    <hr />
                    <Convocados consecutivo={this.state.consecutivo} />
                  </div>
                  <div className='registro-container der'>
                    <p>Puntos de Agenda:</p>
                    <div className={this.state.isCouncilModifier ? 'punto-nonspace' : this.state.consejo.fecha < date ? 'punto-nonspace' : this.state.consejo.limite_solicitud < date ? 'punto-nonspace' : 'punto-consejo'}>
                      <ol className='pl-4 m-0'>
                        {this.state.puntos.length === 0 && <p className='my-muted'>No se han agregado puntos de agenda.</p>}
                        {this.getDiscussions()}
                      </ol>
                    </div>
                    {this.state.consejo.fecha >= date && this.state.consejo.limite_solicitud >= date &&
                      <SolicitudAgendaConvocado consecutivo={this.state.consecutivo} />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
