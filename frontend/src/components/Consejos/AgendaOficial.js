import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import SolicitudAgenda from './SolicitudAgenda';
import ArchivosDePunto from './ArchivosDePunto';
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
      tipoPunto: [],
      puntoSeleccionado: 1,
      ordenar: false,
      orden: 0,
      comentario: '',
      redirect: false
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
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
          let puntos = [];
          for(let i=0; i<resp.data.discussions.length; i++){
            let punto = resp.data.discussions[i];
            punto.editable = false;
            puntos.push(punto);
          }
          this.setState({
            puntos: puntos,
            orden: resp.data.discussions.length
          });
        } else {
          this.setState({
            puntos: []
          });
        }
      }).catch((err) => console.log(err));
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
            axios.post('/punto', { asunto: this.state.punto, comentario: this.state.comentario, consecutivo: this.state.consecutivo, id_estado_punto: 1, cedula: auth.getInfo().cedula, orden: this.state.orden, id_tipo_punto: this.state.puntoSeleccionado })
              .then(res => {
                if (res.data.success) {
                  this.getDiscussionsFromBD();
                  this.setState({
                    punto: '',
                    comentario: '',
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

  deleteDiscussion(id_punto) {
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
    this.setState({ puntos: [] });
    this.getDiscussionsFromBD();
    myAlert("Listo", "Se han actualizado los puntos de agenda.", "success");
  }

  handleCheckChange(e) {
    let puntos = this.state.puntos;
    let index = parseInt(e.target.name);
    let punto = puntos[index];
    punto.id_tipo_punto = parseInt(e.target.value);
    this.setState({puntos: puntos});
  }

  getDiscussionTypeForChange(index) {
    const info = [];
    let punto = this.state.puntos[index];
    for (let i = 0; i < this.state.tipoPunto.length; i++) {
      let tipo_punto = this.state.tipoPunto[i];
      info.push(
        <div className="custom-control custom-radio mx-auto" key={i}>
          <input type="radio" id={"radio"+punto.id_punto+i} name={index} value={tipo_punto.id_tipo_punto} onChange={this.handleCheckChange}
            checked={punto.id_tipo_punto === tipo_punto.id_tipo_punto} className="custom-control-input" />
          <label className="custom-control-label" htmlFor={"radio"+punto.id_punto+i}>
            {tipo_punto.descripcion}
          </label>
        </div>
      );
    }
    return info;
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
              <div className="form-group d-flex align-items-center">
                {this.getDiscussionTypeForChange(i)}
              </div>
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
                    <button className="fas fa-edit my-disabled fa-lg mx-4 my-button" type="button" onClick={(e) => this.disableEditable(e, i)} />
                    <button className="fas fa-check-circle my-icon fa-lg mx-4 my-button" type="button" onClick={(e) => this.acceptDiscussionChanges(e, i)} />
                  </div>
                  :
                  <div>
                    <button className="fas fa-edit my-icon fa-lg mx-4 my-button" type="button" onClick={(e) => this.makeEditable(e, i)} />
                    <AgregarArchivo consecutivo={this.state.consecutivo} punto={this.state.puntos[i]} editable={true} deleteDiscussion={this.deleteDiscussion} modelName={"subir_archivo"+i} updateParent={this.handleUpdate}/>
                  </div>
                }
              </div>
            }
          </div>
          {(!this.state.puntos[i].editable && !this.state.ordenar) ?
            <ArchivosDePunto consecutivo={this.state.consecutivo} punto={this.state.puntos[i]} editable={true}/>
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
          axios.post(`/punto/modificar/${this.state.puntos[i].id_punto}`, {asunto: this.state.puntos[i].asunto, comentario: this.state.puntos[i].comentario, id_tipo_punto: this.state.puntos[i].id_tipo_punto})
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
            <input placeholder='Punto de agenda (opcional)' name='punto' className="form-control mr-2" onChange={this.handleInputChange} value={this.state.punto} />
            <button className="fas fa-plus-square my-icon fa-lg my-button" type="button" onClick={this.addDiscussion} ref={this.button} />
          </div>
          <textarea placeholder='Comentario (opcional)' name='comentario' className="form-control mr-2" onChange={this.handleInputChange} value={this.state.comentario} />
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
