import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Tasks } from '../api/tasks.js';
import Task from './Task.js';
 
class App extends Component {

  handleSubmit(ev) {
    ev.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Tasks.insert({
      text,
      createdAt: new Date(),
    });

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderTasks() {
    return this.props.tasks.map( task => (
      <Task key={task._id} task={task} />
    ));
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
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
    };
})(App);