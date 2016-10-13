import React from 'react';


class PostList extends React.Component {
  constructor(props) {
    super(props);    
    this.setActivePost = this.setActivePost.bind(this);
  }

  setActivePost(index) {
    this.props.setActivePost(index);
  }

  render(){
    const setActivePost = this.setActivePost;
    const posts = this.props.posts;

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
              <li onClick={setActivePost.bind(this, post.id)} key={i}>{post.title}</li>
            );
          })}
        </ul>
      </div>
    );
  }
}


export default PostList;
