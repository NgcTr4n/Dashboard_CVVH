import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { deleteData, updateData, uploadDataWithImage } from "../../features/sukiensliderSlice";
import Layout from "../../layout";
import "../form.css";
import { fetchSukienSlider } from "../../features/sukiensliderSlice";

const Cardslider: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sukienslider, loading, error } = useAppSelector(
    (state) => state.sukienslider
  );

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && title && file) {
      if (editId) {
        dispatch(
          updateData({
            id: editId,
            title,
            description,
            file,
          })
        );
        setEditId(null); 
      } else {
        dispatch(
          uploadDataWithImage({
            file,
            title,
            description,
          })
        );
      }
      setTitle("");
      setDescription("");
      setFile(null); 
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  const handleEdit = (item: any) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditId(item.id); 
  };
  
  useEffect(() => {
    dispatch(fetchSukienSlider());
  }, [dispatch]);

  useEffect(() => {
    console.log("Redux State - watershow: ", sukienslider);
  }, [sukienslider]);

  const handleDelete = (id: string) => {
    dispatch(deleteData(id));
  };

  if (!sukienslider || sukienslider.length === 0) {
    return <div>No items found.</div>;
  }

  return (
    <Layout>
      <div className="app-container">
        <div className="form-container">
          <h2 className="form-heading">Add New CardSlider Watershow</h2>
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
                type="file"
                onChange={handleFileChange}
                className="custom-file-upload"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={!file || !title || !description}
                className="button"
              >
                Add New CardSlider
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">CardSlider Watershow Data</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sukienslider.map((card) => (
                <tr key={card.id}>
                  <td>
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      width="50"
                      height="50"
                      style={{ borderRadius: "10px" }}
                    />
                  </td>
                  <td>{card.title}</td>
                  <td>{card.description}</td>
                  <td>
                  <button
                      onClick={() => handleEdit(card)}
                      className="button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
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

export default Cardslider;
