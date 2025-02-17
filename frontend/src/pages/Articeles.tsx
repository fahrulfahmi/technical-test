import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { articleApi, categoryApi } from "../api/apiService"; // Pastikan API sudah diimport

const AddArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAllCategories();
      console.log("Categories fetched:", data);
      if (data) {
        setCategories(data); // Pastikan data kategori sesuai
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setLoading(true);
  //     setError(null);

  //     console.log('Selected Category ID:', categoryId);

  //     const formData = new FormData();
  //     formData.append("title", title);
  //     formData.append("content", content);
  //     // formData.append("category_id", categoryId);
  //     formData.append("category_id", categoryId.toString());

  //   if (image) {  // Pastikan ini dibungkus dengan {}
  //     console.log('Image:', image);
  //     formData.append("image", image);
  //   } else {
  //     console.error("Image is missing");
  //     setError("Image is required");
  //     setLoading(false);
  //     return;
  //   }
  //   try {
  //     await articleApi.createArticle(formData);
  //     navigate("/"); // Redirect ke home setelah sukses
  //   } catch (err) {
  //     setError("Gagal menambahkan artikel");
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simple form validation
    if (!title || !content || !categoryId || !image) {
      setError("Please fill all fields and add an image.");
      setLoading(false);
      return;
    }

    console.log("Selected Category ID:", categoryId);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category_id", categoryId.toString()); // Ensure categoryId is converted to string

    if (image) {
      console.log("Image:", image);
      formData.append("image", image); // Append the image to FormData
    } else {
      console.error("Image is missing");
      setError("Image is required");
      setLoading(false);
      return;
    }

    try {
      await articleApi.createArticle(formData); // Send formData to API
      navigate("/"); // Redirect to homepage after success
    } catch (err) {
      setError("Failed to add article.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Article</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          {/* <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select> */}
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_category} {/* Menampilkan name_category */}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-40 h-40 object-cover rounded-lg"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddArticle;
