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
			sidebarOpen: true,
			savedPosts: [],
			activePost: {title: "", content: "", id: 1},
			lastId: 1
		};

		// attempted ES7 autobinding but encountered build errors
		this.updatePost = this.updatePost.bind(this);
		this.updatePostList = this.updatePostList.bind(this);
		this.duplicatePost = this.duplicatePost.bind(this);
		this.openEditor = this.openEditor.bind(this);
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.savePost = this.savePost.bind(this);
		this.cancel = this.cancel.bind(this);
		this.removePost = this.removePost.bind(this);
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

    updatePost(field, value) {
    	var updated = this.state.activePost;
    	updated[field] = value;
    	this.setState({activePost: updated});
    }


    toggleSidebar() {
    	this.setState({sidebarOpen: !this.state.sidebarOpen})
    }


    duplicatePost() {
    	let {activePost, lastId} = this.state;
    	let newPost = mkCopy(activePost);
    	newPost.id = lastId + 1;
    	newPost.title = '(copy) ' + newPost.title.replace('(copy) ', '');
    	this.setState({activePost: newPost, editorOpen: true}, () => {
	    	this.savePost(true);
	    });
    }


	removePost(id) {
		const {activePost, savedPosts, lastId} = this.state;
        if(id > lastId) {
			this.cancel();
		} else {
			// copy list, find post and remove it, update list
			let newSavedPosts = mkCopy(savedPosts);
	        let index = newSavedPosts.findIndex(p => p.id === id);
	        newSavedPosts.splice(index, 1);
			this.updatePostList(newSavedPosts);
			this.setState({editorOpen: false})
			return newSavedPosts;
		}
	}

    savePost(open_editor) {
    	let {activePost, savedPosts, lastId} = this.state;
    	let newSavedPosts = mkCopy(savedPosts); // instead of slice() for consistency
    	let original = savedPosts.findIndex(p => p.id === activePost.id);

    	if(isDifferent(original, activePost)){  
	    	let post = mkCopy(activePost);
	    	post.updated_at = new Date();

    		if(activePost.id > lastId) { // is new
				this.setState({lastId: lastId + 1});
			} else {
				newSavedPosts = this.removePost(activePost.id);
			}

			newSavedPosts.unshift(post);
            this.updatePostList(newSavedPosts);
            if (!open_editor) this.setState({editorOpen: false});
            
		} else {
			this.cancel();
		}
    }

    cancel() {
    	let {activePost, savedPosts, lastId} = this.state;
    	let index = savedPosts.findIndex(p => p.id === activePost.id);

    	if(activePost.id > lastId) {
    		this.setState({editorOpen: false, activePost: savedPosts[0]})
    	} else {
    		// return to original
    		this.setState({editorOpen: false, activePost: mkCopy(savedPosts[index])})
    	}
	}

	updatePostList(newSavedPosts, close_editor) {
		// update state and localstorage
		this.setState({ savedPosts: newSavedPosts }, () => {
			localStorage.savedPosts = JSON.stringify(this.state.savedPosts);
			if (close_editor) this.setState({editorOpen: false});
			this.setActivePost(newSavedPosts[0].id)
		});
	}



	render(){
		const {savedPosts, activePost, editorOpen, sidebarOpen, lastId} = this.state;
	    return ( // A la JSX
	    	<div className={"main " + (sidebarOpen ? 'sidebar-open' : 'sidebar-closed')}> 
	    		<div className={"sidebar " + (editorOpen ? 'disabled' : 'enabled')}>
	    			<PostList 
	    				posts={savedPosts} 
	    				activePost={activePost} 
	    				setActivePost={this.setActivePost}
	    				removePost={this.removePost}
	    				/>
	    		</div>
	    		<div className="post">
    				{editorOpen ? 
			    		<Post 
				    		activePost={activePost} 
				    		updatePost={this.updatePost} 
				    		savePost={this.savePost} 
				    		newPost={this.newPost}
				    		lastId={lastId}
				    		removePost={this.removePost}
				    		cancel={this.cancel} /> 
			    		:
			    		<div className="post-actions">
			    		    <button onClick={this.toggleSidebar} className={(sidebarOpen ? 'active' : '')}>
					    		<i className="fa fa-bars" aria-hidden="true"></i>
				    		</button>
				    		<button onClick={()=> this.openEditor(true)} >
					    		<i className="fa fa-file-text" aria-hidden="true"></i>
				    		</button>
				    		<button onClick={()=> this.openEditor(false)} >
					    		<i className="fa fa-pencil" aria-hidden="true"></i>
				    		</button>
				    		<button onClick={this.duplicatePost}>
					    		<i className="fa fa-clone" aria-hidden="true"></i>
				    		</button>
				    	</div>
			    	}
	    		    <div className="post-inner">
				    	<Preview 
				    		activePost={activePost}
				    		/>
				    </div>
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
		return {title: '', content: '', id: id}
	} 	
}


render(<Application savedPosts={getDefaultPostList()}/>, document.getElementById('app'));