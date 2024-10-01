import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import {
  deleteData,
  fetchBaomatcontent,
  uploadDataWithImage,
} from "../../features/baomatcontentSlice";

const Baomatcontent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { baomatcontent, loading, error } = useAppSelector(
    (state) => state.baomatcontent
  );

  const [title, setTitle] = useState<string>("");
  const [mota, setMota] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");

 
  const [banner1, setBanner1] = useState<File | null>(null);
  const [banner2, setBanner2] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (banner1 && banner2) {
      dispatch(
        uploadDataWithImage({
          title,
          mota,
          description: description.split("\n"),
          content,
         
          banner1,
          banner2
        })
      );
      // Reset các giá trị input
      setBanner1(null);
      setBanner2(null);

      setTitle("");
      setMota("");
      setDescription("");
      setContent("");
      
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setBanner1(selectedFile);
    }
  };
  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setBanner2(selectedFile);
    }
  };

  useEffect(() => {
    dispatch(fetchBaomatcontent());
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
            <h2 className="form-heading">Content Bảo Mật</h2>
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
                id="mota"
                name="mota"
                type="text"
                required
                className="input-field"
                placeholder="Describe"
                value={mota}
                onChange={(e) => setMota(e.target.value)}
              />
            </div>

            <div>
              <input
                id="content"
                name="content"
                type="text"
                required
                className="input-field"
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
              Banner 1:{" "}
              <input
                type="file"
                onChange={handleFileChange}
                className="custom-file-upload"
              />
            </div>
            <div>
              Banner 2:{" "}
              <input
                type="file"
                onChange={handleFileChange1}
                className="custom-file-upload"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={!banner1 || !title}
                className="button"
              >
                Add New
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">Cá chép nhào lộn</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Banner 1</th>
                <th>Banner 2</th>
                <th>Title</th>
                <th>Describe</th>
                <th>Content</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {baomatcontent.map((card) => (
                <tr key={card.id}>
                  <td>
                    <img
                      src={card.banner1}
                      alt={card.title}
                      width="100%"
                      height="50%"
                      style={{ borderRadius: "10px" }}
                    />
                  </td>
                  <td>
                    <img
                      src={card.banner2}
                      alt={card.title}
                      width="100%"
                      height="50%"
                      style={{ borderRadius: "10px" }}
                    />
                  </td>
                  <td>{card.title}</td>
                  <td>{card.mota}</td>
                  <td>{card.content}</td>
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

export default Baomatcontent;
