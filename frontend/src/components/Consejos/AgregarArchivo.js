import React, { Component } from "react";
import axios from "axios";
import auth from "../../helpers/auth";
import { Redirect } from "react-router-dom";
//file Upload
import { FilePond, /*registerPlugin*/ } from "react-filepond"
import "filepond/dist/filepond.min.css"
//import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
//import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
const FormData = require('form-data');

export default class AgregarArchivo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consecutivo: this.props.consecutivo,
      punto: this.props.punto,
      archivos: [],
      redirect: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
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
    let value = e.target.value;
    let name = e.target.name;
    this.setState({
        [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    var folder = '';
    const formData = new FormData();
    for(let archivo in this.state.archivos[0]){
      formData.append('archivos', this.state.archivos[0][archivo]);
    }
    folder = this.state.consecutivo + '/' + this.state.punto.id_punto;
    formData.append('folder', folder);
    formData.forEach((value, key) => {
      console.log("key %s: value %s", key, value);
    })
    axios.post(`/punto/upload`, formData, {}).then(res =>{
      console.log(res.data);
    });
  }

  onFileChange(files){
      let items = files.map(fileItem => fileItem.file)
      this.setState(prevState =>{
        let archivos = [...prevState.archivos, items];
        return {
          archivos,
        }
      });
      console.log(this.state.archivos);
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
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <button className="btn btn-primary" type="submit">
                            Upload
                        </button>
                    </div>
                    <div className="filepond-wrapper">
                        <FilePond
                            files = {this.state.archivos}
                            allowMultiple = {true}
                            server = {null}
                            instantUpload = {false}
                            onupdatefiles = {(fileItems) => this.onFileChange(fileItems)}
                        >
                        </FilePond>
                    </div>
                </form>
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