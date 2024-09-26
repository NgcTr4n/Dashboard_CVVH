import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { deleteData, uploadDataWithImage } from "../../features/sukienSlice"; // Thay đổi từ uploadData sang uploadDataWithImage
import Layout from "../../layout";
import "../form.css";
import { fetchWatershows } from "../../features/sukienSlice";

const Watershow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { watershow, loading, error } = useAppSelector(
    (state) => state.watershow
  );
  

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (file && title && description && link && date) {
      dispatch(
        uploadDataWithImage({
          file,
          title,
          description,
          link,
          date,
        })
      );
      // Reset các giá trị input
      setFile(null);
      setTitle("");
      setDescription("");
      setLink("");
      setDate("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    dispatch(fetchWatershows());
  }, [dispatch]);

  useEffect(() => {
    console.log("Redux State - watershow: ", watershow); // Kiểm tra dữ liệu Redux
  }, [watershow]);
  const handleDelete = (id: string) => {
    dispatch(deleteData(id)); // Gọi hàm deleteData
  };
  if (!watershow || watershow.length === 0) {
    return <div>No items found.</div>;
  }

  return (
    <Layout>
      <div className="app-container">
        <div className="form-container">
          <div>
            <h2 className="form-heading">Add New CardList Watershow</h2>
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
                id="link"
                name="link"
                type="text"
                required
                className="input-field"
                placeholder="Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div>
              <input
                id="date"
                name="date"
                type="date"
                required
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <input
                type="file"
                onChange={handleFileChange}
                className="custom-file-upload"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={!file || !title || !description || !link || !date}
                className="button"
              >
                Add New CardList
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">CardList Watershow Data</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Link</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {watershow.map((card) => (
                <tr key={card.id}>
                  <td>
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      width="50"
                      height="50"
                    />
                  </td>
                  <td>{card.title}</td>
                  <td>{card.description}</td>
                  <td>{card.link}</td>
                  <td>{card.date}</td>
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

export default Watershow;
