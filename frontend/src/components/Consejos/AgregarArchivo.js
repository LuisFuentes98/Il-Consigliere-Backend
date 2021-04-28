import React, { Component } from "react";
//import axios from "axios";
import auth from "../../helpers/auth";
import { Redirect } from "react-router-dom";

export default class AgregarArchivo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.consecutivo,
      punto: this.props.punto,
      redirect: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          //Algo pasa
        } else {
          this.setState({
            redirect: true
          })
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  handleInputChange(e) {
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        {this.props.ordenar ?
          <button className="fas fa-paperclip my-disabled disabled fa-lg my-button" type="button" />
          :
          <button className="fas fa-paperclip my-icon fa-lg my-button" type="button" data-toggle="modal" data-target="#subir_archivo" />
        }
        <div className="modal fade" id="subir_archivo" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content modal-border">
              <div className="modal-body">
                <i className="fas fa-times fa-lg m-2 ubicar-salida my-icon" data-dismiss="modal"></i>
                <h4 className="modal-title text-center mb-4">Subir archivos</h4>
                {<p className='my-muted'>Aqui se subirian archivos.</p>}
                <div className='d-flex justify-content-center'>
                  <button type="button" className="btn btn-outline-primary my-size mt-4" data-dismiss="modal">Listo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}