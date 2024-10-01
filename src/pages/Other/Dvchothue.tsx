import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import {
  deleteData,
  fetchDvchothue,
  uploadDataWithImage,
} from "../../features/dvchothueSlice";

const Dvchothue: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dvchothue, loading, error } = useAppSelector(
    (state) => state.dvchothue
  );

  const [chothue, setChothue] = useState<string>("");

  const [gia, setGia] = useState<string>("");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (chothue) {
      dispatch(
        uploadDataWithImage({
          chothue,
          gia: gia.split("\n"),
        })
      );
      // Reset các giá trị input
      setChothue("");
      setGia("");
    }
  };

  useEffect(() => {
    dispatch(fetchDvchothue());
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
            <h2 className="form-heading">Dịch vụ cho thuê</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleUpload}>
            <div>
              <input
                id="chothue"
                name="chothue"
                type="text"
                required
                className="input-field"
                placeholder="Cho Thuê"
                value={chothue}
                onChange={(e) => setChothue(e.target.value)}
              />
            </div>

            <div>
              <textarea
                id="gia"
                name="gia"
                required
                className="input-textarea"
                placeholder="Giá thuê"
                value={gia}
                onChange={(e) => setGia(e.target.value)}
              />
            </div>

            <div>
              <button type="submit" disabled={!chothue} className="button">
                Add New
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">Thông tin bổ sung - Bảo mật</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Cho Thuê</th>
                <th>Giá</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dvchothue.map((card) => (
                <tr key={card.id}>
                  <td>{card.chothue}</td>
                  <td>
                    {" "}
                    {card.gia.map((giaItem, index) => (
                      <span key={index}>
                        {giaItem}
                        <br />
                      </span>
                    ))}
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

export default Dvchothue;
