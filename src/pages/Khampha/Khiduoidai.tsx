import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import { deleteData, fetchKhiduoidai, uploadDataWithImage } from "../../features/khiduoidaifooterSlice";

const Khiduoidai: React.FC = () => {
  const dispatch = useAppDispatch();
  const { khiduoidai, loading, error } = useAppSelector(
    (state) => state.khiduoidai
  );
  

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (file && title && description && date) {
      dispatch(
        uploadDataWithImage({
          file,
          title,
          description,
          date,
        })
      );
      // Reset các giá trị input
      setFile(null);
      setTitle("");
      setDescription("");
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
    dispatch(fetchKhiduoidai());
  }, [dispatch]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^[0-9/]*$/.test(inputValue) || inputValue === "") {
      setDate(inputValue);
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deleteData(id)); 
  };
  if (!khiduoidai || khiduoidai.length === 0) {
    return <div>No items found.</div>;
  }

  return (
    <Layout>
      <div className="app-container">
        <div className="form-container">
          <div>
            <h2 className="form-heading">Add New CardFooter</h2>
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
                id="date"
                name="date"
                type="text"
                required
                placeholder="DD/MM/YYYY"
                className="input-field"
                value={date}
                onChange={handleDateChange}
                maxLength={10}
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
                disabled={!file || !title || !description || !date}
                className="button"
              >
                Add New CardFooter
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">CardFooter Data</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {khiduoidai.map((card) => (
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

export default Khiduoidai;
