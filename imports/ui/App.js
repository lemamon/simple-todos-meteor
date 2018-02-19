import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Tasks } from '../api/tasks.js';
import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';


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
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }

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
          <AccountsUIWrapper/>
          {
            this.props.currentUser ?
            // <h1>Todo List ({this.props.imcompleteCount})</h1>
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
                <input type="text" ref="textInput" placeholder="Type to add new tasks"/>
            </form> : ''
          }
    
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
        currentUser: Meteor.user(),
    };
})(App);