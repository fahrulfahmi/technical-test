import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { articleApi } from "../api/apiService"; // Import API artikel

const Home = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await articleApi.getAllArticles();
      setArticles(response.data || response);
    } catch (err: any) {
      setError("Gagal mengambil artikel");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      setLoading(true);
      try {
        await articleApi.deleteArticle(id);
        setArticles(articles.filter((article) => article.id !== id));
      } catch (err: any) {
        setError("Gagal menghapus artikel");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="ml-10 mt-10">
        <h1 className="text-3xl font-bold">Articles</h1>
        <p>Welcome back! Explore and manage your travel articles.</p>
        <Link to={`/add-article`}>
          <button className="px-3 py-2 text-sm font-medium text-white bg-cyan-500 rounded-lg hover:bg-cyan-700">
            Add Articles
          </button>
        </Link>
      </div>

      {loading && <p className="text-center text-blue-500">Loading articles...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="mt-6 ml-10 mr-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-7">
        {articles.length === 0 ? (
          <p className="text-center text-gray-500">No articles found.</p>
        ) : (
          articles.map((article) => (
            <div key={article.id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
              <img className="rounded-t-lg" src={article.imageUrl} alt={article.title || "Article Image"} />
              <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-700">
                  {article.title}
                </h5>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-500">
                  Created by: {article.username} | Created on: {article.created_at ? new Date(article.created_at).toLocaleDateString() : "Unknown"}
                </p>
                <div className="flex justify-between">
                  <Link
                    to={`/articles/${article.id}`} // Gunakan Link agar tidak me-refresh halaman
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700"
                  >
                    Read more
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
