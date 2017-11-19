// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import Meter from 'grommet/components/Meter';
import Section from 'grommet/components/Section';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Value from 'grommet/components/Value';
import Search from 'grommet/components/Search';
import Status from 'grommet/components/icons/Status';
import CloseIcon from 'grommet/components/icons/base/Close';

import TodoAddTaskForm from './TodoAddTaskForm';

function getLabel(label, value, colorIndex) {
  return { label, value, colorIndex };
}

class DeleteTaskButton extends Component {
  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
  }

  _onClick() {
    const { task, onDelete } = this.props;
    onDelete(task);
  }

  render() {
    const { task } = this.props;
    return (
      <Button plain={true}
        onClick={this._onClick}
        icon={<CloseIcon />}
        a11yTitle={`Delete ${task.item} task`} />
    );
  }
}

DeleteTaskButton.propTypes = {
  task: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired
};

class AddSubTaskButton extends Component {
  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
  }

  _onClick() {
    const { task, onAdd } = this.props;
    onAdd(task);
  }

  render() {
    const { task } = this.props;
    return (
      <Button primary={true}
        label='Add Note'
        onClick={this._onClick}
        a11yTitle={`Delete ${task.item} task`} />
    );
  }
}

AddSubTaskButton.propTypes = {
  task: PropTypes.object.isRequired,
  onAdd: PropTypes.func.isRequired
};


export default class TodoAppDashboard extends Component {

  constructor() {
    super();

    this._onRequestForAdd = this._onRequestForAdd.bind(this);
    this._onRequestForAddClose = this._onRequestForAddClose.bind(this);
    this._onRequestForAddChild = this._onRequestForAddChild.bind(this);
    this._onRequestForDelete = this._onRequestForDelete.bind(this);
    this._onRequestForEdit = this._onRequestForEdit.bind(this);
    this._onSearchTyped = this._onSearchTyped.bind(this);
    this._onAddTask = this._onAddTask.bind(this);

    this.state = {
      fiteredTasks: [],
      tasks: [],
      addTask: false,
      filter: false
    };
  }

  _onSearchTyped(e) {
    // console.log('search typed: ', e.target.value);
    let filtered;
    if(e.target.value.trim() !== '') {
      filtered = [];
      this.state.tasks.forEach((task) => {
        if(task.label.includes(e.target.value)) {
          filtered.push(task);
        }
      });

      this.setState({filteredTasks: filtered, filter: true});
    } else {
      this.setState({filter: false});
    }
    
  }

  _onRequestForAdd() {
    this.setState({ addTask: true, level: 1, mainLevel: true });
  }

  _onRequestForAddChild(e) {
    console.log('index of parent:', this.state.tasks.indexOf(e));
    this.setState({ addTask: true, level: e.level, indexOfParent: this.state.tasks.indexOf(e), mainLevel: false});
  }

  _onRequestForAddClose() {
    this.setState({ addTask: false });
  }

  _onRequestForEdit(e) {
    console.log('on click for edit: ', e.target);
  }

  _onRequestForDelete(task) {
    const { tasks } = this.state;
    const index = this.state.tasks.indexOf(task);
    tasks.splice(index, 1);
    this.setState({ tasks });
  }

  _onAddTask(task) {
    const tasks = this.state.tasks;
    if(this.state.mainLevel) {
      tasks.push(task);
    } else {
      tasks.splice(this.state.indexOfParent+1, 0, task);
    }
    this.setState({ tasks, addTask: false });
  }

  _onMeterActive(index) {
    this.setState({ index });
  }

  render() {
    const tasksMap = {
      critical: 0,
      ok: 0,
      warning: 0
    };

    let tasksToProcess = [];
    if(this.state.filter) {
      tasksToProcess = this.state.filteredTasks;
    } else {
      tasksToProcess = this.state.tasks;
    }

    console.log('taskstorprocess: ', tasksToProcess);

    const tasks = tasksToProcess.map((task, index) => {
      tasksMap[task.status] += 1;

      let separator;
      if (index === 0) {
        separator = 'horizontal';
      }

      console.log('task: ', task);

      let level = 1;
      return (
        <ListItem key={`task_${index}`} justify='between'
          separator={separator} responsive={false} >
          <Box style={{marginLeft: task.level*20}} direction='row' responsive={false}
            pad={{ between: 'small' }}>
            <Status value={task.status} size='small' />
            <span>{task.label}</span>
          </Box>
          <AddSubTaskButton task={task} onAdd={this._onRequestForAddChild} />
          <DeleteTaskButton task={task} onDelete={this._onRequestForDelete} />
        </ListItem>
      );
    }, this);

    let addTask;
    if (this.state.addTask) {
      addTask = (
        <TodoAddTaskForm onClose={this._onRequestForAddClose}
          onSubmit={this._onAddTask} level = {this.state.level}/>
      );
    }

    if (this.state.editTask) {

    }

    const series = [
      getLabel('Past Due', tasksMap.critical, 'critical'),
      getLabel('Due Soon', tasksMap.warning, 'warning'),
      getLabel('Done', tasksMap.ok, 'ok')
    ];

    let value;
    let label;
    if (this.state.index >= 0) {
      value = series[this.state.index].value;
      label = series[this.state.index].label;
    } else {
      value = 0;
      series.forEach(serie => value += serie.value);
      label = 'Total';
    }

    return (
      <Section primary={true} flex={true}>
        
        <Box direction='row'>
          <Box pad='medium' size='xlarge'>
            <Box pad={{ vertical: 'small' }} align='start'>
              <Button label='Add Note' primary={true}
                onClick={this._onRequestForAdd} />
            </Box>
            <Search placeHolder='Search'
            inline={true}
            responsive={false}
            onDOMChange={this._onSearchTyped}/>
            <List>
              {tasks}
            </List>
          </Box>
        </Box>
        {addTask}
      </Section>
    );
  }
}
