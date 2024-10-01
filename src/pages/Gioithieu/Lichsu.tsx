import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { deleteData, updateData, uploadDataWithImage } from "../../features/lichsuSlice"; // Thay đổi từ uploadData sang uploadDataWithImage
import Layout from "../../layout";
import "../form.css";
import { fetchServices } from "../../features/lichsuSlice";

const Lichsu: React.FC = () => {
  const dispatch = useAppDispatch();
  const { services, loading, error } = useAppSelector(
    (state) => state.services
  );
  

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && title && color && file) {
      if (editId) {
        dispatch(
          updateData({
            id: editId,
            title,
            color,
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
            color,
            description,
          })
        );
      }
      setTitle("");
      setDescription("");
      setColor("");
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
    dispatch(fetchServices());
  }, [dispatch]);


  const handleDelete = (id: string) => {
    dispatch(deleteData(id)); // Gọi hàm deleteData
  };
  if (!services || services.length === 0) {
    return <div>No items found.</div>;
  }
 

  return (
    <Layout>
      <div className="app-container">
        <div className="form-container">
          <div>
            <h2 className="form-heading">Add New Services</h2>
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
                id="color"
                name="color"
                type="text"
                required
                className="input-field"
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
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
                disabled={!file || !title || !description || !color}
                className="button"
              >
                Add New Services
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">Services Data</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Color</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((card) => (
                <tr key={card.id}>
                  <td>
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      width="50"
                      height="50"
                      style={{borderRadius: "10px"}}

                    />
                  </td>
                  <td>{card.title}</td>
                  <td>{card.description}</td>
                  <td>{card.color}</td>
                  <td>
                  <button
                      onClick={() => handleEdit(card)}
                      className="button"
                    >
                      Edit
                    </button>
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

export default Lichsu;
