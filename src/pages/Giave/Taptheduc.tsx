import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import {
  deleteData,
  fetchVetaptheduccontent,
  uploadDataWithImage,
} from "../../features/vetaptheduccontentSlice";

const Taptheduc: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vetaptheduccontent, loading, error } = useAppSelector(
    (state) => state.vetaptheduccontent
  );

  const [title, setTitle] = useState<string>("");
  const [mota, setMota] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [banner1, setBanner1] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (banner1) {
      dispatch(
        uploadDataWithImage({
          title,
          mota,
          description: description.split("\n"),
          banner1,
        })
      );
      // Reset các giá trị input
      setBanner1(null);

      setTitle("");
      setMota("");
      setDescription("")
   
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setBanner1(selectedFile);
    }
  };

  useEffect(() => {
    dispatch(fetchVetaptheduccontent());
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
            <h2 className="form-heading">Content Vé tập thể dục</h2>
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
                disabled={!banner1 || !title}
                className="button"
              >
                Add New
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading"> Vé tập thể dục</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Banner</th>
                <th>Title</th>
                <th>Describe</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vetaptheduccontent.map((card) => (
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

                  <td>{card.title}</td>
                  <td>{card.mota}</td>
                  <td>{card.description}</td>

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

export default Taptheduc;
