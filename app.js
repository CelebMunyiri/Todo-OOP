'use strict'

class Todo {
    constructor(title, description, deadline) {
      this._title = title;
      this._description = description;
      this._deadline = new Date(deadline);
      this._completed = false;
      this._completionDate = null;
    }
  
  
    getTitle() {
      return this._title;
    }
  
    getDescription() {
      return this._description;
    }
  
    getDeadline() {
      return this._deadline.toISOString().split('T')[0];
    }
  
    isCompleted() {
      return this._completed;
    }
  
  
    setCompleted(completed) {
      this._completed = completed;
      this._completionDate = completed ? new Date() : null;
    }
  

    completeTaskOnTime() {
      if (this._completed && this._completionDate <= this._deadline) {
        const diffInTime = this._deadline.getTime() - this._completionDate.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
        return diffInDays;
      }
      return 0;
    }
  

    completeTaskLate() {
      if (this._completed && this._completionDate > this._deadline) {
        const diffInTime = this._completionDate.getTime() - this._deadline.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
        return diffInDays;
      }
      return 0;
    }
  }

  class TaskManager {
    constructor() {
      this._tasks = [];
    }

    addTask(task) {
      this._tasks.push(task);
    }
  
    removeTask(index) {
      this._tasks.splice(index, 1);
    }
  
    completeTask(index) {
      this._tasks[index].setCompleted(true);
    }
  
    getCompletedTasks() {
      return this._tasks.filter((task) => task.isCompleted());
    }
  
    getUncompletedTasks() {
      return this._tasks.filter((task) => !task.isCompleted());
    }
  }
  
  const taskManager = new TaskManager(); // Instantiate TaskManager
  
  function addTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const deadline = document.getElementById('deadline').value;
  
    if (title === '' || description === '' || deadline === '') {
      alert('Yoh fill all the fields.');
      return;
    }
  
    const task = new Todo(title, description, deadline);
    taskManager.addTask(task);
    displayTasks();
    saveTasksToLocalStorage()
  }
  
  function completeTask(index) {
    taskManager.completeTask(index);
    displayTasks();
    saveTasksToLocalStorage()
  }
  
  function removeTask(index) {
    taskManager.removeTask(index);
    displayTasks();
  }
  
  function displayTasks() {
    const uncompletedTasksList = document.getElementById('uncompleted-tasks');
    const completedTasksList = document.getElementById('completed-tasks');
  
    uncompletedTasksList.innerHTML = '';
    completedTasksList.innerHTML = '';
  
    const uncompletedTasks = taskManager.getUncompletedTasks();
    const completedTasks = taskManager.getCompletedTasks();
  
    uncompletedTasks.forEach((task, index) => {
        const li = document.createElement('li');
    li.innerHTML = `
      <span>${task.getTitle()} - ${task.getDescription()} - ${task.getDeadline()}</span>
      <button onclick="completeTask(${index})">Complete</button>
      <button id="removeTask" onclick="removeTask()">Delete</button>
    `;
    uncompletedTasksList.appendChild(li);
    });

  
    completedTasks.forEach((task, index) => {
      const li = document.createElement('li');
      const daysEarly = task.completeTaskOnTime();
      const daysLate = task.completeTaskLate();
  
      li.innerHTML = `
        <span class="completed">${task.getTitle()} - ${task.getDescription()} - ${task.getDeadline()}</span>
        <span class="status-info">${daysEarly > 0 ? `Completed ${daysEarly} days early.` : (daysLate > 0 ? `Completed ${daysLate} days late.` : 'Completed on time.')}</span>
        <button onclick="removeTask(${index})">Delete</button>
      <button>Update</button>
        `;
      completedTasksList.appendChild(li);
    });
  }

  function saveTasksToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(taskManager._tasks))
  }

  function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const tasksArray = JSON.parse(savedTasks);
      tasksArray.forEach((taskData) => {
        const task = new Todo(taskData._title, taskData._description, taskData._deadline);
        task.setCompleted(taskData._completed);
        task._completionDate = taskData._completionDate ? new Date(taskData._completionDate) : null;
        taskManager.addTask(task);
      });
    }
  }

  let addTaskBtn=document.getElementById('addTask')
  addTaskBtn.addEventListener('click',()=>addTask())
  loadTasksFromLocalStorage()
  displayTasks();
  
  