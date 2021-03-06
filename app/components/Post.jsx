import React from 'react';
import Preview from './Preview.jsx';

class Post extends React.Component {
  constructor(props) {
    super(props); 
    this.updatePost = this.updatePost.bind(this);
  }

  updatePost(event) {
    let field = event.target.id;
    let value = event.target.value.substr(0, 700); // 300 was too small to fit my quote
    this.props.updatePost(field, value);
  }

  render() {
    const {savePost, activePost, cancel, removePost, lastId} = this.props;
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
              onClick={cancel} >
              Cancel 
              </button>
            <button 
              className={"btn-danger " + (activePost.id > lastId || activePost.id === 0? 'disabled': '')}
              onClick={()=> removePost(activePost.id)} >
              Discard 
              </button>
            </div>
          
      </div>
    );
  }

}



export default Post;