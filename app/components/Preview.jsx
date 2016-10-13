import React from 'react';
import Markdown from 'react-markdown';
// var Remarkable = require('remarkable');
// var md = new Remarkable();


class Preview extends React.Component {

  render(props) {
    const activePost = this.props.activePost;
    return (
      <div className="preview">
        <h1>Preview Below</h1>
        <h1>{activePost.title}</h1>
        <Markdown
          source={activePost.content}
          escapeHtml
        />
      </div>
    );
  }
}


export default Preview;