
const tasks = [
    {
        id: 1,
        title: "Design Homepage",
        description: "Create a clean and modern homepage layout.",
        priority: "high",
        dueDate: "2026-11-10",
        status: "todo"
    },
    {
        id: 2,
        title: "Create Login Page",
        description: "Design a simple and user-friendly login page.",
        priority: "medium",
        dueDate: "2026-11-11",
        status: "todo"
    },
    {
        id: 3,
        title: "Research Project Ideas",
        description: "Explore ideas and finalize the project concept.",
        priority: "low",
        dueDate: "2026-11-12",
        status: "todo"
    },
    {
        id: 4,
        title: "Build Navigation Bar",
        description: "Create a responsive navigation bar.",
        priority: "high",
        dueDate: "2026-11-10",
        status: "progress"
    },
    {
        id: 5,
        title: "Develop Dashboard",
        description: "Work on the main dashboard structure.",
        priority: "medium",
        dueDate: "2026-11-12",
        status: "progress"
    },
    {
        id: 6,
        title: "Fix Mobile Layout",
        description: "Improve the responsive mobile experience.",
        priority: "low",
        dueDate: "2026-11-13",
        status: "progress"
    },
    {
        id: 7,
        title: "Setup Project Files",
        description: "Organize HTML, CSS and JavaScript files.",
        priority: "low",
        dueDate: "2026-11-09",
        status: "done"
    },
    {
        id: 8,
        title: "Choose Color Theme",
        description: "Select a consistent and professional color palette.",
        priority: "medium",
        dueDate: "2026-11-09",
        status: "done"
    },
    {
        id: 9,
        title: "Create Wireframe",
        description: "Prepare the basic dashboard wireframe.",
        priority: "high",
        dueDate: "2026-11-09",
        status: "done"
    }
];


// HTML elements select kar rahe hain

const todoList = document.getElementById("todoList");
const progressList = document.getElementById("progressList");
const doneList = document.getElementById("doneList");


// Task card create karne ka function

function createTaskCard(task) {

    const card = document.createElement("div");

    card.classList.add("task-card");

    card.innerHTML = `
        <h3>${task.title}</h3>

        <p>${task.description}</p>

        <span class="priority ${task.priority}">
            ${task.priority.toUpperCase()} PRIORITY
        </span>

        <p>Due Date: ${task.dueDate}</p>
    `;

    return card;
}


// Tasks ko columns mein show karne ka function

function renderTasks() {

    todoList.innerHTML = "";
    progressList.innerHTML = "";
    doneList.innerHTML = "";

    tasks.forEach(function(task) {

        const card = createTaskCard(task);

        if (task.status === "todo") {
            todoList.appendChild(card);
        }

        else if (task.status === "progress") {
            progressList.appendChild(card);
        }

        else if (task.status === "done") {
            doneList.appendChild(card);
        }

    });

    updateStatistics();
}


// Statistics update karne ka function

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


// Page load hone par tasks show honge

renderTasks();
