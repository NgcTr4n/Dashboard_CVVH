import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import { deleteData, fetchThanhviencontent, uploadDataWithImage } from "../../features/thanhviencontentSlice";

const Thanhviencontent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { thanhviencontent, loading, error } = useAppSelector(
    (state) => state.thanhviencontent
  );
  

  const [title, setTitle] = useState<string>("");
  const [mota, setMota] = useState<string>("");
  const [content1, setContent1] = useState<string>("");
  const [description1, setDescription1] = useState<string>("");
  const [content2, setContent2] = useState<string>("");
  const [description2, setDescription2] = useState<string>("");
  const [banner, setBanner] = useState<File | null>(null);
  const [logo1, setLogo1] = useState<File | null>(null);
  const [logo2, setLogo2] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (banner && logo1 && logo2) {
      dispatch(
        uploadDataWithImage({
            title,
            mota,
            content1,
            description1: description1.split('\n'),
            content2,
            description2: description2.split('\n'),
            banner,
            logo1,
            logo2
           
        })
      );
      // Reset các giá trị input
      setBanner(null);
      setLogo1(null);
      setLogo2(null);

      setTitle("");
      setMota("");
     setContent1("");
     setDescription1("");
     setContent2("");
     setDescription2("");
    }
  };

  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setBanner(selectedFile);
    }
  };
  
  const handleFileChangeLogo1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setLogo1(selectedFile);
    }
  };
  const handleFileChangeLogo2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setLogo2(selectedFile);
    }
  };
  useEffect(() => {
    dispatch(fetchThanhviencontent());
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
            <h2 className="form-heading">Content Thành Viên</h2>
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
                id="content1"
                name="content1"
                type="text"
                required
                className="input-field"
                placeholder="Nhà hàng thủy tạ,.."
                value={content1}
                onChange={(e) => setContent1(e.target.value)}
              />
            </div>
            <div>
                Logo Nhà hàng thủy tạ:{" "}
              <input
                type="file"
                onChange={handleFileChangeLogo1}
                className="custom-file-upload"
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
              <input
                id="content2"
                name="content2"
                type="text"
                required
                className="input-field"
                placeholder="Cà phê vườn đá,.."
                value={content2}
                onChange={(e) => setContent2(e.target.value)}
              />
            </div>
            <div>
                Logo Cà phê vườn đá:{" "}
              <input
                type="file"
                onChange={handleFileChangeLogo2}
                className="custom-file-upload"
              />
            </div>
            <div>
              <textarea
                id="description2"
                name="description2"
                required
                className="input-textarea"
                placeholder="Description 2"
                value={description2}
                onChange={(e) => setDescription2(e.target.value)}
              />
            </div>
           
          
            <div>
                Banner:{" "}
              <input
                type="file"
                onChange={handleFileChange1}
                className="custom-file-upload"
              />
            </div>
           
            <div>
              <button
                type="submit"
                disabled={!banner || !title || !content1 || !description1 || !logo1 || !content2 || !description2 || !logo2 || !mota }
                className="button"
              >
                Add New
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">Thành viên</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Banner</th>
                <th>Title</th>
                <th>Describe</th>
                <th>Content 1</th>
                <th>Description 1</th>
                <th>Content 2</th>
                <th>Description 2</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {thanhviencontent.map((card) => (
                <tr key={card.id}>
                  <td>
                    <img
                      src={card.banner}
                      alt={card.title}
                      width="100%"
                      height="50%"
                      style={{borderRadius: "10px"}}

                    />
                  </td>

                  <td>{card.title}</td>
                  <td>{card.mota}</td>
                  <td> {card.content1} <img src={card.logo1}  width="70px"
                      height="70px" alt="" style={{paddingTop: "5px"}}/> </td>
                  <td>{card.description1}</td>
                  <td> {card.content2} <img src={card.logo2} width="100px"
                      height="50px" style={{paddingTop: "5px"}} alt="" /> </td>
                  <td>{card.description2}</td>
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

export default Thanhviencontent;
