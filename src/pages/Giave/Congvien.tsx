import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import {
  deleteData,
  fetchCongviencontent,
  uploadDataWithImage,
} from "../../features/congviencontentSlice";

const Congvien: React.FC = () => {
  const dispatch = useAppDispatch();
  const { congviencontent, loading, error } = useAppSelector(
    (state) => state.congviencontent
  );

  const [title, setTitle] = useState<string>("");
  const [mota, setMota] = useState<string>("");
//   const [note, setNote] = useState<string>("");

//   const [content1, setContent1] = useState<string>("");
//   const [content2, setContent2] = useState<string>("");
//   const [content3, setContent3] = useState<string>("");
//   const [content4, setContent4] = useState<string>("");
//   const [content5, setContent5] = useState<string>("");
//   const [content6, setContent6] = useState<string>("");
//   const [content7, setContent7] = useState<string>("");
//   const [content8, setContent8] = useState<string>("");
//   const [content9, setContent9] = useState<string>("");
  const [banner, setBanner] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (banner) {
      dispatch(
        uploadDataWithImage({
          title,
          mota,
        //   note,
        //   content1,
        //   content2,
        //   content3,
        //   content4,
        //   content5,
        //   content6,
        //   content7,
        //   content8,
          banner,
        })
      );
      // Reset các giá trị input
      setBanner(null);

      setTitle("");
      setMota("");
    //   setNote("");
    //   setContent1("");
    //   setContent2("");
    //   setContent3("");
    //   setContent4("");
    //   setContent5("");
    //   setContent6("");
    //   setContent7("");
    //   setContent8("");
    //   setContent9("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setBanner(selectedFile);
    }
  };

  useEffect(() => {
    dispatch(fetchCongviencontent());
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
            <h2 className="form-heading">Content Vé trong công viên</h2>
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
              Banner:{" "}
              <input
                type="file"
                onChange={handleFileChange}
                className="custom-file-upload"
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
                disabled={!banner || !title}
                className="button"
              >
                Add New
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">Vé trong công viên</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Banner</th>
                <th>Title</th>
                <th>Describe</th>
                {/* <th>Note</th>
                <th>Content</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {congviencontent.map((card) => (
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

export default Congvien;
