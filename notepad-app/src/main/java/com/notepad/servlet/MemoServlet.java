package com.notepad.servlet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.notepad.dao.MemoDao;
import com.notepad.model.Memo;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

// メモのREST APIエンドポイント
public class MemoServlet extends HttpServlet {

    private final MemoDao memoDao = new MemoDao();
    private final Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss").create();

    // メモ一覧取得 / メモ1件取得
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setJsonResponse(resp);
        String idParam = req.getParameter("id");
        if (idParam != null) {
            Memo memo = memoDao.findById(Integer.parseInt(idParam));
            if (memo == null) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write(gson.toJson(new ErrorResponse("メモが見つかりません")));
                return;
            }
            resp.getWriter().write(gson.toJson(memo));
        } else {
            List<Memo> memos = memoDao.findAll();
            resp.getWriter().write(gson.toJson(memos));
        }
    }

    // メモ新規作成
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setJsonResponse(resp);
        Memo memo = parseBody(req);
        Memo created = memoDao.create(memo);
        resp.setStatus(HttpServletResponse.SC_CREATED);
        resp.getWriter().write(gson.toJson(created));
    }

    // メモ更新
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setJsonResponse(resp);
        Memo memo = parseBody(req);
        Memo updated = memoDao.update(memo);
        if (updated == null) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write(gson.toJson(new ErrorResponse("メモが見つかりません")));
            return;
        }
        resp.getWriter().write(gson.toJson(updated));
    }

    // メモ削除
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setJsonResponse(resp);
        String idParam = req.getParameter("id");
        if (idParam == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(gson.toJson(new ErrorResponse("IDが指定されていません")));
            return;
        }
        memoDao.delete(Integer.parseInt(idParam));
        resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    // レスポンスのContent-TypeをJSONに設定
    private void setJsonResponse(HttpServletResponse resp) {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
    }

    // リクエストボディからMemoオブジェクトを生成
    private Memo parseBody(HttpServletRequest req) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        return gson.fromJson(sb.toString(), Memo.class);
    }

    // エラーレスポンス用クラス
    private static class ErrorResponse {
        private final String message;

        private ErrorResponse(String message) {
            this.message = message;
        }
    }
}
