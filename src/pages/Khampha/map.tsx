import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { uploadData } from "../../features/khamphaSlice";
import Layout from "../../layout";
import "../form.css";
import { fetchKhamPha, deleteData } from "../../features/khamphaSlice";

const Map: React.FC = () => {
  const dispatch = useAppDispatch();
  const { khampha, loading, error } = useAppSelector((state) => state.khampha);

  const [label_id, setLabelId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [top, setTop] = useState<string>("");
  const [left, setLeft] = useState<string>("");
  const [label, setLabel] = useState<string>("");

  const handleUpload = () => {
    if (description && label_id && top && left && label) {
      dispatch(
        uploadData({
          label_id: Number(label_id),
          top,
          left,
          label,
          description,
        })
      );
      setLabelId("");
      setDescription("");
      setTop("");
      setLeft("");
      setLabel("");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchKhamPha());
      console.log("Current khampha state after fetch:", khampha); 
    };
    fetchData();
  }, [dispatch]);

  const handleDelete = (id: string) =>{
    dispatch(deleteData(id))
  };
  if (!khampha || khampha.length === 0) {
    return <div>No items found.</div>; 
  }

  return (
    <Layout>
      <div className="app-container">
        <div className="form-container">
          <div>
            <h2 className="form-heading">Add New Location</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleUpload}>
            <div>
              <input
                id="label_id"
                name="label_id"
                type="number"
                required
                className="input-field"
                placeholder="Label ID"
                value={label_id}
                onChange={(e) => setLabelId(e.target.value)}
              />
            </div>
            <div>
              <input
                id="top"
                name="top"
                type="text"
                required
                className="input-field"
                placeholder="Top"
                value={top}
                onChange={(e) => setTop(e.target.value)}
              />
            </div>
            <div>
              <input
                id="left"
                name="left"
                type="text"
                required
                className="input-field"
                placeholder="Left"
                value={left}
                onChange={(e) => setLeft(e.target.value)}
              />
            </div>
            <div>
              <textarea
                id="label"
                name="label"
                required
                className="input-textarea"
                placeholder="Label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
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
                onClick={handleUpload}
                disabled={!description || !label || !label_id || !top || !left}
                className="button"
              >
                Add Location
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2 className="table-heading">Location Data</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Label ID</th>
                <th>Top</th>
                <th>Left</th>
                <th>Label</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {khampha
                .slice()
                .sort((a, b) => Number(b.label_id) - Number(a.label_id))
                .map((location, index) => (
                  <tr key={index}>
                    <td>{location.label_id}</td>
                    <td>{location.top}</td>
                    <td>{location.left}</td>
                    <td>{location.label}</td>
                    <td>{location.description}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(location.id)}
                        className="button"
                      >
                        Delete
                      </button>{" "}
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

export default Map;
