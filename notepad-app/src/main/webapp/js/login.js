// ログイン画面のロジック
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const errorMessage = document.getElementById('error-message');

const handleLogin = async (e) => {
  e.preventDefault();
  errorMessage.hidden = true;

  const resp = await fetch('api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value
    })
  });

  const result = await resp.json();
  if (result.success) {
    window.location.href = 'index.html';
  } else {
    errorMessage.textContent = result.message;
    errorMessage.hidden = false;
  }
};

loginForm.addEventListener('submit', handleLogin);
