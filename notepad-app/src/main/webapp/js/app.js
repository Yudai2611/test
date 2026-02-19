// メモ帳アプリのフロントエンドロジック
const API_URL = 'api/memos';

const memoList = document.getElementById('memo-list');
const emptyMessage = document.getElementById('empty-message');
const editorSection = document.getElementById('editor-section');
const editorTitle = document.getElementById('editor-title');
const memoForm = document.getElementById('memo-form');
const memoIdInput = document.getElementById('memo-id');
const memoTitleInput = document.getElementById('memo-title-input');
const memoContentInput = document.getElementById('memo-content-input');
const newMemoBtn = document.getElementById('new-memo-btn');
const cancelBtn = document.getElementById('cancel-btn');
const logoutBtn = document.getElementById('logout-btn');

// メモ一覧を取得して表示
const loadMemos = async () => {
  const resp = await fetch(API_URL);
  const memos = await resp.json();
  renderMemoList(memos);
};

// メモ一覧のDOM描画
const renderMemoList = (memos) => {
  memoList.innerHTML = '';
  if (memos.length === 0) {
    emptyMessage.hidden = false;
    return;
  }
  emptyMessage.hidden = true;
  memos.forEach((memo) => {
    const li = document.createElement('li');
    li.className = 'memo-list-item';
    li.innerHTML = `
      <div class="memo-item-header">
        <span class="memo-item-title">${escapeHtml(memo.title)}</span>
        <span class="memo-item-date">${formatDate(memo.updatedAt)}</span>
      </div>
      <div class="memo-item-preview">${escapeHtml(memo.content || '')}</div>
    `;
    li.addEventListener('click', () => openEditor(memo));
    memoList.appendChild(li);
  });
};

// エディタを開く（新規 or 編集）
const openEditor = (memo = null) => {
  editorSection.hidden = false;
  if (memo) {
    editorTitle.textContent = 'メモを編集';
    memoIdInput.value = memo.id;
    memoTitleInput.value = memo.title;
    memoContentInput.value = memo.content || '';
  } else {
    editorTitle.textContent = '新規メモ';
    memoIdInput.value = '';
    memoTitleInput.value = '';
    memoContentInput.value = '';
  }
  memoTitleInput.focus();
};

// エディタを閉じる
const closeEditor = () => {
  editorSection.hidden = true;
  memoForm.reset();
};

// メモの保存（作成 or 更新）
const saveMemo = async (e) => {
  e.preventDefault();
  const id = memoIdInput.value;
  const memo = {
    title: memoTitleInput.value,
    content: memoContentInput.value
  };

  if (id) {
    // 更新
    memo.id = parseInt(id, 10);
    await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memo)
    });
  } else {
    // 新規作成
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memo)
    });
  }

  closeEditor();
  loadMemos();
};

// メモの削除
const deleteMemo = async (id) => {
  if (!confirm('このメモを削除しますか？')) {
    return;
  }
  await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
  closeEditor();
  loadMemos();
};

// HTML特殊文字のエスケープ
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// 日付のフォーマット
const formatDate = (dateStr) => {
  if (!dateStr) {
    return '';
  }
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}/${m}/${d} ${h}:${min}`;
};

// ログアウト処理
const logout = async () => {
  await fetch('api/auth/logout', { method: 'POST' });
  window.location.href = 'login.html';
};

// イベントリスナー登録
newMemoBtn.addEventListener('click', () => openEditor());
cancelBtn.addEventListener('click', closeEditor);
memoForm.addEventListener('submit', saveMemo);
logoutBtn.addEventListener('click', logout);

// 初期表示
loadMemos();
