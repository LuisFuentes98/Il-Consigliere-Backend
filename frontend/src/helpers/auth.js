import axios from 'axios';
import roles from './roles';

class Auth {
  constructor() {
    this.info = {
      cedula: '',
      nombre: '',
      apellido: '',
      segundo_apellido: '',
      enSistema: false
    };
  }

  setInfo(info) {
    this.info = {
      cedula: info.cedula,
      nombre: info.nombre,
      apellido: info.apellido,
      segundo_apellido: info.segundo_apellido,
      enSistema: true
    };
  }

  getInfo() {
    return this.info;
  }

  cleanInfo() {
    this.info = {
      cedula: '',
      nombre: '',
      apellido: '',
      enSistema: false
    };
  }

  isAuthenticated() {
    return this.info.enSistema;
  }

  logOut() {
    localStorage.removeItem('il-consigliere');
    this.cleanInfo();
    roles.cleanRoles();
  }

  async verifyToken() {
    let store = JSON.parse(localStorage.getItem('il-consigliere'));
    if (store) {
      let token = 'Bearer ' + store.token;
      let header = {
        headers: {
          authorization: token
        }
      }
      const res = await axios.post('/usuario/verificar_token', null, header);
      if (res.data.success) {
        const user = res.data.token.user;
        this.setInfo(user);
        return true;
      } else {
        this.cleanInfo();
        return false
      }
    } else {
      this.cleanInfo();
      return false;
    }
  }
}
export default new Auth();
