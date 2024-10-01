import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import {
  deleteData,
  fetchThongtinbosung,
  uploadDataWithImage,
} from "../../features/thongtinbosungcontentSlice";

const Thongtinbosung: React.FC = () => {
  const dispatch = useAppDispatch();
  const { thongtinbosung, loading, error } = useAppSelector(
    (state) => state.thongtinbosung
  );


  const [description, setDescription] = useState<string>("");


  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (description) {
      dispatch(
        uploadDataWithImage({
          
          description: description.split('\n'),
        
        })
      );
      // Reset các giá trị input
    
      setDescription("");
    }
  };

 

  useEffect(() => {
    dispatch(fetchThongtinbosung());
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
            <h2 className="form-heading">Thông tin bổ sung - Bảo mật</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleUpload}>
          
           
            
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
              <button
                type="submit"
                disabled={!description}
                className="button"
              >
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
                
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {thongtinbosung.map((card) => (
                <tr key={card.id}>
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

export default Thongtinbosung;
