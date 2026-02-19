package com.notepad.filter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

// 未ログインユーザーをログイン画面にリダイレクトするフィルター
public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 初期化処理なし
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;
        String path = req.getRequestURI().substring(req.getContextPath().length());

        // 認証不要のパスはスキップ
        if (path.equals("/login.html")
                || path.startsWith("/css/")
                || path.startsWith("/js/")
                || path.startsWith("/api/auth/")) {
            chain.doFilter(request, response);
            return;
        }

        // セッション確認
        HttpSession session = req.getSession(false);
        if (session != null && session.getAttribute("username") != null) {
            chain.doFilter(request, response);
            return;
        }

        // APIリクエストには401を返す
        if (path.startsWith("/api/")) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.getWriter().write("{\"message\":\"認証が必要です\"}");
            return;
        }

        // それ以外はログイン画面にリダイレクト
        resp.sendRedirect(req.getContextPath() + "/login.html");
    }

    @Override
    public void destroy() {
        // 破棄処理なし
    }
}
