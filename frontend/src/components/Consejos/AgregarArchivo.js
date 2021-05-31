import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import auth from "../../helpers/auth";
import $ from 'jquery';
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
    this.deleteAllFiles = this.deleteAllFiles.bind(this);
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

  handleSubmit() {
    if(this.state.archivos.length === 0){
      return;
    }
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
      this.setState({ archivos: [] });
      $("#"+this.props.modelName).modal('hide');
      this.props.updateParent();
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

  deleteAllFiles(e){
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          let punto = this.props.punto;
          axios.get(`/punto/getFiles/${this.props.consecutivo.split(' ').join('_')}/${punto.id_punto}`)
            .then(res => {
              if (res.data.success) {
                if (res.data.files.length > 0) {
                  res.data.files.forEach(file => {
                    axios.delete(`/punto/deleteFile/${file.filename}`)
                      .then(res =>{
                          if (res.data.success) {
                              console.log('file deleted');
                          }else{
                              console.log(res.data.msg);
                          }
                      });
                  });
                }
                this.props.deleteDiscussion(this.props.punto.id_punto);
              }
            })
            .catch((err) => console.log(err));
        } else {
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  render() {
    $("#"+this.props.modelName).on('shown.bs.modal', function () {
      $('#modal-input').focus();
    });
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <button className="fas fa-paperclip my-icon fa-lg mx-2 my-button" type="button" data-toggle="modal" data-target={"#"+this.props.modelName} />
        <div className="modal fade" id={this.props.modelName} role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content modal-border">
              <div className="modal-body">
                <i className="fas fa-times fa-lg m-2 ubicar-salida my-icon" data-dismiss="modal"></i>
                <h4 className="modal-title text-center mb-4">{this.state.punto.asunto}</h4>
                <div>
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
                      <button type="button" className="btn btn-primary my-size mt-4" onClick={() => this.handleSubmit()}>Subir archivo(s)</button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.props.editable && <button className="fas fa-trash-alt my-icon fa-lg mx-4 my-button" type="button" onClick={this.deleteAllFiles} />}
      </>
    )}
}