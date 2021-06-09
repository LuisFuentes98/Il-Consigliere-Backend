import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Acceso from './components/Acceso/Acceso';
import Inicio from './components/Inicio/Inicio';
import Consejos from './components/Consejos/Consejos';
import Consejo from './components/Consejos/Consejo';
import RegistroConsejos from './components/Consejos/RegistroConsejos';
import Convocar from './components/Consejos/Convocar';
import VisualizarConsejos from './components/Consejos/VisualizarConsejos';
import VisualizarConsejosUsuario from './components/Consejos/VisualizarConsejosUsuario';
import EditarConsejo from './components/Consejos/EditarConsejo';
import ConsejoVotacion from './components/Consejos/ConsejoVotacion';
import ListaUsuarios from './components/Usuarios/ListaUsuarios';
import Registro from './components/Usuarios/Registro';
import NuevaClave from './components/Usuarios/NuevaClave';
import Usuario from './components/Usuarios/Usuario';
import Cuenta from './components/Cuenta/Cuenta';
import ConsejosPrincipal from './components/Consejos/ConsejosPrincipal';
import ConsejoAnonimo from './components/Consejos/ConsejoAnonimo';
import ProtectedRoute from './helpers/ProtectedRoute';
import DefaultComponent from './helpers/DefaultComponent';
import { Role } from './helpers/Role';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/gUsuarios/registro/:token' component={Registro} />
        <Route path='/gUsuarios/cambioClave/:token' component={NuevaClave} />
        <ProtectedRoute path='/gConsejos/registro' role={Role.CouncilModifier} component={RegistroConsejos} />
        <ProtectedRoute path='/gConsejos/participantes/:consecutivo' role={Role.CouncilModifier} component={Convocar} />
        <ProtectedRoute path='/gConsejos/editar/:consecutivo' role={Role.CouncilModifier} component={EditarConsejo} />
        <ProtectedRoute path='/gConsejos/:consecutivo' role={Role.CouncilModifier} component={ConsejoVotacion} />
        <ProtectedRoute path='/gConsejos' role={Role.CouncilModifier} component={VisualizarConsejos} />
        <ProtectedRoute path='/gUsuarios/:cedula' exact role={Role.UserModifier} component={Usuario} />
        <ProtectedRoute path='/gUsuarios' exact role={Role.UserModifier} component={ListaUsuarios} />
        <ProtectedRoute path='/consejos/:consecutivo' component={Consejo} />
        <ProtectedRoute path='/consejos' component={Consejos} />
        <ProtectedRoute path='/proximosconsejos/:consecutivo' component={Consejo} />
        <ProtectedRoute path='/proximosconsejos' component={VisualizarConsejosUsuario} />
        <ProtectedRoute path='/cuenta' component={Cuenta} />
        <Route path='/acceso' component={Acceso} />
        <Route exact path='/iConsejos' component={ConsejosPrincipal} />
        <Route path='/iConsejos/:consecutivo' component={ConsejoAnonimo} />
        <Route exact path='/' component={Inicio} />
        <Route path='*' component={DefaultComponent} />
      </Switch>
    </Router>
  );
}

export default App;
