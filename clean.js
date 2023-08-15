document.addEventListener('DOMContentLoaded', function() {
  const taskForm = document.getElementById('taskForm');
  const taskTable = document.getElementById('taskTable');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Get references to the buttons and the info container
  var infoButton = document.getElementById("infoButton");
  var infoContainer = document.getElementById("infoContainer");
  var closeInfoButton = document.getElementById("closeInfoButton");

  // Show the info container when the info button is clicked
 infoButton.addEventListener("click", function() {
 infoContainer.style.display = "block";
 });

 // Hide the info container when the close button is clicked
 closeInfoButton.addEventListener("click", function() {
 infoContainer.style.display = "none";
 });

  function updateTaskList() {
      while (taskTable.rows.length > 1) {
          taskTable.deleteRow(1);
      }

      tasks.forEach(function(task, index) {
          const newRow = taskTable.insertRow(-1);
          const nameCell = newRow.insertCell(0);
          const descriptionCell = newRow.insertCell(1);
          const dueDateCell = newRow.insertCell(2);
          const priorityCell = newRow.insertCell(3);
          const assignedToCell = newRow.insertCell(4);
          const actionCell = newRow.insertCell(5);

          nameCell.innerText = task.name;
          descriptionCell.innerText = task.description;
          dueDateCell.innerText = task.dueDate;
          priorityCell.innerText = task.priority;
          assignedToCell.innerText = task.assignedTo;

          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.addEventListener('click', function() {
              editTask(index);
          });

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', function() {
              deleteTask(index);
          });

          actionCell.appendChild(editButton);
          actionCell.appendChild(deleteButton);
      });

      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function handleFormSubmit(event) {
      event.preventDefault();

      const taskName = document.getElementById('taskName').value;
      const taskDescription = document.getElementById('taskDescription').value;
      const dueDate = document.getElementById('dueDate').value;
      const taskPriority = document.getElementById('taskPriority').value;
      const assignedTo = document.getElementById('assignedTo').value;

      const newTask = {
          name: taskName,
          description: taskDescription,
          dueDate: dueDate,
          priority: taskPriority,
          assignedTo: assignedTo
      };

      tasks.push(newTask);
      updateTaskList();
      taskForm.reset();
  }

  function deleteTask(index) {
      tasks.splice(index, 1);
      updateTaskList();
  }

  function editTask(index) {
      const task = tasks[index];
      const editForm = document.createElement('form');

      // ... Create input fields for editing ...

      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save';

      saveButton.addEventListener('click', function() {
          tasks[index] = {
              name: editNameInput.value,
              description: editDescriptionInput.value,
              dueDate: editDueDateInput.value,
              priority: editPriorityInput.value,
              assignedTo: editAssignedToInput.value
          };
          updateTaskList();
      });

      // ... Append input fields and save button to the form ...

      const taskRow = taskTable.rows[index + 1];
      while (taskRow.cells.length > 0) {
          taskRow.deleteCell(0);
      }
      const editCell = taskRow.insertCell(0);
      editCell.colSpan = 6;
      editCell.appendChild(editForm);
  }

  function requestNotificationPermission() {
      if ('Notification' in window) {
          Notification.requestPermission().then(function(permission) {
              if (permission === 'granted') {
                  console.log('Notification permission granted.');
              }
          });
      }
  }

  function showNotification(taskName, dueDate) {
      if ('Notification' in window && Notification.permission === 'granted') {
          const notification = new Notification('Task Due', {
              body: `Task "${taskName}" is due!\nDue Date: ${dueDate}`,
              icon: 'path_to_your_notification_icon.png'
          });
      }
  }

  function checkDueTasks() {
      const now = new Date();
      tasks.forEach(function(task) {
          const dueDate = new Date(task.dueDate);
          if (dueDate <= now) {
              showNotification(task.name, task.dueDate);
          }
      });
  }

  // Request notification permission on page load
  requestNotificationPermission();

  // Check for due tasks every minute (60000 milliseconds)
  setInterval(checkDueTasks, 60000);

  taskForm.addEventListener('submit', handleFormSubmit);
  updateTaskList();
});
