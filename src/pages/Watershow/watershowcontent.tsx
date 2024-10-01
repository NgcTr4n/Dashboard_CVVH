import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import {
  deleteData,
  fetchWatershowcontent,
  uploadDataWithImage,
} from "../../features/watershowcontentSlice";

const Watershowcontent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { watershowcontent, loading, error } = useAppSelector(
    (state) => state.watershowcontent
  );

  const [title, setTitle] = useState<string>("");
  const [mota, setMota] = useState<string>("");
//   const [note, setNote] = useState<string>("");

  const [content1, setContent1] = useState<string>("");
  const [content2, setContent2] = useState<string>("");
  const [description1, setDescription1] = useState<string>("");
  const [description2, setDescription2] = useState<string>("");
  const [description3, setDescription3] = useState<string>("");

  const [banner1, setBanner1] = useState<File | null>(null);
  const [banner2, setBanner2] = useState<File | null>(null);
  const [banner3, setBanner3] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (banner1 && banner2 && banner3) {
      dispatch(
        uploadDataWithImage({
            banner1,
            banner2,
            banner3,
            title,
            mota,
            content1,
            content2,
            description1: description1.split('\n'),
            description2: description2.split('\n'),
            description3: description3.split('\n')
         
        })
      );
      // Reset các giá trị input
      setBanner1(null);
      setBanner2(null);
      setBanner3(null);

      setTitle("");
      setMota("");
      setContent1("");
      setContent2("");
      setDescription1("");
      setDescription2("");
      setDescription3("");


    }
  };

  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setBanner1(selectedFile);
    }
  };
  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setBanner2(selectedFile);
    }
  };
  const handleFileChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setBanner3(selectedFile);
    }
  };

  useEffect(() => {
    dispatch(fetchWatershowcontent());
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
            <h2 className="form-heading">Watershow Content</h2>
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
              Banner 1:{" "}
              <input
                type="file"
                onChange={handleFileChange1}
                className="custom-file-upload"
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
              Banner 2:{" "}
              <input
                type="file"
                onChange={handleFileChange2}
                className="custom-file-upload"
              />
            </div>
            <div>
              <input
                id="mota"
                name="mota"
                type="text"
                required
                className="input-field"
                placeholder="Content pic2"
                value={content1}
                onChange={(e) => setContent1(e.target.value)}
              />
            </div>
            <div>
              <textarea
                id="description"
                name="description"
                required
                className="input-textarea"
                placeholder="Description 2"
                value={description2}
                onChange={(e) => setDescription2(e.target.value)}
              />
            </div>
            <div>
              Banner 3:{" "}
              <input
                type="file"
                onChange={handleFileChange3}
                className="custom-file-upload"
              />
            </div>
            <div>
              <input
                id="mota"
                name="mota"
                type="text"
                required
                className="input-field"
                placeholder="Content pic3"
                value={content2}
                onChange={(e) => setContent2(e.target.value)}
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
            {/* <div>
              <input
                id="note"
                name="note"
                type="text"
                required
                className="input-field"
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
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
              <input
                id="content3"
                name="content3"
                type="text"
                required
                className="input-field"
                placeholder="Content 3"
                value={content3}
                onChange={(e) => setContent3(e.target.value)}
              />
            </div>

            <div>
              <input
                id="content4"
                name="content4"
                type="text"
                required
                className="input-field"
                placeholder="Content 4"
                value={content4}
                onChange={(e) => setContent4(e.target.value)}
              />
            </div>

            <div>
              <input
                id="content5"
                name="content5"
                type="text"
                required
                className="input-field"
                placeholder="Content 5"
                value={content5}
                onChange={(e) => setContent5(e.target.value)}
              />
            </div>
            <div>
              <input
                id="content6"
                name="content6"
                type="text"
                required
                className="input-field"
                placeholder="Content 6"
                value={content6}
                onChange={(e) => setContent6(e.target.value)}
              />
            </div>
            <div>
              <input
                id="content7"
                name="content7"
                type="text"
                required
                className="input-field"
                placeholder="Content 7"
                value={content7}
                onChange={(e) => setContent7(e.target.value)}
              />
            </div>
            <div>
              <input
                id="content8"
                name="content8"
                type="text"
                required
                className="input-field"
                placeholder="Content 8"
                value={content8}
                onChange={(e) => setContent8(e.target.value)}
              />
            </div> */}
           
           

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
          <h2 className="table-heading">Watershow Content</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Banner 1</th>
                <th>Title</th>
                <th>Describe</th>
                <th>Description 1</th>

                <th>Banner 2</th>
                <th>Description 2</th>

                <th>Banner 3</th>
                <th>Description 3</th>


                {/* <th>Note</th>
                <th>Content</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {watershowcontent.map((card) => (
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
                  <td>{card.description1}</td>

                  <td>
                    <img
                      src={card.banner2}
                      alt={card.title}
                      width="100%"
                      height="50%"
                      style={{ borderRadius: "10px" }}
                    /> - {card.content1}
                  </td>
                  <td>{card.description2}</td>
                  <td>
                    <img
                      src={card.banner3}
                      alt={card.title}
                      width="100%"
                      height="50%"
                      style={{ borderRadius: "10px" }}
                    /> - {card.content2}
                  </td>
                  <td>{card.description3}</td>

                 
                  {/* <td>{card.note}</td> */}

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

export default Watershowcontent;
