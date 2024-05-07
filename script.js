//Initial References
const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";

path = "https://to-do-backend-an1j.onrender.com/";

//Function on window load
window.onload = () => {
  updateNote = "";
  displayTasks();
};

//Function to Display The Tasks
const displayTasks = () => {
  axios.get(path).then(
    (response) => {
      var result = response.data;

      if (result.length > 0) {
        tasksDiv.style.display = "inline-block";
      } else {
        tasksDiv.style.display = "none";
      }

      //Clear the tasks
      tasksDiv.innerHTML = "";

      for (let task of result) {
        tasksDiv.innerHTML += `<div class="task" id="${task["_id"]}">
        <span id="taskname">${task["text"]}</span
        ><button class="edit" style="visibility: visible">
          <i class="fa-solid fa-pen-to-square"></i></button
        ><button class="delete"><i class="fa-solid fa-trash"></i></button>
      </div>`;
      }

      // Delete Task
      deleteTasks = document.getElementsByClassName("delete");
      Array.from(deleteTasks).forEach((element, index) => {
        element.addEventListener("click", (e) => {
          e.stopPropagation();
          let parent = element.parentElement;
          removeTask(parent.id);
          parent.remove();
        });
        displayTasks();
      });

      //Edit Tasks
      editTasks = document.getElementsByClassName("edit");
      Array.from(editTasks).forEach((element) => {
        element.addEventListener("click", (e) => {
          //Stop propogation to outer elements (if removed when we click delete eventually rhw click will move to parent)
          e.stopPropagation();
          //disable other edit buttons when one task is being edited
          disableButtons(true);
          //update input value and remove div
          let parent = element.parentElement;
          newTaskInput.value = parent.querySelector("#taskname").innerText;
          //set updateNote to the task that is being edited
          updateNote = parent.id;
          //remove task
          parent.remove();
        });
      });
    },
    (error) => {
      console.log(error);
    }
  );
};

//Disable Edit Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

//Remove Task from local storage
const removeTask = (taskValue) => {
  axios.post(path + "delete", { _id: taskValue });
};

//Function To Add New Task
document.querySelector("#push").addEventListener("click", () => {
  if (newTaskInput.value.length == 0) {
    alert("Please Enter A Task");
  } else {
    if (updateNote === "") {
      axios.post(path + "save", { text: newTaskInput.value });
      newTaskInput.value = "";
    } else {
      axios.post(path + "update", {
        _id: updateNote,
        text: newTaskInput.value,
      });
      newTaskInput.value = "";
    }
  }
  displayTasks();
});
