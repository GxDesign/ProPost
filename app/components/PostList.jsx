import React from 'react';
import TimeAgo from 'react-timeago'


class PostList extends React.Component {
  constructor(props) {
    super(props);    
    this.setActivePost = this.setActivePost.bind(this);
  }

  setActivePost(post) {
    this.props.setActivePost(post.id);
  }

  render(){
    const setActivePost = this.setActivePost;
    const {posts, activePost, removePost} = this.props;

    if (posts.length === 0) {
      return (
        <div className="post-list empty">
          There are no saved posts
        </div>
      );
    }
    return (
      <div className="post-list">
        <ul>
          {posts.map(function(post, i) {
            return (
              <li 
                className={"postlist-item " + (post.id == activePost.id ? 'active' : '')}
                onClick={setActivePost.bind(this, post)} key={i}>
                <span className="postlist-item-title">{post.title}</span>
                <button onClick={removePost.bind(this, post.id)}>
                  <i className="fa fa-close" aria-hidden="true"></i>
                </button>
                <TimeAgo className="time-ago" date={post.updated_at} minPeriod="60"/>
                </li>
            );
          })}
        </ul>
      </div>
    );
  }
}


export default PostList;
