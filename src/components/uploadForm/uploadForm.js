import React, { Component } from 'react';
import axios from 'axios';
import { AES } from 'crypto-js';
import './uploadForm.css';
import { API_URL, encryptionKey } from '../../config';

class UploadForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      file: null,
      success: false
    };
  }

  fileInputChange = e => {
    const file = e.target.files[0];
    if (file.type.slice(0, 5) !== 'image') {
      this.setState({
        error: 'Please upload an image file',
        file: null,
        success: false
      });
    } else if (!file) {
      this.setState({
        error: 'Please upload a file',
        file: null,
        success: false
      });
    } else {
      this.setState({ file, error: null, success: false });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.file) {
      this.setState({ error: 'Please upload a file', file: null });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const buffer = JSON.stringify(new Uint8Array(reader.result));
      const data = {
        imagebuff: AES.encrypt(buffer, encryptionKey).toString(),
        fileName: this.state.file.name
      };
      const res = await axios({
        url: `${API_URL}upload`,
        method: 'POST',
        data
      });
      if (res.data.success) {
        this.setState({ success: true });
      } else {
        this.state.error = res.data.error;
      }
    };
    reader.readAsArrayBuffer(this.state.file);
  };

  render() {
    return (
      <div className="ui container segment upload-form-container">
        <div className="ui huge header centered">Upload image</div>
        <form className="ui form ">
          <div className="field">
            <input type="file" name="image" onChange={this.fileInputChange} />
          </div>
          <p className="red centered">{this.state.error}</p>
          {this.state.success ? (
            <p className="green centered">Your file was uploaded !</p>
          ) : (
            ''
          )}
          {this.state.error ? (
            ''
          ) : (
            <button
              className="ui button"
              onClick={this.handleSubmit}
              type="submit"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    );
  }
}

export default UploadForm;
