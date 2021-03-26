import React, { Component } from 'react';
import auth from './auth';
import roles from './roles';
import logo from '../assets/tec.png';
import Navegacion from '../components/Navegacion/Navegacion';
import { Loading } from './Loading';

export default class DefaultComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }
  componentDidMount() {
    auth.verifyToken()
      .then(() => {
        roles.checkRoles()
          .then(() => {
            this.setState({
              isLoading: false
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    } else {
      return (
        <>
          <Navegacion />
          <div className="row m-0" style={{ height: '70vh' }}>
            <div className="col-sm-12 my-auto">
              <h3 className='text-center'>Página no encontrada</h3>
              <h1 className='text-center mb-4'>404</h1>
              <img src={logo} className='rounded-circle img-fluid m-auto d-block' style={{ opacity: 0.6 }} alt='logo' />
            </div>
          </div>
        </>
      );
    }
  }
}
