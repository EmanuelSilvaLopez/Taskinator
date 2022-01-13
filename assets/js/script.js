var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var taskToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");

var taskFormHandler = function (event) {

	event.preventDefault();

	var taskNameInput = document.querySelector("input[name='task-name']").value;
	var taskTypeInput = document.querySelector("select[name='task-type']").value;

	if (!taskNameInput || !taskTypeInput) {
		alert("You need to fill out the task form!");
		return false;
	}

	formEl.reset();

	var taskDataObj = {
		name: taskNameInput,
		type: taskTypeInput
	};

	// send it as an arguement to createTaskEl
	createTaskEl(taskDataObj);

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

formEl.addEventListener("submit", taskFormHandler);

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
};

pageContentEl.addEventListener("click", taskButtonHandler);