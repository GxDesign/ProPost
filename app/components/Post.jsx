import React from 'react';
import Preview from './Preview.jsx';

class Post extends React.Component {
  constructor(props) {
    super(props); 
    this.updatePost = this.updatePost.bind(this);
  }

  updatePost(event) {
    let field = event.target.id;
    let value = event.target.value.substr(0, 300);
    this.props.updatePost(field, value);
  }

  render() {
    const {savePost, activePost, cancel, discard} = this.props;
    return (
      <div className="post">
        <input
          id="title"
          type="text"
          className="form-control"
          value={activePost.title}
          onChange={this.updatePost} />
        <textarea
          id="content"
          className="form-control"
          value={activePost.content}
          onChange={this.updatePost}>
        </textarea>
        <div>id: {activePost.id}</div>
        <button 
          className="btn-primary" 
          onClick={savePost} >
          Save
          </button>
        <button 
          className="btn-danger" 
          onClick={cancel.bind(activePost.id)} >
          Cancel 
          </button>
        <button 
          className="btn-danger" 
          onClick={discard.bind(activePost.id)} >
          Discard 
          </button>
        
      </div>
    );
  }

}



export default Post;