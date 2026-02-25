const addBtn = document.getElementById('addBtn');
const input = document.getElementById('input');
const list = document.getElementById('list');

addBtn.addEventListener('click', () => {
  const text = input.value;

  if (text === '') return;

  const li = document.createElement('li');
  li.textContent = text;

  list.appendChild(li);
  input.value = '';
});