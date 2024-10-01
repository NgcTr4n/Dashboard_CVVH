import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import {
  deleteData,
  fetchTapthecontent,
  uploadDataWithImage,
} from "../../features/tapthecontentSlice";

const Tapthe: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tapthecontent, loading, error } = useAppSelector(
    (state) => state.tapthecontent
  );

  const [title, setTitle] = useState<string>("");
  const [mota, setMota] = useState<string>("");
  const [description1, setDescription1] = useState<string>("");
  const [description2, setDescription2] = useState<string>("");
  const [list1, setList1] = useState<string>("");
  const [list2, setList2] = useState<string>("");
  const [list3, setList3] = useState<string>("");
  const [list4, setList4] = useState<string>("");

  const [content1, setContent1] = useState<string>("");
  const [content2, setContent2] = useState<string>("");
  const [content3, setContent3] = useState<string>("");
  const [content4, setContent4] = useState<string>("");

  const [diachi, setDiachi] = useState<string>("");
  const [sodt, setSodt] = useState<string>("");
  const [banner, setBanner] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (banner) {
      dispatch(
        uploadDataWithImage({
            title,
            mota,
            description1: description1.split('\n'),
            list1,
            content1: content1.split('\n'),
            list2,
            content2,
            list3,
            content3: content3.split('\n'),
            list4,
            content4,
            description2,
            diachi,
            sodt,
          banner,
        })
      );
      // Reset các giá trị input
      setBanner(null);

      setTitle("");
      setMota("");
      setDescription1("");
      setDescription2("");
      setList1("");
      setList2("");
      setList3("");
      setList4("");
      setContent1("");
      setContent2("");
      setContent3("");
      setContent4("");
      setDiachi("");
      setSodt("");
     
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setBanner(selectedFile);
    }
  };

  useEffect(() => {
    dispatch(fetchTapthecontent());
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
            <h2 className="form-heading">Content Tập thể</h2>
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
                id="description1"
                name="description1"
                required
                className="input-textarea"
                placeholder="Description 1"
                value={description1}
                onChange={(e) => setDescription1(e.target.value)}
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
              <input
                id="list1"
                name="list1"
                type="text"

                required
                className="input-field"
                placeholder="List 1 "
                value={list1}
                onChange={(e) => setList1(e.target.value)}
              />
            </div>        
            <div>
              <textarea
                id="content1"
                name="content1"
                required
                className="input-textarea"
                placeholder="Content 1"
                value={content1}
                onChange={(e) => setContent1(e.target.value)}
              />
            </div>
            <div>
              <input
                id="list2"
                name="list2"
                type="text"
                required
                className="input-field"
                placeholder="List 2 "
                value={list2}
                onChange={(e) => setList2(e.target.value)}
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
                id="list3"
                name="list3"
                type="text"
                required
                className="input-field"
                placeholder="List 3 "
                value={list3}
                onChange={(e) => setList3(e.target.value)}
              />
            </div>        
            <div>
              <textarea
                id="content3"
                name="content3"
                required
                className="input-textarea"
                placeholder="Content 3"
                value={content3}
                onChange={(e) => setContent3(e.target.value)}
              />
            </div>
            <div>
              <input
                id="list4"
                name="list4"
                type="text"
                required
                className="input-field"
                placeholder="List 4"
                value={list4}
                onChange={(e) => setList4(e.target.value)}
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
                id="description2"
                name="description2"
                type="text"
                required
                className="input-field"
                placeholder="Description ĐẶT TOUR – SỰ KIỆN – TIỆC"
                value={description2}
                onChange={(e) => setDescription2(e.target.value)}
              />
            </div>
            <div>
              <input
                id="diachi"
                name="diachi"
                type="text"
                required
                className="input-field"
                placeholder="Địa chỉ"
                value={diachi}
                onChange={(e) => setDiachi(e.target.value)}
              />
            </div>
            <div>
              <input
                id="sodt"
                name="sodt"
                type="text"
                required
                className="input-field"
                placeholder="Số điện thoại"
                value={sodt}
                onChange={(e) => setSodt(e.target.value)}
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
          <h2 className="table-heading">Tập thể</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Banner</th>
                <th>Title</th>
                <th>Describe</th>
                <th>Description</th>
                <th>Content</th>
                <th>Description Footer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tapthecontent.map((card) => (
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
                  <td>{card.description1}</td>

                  <td>
                    <ul>
                      <li>{card.list1}-{card.content1}</li>
                      <li>{card.list2}-{card.content2}</li>
                      <li>{card.list3}-{card.content3}</li>
                      <li>{card.list4}-{card.content4}</li>
                    </ul>
                  </td>
                  <td>
                    {card.description2} <br />
                    - {card.diachi} <br />
                    - {card.sodt}
                  </td>

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

export default Tapthe;
