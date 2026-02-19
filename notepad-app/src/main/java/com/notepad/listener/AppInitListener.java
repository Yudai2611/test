package com.notepad.listener;

import com.notepad.dao.MemoDao;
import com.notepad.dao.UserDao;
import com.notepad.model.User;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

// アプリケーション起動時にDBテーブルとadminユーザーを初期化するリスナー
public class AppInitListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            Class.forName("org.h2.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("H2ドライバの読み込みに失敗しました", e);
        }

        // テーブル作成
        MemoDao memoDao = new MemoDao();
        memoDao.createTable();

        UserDao userDao = new UserDao();
        userDao.createTable();

        // adminユーザーが存在しなければ作成
        if (userDao.findByUsername("admin") == null) {
            User admin = new User("admin", UserDao.hashPassword("admin"));
            userDao.create(admin);
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // 終了処理なし
    }
}
