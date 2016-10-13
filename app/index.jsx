import React from 'react';
import {render} from 'react-dom';
import Post from './components/Post.jsx';
import PostList from './components/PostList.jsx';
import Preview from './components/Preview.jsx';

class Application extends React.Component { // A la ES6
	constructor(props) {
		super(props);
		this.state = {
			editorOpen: false,
			savedPosts: [],
			activePost: {title: "", content: "", id: ""},
			lastId: 0
		};

		// attempted ES7 autobinding but encountered build errors
		this.updatePost = this.updatePost.bind(this);
		this.openEditor = this.openEditor.bind(this);
		this.savePost = this.savePost.bind(this);
		this.cancel = this.cancel.bind(this);
		this.discard = this.discard.bind(this);
		this.setActivePost = this.setActivePost.bind(this);
	}

	componentWillMount(){
		let savedPosts = this.props.savedPosts;	
		let id = 1;

		// IDs will allow us to index into the savedPosts array to compare changes
		// to the active post before saving. We can reset them on load as they're only used
		// for finding the post's index
		for (const post of savedPosts) {
			post.id = id++;
		}
		this.setState({savedPosts: savedPosts, lastId: savedPosts.length});
		if(savedPosts.length) {
			this.setState({activePost: savedPosts[0]});
		}
	}

    updatePost(field, value) {
    	var updated = this.state.activePost;
    	updated[field] = value;
    	this.setState({activePost: updated});
    }

    setActivePost(id) {
    	let savedPosts = this.state.savedPosts.slice();
    	let index = savedPosts.findIndex(p => p.id === id);
    	let activePost =  mkCopy(savedPosts[index]);
    	this.setState({activePost: activePost});
    }

    openEditor(isNew) {
    	if(isNew){
	    	let lastId = this.state.lastId;
	    	this.setState({activePost: {title: '', content: '', id: lastId + 1}});
	    }
    	this.setState({editorOpen: true})
    }

    savePost() {
    	let {activePost, savedPosts, lastId, editorOpen} = this.state;
    	let newSavedPosts = savedPosts.slice();
    	let original = this.getOriginalPost(activePost.id);

    	if(isDifferent(original, activePost)){  
	    	let post = mkCopy(activePost);
            
    		if(activePost.id > lastId) { // is new
				this.setState({lastId: lastId + 1});
			} else {
				let index = savedPosts.indexOf(original);
		        newSavedPosts.splice(index, 1);
			}

			newSavedPosts.unshift(post);
			this.setState({lastId: lastId + 1});

	    	// update state and localstorage
			this.setState({ savedPosts: newSavedPosts }, () => {
				localStorage.savedPosts = JSON.stringify(this.state.savedPosts);
				this.setState({editorOpen: false});
			});

		} else {
			this.cancel()
		}
    }

    cancel() {
    	this.setState({editorOpen: false, activePost: this.getOriginalPost()});
	}

	discard() {
		const {activePost, savedPosts, lastId} = this.state;
        if(activePost.id > lastId) {
			this.cancel();
		} else {
			var newSavedPosts = savedPosts.slice();
	        let post = getPostById(activePost.id, newSavedPosts);
	        let index = newSavedPosts.indexOf(post);
	        newSavedPosts.splice(index, 1);
			this.setState({ savedPosts: newSavedPosts }, () => {
				localStorage.savedPosts = JSON.stringify(this.state.savedPosts);
				this.setState({editorOpen: false});
			});
		}
	}

	getOriginalPost(id) {
		const {activePost, savedPosts, lastId} = this.state;
    	var active_id = id || activePost.id;
    	return getPostById(active_id, savedPosts) || {title: '', content: '', id: lastId + 1};	
	}

	render(){
		const {savedPosts, activePost, editorOpen} = this.state;
	    return ( // A la JSX
	    	<div className="row"> 
	    		<div className={"sidebar col-md-4 " + (editorOpen ? 'disabled' : 'enabled')}>
	    			<PostList 
	    				posts={savedPosts} 
	    				setActivePost={this.setActivePost}
	    				/>
	    		</div>
	    		<div className="post-editor col-md-8">
			    	{editorOpen ? 
			    		<Post 
				    		activePost={activePost} 
				    		updatePost={this.updatePost} 
				    		savePost={this.savePost} 
				    		newPost={this.newPost}
				    		discard={this.discard}
				    		cancel={this.cancel} /> 
			    		:
			    		<div className="post-actions">
				    		<button onClick={()=> this.openEditor(true)} >
					    		New post
				    		</button>
				    		<button onClick={()=> this.openEditor(false)} >
					    		Edit Post
				    		</button>
				    	</div>
			    	}
			    	<Preview 
			    		activePost={activePost}
			    		/>
		    	</div>
	    	</div>
	    )
	}
}

Application.propTypes = {
	postList: React.PropTypes.array
}



// Helper Functions
// =========================================

// Check if the browser supports localstorage

var hasLocalStorage = supportsLocalStorage();  

function supportsLocalStorage() {  
    var mod = 'test';
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch (e) {
        return false;
    }
}


// If so, check if there saved posts
// If not, create an empty array/container

function getDefaultPostList() { 
    if(hasLocalStorage && localStorage.savedPosts) {
    	return JSON.parse(localStorage.savedPosts)
    } else {
    	return []
    } 
}

function isDifferent(oldPost, newPost){
	if(oldPost.title !== newPost.title || oldPost.content !== newPost.content) {
		return true
	} else {
		return false
	}
}

// create object copy using the JSON library
function mkCopy(object){
	return JSON.parse(JSON.stringify(object));
}

function getPostById(id, array) {
	let index = array.findIndex(p => p.id === id);
	if (index > -1) { 
		return array[index];  
	} else {
		return null
	} 	
}


render(<Application savedPosts={getDefaultPostList()}/>, document.getElementById('app'));