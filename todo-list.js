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

let taskIndexToEdit = null;

const salvarTarefas = (tarefas) => {
  localStorage.setItem("tasks", JSON.stringify(tarefas));
};
const carregarTarefas = () => {
  const tarefasSalvas = localStorage.getItem("tasks");
  return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
};
let tasks = carregarTarefas();
// Formulário
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const taskTitle = taskTitleInput.value.trim();

  if (taskTitle.length < 3) {
    alert("O título da tarefa deve ter pelo menos 3 caracteres");
    return;
  }

  tasks.push({ title: taskTitle, done: false });
  salvarTarefas(tasks);
  document.getElementById("minhas-tarefas").classList.add("com-tarefas");
  rederizarTarefas(tasks);
  taskTitleInput.value = "";
  await mensagemModal("Tarefa adicionada com sucesso!");
});

const rederizarTarefas = (tasks) => {
  todolistUl.innerHTML = "";

  tasks.forEach((task, index) => {
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

    input.addEventListener("change", () => {
      task.done = input.checked;
      salvarTarefas(tasks);
      rederizarTarefas(tasks);
    });

    const divBtn = document.createElement("div");
    li.appendChild(divBtn);
    divBtn.classList.add("div-btn");

    const editBtn = document.createElement("button");
    const icon = document.createElement("span");
    icon.classList.add("material-icons");
    icon.textContent = "edit";
    editBtn.appendChild(icon);
    editBtn.title = "Editar";
    editBtn.addEventListener("click", () => openEditModal(index));
    divBtn.appendChild(editBtn);

    const button = document.createElement("button");
    const iconDelete = document.createElement("span");
    iconDelete.classList.add("material-icons");
    iconDelete.textContent = "delete";
    button.appendChild(iconDelete);
    button.title = "Excluir";
    button.addEventListener("click", async () => {
      tasks.splice(index, 1);
      salvarTarefas(tasks);
      rederizarTarefas(tasks);
      if (tasks.length === 0) {
        document
          .getElementById("minhas-tarefas")
          .classList.remove("com-tarefas");
      }
      await mensagemModal("Tarefa excluída com sucesso!");
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
const mensagemModal = (texto) => {
  return new Promise((resolve) => {
    const mensagem = document.querySelector(".mensagem");
    mensagem.textContent = texto;
    mensagem.style.display = "block";

    setTimeout(() => {
      mensagem.style.display = "none";
      resolve(); // Continua após 2 segundos
    }, 2000);
  });
};

saveEditBtn.addEventListener("click", async () => {
  const newTitle = editTaskInput.value.trim();
  if (newTitle.length < 3) {
    alert("O título da tarefa deve ter pelo menos 3 caracteres");
    return;
  }

  tasks[taskIndexToEdit].title = newTitle;
  salvarTarefas(tasks);
  rederizarTarefas(tasks);
  await mensagemModal("Tarefa atualizada com sucesso!");
  closeEditModal();
});

cancelEditBtn.addEventListener("click", closeEditModal);

document.addEventListener("DOMContentLoaded", () => {
  tasks = carregarTarefas(); // Carrega as tarefas salvas
  rederizarTarefas(tasks);
});
