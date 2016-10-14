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
    const {savePost, activePost, cancel, removePost} = this.props;
    return (
        <div className="post-editor">
          <input
            id="title"
            type="text"
            className="form-control"
            placeholder="New Post"
            value={activePost.title}
            onChange={this.updatePost} />
          <textarea
            id="content"
            className="form-control"
            placeholder="Add your Markdown here..."
            value={activePost.content}
            onChange={this.updatePost}>
          </textarea>
          {/* <div>id: {activePost.id}</div> */}
          <div className="post-editor-actions">
            <button 
              className="btn-success" 
              onClick={()=> savePost(false)} >
              Save
              </button>
            <button 
              onClick={cancel.bind(this, activePost.id)} >
              Cancel 
              </button>
            <button 
              className="btn-danger" 
              onClick={removePost.bind(this, activePost.id)} >
              Discard 
              </button>
            </div>
          
      </div>
    );
  }

}



export default Post;