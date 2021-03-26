import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Navegacion from '../Navegacion/Navegacion';
import auth from '../../helpers/auth';
import roles from '../../helpers/roles';
import './Inicio.css';
import sanjose from '../../assets/sanjose.jpg';

export default class Inicio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  componentDidMount() {
    auth.verifyToken()
      .then(res => {
        if (res) {
          roles.checkRoles()
            .then(() => {
              this.setState({
                redirect: true
              });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (this.state.redirect ? <Redirect to='/consejos' /> :
      <>
        <Navegacion />
        <div className="row m-0 my-row">
          <div className="col-sm-12 my-auto">
            <div className="container bounce">
              <h3 className="title text-center">Consejo de Ingeniería en Computación<br /> del Campus Tecnológico Local de San José</h3>
              <div className="special-div">
                <img src={sanjose} className="rounded img-fluid handler" alt="Escuela de Computación San José" />
                <p className="description">La Escuela de Ingeniería en Computación ha creado un sólido prestigio como centro de excelencia en la enseñanza y en la investigación aplicada. Ofrece opciones académicas en la Sede Central en Cartago ,  y en las Sedes de San Carlos, Alajuela, Limón y San José.<br />
                        Su misión es: Contribuir a la sociedad costarricense en la generación de conocimiento científico-tecnológico en computación a través de la docencia, investigación, extensión y vinculación externa, basados en principios de excelencia académica, pertinencia social, regionalización, equidad y formación integral.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
