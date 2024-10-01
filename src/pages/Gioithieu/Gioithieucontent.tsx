import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import {
  deleteData,
  fetchGioithieucontent,
  uploadDataWithImage,
} from "../../features/gioithieucontentSlice";

const Gioithieucontent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { gioithieucontent, loading, error } = useAppSelector(
    (state) => state.gioithieucontent
  );

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

 
  const [banner, setBanner] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (banner) {
      dispatch(
        uploadDataWithImage({
          title,
          description,         
          banner,

        })
      );
      // Reset các giá trị input
      setBanner(null);

      setTitle("");
      setDescription("");
      
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setBanner(selectedFile);
    }
  };


  useEffect(() => {
    dispatch(fetchGioithieucontent());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteData(id)); // Gọi hàm deleteData
  };
  //   if (!lichsucontent || lichsucontent.length === 0) {
  //     return <div>No items found.</div>;
  //   }

  return (
    <Layout>
      <div className="app-container">
        <div className="form-container">
          <div>
            <h2 className="form-heading">Content Giới Thiệu</h2>
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
                placeholder="Description 1"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              Banner:{" "}
              <input
                type="file"
                onChange={handleFileChange}
                className="custom-file-upload"
              />
            </div>
          

            <div>
              <button
                type="submit"
                disabled={!banner || !title}
                className="button"
              >
                Add New
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">Giới thiệu</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Banner</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gioithieucontent.map((card) => (
                <tr key={card.id}>
                  <td>
                    <img
                      src={card.banner}
                      alt={card.title}
                      width="100%"
                      height="50%"
                      style={{ borderRadius: "10px" }}
                    />
                  </td>
                
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

export default Gioithieucontent;
