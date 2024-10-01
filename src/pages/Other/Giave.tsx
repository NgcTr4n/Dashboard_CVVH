import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import {
  deleteData,
  fetchGiave,
  uploadDataWithImage,
} from "../../features/giaveSlice";

const Giavegt: React.FC = () => {
  const dispatch = useAppDispatch();
  const { giave, loading, error } = useAppSelector((state) => state.giave);

  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [bgColor, setBgColor] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("");
  const [svgColor, setSvgColor] = useState<string>("");

  const [link, setLink] = useState<string>("");

  const [imageUrl, setImageUrl] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl) {
      dispatch(
        uploadDataWithImage({
          title,
          price,
          description,
          backgroundColor,
          bgColor,
          textColor,
          svgColor,
          link,
          imageUrl,
        })
      );
      // Reset các giá trị input
      setDescription("");
      setTitle("");
      setBgColor("");
      setPrice("");
      setTextColor("");
      setLink("");
      setImageUrl(null);
    }
  };

  useEffect(() => {
    dispatch(fetchGiave());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteData(id)); // Gọi hàm deleteData
  };
  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImageUrl(selectedFile);
    }
  };
  //   if (!lichsucontent || lichsucontent.length === 0) {
  //     return <div>No items found.</div>;
  //   }

  return (
    <Layout>
      <div className="app-container">
        <div className="form-container">
          <div>
            <h2 className="form-heading">Giá vé - Giới thiệu</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleUpload}>
            <div>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="input-field"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <input
                id="price"
                name="price"
                type="text"
                required
                className="input-field"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <textarea
                id="description"
                name="description"
                required
                className="input-textarea"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <input
                id="backgroundColor"
                name="backgroundColor"
                type="text"
                required
                className="input-field"
                placeholder="backgroundColor"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
            </div>
            <div>
              <input
                id="bgColor"
                name="bgColor"
                type="text"
                required
                className="input-field"
                placeholder="bgColor"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>
            <div>
              <input
                id="textColor"
                name="textColor"
                type="text"
                required
                className="input-field"
                placeholder="textColor"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
            </div>
            <div>
              <input
                id="svgColor"
                name="svgColor"
                type="text"
                required
                className="input-field"
                placeholder="svgColor"
                value={svgColor}
                onChange={(e) => setSvgColor(e.target.value)}
              />
            </div>
            <div>
              <input
                id="link"
                name="link"
                type="text"
                required
                className="input-field"
                placeholder="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div>
               {" "}
              <input
                type="file"
                onChange={handleFileChange1}
                className="custom-file-upload"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={!description }
                className="button"
              >
                Add New
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">Giá vé - Giới thiệu</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {giave.map((card) => (
                <tr key={card.id}>
                  <td>{card.title}</td>
                  <td>{card.description}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(card.id)} // Gọi hàm delete
                      className="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Loading...</div>}
      </div>
    </Layout>
  );
};

export default Giavegt;
