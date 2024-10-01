import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import {
  deleteData,
  fetchChuy,
  uploadDataWithImage,
} from "../../features/chuySlice";

const Chuy: React.FC = () => {
  const dispatch = useAppDispatch();
  const { chuy, loading, error } = useAppSelector(
    (state) => state.chuy
  );


  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");


  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (content) {
      dispatch(
        uploadDataWithImage({
          
          description,
          content,
        
        })
      );
      // Reset các giá trị input
    
      setDescription("");
      setContent("");
    }
  };

 

  useEffect(() => {
    dispatch(fetchChuy());
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
            <h2 className="form-heading">Chú ý</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleUpload}>
          
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
                disabled={!description || !content}
                className="button"
              >
                Add New
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">Chú Ý</h2>
          <table className="data-table">
            <thead>
              <tr>
                
                <th>Content</th>

                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chuy.map((card) => (
                <tr key={card.id}>
                 

                 
                  <td>{card.content}</td>
                

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

export default Chuy;
