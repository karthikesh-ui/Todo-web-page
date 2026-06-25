// Selecting HTML Elements

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const quote = document.getElementById("quote");
const filterButtons = document.querySelectorAll(".filter-btn");

// Store Tasks

let tasks = [];
let currentFilter = "all";

// Load Tasks from Local Storage

window.onload = () => {

    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    fetchQuote();

    displayTasks();
};

// Add Task

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        addTask();
    }

});

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {

        alert("Please enter a task.");

        return;
    }

    const task = {

        id: Date.now(),

        text: taskText,

        completed: false

    };

    tasks.push(task);

    saveTasks();

    displayTasks();

    taskInput.value = "";

    taskInput.focus();

}

// Display Tasks

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {

        filteredTasks = tasks.filter(task => !task.completed);

    }

    else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(task => task.completed);

    }

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }

    emptyMessage.style.display = "none";

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        const taskText = document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;

        if (task.completed) {

            taskText.classList.add("completed");

        }

        const buttonContainer = document.createElement("div");

        buttonContainer.className = "task-buttons";

        // Complete Button

        const completeBtn = document.createElement("button");

        completeBtn.className = "complete-btn";

        completeBtn.textContent = "✔";

        completeBtn.addEventListener("click", () => {

            toggleComplete(task.id);

        });

        // Pending Button

        const deleteBtn = document.createElement("button");

        deleteBtn.className = "delete-btn";

        deleteBtn.textContent = "✖";

        deleteBtn.addEventListener("click", () => {

            markPending(task.id);

        });
        

        buttonContainer.appendChild(completeBtn);

        buttonContainer.appendChild(deleteBtn);

        li.appendChild(taskText);

        li.appendChild(buttonContainer);

        taskList.appendChild(li);

    });

}

// Complete Task

function toggleComplete(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed = !task.completed;

        }

        return task;

    });

    saveTasks();

    displayTasks();

}

// Delete Task

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    displayTasks();

}

// Save Tasks

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// Filter Tasks

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();

    });

});

// Fetch Motivational Quote

async function fetchQuote() {

    try {

        const response = await fetch("https://api.adviceslip.com/advice");

        const data = await response.json();

        quote.textContent = `"${data.slip.advice}"`;

    }

    catch (error) {

        quote.textContent = '"Believe in yourself and keep moving forward."';

    }

}