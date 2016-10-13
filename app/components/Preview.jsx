import React from 'react';
import Markdown from 'react-markdown';
// var Remarkable = require('remarkable');
// var md = new Remarkable();


class Preview extends React.Component {
  
  render(props) {
    const activePost = this.props.activePost;
    return (
      <div className="post-preview">
        <h1 className="post-title">{activePost.title}</h1>
        <Markdown
          className="post-content"
          source={activePost.content}
          escapeHtml
        />
      </div>
    );
  }
}


export default Preview;