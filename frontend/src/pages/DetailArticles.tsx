import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { articleApi, commentApi } from "../api/apiService";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, []);

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await articleApi.getArticleById(id);
      setArticle(response);
    } catch (err) {
      setError("Gagal mengambil artikel");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentApi.getComments(id);
      setComments(response);
    } catch (err) {
      console.error("Gagal mengambil komentar", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await commentApi.addComment({ article_id: Number(id), content: newComment });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Gagal menambahkan komentar", err);
    }
  };

  const handleEditComment = async () => {
    if (!editingComment.content.trim()) return;
    try {
      await commentApi.updateComment(editingComment.id, { content: editingComment.content });
      setEditingComment(null);
      fetchComments();
    } catch (err) {
      console.error("Gagal mengedit komentar", err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentApi.deleteComment(commentId);
      fetchComments();
    } catch (err) {
      console.error("Gagal menghapus komentar", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      {loading && <p className="text-center text-blue-500">Loading article...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {article && (
        <div>
          <img
            src={`http://localhost:5000/uploads/${article.image}`}
            alt={article.title}
            className="w-full h-full object-cover rounded-lg mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{article.title}</h1>
          <p className="text-gray-700 mb-4">{article.content}</p>
          <p className="text-sm text-gray-500">
            Created by: <span className="font-semibold">{article.username}</span> |
            Created on: {new Date(article.created_at).toLocaleDateString()}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            <div className="mb-4">
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={handleAddComment}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
              >
                Add Comment
              </button>
            </div>
            {comments.map((comment) => (
              <div key={comment.id} className="border-b py-2 flex justify-between items-center">
                {editingComment?.id === comment.id ? (
                  <input
                    type="text"
                    className="w-full p-1 border rounded"
                    value={editingComment.content}
                    onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-800">{comment.content}</p>
                )}
                <div className="flex gap-2">
                  {editingComment?.id === comment.id ? (
                    <button
                      onClick={handleEditComment}
                      className="text-blue-500 hover:underline"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingComment(comment)}
                      className="text-yellow-500 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
