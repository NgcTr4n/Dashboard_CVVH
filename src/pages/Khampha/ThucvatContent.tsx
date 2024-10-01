import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import {
  deleteData,
  fetchThucvatcontent,
  uploadDataWithImage,
} from "../../features/thucvatcontentSlice";

const Thucvatcontent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { thucvatcontent, loading, error } = useAppSelector(
    (state) => state.thucvatcontent
  );

  const [title, setTitle] = useState<string>("");
  const [title2, setTitle2] = useState<string>("");
  const [mota, setMota] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const [banner, setBanner] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (banner) {
      dispatch(
        uploadDataWithImage({
          title,
          title2,
          description: description.split("\n"),
          content,
          date,
          banner,
        })
      );
      // Reset các giá trị input
      setBanner(null);

      setTitle("");
      setTitle2("");
      setDescription("");
      setContent("");
      setDate("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setBanner(selectedFile);
    }
  };

  useEffect(() => {
    dispatch(fetchThucvatcontent());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteData(id)); // Gọi hàm deleteData
  };
  //   if (!lichsucontent || lichsucontent.length === 0) {
  //     return <div>No items found.</div>;
  //   }
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^[0-9/]*$/.test(inputValue) || inputValue === "") {
      setDate(inputValue);
    }
  };
  return (
    <Layout>
      <div className="app-container">
        <div className="form-container">
          <div>
            <h2 className="form-heading">Content Thực vật</h2>
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
                id="title2"
                name="title2"
                type="text"
                required
                className="input-field"
                placeholder="Title 2"
                value={title2}
                onChange={(e) => setTitle2(e.target.value)}
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
                disabled={!banner || !title || !title2 || !description}
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
                <th>Banner</th>
                <th>Title</th>
                <th>Title 2</th>
                <th>Content</th>
                <th>Date</th>

                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {thucvatcontent.map((card) => (
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
                  <td>{card.title2}</td>
                  <td>{card.content}</td>
                  <td>{card.date}</td>

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

export default Thucvatcontent;
