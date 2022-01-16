var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var taskToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var taskInProgressEl = document.querySelector("#tasks-in-progress");
var taskCompletedEl = document.querySelector("#tasks-completed");

var tasks = [];

var taskFormHandler = function (event) {

	event.preventDefault();

	var taskNameInput = document.querySelector("input[name='task-name']").value;
	var taskTypeInput = document.querySelector("select[name='task-type']").value;

	if (!taskNameInput || !taskTypeInput) {
		alert("You need to fill out the task form!");
		return false;
	}

	formEl.reset();

	var isEdit = formEl.hasAttribute("data-task-id");

	// has data attribute, so get task id and call function to complete edit process
	if (isEdit) {
		var taskId = formEl.getAttribute("data-task-id");
		completeEditTask(taskNameInput, taskTypeInput, taskId);
	}
	// no data attribute, so create object as normal and pass to createTaskEl function
	else {
		var taskDataObj = {
			name: taskNameInput,
			type: taskTypeInput,
			status: "to do"
		};

		createTaskEl(taskDataObj);
	}

};

var completeEditTask = function (taskName, taskType, taskId) {
	// find the matching task list item
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

	// set new values
	taskSelected.querySelector("h3.task-name").textContent = taskName;
	taskSelected.querySelector("span.task-type").textContent = taskType;

	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id === parseInt(taskId)) {
			tasks[i].name = taskName;
			tasks[i].type = taskType;
		}
	};

	saveTasks();

	alert("Task Updated!");

	formEl.removeAttribute("data-task-id");
	document.querySelector("#save-task").textContent = "Add Task";
};

var createTaskEl = function (taskDataObj) {
	// create list item
	var listItemEl = document.createElement("li");
	listItemEl.className = "task-item";

	listItemEl.setAttribute("data-task-id", taskIdCounter);

	// create div to hold task info and add to list item
	var taskInfoEl = document.createElement("div");
	// Give it a class name
	taskInfoEl.className = "task-info";
	// add html content to div
	taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

	listItemEl.appendChild(taskInfoEl);

	var taskActionsEl = createTaskActions(taskIdCounter);
	listItemEl.appendChild(taskActionsEl);

	taskDataObj.id = taskIdCounter;

	tasks.push(taskDataObj);

	saveTasks();

	// Add entire list item to list
	taskToDoEl.appendChild(listItemEl);

	// Increase task counter for next unique ID 
	taskIdCounter++;
};

var createTaskActions = function (taskId) {
	var actionContainerEl = document.createElement("div");
	actionContainerEl.className = "task-actions";

	// Create Edit button
	var editButtonEl = document.createElement("button");
	editButtonEl.textContent = "Edit";
	editButtonEl.className = "btn edit-btn";
	editButtonEl.setAttribute("data-task-id", taskId);

	actionContainerEl.appendChild(editButtonEl);

	// Create Delete button
	var deleteButtonEl = document.createElement("button");
	deleteButtonEl.textContent = "Delete";
	deleteButtonEl.className = "btn delete-btn";
	deleteButtonEl.setAttribute("data-task-id", taskId);

	actionContainerEl.appendChild(deleteButtonEl);

	var statusSeletEl = document.createElement("Select");
	statusSeletEl.className = "select-status";
	statusSeletEl.setAttribute("name", "status-change");
	statusSeletEl.setAttribute("data-task-id", taskId);

	var statusChoices = ["To do", "In Progress", "Completed"];

	for (var i = 0; i < statusChoices.length; i++) {
		// Create option element
		var statusOptionEl = document.createElement("option")
		statusOptionEl.textContent = statusChoices[i];
		statusOptionEl.setAttribute("value", statusChoices[i]);

		// append to select
		statusSeletEl.appendChild(statusOptionEl);
	}

	actionContainerEl.appendChild(statusSeletEl);

	return actionContainerEl;
}



var taskStatusChangeHandler = function (event) {
	// get the task item's ID
	var taskId = event.target.getAttribute("data-task-id");

	// get the currently selected option's value and convert to lowercase 
	var statusValue = event.target.value.toLowerCase();

	// find the parent task item element based on the id
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

	if (statusValue === "to do") {
		taskToDoEl.appendChild(taskSelected);
	}
	else if (statusValue === "in progress") {
		taskInProgressEl.appendChild(taskSelected);
	}
	else if (statusValue === "completed") {
		taskCompletedEl.appendChild(taskSelected);
	}

	// updates task's in tasks array
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id === parseInt(taskId)) {
			tasks[i].status = statusValue;
		}
	}

	saveTasks();
};

var taskButtonHandler = function (event) {
	// get target element from event 
	var targetEl = event.target;

	//edit button was clicked
	if (targetEl.matches(".edit-btn")) {
		var taskId = targetEl.getAttribute("data-task-id");
		editTask(taskId);
	}
	// delete button was clicked
	else if (event.target.matches(".delete-btn")) {
		// get the elements task id
		var taskId = event.target.getAttribute("data-task-id");
		deleteTask(taskId);
	}
};

var editTask = function (taskId) {
	// get task list item element
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

	// get content from task name and type 
	var taskName = taskSelected.querySelector("h3.task-name").textContent;
	console.log(taskName);

	var taskType = taskSelected.querySelector("span.task-type").textContent;
	document.querySelector("input[name = 'task-name']").value = taskName;
	document.querySelector("select[name = 'task-type']").value = taskType;

	document.querySelector("#save-task").textContent = "Save Task";

	formEl.setAttribute("data-task-id", taskId);
};

var deleteTask = function (taskId) {
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
	taskSelected.remove();

	// create new array to hold updated list of tasks
	var updatedTaskArr = [];

	// loop through current tasks
	for (var i = 0; i < tasks.length; i++) {
		// if tasks[i].id doesn't match the value of taskId, lets keep that task and push it into a new array
		if (tasks[i].id !== parseInt(taskId)) {
			updatedTaskArr.push(tasks[i]);
		}
	}

	// reassign tasks array to be the same as updatedTaskArr
	tasks = updatedTaskArr;

	saveTasks();
};

var saveTasks = function () {
	localStorage.setItem("tasks", JSON.stringify(tasks));
};


// Gets task items from localStorage.

// Converts tasks from the string format back into an array of objects.

// Iterates through a tasks array and creates task elements on the page from it.
var loadTasks = function () {
	tasks = localStorage.getItem("tasks");

	if (tasks === null) {
		tasks = [];
		return false;
	}

	tasks = JSON.parse(tasks);

	console.log(tasks);

	for (var i = 0; i < tasks.length; i++) {

		tasks[i].id = taskIdCounter;

		var listItemEl = document.createElement("li");
		listItemEl.className = "task-item";

		listItemEl.setAttribute("data-task-id", tasks[i].id);

		var taskInfoEl = document.createElement("div");

		taskInfoEl.className = "task-info";

		taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";

		listItemEl.appendChild(taskInfoEl);

		var taskActionsEl = createTaskActions(tasks[i].id)

		listItemEl.appendChild(taskActionsEl);

		if (tasks[i].status === "to do") {
			listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;

			taskToDoEl.appendChild(listItemEl);
		} else if (tasks[i].status === "in progress") {
			listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;

			taskInProgressEl.appendChild(listItemEl);
		} else if (tasks[i].status === "completed") {
			listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;

			taskCompletedEl.appendChild(listItemEl);
		}

		taskIdCounter++;

		console.log(listItemEl);
	}


}

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();