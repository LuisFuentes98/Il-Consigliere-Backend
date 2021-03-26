import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import SolicitudAgenda from './SolicitudAgenda';
import auth from "../../helpers/auth";

export default class AgendaOficial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.consecutivo,
      punto: '',
      puntos: [],
      tipoPunto: [],
      puntoSeleccionado: 1,
      ordenar: false,
      orden: 0,
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

  getDiscussionsFromBD() {
    axios.get(`/punto/aprobado/${this.state.consecutivo}`)
      .then(resp => {
        if (resp.data.success) {
          this.setState({
            puntos: resp.data.discussions,
            orden: resp.data.discussions.length
          });
        } else {
          this.setState({
            puntos: []
          });
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
                  this.setState({
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
    [puntos[i - 1], puntos[i]] = [puntos[i], puntos[i - 1]];
    this.setState({
      puntos: puntos
    });
  }

  down(e, i) {
    e.preventDefault();
    let puntos = this.state.puntos;
    [puntos[i + 1], puntos[i]] = [puntos[i], puntos[i + 1]];
    this.setState({
      puntos: puntos
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
        <div className='d-flex justify-content-between align-items-center my-2' key={i}>
          <div>
            <li className='text-justify m-0'>{punto.asunto}</li>
            {punto.id_tipo_punto === 1 && <p className='text-justify m-0 my-muted'>*Este punto es votativo</p>}
          </div>
          {this.state.ordenar ?
            <div className='d-flex'>
              {i !== 0 && <button className="far fa-caret-square-up my-icon fa-lg mx-1 my-button" type="button" onClick={(e) => this.up(e, i)} />}
              {i !== (this.state.puntos.length - 1) && <button className="far fa-caret-square-down my-icon fa-lg mx-1 my-button" type="button" onClick={(e) => this.down(e, i)} />}
            </div>
            :
            <button className="fas fa-trash-alt my-icon fa-lg mx-1 my-button" type="button" onClick={(e) => this.deleteDiscussion(e, punto.id_punto)} />
          }
        </div>
      );
    }
    return discussions;
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
