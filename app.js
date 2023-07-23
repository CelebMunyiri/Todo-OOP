'use strict'
// class ToDo{
//     constructor(taskName,description,deadline){
//         this._title=title;
//         this._description=description;
//         this._deadline=deadline
//     }
// }
// Task Class
// class Todo {
//     constructor(title, description, deadline) {
//       this._title = title;
//       this._description = description;
//       this._deadline = new Date(deadline); // Convert deadline to Date object
//       this._completed = false;
//       this._completionDate = null;
//     }
  

class Todo {
    constructor(title, description, deadline) {
      this._title = title;
      this._description = description;
      this._deadline = new Date(deadline); // Convert deadline to Date object
      this._completed = false;
      this._completionDate = null;
    }
  
    // Getter methods
    getTitle() {
      return this._title;
    }
  
    getDescription() {
      return this._description;
    }
  
    getDeadline() {
      return this._deadline.toISOString().split('T')[0]; // Convert deadline back to string
    }
  
    isCompleted() {
      return this._completed;
    }
  
    // Setter method
    setCompleted(completed) {
      this._completed = completed;
      this._completionDate = completed ? new Date() : null;
    }
  
    // Method to check if task was completed on time and get the number of days early
    completeTaskOnTime() {
      if (this._completed && this._completionDate <= this._deadline) {
        const diffInTime = this._deadline.getTime() - this._completionDate.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
        return diffInDays;
      }
      return 0;
    }
  
    // Method to check if task was completed late and get the number of days late
    completeTaskLate() {
      if (this._completed && this._completionDate > this._deadline) {
        const diffInTime = this._completionDate.getTime() - this._deadline.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
        return diffInDays;
      }
      return 0;
    }
  }
  
  // Task Manager
  class TaskManager {
    constructor() {
      this._tasks = [];
    }
  
    // Add task to the list
    addTask(task) {
      this._tasks.push(task);
    }
  
    // Remove task from the list
    removeTask(index) {
      this._tasks.splice(index, 1);
    }
  
    // Mark task as completed
    completeTask(index) {
      this._tasks[index].setCompleted(true);
    }
  
    // Get completed tasks
    getCompletedTasks() {
      return this._tasks.filter((task) => task.isCompleted());
    }
  
    // Get uncompleted tasks
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
      alert('Please fill all the fields.');
      return;
    }
  
    const task = new Todo(title, description, deadline);
    taskManager.addTask(task);
    displayTasks();
  }
  
  function completeTask(index) {
    taskManager.completeTask(index);
    displayTasks();
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
      <button onclick="removeTask(${index})">Delete</button>
    `;
    uncompletedTasksList.appendChild(li);
      // ... (rest of the code for displaying uncompleted tasks remains the same)
    });
  
    completedTasks.forEach((task, index) => {
      const li = document.createElement('li');
      const daysEarly = task.completeTaskOnTime();
      const daysLate = task.completeTaskLate();
  
      li.innerHTML = `
        <span class="completed">${task.getTitle()} - ${task.getDescription()} - ${task.getDeadline()}</span>
        <span class="status-info">${daysEarly > 0 ? `Completed ${daysEarly} days early.` : (daysLate > 0 ? `Completed ${daysLate} days late.` : 'Completed on time.')}</span>
        <button onclick="removeTask(${index})">Delete</button>
      `;
      completedTasksList.appendChild(li);
    });
  }
  
  displayTasks();
  
  