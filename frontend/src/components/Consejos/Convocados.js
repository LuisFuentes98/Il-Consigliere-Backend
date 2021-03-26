import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import auth from '../../helpers/auth';

export default class Convocados extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.consecutivo,
      docentes: [],
      administrativo: [],
      estudiantes: [],
      redirect: false
    }
  }

  componentDidMount() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get(`/convocado/nombres_usuario/${this.state.consecutivo}`)
            .then(resp => {
              if (resp.data.success) {
                const docentes = [];
                const estudiantes = [];
                const administrativo = [];
                for (let i = 0; i < resp.data.convocados.length; i++) {
                  let convocado = resp.data.convocados[i];
                  if (convocado.id_tipo_convocado === 1) {
                    docentes.push(convocado);
                  } else if (convocado.id_tipo_convocado === 2) {
                    administrativo.push(convocado);
                  } else if (convocado.id_tipo_convocado === 3) {
                    estudiantes.push(convocado);
                  }
                }
                this.setState({
                  docentes: docentes,
                  administrativo: administrativo,
                  estudiantes: estudiantes
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

  getTeachers() {
    const attendants = [];
    for (let i = 0; i < this.state.docentes.length; i++) {
      attendants.push(<li className='m-0' key={i}>{this.state.docentes[i].nombre} {this.state.docentes[i].apellido} {this.state.docentes[i].segundo_apellido}</li>);
    }
    return attendants;
  }

  getAdmin() {
    const attendants = [];
    for (let i = 0; i < this.state.administrativo.length; i++) {
      attendants.push(<li className='m-0' key={i}>{this.state.administrativo[i].nombre} {this.state.administrativo[i].apellido} {this.state.administrativo[i].segundo_apellido}</li>);
    }
    return attendants;
  }

  getStudents() {
    const attendants = [];
    for (let i = 0; i < this.state.estudiantes.length; i++) {
      attendants.push(<li className='m-0' key={i}>{this.state.estudiantes[i].nombre} {this.state.estudiantes[i].apellido} {this.state.estudiantes[i].segundo_apellido}</li>);
    }
    return attendants;
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <p>Personas convocadas al Consejo de Unidad:</p>
        <div className='convocados'>
          {this.state.docentes.length > 0 &&
            <>
              <p className='m-0'>Personal Docente:</p>
              <ol className='pl-4 m-1'>
                {this.getTeachers()}
              </ol>
            </>
          }
          {this.state.administrativo.length > 0 &&
            <>
              <p className='m-0'>Personal administrativo:</p>
              <ol className='pl-4 m-1'>
                {this.getAdmin()}
              </ol>
            </>
          }
          {this.state.estudiantes.length > 0 &&
            <>
              <p className='m-0'>Estudiantes:</p>
              <ol className='pl-4 m-1'>
                {this.getStudents()}
              </ol>
            </>
          }
        </div>
      </>
    );
  }
}
