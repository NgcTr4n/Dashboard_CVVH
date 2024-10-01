import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import {
  deleteData,
  fetchVedichvusubcontent,
  uploadDataWithImage,
} from "../../features/vedichvusubcontentSlice";

const Dichvusub: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vedichvusubcontent, loading, error } = useAppSelector(
    (state) => state.vedichvusubcontent
  );

  const [title1, setTitle1] = useState<string>("");
  const [title2, setTitle2] = useState<string>("");
  const [title3, setTitle3] = useState<string>("");

  const [note1, setNote1] = useState<string>("");
  const [note2, setNote2] = useState<string>("");

  const [description1, setDescription1] = useState<string>("");
  const [description3, setDescription3] = useState<string>("");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (title1) {
      dispatch(
        uploadDataWithImage({
          title1,
          title2,
          title3,
          note1,
          note2,
          description1: description1.split("\n"),
          description3: description3.split("\n"),
        })
      );
      // Reset các giá trị input
      setTitle1("");
      setTitle2("");
      setTitle3("");
      setNote1("");
      setNote2("");
      setDescription1("");
      setDescription3("");
    }
  };

  useEffect(() => {
    dispatch(fetchVedichvusubcontent());
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
            <h2 className="form-heading">Content Vé dịch vụ</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleUpload}>
            <div>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="input-field"
                placeholder="Title 1"
                value={title1}
                onChange={(e) => setTitle1(e.target.value)}
              />
            </div>
            <div>
              <input
                id="mota"
                name="mota"
                type="text"
                required
                className="input-field"
                placeholder="Note 1"
                value={note1}
                onChange={(e) => setNote1(e.target.value)}
              />
            </div>
            <div>
              <textarea
                id="description"
                name="description"
                required
                className="input-textarea"
                placeholder="Description 1"
                value={description1}
                onChange={(e) => setDescription1(e.target.value)}
              />
            </div>
          
            <div>
              <input
                id="title"
                name="title"
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
                id="mota"
                name="mota"
                type="text"
                required
                className="input-field"
                placeholder="Note 2"
                value={note2}
                onChange={(e) => setNote2(e.target.value)}
              />
            </div>
            <div>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="input-field"
                placeholder="Title 3"
                value={title3}
                onChange={(e) => setTitle3(e.target.value)}
              />
            </div>
            <div>
              <textarea
                id="description"
                name="description"
                required
                className="input-textarea"
                placeholder="Description 3"
                value={description3}
                onChange={(e) => setDescription3(e.target.value)}
              />
            </div>
            <div>
              <button type="submit" disabled={!title1} className="button">
                Add New
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">Vé dịch vụ</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title 1</th>
                <th>Note 1</th>
                <th>Description 1</th>
                <th>Title 2</th>
                <th>Note 2</th>
                <th>Title 3</th>
                <th>Description 2</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vedichvusubcontent.map((card) => (
                <tr key={card.id}>
                  <td>{card.title1}</td>
                  <td>{card.note1}</td>
                  <td>{card.description1}</td>
                  <td>{card.title2}</td>
                  <td>{card.note2}</td>
                  <td>{card.title3}</td>

                  <td>{card.description3}</td>
                  {/* <td>
                    <ul>
                      <li>{card.content1}</li>
                      <li>{card.content2}</li>
                      <li>{card.content3}</li>
                      <li>{card.content4}</li>
                      <li>{card.content5}</li>
                      <li>{card.content6}</li>
                      <li>{card.content7}</li>
                      <li>{card.content8}</li>
                    </ul>
                  </td> */}

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

export default Dichvusub;
