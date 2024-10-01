import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import {
  deleteData,
  fetchKhiduoidaicontent,
  uploadDataWithImage,
} from "../../features/khiduoidaicontentSlice";

const Khiduoidaicontent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { khiduoidaicontent, loading, error } = useAppSelector(
    (state) => state.khiduoidaicontent
  );

  const [title, setTitle] = useState<string>("");
  const [mota, setMota] = useState<string>("");
  const [description1, setDescription1] = useState<string>("");
  const [description2, setDescription2] = useState<string>("");
  const [description3, setDescription3] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [content1, setContent1] = useState<string>("");
  const [content2, setContent2] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const [banner, setBanner] = useState<File | null>(null);
  const [khi1, setKhi1] = useState<File | null>(null);
  const [khi2, setKhi2] = useState<File | null>(null);
  const [khi3, setKhi3] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (banner && khi1 && khi2 && khi3) {
      dispatch(
        uploadDataWithImage({
          title,
          mota,
          content,
          description1: description1.split("\n"),
          description2: description2.split("\n"),
          description3: description3.split("\n"),
          content1,
          content2,
          date,
          banner,
          khi1,
          khi2,
          khi3,
        })
      );
      // Reset các giá trị input
      setBanner(null);
      setKhi1(null);
      setKhi2(null);
      setKhi3(null);

      setTitle("");
      setMota("");
      setDescription1("");
      setDescription2("");
      setDescription3("");
      setContent1("");
      setContent2("");
      setDate("");
      setContent("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setBanner(selectedFile);
    }
  };
  const handleFileChangeKhi1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setKhi1(selectedFile);
    }
  };
  const handleFileChangeKhi2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setKhi2(selectedFile);
    }
  };
  const handleFileChangeKhi3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setKhi3(selectedFile);
    }
  };

  useEffect(() => {
    dispatch(fetchKhiduoidaicontent());
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
            <h2 className="form-heading">Content Khỉ đuôi dài</h2>
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
                placeholder="Mô tả"
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
              Monkey 01:{" "}
              <input
                type="file"
                onChange={handleFileChangeKhi1}
                className="custom-file-upload"
              />
            </div>
            <div>
              <input
                id="content1"
                name="content1"
                type="text"
                required
                className="input-field"
                placeholder="Content 1"
                value={content1}
                onChange={(e) => setContent1(e.target.value)}
              />
            </div>
            <div>
              <textarea
                id="description1"
                name="description1"
                required
                className="input-textarea"
                placeholder="Description Monkey 1"
                value={description1}
                onChange={(e) => setDescription1(e.target.value)}
              />
            </div>
            <div>
              Monkey 02:{" "}
              <input
                type="file"
                onChange={handleFileChangeKhi2}
                className="custom-file-upload"
              />
            </div>
            <div>
              <textarea
                id="description2"
                name="description2"
                required
                className="input-textarea"
                placeholder="Description Monkey 2"
                value={description2}
                onChange={(e) => setDescription2(e.target.value)}
              />
            </div>
            <div>
              Monkey 03:{" "}
              <input
                type="file"
                onChange={handleFileChangeKhi3}
                className="custom-file-upload"
              />
            </div>
            <div>
              <input
                id="content2"
                name="content2"
                type="text"
                required
                className="input-field"
                placeholder="Content 2"
                value={content2}
                onChange={(e) => setContent2(e.target.value)}
              />
            </div>
            <div>
              <textarea
                id="description3"
                name="description3"
                required
                className="input-textarea"
                placeholder="Description Monkey 3"
                value={description3}
                onChange={(e) => setDescription3(e.target.value)}
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
                disabled={
                  !banner ||
                  !title ||
                  !description1 ||
                  !description2 ||
                  !description3 ||
                  !content1 ||
                  !content2 ||
                  !content ||
                  !mota
                }
                className="button"
              >
                Add New
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">Khỉ đuôi dài</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Banner</th>
                <th>Title</th>
                <th>Describe</th>
                <th>Content</th>
                <th>Date</th>
                <th>Content Monkey 1</th>
                <th>Description Monkey 1</th>
                <th>Content Monkey 2</th>
                <th>Description Monkey 2</th>
                <th>Content Monkey 3</th>
                <th>Description Monkey 3</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {khiduoidaicontent.map((card) => (
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
                  <td>{card.mota}</td>
                  <td>{card.content}</td>
                  <td>{card.date}</td>
                  <td>
                    {card.content1}{" "}
                    <img
                      src={card.khi1}
                      width={"70px"}
                      height={"70px"}
                      alt=""
                      style={{paddingTop:'5px'}}

                    />
                  </td>

                  <td>{card.description1}</td>
                  <td>
                    {" "}
                    <img
                      src={card.khi2}
                      width={"70px"}
                      height={"70px"}
                      alt=""
                      style={{paddingTop:'5px'}}

                    />
                  </td>
                  <td>{card.description2}</td>
                  <td>
                    {card.content2}{" "}
                    <img
                      src={card.khi3}
                      width={"70px"}
                      height={"70px"}
                      alt=""
                      style={{paddingTop:'5px'}}
                    />
                  </td>

                  <td>{card.description3}</td>
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

export default Khiduoidaicontent;
