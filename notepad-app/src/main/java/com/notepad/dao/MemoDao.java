package com.notepad.dao;

import com.notepad.model.Memo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

// メモのデータアクセスオブジェクト
public class MemoDao {

    private static final String DB_URL = "jdbc:h2:./data/notepad";
    private static final String DB_USER = "sa";
    private static final String DB_PASSWORD = "";

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }

    // テーブル作成
    public void createTable() {
        String sql = "CREATE TABLE IF NOT EXISTS memos ("
                + "id INT AUTO_INCREMENT PRIMARY KEY, "
                + "title VARCHAR(255) NOT NULL, "
                + "content TEXT, "
                + "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "
                + "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
                + ")";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.execute();
        } catch (SQLException e) {
            throw new RuntimeException("テーブル作成に失敗しました", e);
        }
    }

    // メモ一覧取得
    public List<Memo> findAll() {
        String sql = "SELECT * FROM memos ORDER BY updated_at DESC";
        List<Memo> memos = new ArrayList<>();
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                memos.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("メモ一覧の取得に失敗しました", e);
        }
        return memos;
    }

    // メモ1件取得
    public Memo findById(int id) {
        String sql = "SELECT * FROM memos WHERE id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("メモの取得に失敗しました", e);
        }
        return null;
    }

    // メモ作成
    public Memo create(Memo memo) {
        String sql = "INSERT INTO memos (title, content) VALUES (?, ?)";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, memo.getTitle());
            ps.setString(2, memo.getContent());
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    return findById(keys.getInt(1));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("メモの作成に失敗しました", e);
        }
        return null;
    }

    // メモ更新
    public Memo update(Memo memo) {
        String sql = "UPDATE memos SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, memo.getTitle());
            ps.setString(2, memo.getContent());
            ps.setInt(3, memo.getId());
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("メモの更新に失敗しました", e);
        }
        return findById(memo.getId());
    }

    // メモ削除
    public void delete(int id) {
        String sql = "DELETE FROM memos WHERE id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("メモの削除に失敗しました", e);
        }
    }

    // ResultSetからMemoオブジェクトへのマッピング
    private Memo mapRow(ResultSet rs) throws SQLException {
        Memo memo = new Memo();
        memo.setId(rs.getInt("id"));
        memo.setTitle(rs.getString("title"));
        memo.setContent(rs.getString("content"));
        memo.setCreatedAt(rs.getTimestamp("created_at"));
        memo.setUpdatedAt(rs.getTimestamp("updated_at"));
        return memo;
    }
}
