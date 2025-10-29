// Variaveis do modal
const editModal = document.querySelector("#edit-modal");
const modalOverlay = document.querySelector("#modal-overlay");
const editTaskInput = document.querySelector("#edit-task-input");
const saveEditBtn = document.querySelector("#save-edit-btn");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

// Variaveis do formulário
const form = document.querySelector("#todo-form");
const taskTitleInput = document.querySelector("#task-title-input");
const todolistUl = document.querySelector("#todo-list");

let tasks = [];
let taskIndexToEdit = null;

// Formulário
form.addEventListener("submit", (event) => {
  event.preventDefault(); // previne o comportamento padrão do formulário
  const taskTitle = taskTitleInput.value;
  if (taskTitle.length < 3) {
    alert("O título da tarefa deve ter pelo menos 3 caracteres");
    return;
  }
  tasks.push({ title: taskTitle, done: false });
  document.getElementById("minhas-tarefas").classList.add("com-tarefas");
  rederizarTarefas(tasks);
  taskTitleInput.value = "";
  return tasks;
});

const rederizarTarefas = (tasks) => {
  console.log("Tarefas:", tasks);
  todolistUl.innerHTML = "";

  tasks.forEach((task, index) => {
    // Se não for o primeiro item, insere uma linha antes
    if (index > 0) {
      const linha = document.createElement("hr");
      linha.style.border = "0";
      linha.style.borderTop = "1px solid #ccc";
      linha.style.margin = "8px 0";
      todolistUl.appendChild(linha);
    }

    const li = document.createElement("li");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = task.done;
    li.appendChild(input);

    const span = document.createElement("span");
    span.textContent = task.title;
    if (task.done) {
      span.style.textDecoration = "line-through";
    }
    li.appendChild(span);

    input.addEventListener("change", (input) => {
      span.style.textDecoration = input.target.checked
        ? "line-through"
        : "none";
      const myTasks = span.textContent;
      const newTasks = tasks.map((task) =>
        task.title === myTasks ? { ...task, done: !task.done } : task
      );
      rederizarTarefas(newTasks); // atualiza a lista com novo estado
    });
    const divBtn = document.createElement("div");
    li.appendChild(divBtn);
    divBtn.classList.add("div-btn");
    const editBtn = document.createElement("button");

    // Cria o ícone usando
    const icon = document.createElement("span");
    icon.classList.add("material-icons");
    icon.textContent = "edit"; // nome do ícone
    editBtn.appendChild(icon);
    // Acessibilidade e tooltip
    editBtn.title = "Editar";

    editBtn.addEventListener("click", () => openEditModal(index));
    divBtn.appendChild(editBtn);

    const button = document.createElement("button");
    // Cria o ícone usando
    const iconDelete = document.createElement("span");
    iconDelete.classList.add("material-icons");
    iconDelete.textContent = "delete"; // nome do ícone
    button.appendChild(iconDelete);
    // Acessibilidade e tooltip
    button.title = "Excluir";
    button.addEventListener("click", () => {
      tasks.splice(index, 1);
      rederizarTarefas(tasks);
      if (tasks.length === 0) {
        document
          .getElementById("minhas-tarefas")
          .classList.remove("com-tarefas");
      }
    });
    divBtn.appendChild(button);
    todolistUl.appendChild(li);
  });
};

// Modal para editar
const openEditModal = (index) => {
  taskIndexToEdit = index;
  editTaskInput.value = tasks[index].title;
  editModal.style.display = "block";
  modalOverlay.style.display = "block";
  const editBtnSave = document.querySelector("#save-edit-btn");
  const editBtnCancel = document.querySelector("#cancel-edit-btn");
  editBtnSave.classList.add("btn");
  editBtnCancel.classList.add("btn");
  editBtnSave.classList.add("salve-btn");
  editBtnCancel.classList.add("cancel-btn");
};

const closeEditModal = () => {
  editModal.style.display = "none";
  modalOverlay.style.display = "none";
  taskIndexToEdit = null;
};

saveEditBtn.addEventListener("click", () => {
  const newTitle = editTaskInput.value.trim();
  if (newTitle.length < 3) {
    alert("O título da tarefa deve ter pelo menos 3 caracteres");
    return;
  }
  tasks[taskIndexToEdit].title = newTitle;
  closeEditModal();
  rederizarTarefas(tasks);
});

cancelEditBtn.addEventListener("click", closeEditModal);
