import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Tasks } from '../api/tasks.js';
import Task from './Task.js';
 
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: true,
    };
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Tasks.insert({
      text,
      createdAt: new Date(),
    });

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    console.log(this.state.hideCompleted)
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
    console.log(this.state.hideCompleted)    
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    console.log(this.state.hideCompleted)    
      
    }
    console.log(this.state.hideCompleted)  
    console.log(filteredTasks)
      

    return filteredTasks.map( task => (
      <Task key={task._id} task={task} />
    ));
  }
 
  render() {
    return (
      <div className="container">
        <header>

          <label className="hide-completed">
            <input 
                type="checkbox" 
                readOnly 
                checked={ this.state.hideCompleted } 
                onClick={ this.toggleHideCompleted.bind(this) }
            />
            Hide Completed Tasks
          </label>
          <h1>Todo Liste ({this.props.imcompleteCount})</h1>
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
              <input type="text" ref="textInput" placeholder="Type to add new tasks"/>
          </form>

        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() =>{
    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1} } ).fetch(),
        imcompleteCount: Tasks.find({ checked: {$ne: true}}).count(),
    };
})(App);