const addBtn = document.getElementById('addBtn');
const input = document.getElementById('input');
const list = document.getElementById('list');

const tasks = [];

function render() {
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.text;

    if (task.done) {
      li.style.textDecoration = 'line-through';
      li.style.color = '#adb5bd';
    }

    const doneBtn = document.createElement('button');
    doneBtn.textContent = '完了';
    doneBtn.addEventListener('click', () => {
      tasks[index].done = !tasks[index].done;
      render();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      render();
    });

    li.appendChild(doneBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

addBtn.addEventListener('click', () => {
  const text = input.value;
  if (text === '') return;
  tasks.push({ text: text, done: false });
  render();
  input.value = '';
});