import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

interface UserData {
  username?: string;
  email: string;
  password: string;
}

interface ArticleData {
  title: string;
  content: string;
  category_id: number;
  image: File | null;
}

interface CommentData {
  article_id: number;
  content: string;
}



const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token tidak ditemukan di localStorage");
    throw new Error("Token tidak ditemukan!");
  }
  return token;
};

export const getUser = async () => {
  const token = getToken();

  try {
    const response = await axios.get(`${API_BASE_URL}/auth/user`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Gagal mengambil profil pengguna", error);
    throw new Error("Failed to fetch user data");
  }
};

const handleError = (error: any) => {
  console.error("API Error:", error);
  throw error;
};

const authApi = {
  register: async (userData: UserData) => {
    try {
      return await axios.post(`${API_BASE_URL}/auth/register`, userData);
    } catch (error) {
      handleError(error);
    }
  },

  login: async (userData: UserData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, userData);
      console.log("Login API Response:", response);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response;
    } catch (error) {
      handleError(error);
    }
  },
};

const userApi = {
  getProfile: async () => {
    const token = getToken();
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

const articleApi = {
  getAllArticles: async () => {
    const token = getToken();
    try {
      const response = await axios.get(`${API_BASE_URL}/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getArticleById: async (id: string) => {
    const token = getToken();
    try {
      const response = await axios.get(`${API_BASE_URL}/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  createArticle: async (articleData: ArticleData) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("title", articleData.title);
    formData.append("content", articleData.content);
    formData.append("category_id", articleData.category_id.toString());
    if (articleData.image) {
      formData.append("image", articleData.image);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/articles`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateArticle: async (id: string, articleData: ArticleData) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("title", articleData.title);
    formData.append("content", articleData.content);
    formData.append("category_id", articleData.category_id.toString());
    if (articleData.image) {
      formData.append("image", articleData.image);
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/articles/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  deleteArticle: async (id: string) => {
    const token = getToken();
    try {
      const response = await axios.delete(`${API_BASE_URL}/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

const categoryApi = {
  getAllCategories: async () => {
    const token = getToken();
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

const commentApi = {
  getComments: async (articleId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/comments/${articleId}`);
      return response.data;
    } catch (error) {
      console.error("Gagal mengambil komentar:", error);
      throw error;
    }
  },

  addComment: async (commentData: CommentData) => {
    try {
      const token = getToken();
      const response = await axios.post(`${API_BASE_URL}/comments`, commentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Gagal menambahkan komentar:", error);
      throw error;
    }
  },

  deleteComment: async (commentId: string) => {
    try {
      const token = getToken();
      const response = await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Gagal menghapus komentar:", error);
      throw error;
    }
  },
};


export { authApi, userApi, articleApi, categoryApi, commentApi };
