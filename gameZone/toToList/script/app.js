document.addEventListener('DOMContentLoaded', function () {
    let selectedPriority = 'Medium';
    let draggedItem = null;
    let currentTaskItem = null; // to track the task being edited

    // פונקציה המציגה הודעה למשתמש על כל פעולה שהוא מבצע

    function showToast(message) {
        const toastLiveExample = document.getElementById('liveToast');
        const toastBody = toastLiveExample.querySelector('.toast-body');
        toastBody.textContent = message;

        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    }

    //קריאה לפעולה בכפתור עדיפות לדחיפות ביצוע המשימה
    document.getElementById('priorityDropdown').addEventListener('click', function (event) {
        event.preventDefault();
        if (event.target.tagName === 'A') {
            selectedPriority = event.target.getAttribute('data-priority');

            const priorityButton = document.getElementById('priorityButton');
            priorityButton.textContent = 'Priority: ' + selectedPriority;
            priorityButton.classList.remove('btn-danger', 'btn-warning', 'btn-success');
            if (selectedPriority === 'High') {
                priorityButton.classList.add('btn-danger');
            } else if (selectedPriority === 'Medium') {
                priorityButton.classList.add('btn-warning');
            } else if (selectedPriority === 'Low') {
                priorityButton.classList.add('btn-success');
            }
            showToast('Priority set to: ' + selectedPriority);
        }
    });

    // הוספת משימה תוך בדיקה ופעולה כאשר מנסים להכניס משימה ריקה או שהתאריך של המשימה עבר

    document.getElementById('add-task').addEventListener('click', function () {
        const taskInput = document.getElementById('new-task');
        const taskText = taskInput.value.trim();
        const datetimeInput = document.querySelector('input[type="datetime-local"]');
        const dueDateTime = datetimeInput.value ? new Date(datetimeInput.value) : null;

        if (taskText === '') {
            showToast('Task cannot be empty!');
            return;
        }

        const now = new Date();
        if (dueDateTime && dueDateTime < now) {
            showToast('Cannot add a task with a past due date!');
            return;
        }

        const timeToComplete = calculateTimeToComplete(now, dueDateTime);
        addTask(taskText, selectedPriority, dueDateTime, timeToComplete);
        saveTask(taskText, selectedPriority, dueDateTime, timeToComplete);
        taskInput.value = '';
        datetimeInput.value = '';
        taskInput.focus();
        showToast('Task added successfully with ' + selectedPriority + ' priority!');
    });

    function addTask(taskText, priority, dueDateTime, timeToComplete) {
        priority = priority || 'Medium';

        const taskList = document.getElementById('task-list');
        const taskItem = document.createElement('li');

        const formattedDueDate = dueDateTime ? dueDateTime.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) + ' ' + dueDateTime.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }) : 'Now';

        taskItem.setAttribute('data-task-date', formattedDueDate);

        taskItem.className = `list-group-item d-flex justify-content-between align-items-center priority-${priority.toLowerCase()}`;
        taskItem.innerHTML = `
    <span>${taskText} <small class="text-muted">(Due: ${formattedDueDate}, Priority: ${priority})</small><br><small class="text-info">${timeToComplete}</small></span>
    <div class="d-flex"> <!-- Ensuring d-flex class is here -->
        <button class="btn btn-success btn-sm me-2 complete-task">הושלם</button>
        <button class="btn btn-danger btn-sm delete-task">מחיקה</button>
        <button class="btn btn-secondary btn-sm edit-task">עריכה</button>
    </div>
`;
        taskItem.draggable = true;
        addDragAndDropEvents(taskItem);
        taskList.appendChild(taskItem);

        taskItem.querySelector('.complete-task').addEventListener('click', function () {
            completeTask(taskItem, taskText, priority);
        });

        taskItem.querySelector('.delete-task').addEventListener('click', function () {
            removeTask(taskText);
            taskList.removeChild(taskItem);
        });

        taskItem.querySelector('.edit-task').addEventListener('click', function () {
            currentTaskItem = taskItem;
            document.getElementById('editTaskInput').value = taskText;
            var editModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
            editModal.show();
        });
    }

    //חישוב זמן לביצוע המשימה והצגה

    function calculateTimeToComplete(currentTime, dueDateTime) {
        if (!dueDateTime || dueDateTime <= currentTime) {
            const formattedCurrentTime = currentTime.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }) + ' ' + currentTime.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            return `Due Date: Now (${formattedCurrentTime})`;
        }

        const diffInMs = dueDateTime - currentTime;
        const diffInMinutes = Math.floor(diffInMs / 60000);

        const days = Math.floor(diffInMinutes / (60 * 24));
        const hours = Math.floor((diffInMinutes % (60 * 24)) / 60);
        const minutes = diffInMinutes % 60;

        const formattedDueDate = dueDateTime.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) + ' ' + dueDateTime.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        return `Due Date: ${formattedDueDate} | Time left: ${days} days, ${hours} hours, and ${minutes} minutes`;
    }

    // שמירת משימה באחסון דפדפן 

    function saveTask(taskText, priority, dueDateTime, timeToComplete) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({
            text: taskText,
            priority: priority,
            dueDateTime: dueDateTime ? dueDateTime.toISOString() : null,
            timeToComplete: timeToComplete
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.text, task.priority, task.dueDateTime ? new Date(task.dueDateTime) : null, task.timeToComplete);
        });
    }

    // אפשרות גרירת משימות ושינוי סדר על גבי המסך
    function addDragAndDropEvents(taskItem) {
        taskItem.addEventListener('dragstart', function (e) {
            draggedItem = taskItem;
            setTimeout(() => {
                taskItem.style.display = 'none';
            }, 0);
        });

        taskItem.addEventListener('dragend', function (e) {
            setTimeout(() => {
                draggedItem.style.display = 'block';
                draggedItem = null;
            }, 0);
        });

        taskItem.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        taskItem.addEventListener('drop', function (e) {
            e.preventDefault();
            if (draggedItem !== taskItem) {
                const taskList = document.getElementById('task-list');
                const allTasks = Array.from(taskList.querySelectorAll('li'));
                const currentIndex = allTasks.indexOf(taskItem);
                const draggedIndex = allTasks.indexOf(draggedItem);

                if (currentIndex > draggedIndex) {
                    taskList.insertBefore(draggedItem, taskItem.nextSibling);
                } else {
                    taskList.insertBefore(draggedItem, taskItem);
                }
            }
        });
    }

    function completeTask(taskItem, taskText, priority) {
        const historyList = document.getElementById('history-list');
        const taskDate = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) + ' ' + new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        const completedTaskItem = document.createElement('li');
        completedTaskItem.className = `list-group-item priority-${priority.toLowerCase()}`;
        completedTaskItem.innerHTML = `${taskText} <small class="text-muted">(${taskDate}, Priority: ${priority})</small>`;

        if (historyList.firstChild) {
            historyList.insertBefore(completedTaskItem, historyList.firstChild);
        } else {
            historyList.appendChild(completedTaskItem);
        }

        saveToHistory(taskText + ' (' + taskDate + ', Priority: ' + priority + ')');
        removeTask(taskText);
        taskItem.remove();
        showToast('Task marked as complete: ' + taskText + ' with ' + priority + ' priority.');
    }

    function saveToHistory(taskText) {
        let history = JSON.parse(localStorage.getItem('history')) || [];
        history.push(taskText);
        localStorage.setItem('history', JSON.stringify(history));
    }

    function removeTask(taskText) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    document.getElementById('clear-history').addEventListener('click', function () {
        clearHistory();
    });

    function clearHistory() {
        localStorage.removeItem('history');
        document.getElementById('history-list').innerHTML = '';
    }

    document.getElementById('saveTaskChanges').addEventListener('click', function () {
        const newTaskText = document.getElementById('editTaskInput').value.trim();
        if (newTaskText !== "" && currentTaskItem) {
            const taskDate = currentTaskItem.getAttribute('data-task-date');
            const oldTaskText = currentTaskItem.querySelector('span').innerText.split(' (')[0];

            currentTaskItem.querySelector('span').innerHTML = `${newTaskText} <small class="text-muted">(${taskDate}, Priority: ${selectedPriority})</small>`;

            updateTaskInLocalStorage(oldTaskText, newTaskText, selectedPriority, taskDate);

            var editModal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
            editModal.hide();
            showToast('Task updated successfully!');
        }
    });

    function updateTaskInLocalStorage(oldTaskText, newTaskText, priority, taskDate) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const index = tasks.findIndex(task => task.text === oldTaskText);
        if (index !== -1) {
            tasks[index].text = newTaskText;
            tasks[index].priority = priority;
            tasks[index].date = taskDate;
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        const historyList = document.getElementById('history-list');
        history.forEach(task => {
            const completedTaskItem = document.createElement('li');
            completedTaskItem.className = 'list-group-item';
            completedTaskItem.textContent = task;
            historyList.appendChild(completedTaskItem);
        });
    }

    loadTasks();
    loadHistory();
});
