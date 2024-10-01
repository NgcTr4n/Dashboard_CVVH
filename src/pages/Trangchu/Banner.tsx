import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Layout from "../../layout";
import "../form.css";
import { deleteData, fetchTrangchu, uploadDataWithImage } from "../../features/trangchuSlice";

const Banner: React.FC = () => {
  const dispatch = useAppDispatch();
  const { trangchu, loading, error } = useAppSelector(
    (state) => state.trangchu
  );
  

  
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (file) {
      dispatch(
        uploadDataWithImage({
          file,
          
        })
      );
      // Reset các giá trị input
      setFile(null);
     
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    dispatch(fetchTrangchu());
  }, [dispatch]);


  const handleDelete = (id: string) => {
    dispatch(deleteData(id)); // Gọi hàm deleteData
  };


  return (
    <Layout>
      <div className="app-container">
        <div className="form-container">
          <div>
            <h2 className="form-heading">Add New Banner</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleUpload}>

            <div>
              <input
                type="file"
                onChange={handleFileChange}
                className="custom-file-upload"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={!file}
                className="button"
              >
                Add New CardList
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">Banner Images</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trangchu.map((card) => (
                <tr key={card.id}>
                  <td>
                    <img
                      src={card.imageUrl}
                      
                      width="50%"
                      height="50%"
                      style={{borderRadius: "10px"}}

                    />
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

export default Banner;
