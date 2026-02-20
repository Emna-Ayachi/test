// DOM Elements
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Event Listeners
addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
});
taskList.addEventListener('click', deleteOrToggleTask);

// Load tasks from LocalStorage on startup
document.addEventListener('DOMContentLoaded', loadTasks);

// --- Functions ---

function addTask() {
    const taskText = input.value.trim();

    if (taskText === '') {
        alert("Please enter a task!");
        return;
    }

    createTaskElement(taskText, false);
    saveTaskToLocalStorage(taskText, false);
    
    input.value = ''; // Clear input
}

function createTaskElement(text, isCompleted) {
    const li = document.createElement('li');
    
    // Create text node
    const textNode = document.createTextNode(text);
    li.appendChild(textNode);

    // If completed, add class
    if (isCompleted) {
        li.classList.add('completed');
    }

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.classList.add('delete-btn');
    li.appendChild(deleteBtn);

    // Add to list
    taskList.appendChild(li);
}

function deleteOrToggleTask(e) {
    const item = e.target;

    // Check if delete button was clicked
    if (item.classList.contains('delete-btn')) {
        const task = item.parentElement;
        removeTaskFromLocalStorage(task);
        task.remove();
    } 
    // Check if list item was clicked (to toggle complete)
    else if (item.tagName === 'LI') {
        item.classList.toggle('completed');
        updateTaskStatusInLocalStorage(item);
    }
}

// --- Local Storage Functions ---

function saveTaskToLocalStorage(text, isCompleted) {
    let tasks = getTasksFromStorage();
    tasks.push({ text, completed: isCompleted });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = getTasksFromStorage();
    
    if(tasks.length === 0) {
        const msg = document.createElement('div');
        msg.innerText = "No tasks yet. Add one above!";
        msg.classList.add('empty-msg');
        // We could append this, but for simplicity we just leave the list empty
    } else {
        tasks.forEach(task => {
            createTaskElement(task.text, task.completed);
        });
    }
}

function removeTaskFromLocalStorage(taskItem) {
    let tasks = getTasksFromStorage();
    // Filter out the task that matches the text of the item being removed
    // Note: In a complex app, use unique IDs. Here we use text.
    tasks = tasks.filter(t => t.text !== taskItem.firstChild.textContent);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskStatusInLocalStorage(taskItem) {
    let tasks = getTasksFromStorage();
    const taskText = taskItem.firstChild.textContent;
    
    // Find task and toggle status
    tasks.forEach(task => {
        if (task.text === taskText) {
            task.completed = !task.completed;
        }
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromStorage() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
}
