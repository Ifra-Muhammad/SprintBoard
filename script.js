
// Sample tasks
let tasks = [
    { id: 1, title: "Design Homepage", description: "Create a clean and modern homepage layout.", priority: "high", dueDate: "2026-11-10", status: "todo" },
    { id: 2, title: "Create Login Page", description: "Design a simple and user-friendly login page.", priority: "medium", dueDate: "2026-11-11", status: "todo" },
    { id: 3, title: "Research Project Ideas", description: "Explore ideas and finalize the project concept.", priority: "low", dueDate: "2026-11-12", status: "todo" },
    { id: 4, title: "Build Navigation Bar", description: "Create a responsive navigation bar.", priority: "high", dueDate: "2026-11-10", status: "progress" },
    { id: 5, title: "Develop Dashboard", description: "Work on the main dashboard structure.", priority: "medium", dueDate: "2026-11-12", status: "progress" },
    { id: 6, title: "Fix Mobile Layout", description: "Improve the responsive mobile experience.", priority: "low", dueDate: "2026-11-13", status: "progress" },
    { id: 7, title: "Setup Project Files", description: "Organize HTML, CSS and JavaScript files.", priority: "low", dueDate: "2026-11-09", status: "done" },
    { id: 8, title: "Choose Color Theme", description: "Select a consistent and professional color palette.", priority: "medium", dueDate: "2026-11-09", status: "done" },
    { id: 9, title: "Create Wireframe", description: "Prepare the basic dashboard wireframe.", priority: "high", dueDate: "2026-11-09", status: "done" }
];

// HTML elements
const todoList = document.getElementById("todoList");
const progressList = document.getElementById("progressList");
const doneList = document.getElementById("doneList");

const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");

const taskForm = document.getElementById("taskForm");
const modalTitle = document.getElementById("modalTitle");

const taskId = document.getElementById("taskId");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.getElementById("taskDueDate");
const taskStatus = document.getElementById("taskStatus");

const titleError = document.getElementById("titleError");

// Column status mapping
const columnStatuses = {
    todo: todoList,
    progress: progressList,
    done: doneList
};

const statusNames = {
    todo: "To Do",
    progress: "In Progress",
    done: "Done"
};

// Store currently dragged task ID
let draggedTaskId = null;


// Modal open
function openModal() {
    taskForm.reset();
    taskId.value = "";
    titleError.textContent = "";
    modalTitle.textContent = "Add New Task";

    taskModal.classList.add("show");
    taskModal.setAttribute("aria-hidden", "false");

    taskTitle.focus();
}


// Modal close
function closeModal() {
    taskModal.classList.remove("show");
    taskModal.setAttribute("aria-hidden", "true");

    taskForm.reset();
    taskId.value = "";
    titleError.textContent = "";
}


// Modal events
addTaskBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cancelTaskBtn.addEventListener("click", closeModal);

taskModal.addEventListener("click", function(event) {
    if (event.target === taskModal) {
        closeModal();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && taskModal.classList.contains("show")) {
        closeModal();
    }
});


// Move task and update the board
function moveTask(id, newStatus) {
    const task = tasks.find(function(item) {
        return item.id === id;
    });

    if (!task || !columnStatuses[newStatus]) return;

    task.status = newStatus;

    renderTasks();
}


// Create task card
function createTaskCard(task) {
    const card = document.createElement("div");
    card.classList.add("task-card");
    card.setAttribute("draggable", "true");
    card.dataset.taskId = task.id;

    // Drag start
    card.addEventListener("dragstart", function(event) {
        draggedTaskId = task.id;

        event.dataTransfer.setData("text/plain", String(task.id));
        event.dataTransfer.effectAllowed = "move";

        card.classList.add("dragging");
    });

    // Drag end
    card.addEventListener("dragend", function() {
        draggedTaskId = null;
        card.classList.remove("dragging");

        document.querySelectorAll(".board-column").forEach(function(column) {
            column.classList.remove("drag-over");
        });
    });

    const heading = document.createElement("h3");
    heading.textContent = task.title;

    const description = document.createElement("p");
    description.textContent = task.description || "No description provided.";

    const priority = document.createElement("span");
    priority.classList.add("priority", task.priority);
    priority.textContent = task.priority.toUpperCase() + " PRIORITY";

    const dueDate = document.createElement("span");
    dueDate.classList.add("task-due-date");
    dueDate.textContent = "Due Date: " + task.dueDate;

    const status = document.createElement("span");
    status.classList.add("task-status");
    status.textContent = "Status: " + statusNames[task.status];

    // Accessible status dropdown
    const statusLabel = document.createElement("label");
    statusLabel.classList.add("move-label");
    statusLabel.textContent = "Move task:";

    const statusSelect = document.createElement("select");
    statusSelect.classList.add("move-task-select");
    statusSelect.setAttribute("aria-label", "Move " + task.title + " to another column");

    Object.keys(statusNames).forEach(function(statusKey) {
        const option = document.createElement("option");
        option.value = statusKey;
        option.textContent = statusNames[statusKey];

        if (task.status === statusKey) {
            option.selected = true;
        }

        statusSelect.appendChild(option);
    });

    statusSelect.addEventListener("change", function() {
        moveTask(task.id, statusSelect.value);
    });

    statusLabel.appendChild(statusSelect);

    // Edit button
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.classList.add("edit-btn");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function() {
        editTask(task.id);
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function() {
        deleteTask(task.id);
    });

    const actions = document.createElement("div");
    actions.classList.add("task-actions");

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    // Add elements to card
    card.appendChild(heading);
    card.appendChild(description);
    card.appendChild(priority);
    card.appendChild(dueDate);
    card.appendChild(status);
    card.appendChild(statusLabel);
    card.appendChild(actions);

    return card;
}


// Render tasks
function renderTasks() {
    todoList.innerHTML = "";
    progressList.innerHTML = "";
    doneList.innerHTML = "";

    tasks.forEach(function(task) {
        const card = createTaskCard(task);
        const targetList = columnStatuses[task.status];

        if (targetList) {
            targetList.appendChild(card);
        }
    });

    updateStatistics();
}


// Drag and drop setup
function setupDropZone(list, status) {
    const column = list.closest(".board-column");

    list.addEventListener("dragover", function(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";

        column.classList.add("drag-over");
    });

    list.addEventListener("dragleave", function(event) {
        if (!list.contains(event.relatedTarget)) {
            column.classList.remove("drag-over");
        }
    });

    list.addEventListener("drop", function(event) {
        event.preventDefault();
        column.classList.remove("drag-over");

        const droppedId = event.dataTransfer.getData("text/plain");
        const id = Number(droppedId || draggedTaskId);

        if (!id) return;

        moveTask(id, status);
        draggedTaskId = null;
    });
}


// Enable drop zones on all three columns
setupDropZone(todoList, "todo");
setupDropZone(progressList, "progress");
setupDropZone(doneList, "done");


// Update statistics
function updateStatistics() {
    const totalTasks = tasks.length;

    const todoTasks = tasks.filter(function(task) {
        return task.status === "todo";
    }).length;

    const progressTasks = tasks.filter(function(task) {
        return task.status === "progress";
    }).length;

    const doneTasks = tasks.filter(function(task) {
        return task.status === "done";
    }).length;

    document.getElementById("totalTasks").textContent = totalTasks;
    document.getElementById("todoCount").textContent = todoTasks;
    document.getElementById("progressCount").textContent = progressTasks;
    document.getElementById("doneCount").textContent = doneTasks;

    document.getElementById("todoBadge").textContent = todoTasks;
    document.getElementById("progressBadge").textContent = progressTasks;
    document.getElementById("doneBadge").textContent = doneTasks;
}


// Create and edit task
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const priority = taskPriority.value;
    const dueDate = taskDueDate.value;
    const status = taskStatus.value;

    if (!title) {
        titleError.textContent = "Task title is required.";
        taskTitle.focus();
        return;
    }

    if (!priority || !dueDate || !status) {
        alert("Please complete all required fields.");
        return;
    }

    titleError.textContent = "";

    if (taskId.value !== "") {
        const existingTask = tasks.find(function(task) {
            return task.id === Number(taskId.value);
        });

        if (existingTask) {
            existingTask.title = title;
            existingTask.description = description;
            existingTask.priority = priority;
            existingTask.dueDate = dueDate;
            existingTask.status = status;
        }
    } else {
        const newTask = {
            id: Date.now(),
            title: title,
            description: description,
            priority: priority,
            dueDate: dueDate,
            status: status
        };

        tasks.push(newTask);
    }

    renderTasks();
    closeModal();
});


// Edit task
function editTask(id) {
    const task = tasks.find(function(item) {
        return item.id === id;
    });

    if (!task) return;

    taskId.value = task.id;
    taskTitle.value = task.title;
    taskDescription.value = task.description;
    taskPriority.value = task.priority;
    taskDueDate.value = task.dueDate;
    taskStatus.value = task.status;

    titleError.textContent = "";
    modalTitle.textContent = "Edit Task";

    taskModal.classList.add("show");
    taskModal.setAttribute("aria-hidden", "false");

    taskTitle.focus();
}


// Delete task
function deleteTask(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    renderTasks();
}


// Initial render
renderTasks();
