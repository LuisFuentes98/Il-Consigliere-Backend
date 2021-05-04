import React, { Component } from "react";
import axios from "axios";
import auth from "../../helpers/auth";
import $ from 'jquery';
import { myAlert } from '../../helpers/alert';
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
      $("#"+this.props.modelName).modal('hide');
      window.location.reload()
    });
  }

  onFileChange(files){
      let items = files.map(fileItem => fileItem.file)
      this.setState(prevState =>{
        let archivos = [...prevState.archivos, items];
        return {
          archivos
        }
      });
      console.log(this.state.archivos);
  }

  render() {
    $("#"+this.props.modelName).on('shown.bs.modal', function () {
      $('#modal-input').focus();
    });
    return <>
        <button className="fas fa-paperclip my-icon fa-lg my-button" type="button" data-toggle="modal" data-target={"#"+this.props.modelName} />
        <div className="modal fade" id={this.props.modelName} role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content modal-border">
              <div className="modal-body">
                <i className="fas fa-times fa-lg m-2 ubicar-salida my-icon" data-dismiss="modal"></i>
                <h4 className="modal-title text-center mb-4">{this.state.punto.asunto}</h4>
                <form onSubmit={this.handleSubmit}>
                    <div className="filepond-wrapper">
                        <FilePond
                            files = {this.state.archivos}
                            allowMultiple = {true}
                            server = {null}
                            instantUpload = {false}
                            onupdatefiles = {(fileItems) => this.onFileChange(fileItems)}
                            labelIdle='Arrastra y suelta tus archivos o <span class="filepond--label-action">Buscalos</span>'
                        >
                        </FilePond>
                    </div>
                    <div className='d-flex justify-content-center'>
                      <button type="submit" className="btn btn-primary my-size mt-4">Subir archivo(s)</button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
  }
}