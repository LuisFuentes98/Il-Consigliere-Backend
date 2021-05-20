import React, { Component } from 'react';
import axios from 'axios';

class ArchivosDePunto extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            archivos: [],
            archivosVisibles: false

        }
    }

    componentDidMount() {
        this.getDiscussionFiles();
    }

    getDiscussionFiles(){
        let punto = this.props.punto;
        const files = [];
        axios.get(`/punto/getFiles/${this.props.consecutivo.split(' ').join('_')}/${punto.id_punto}`)
          .then(res => {
            if (res.data.success) {
              if (res.data.files.length > 0) {
                for (let i = 0; i < res.data.files.length; i++) {
                  files.push(res.data.files[i])
                };
              }
              this.setState({ archivos: files });
            }
          })
          .catch((err) => console.log(err));
        return true;
    }

    downloadFile(filename) {
        console.log("opening: ", filename);
        const newWindow = window.open("https://storage.googleapis.com/il-consigliere-files/"+filename, '_blank', 'noopener,noreferrer')
        if(newWindow) newWindow.opener = null
    }

    deleteFile(file) {
        axios.delete(`/punto/deleteFile/${file.filename}`)
        .then(res =>{
            if (res.data.success) {
                console.log('file deleted')
                let files = this.state.archivos;
                let newFiles = [];
                for(let i=0; i<files.length; i++){
                    if(files[i]!==file){
                        newFiles.push(files[i]);
                    }
                }
                this.setState({ archivos: newFiles });
            }else{
                console.log(res.data.msg);
            }
        });
    }

    displayFiles(){
        const fileData = [];
        if(this.state.archivos.length > 0){
            for(let i = 0; i < this.state.archivos.length; i++){
            fileData.push(
                <div key={this.state.archivos[i].filename} className='d-flex justify-content-around align-items-center my-2'>
                <div>
                    <p className='text-justify m-0 my-muted'>{this.state.archivos[i].filename}</p>
                </div>
                <div>
                    <button className="fas fa-arrow-alt-circle-down my-icon fa-lg mx-0 my-button" type="button"  onClick={() => this.downloadFile(this.state.archivos[i].filename)} />
                    {this.props.editable && <button className="fas fa-trash-alt my-icon fa-lg mx-4 my-button" type="button" onClick={() => this.deleteFile(this.state.archivos[i])}/>}
                    
                </div>
                </div>
            );
            }
        }else{
            fileData.push(
            <div key='noFiles' className='d-flex justify-content-around align-items-center my-2'>
                <div>
                <p className='text-justify m-0 my-muted'>No hay archivos adjuntos.</p>
                </div>
            </div>
            );
        }
        return fileData;
    }

    handleFileVisibility(e){
        let archivosVisibles = !this.state.archivosVisibles;
        this.setState({
          archivosVisibles: archivosVisibles
        });
      }

    
    render() { 
        return (  
            <>
                <div>
                    <div className='d-flex align-items-center my-2'>
                        {!this.state.archivosVisibles && <button className="fas fas fa-chevron-right fa-lg mx-1 my-button" type="button" onClick={(e) => this.handleFileVisibility(e)}/>}
                        {this.state.archivosVisibles && <button className="fas fas fa-chevron-down fa-lg mx-1 my-button" type="button" onClick={(e) => this.handleFileVisibility(e)}/>}
                        {!this.state.archivosVisibles && <p className='text-justify m-0 my-muted'>Mostrar archivos</p>}
                        {this.state.archivosVisibles && <p className='text-justify m-0 my-muted'>Ocultar archivos</p>}
                    </div>
                    {this.state.archivosVisibles && this.displayFiles()}
                </div>
            </>
        );
    }
}
 
export default ArchivosDePunto;