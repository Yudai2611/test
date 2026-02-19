package com.notepad.servlet;

import com.google.gson.Gson;
import com.notepad.dao.UserDao;
import com.notepad.model.User;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;

// 認証用REST APIエンドポイント
public class AuthServlet extends HttpServlet {

    private final UserDao userDao = new UserDao();
    private final Gson gson = new Gson();

    // ログイン・ログアウトの振り分け
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        String path = req.getPathInfo();
        if ("/login".equals(path)) {
            handleLogin(req, resp);
        } else if ("/logout".equals(path)) {
            handleLogout(req, resp);
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    // ログイン処理
    private void handleLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        LoginRequest loginReq = gson.fromJson(sb.toString(), LoginRequest.class);

        User user = userDao.findByUsername(loginReq.username);
        String hashedPassword = UserDao.hashPassword(loginReq.password);

        if (user != null && user.getPassword().equals(hashedPassword)) {
            HttpSession session = req.getSession(true);
            session.setAttribute("username", user.getUsername());
            resp.getWriter().write(gson.toJson(new AuthResponse(true, "ログインしました")));
        } else {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write(gson.toJson(new AuthResponse(false, "ユーザー名またはパスワードが正しくありません")));
        }
    }

    // ログアウト処理
    private void handleLogout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        resp.getWriter().write(gson.toJson(new AuthResponse(true, "ログアウトしました")));
    }

    // ログインリクエスト用クラス
    private static class LoginRequest {
        private String username;
        private String password;
    }

    // 認証レスポンス用クラス
    private static class AuthResponse {
        private final boolean success;
        private final String message;

        private AuthResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }
}
