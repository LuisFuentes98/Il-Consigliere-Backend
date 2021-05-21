import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import Convocados from './Convocados';
import Navegacion from '../Navegacion/Navegacion';
import auth from '../../helpers/auth';
import DefaultComponent from '../../helpers/DefaultComponent';
import { Loading } from '../../helpers/Loading';
import roles from '../../helpers/roles';
import { getTodaysDate } from '../../helpers/dates';
import './Consejos.css';
import SolicitudAgendaConvocado from './SolicitudAgendaConvocado';
import ArchivosDePunto from './ArchivosDePunto';

export default class Consejos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      consecutivo: this.props.match.params.consecutivo,
      consejo: {},
      puntos: [],
      isCouncilModifier: roles.isCouncilModifier(),
      cedula: auth.getInfo().cedula,
      encontrado: true,
      redirect: false
    }
  }

  componentDidMount() {
    auth.verifyToken()
      .then(value => {
        if (value) {
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
                this.setState({
                  isLoading: false,
                  encontrado: false
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
            <ArchivosDePunto consecutivo={this.state.consecutivo} punto={this.state.puntos[i]} editable={false}/>
          </div>
        </div>
      );
    }
    return discussions;
  }

  render() {
    const date = getTodaysDate();
    return (this.state.isLoading ? <Loading /> : this.state.redirect ? <Redirect to='/' /> : !this.state.encontrado ? <DefaultComponent /> :
      <>
        <Navegacion />
        <div className="row m-0">
          <div className="col-md-10 m-auto">
            <div className="card border-primary consejo-card">
              <div className="card-body">
                <Link to='/consejos'><i className="fas fa-times fa-lg m-2 ubicar-salida" style={{ color: 'navy' }}></i></Link>
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
                    {!this.state.isCouncilModifier && this.state.consejo.fecha >= date && this.state.consejo.limite_solicitud >= date &&
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
