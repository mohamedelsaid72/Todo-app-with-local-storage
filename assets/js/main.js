/* Loader */
let loader = document.querySelector(".loader");
window.onload = () => {
  setTimeout(() => {
    loader.classList.add("remove");
  }, 1500);
};

/* Loader */
// variables
const alert = document.querySelector(".alert"),
  form = document.querySelector(".todo-form"),
  work = document.getElementById("task"),
  submitBtn = document.querySelector(".submit-btn"),
  tasksContainer = document.querySelector(".tasks-container"),
  taskDefault = document.querySelector(".task-container-default"),
  list = document.querySelector(".tasks-list"),
  clearBtn = document.querySelector(".clear-btn"),
  language = document.documentElement.lang;

// edit
let editElement;
let editFlag = false;
let editId = "";

// Submit Form
form.addEventListener("submit", addItem);

// Clear Items
clearBtn.addEventListener("click", clearItems);

//load items
window.addEventListener("DOMContentLoaded", setupTasks);

// Functions
function addItem(e) {
  e.preventDefault();
  const value = work.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createListTask(id, value);
    // display alert
    if (language === "en") {
      displayAlert("Task added to the list", "success");
    } else {
      displayAlert("تمت إضافة مهمة إلي القائمة", "success");
    }
    // remove default container
    taskDefault.classList.remove("show");
    // show container
    tasksContainer.classList.add("show-container");
    // add to local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    if (language === "en") {
      displayAlert("Task edited", "success");
    } else {
      displayAlert("تم التعديل", "success");
    }
    // Edit Local Storage
    editLocalStorage(editId, value);
    setBackToDefault();
  } else {
    if (language === "en") {
      displayAlert("please enter Task", "danger");
    } else {
      displayAlert("من فضلك أدخل مهمة", "danger");
    }
  }
}

// Display Alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  //   Remove Alert
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// Clear Items
function clearItems() {
  const items = document.querySelectorAll(".task-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }

  // hide show container
  tasksContainer.classList.remove("show-container");
  // return default container
  taskDefault.classList.add("show");
  // Empty List
  if (language === "en") {
    displayAlert("you have cleared the list", "danger");
  } else {
    displayAlert("لقد قمت بإخلاء القائمة", "danger");
  }
  setBackToDefault();
  localStorage.removeItem("tasksList");
}

// set back to default
function setBackToDefault() {
  work.value = "";
  editFlag = false;
  editId = "";
  submitBtn.innerHTML = `<i class="fas fa-plus"></i>`;
  localStorage.removeItem("list");
}

// delete Items
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    // return default container
    taskDefault.classList.add("show");
    // hide show container
    tasksContainer.classList.remove("show-container");
  }
  if (language === "en") {
    displayAlert("Task Removed", "danger");
  } else {
    displayAlert("تم المسح", "danger");
  }
  setBackToDefault();
  // remove form local storage
  removeFromLocalStorage(id);
}
// edit Items
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // Set form value
  work.value = editElement.innerHTML;
  editFlag = true;
  editId = element.dataset.id;
  submitBtn.innerHTML = `<i class="fas fa-check"></i>`;
}
/* Local Storage */
function addToLocalStorage(id, value) {
  const task = { id, value };
  let tasks = getLocalStorage();
  tasks.push(task);
  localStorage.setItem("tasksList", JSON.stringify(tasks));
}
function removeFromLocalStorage(id) {
  let tasks = getLocalStorage();
  tasks = tasks.filter(function (task) {
    if (task.id !== id) {
      return task;
    }
  });
  localStorage.setItem("tasksList", JSON.stringify(tasks));
}
function editLocalStorage(id, value) {
  let tasks = getLocalStorage();
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      task.value = value;
    }
    return task;
  });
  localStorage.setItem("tasksList", JSON.stringify(tasks));
}

function getLocalStorage() {
  return localStorage.getItem("tasksList")
    ? JSON.parse(localStorage.getItem("tasksList"))
    : [];
}

// Setup Items
function setupTasks() {
  let tasks = getLocalStorage();
  if (tasks.length > 0) {
    tasks.forEach(function (task) {
      createListTask(task.id, task.value);
    });
    tasksContainer.classList.add("show-container");
    taskDefault.classList.remove("show");
  }
}
function createListTask(id, value) {
  const element = document.createElement("article");
  // add class
  element.classList.add("task-item");
  // add id
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = ` <p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;
  const editBtn = element.querySelector(".edit-btn");
  const deleteBtn = element.querySelector(".delete-btn");
  editBtn.addEventListener("click", editItem);
  deleteBtn.addEventListener("click", deleteItem);
  // append child
  list.appendChild(element);
}

// Dark Mode
let darkTheme = localStorage.getItem("darkTheme");
const switchBtn = document.getElementById("switch");

const changeThemeToDark = () => {
  document.documentElement.dataset.theme = "dark"; // set theme to dark
  switchBtn.querySelector("i").className = "fas fa-sun";
  localStorage.setItem("darkTheme", "enabled");
};

const changeThemeToLight = () => {
  document.documentElement.dataset.theme = "light"; // set theme light
  switchBtn.querySelector("i").className = "fas fa-moon";
  localStorage.setItem("darkTheme", null);
};

if (darkTheme === "enabled") {
  changeThemeToDark();
}

switchBtn.addEventListener("click", () => {
  darkTheme = localStorage.getItem("darkTheme");
  if (darkTheme !== "enabled") {
    changeThemeToDark();
  } else {
    changeThemeToLight();
  }
});

// Add to home screen
let addToHome = document.querySelector(".addToHome"),
  closeHome = document.querySelector(".close-home");
// addToHome.addEventListener("click", () => {});

closeHome.addEventListener("click", () => {
  let addContainer = document.querySelector(".home-screen-container");
  addContainer.style.display = "none";
});
