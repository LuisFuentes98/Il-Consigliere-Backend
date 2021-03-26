import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import roles from '../../helpers/roles';
import auth from '../../helpers/auth';
import navBrand from '../../assets/navBrand.png';
import './Navegacion.css';

export default class Navegacion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autenticado: false,
      gestUsuario: false,
      gestConsejo: false
    }
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    const userRoles = roles.getRoles();
    const cedula = auth.getInfo().cedula;
    if (cedula !== '') {
      this.setState({
        autenticado: true
      });
      for (let i = 0; i < userRoles.length; i++) {
        let role = userRoles[i];
        if (role.id_permiso === 1) {
          this.setState({
            gestUsuario: true
          });
        }
        if (role.id_permiso === 2) {
          this.setState({
            gestConsejo: true
          });
        }
      }
    }
  }

  logOut() {
    auth.logOut();
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light mb-4 p-0 navcolor sticky-top">
        <div className="container p-0">
          <Link className="navbar-brand" to={this.state.autenticado ? '/consejos' : '/'}><img className='logo' src={navBrand} alt="logo del TEC" /></Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarColor01">
            {this.state.autenticado ?
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <NavLink className="nav-link text" activeClassName="active" to="/consejos">Mis Consejos</NavLink>
                </li>
                {this.state.gestUsuario &&
                  <li className="nav-item">
                    <NavLink className="nav-link text" activeClassName="active" to="/gUsuarios">Gestión de Usuarios</NavLink>
                  </li>
                }
                {this.state.gestConsejo &&
                  <li className="nav-item dropdown">
                    <NavLink className="nav-link dropdown-toggle text" data-toggle="dropdown" to="/gConsejos"
                      role="button" aria-haspopup="true" aria-expanded="false">Gestión de Consejos</NavLink>
                    <div className="dropdown-menu">
                      <NavLink className="dropdown-item" activeClassName="active" exact to="/gConsejos">Todos los Consejos</NavLink>
                      <NavLink className="dropdown-item" activeClassName="active" exact to="/gConsejos/registro">Nuevo Consejo</NavLink>
                    </div>
                  </li>
                }
                <li className="nav-item">
                  <NavLink className="nav-link text" activeClassName="active" exact to="/proximosconsejos" onClick={this.verifyToken}>Próximos Consejos</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text" activeClassName="active" exact to="/cuenta" onClick={this.verifyToken}>Mi Cuenta</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text" activeClassName="active" exact to="/" onClick={this.logOut}>Salir</NavLink>
                </li>
              </ul>
              :
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <NavLink className="nav-link text" activeClassName="active" exact to="/">Inicio</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text" activeClassName="active" to="/acceso">Acceso</NavLink>
                </li>
              </ul>
            }
          </div>
        </div>
      </nav>
    );
  }
}
