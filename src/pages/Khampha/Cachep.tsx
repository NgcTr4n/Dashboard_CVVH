import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import { Link } from "react-router-dom";
import "../form.css";
import {
  deleteData,
  fetchCachepslider,
  uploadDataWithImage,
} from "../../features/cachepsliderSlice";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchCachep, uploadDataWithImage1, deleteData1 } from "../../features/cachepfooterSlice";

interface MenuItem {
  id: string;
  label: string;
  path: string;
}

const Cachep = () => {
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [menuItems] = useState<MenuItem[]>([
    {
      id: "cachepslider",
      label: "Slider",
      path: "/gioithieu/cachepslider",
    },
    { id: "cachep", label: "Footer", path: "/gioithieu/footer" },
  ]);

  const dispatch = useAppDispatch();
  const {
    cachepslider,
    loading: loadingSlider1,
    error: errorSlider1,
  } = useAppSelector((state) => state.cachepslider);

  const {
    cachep,
    loading: loading,
    error: error,
  } = useAppSelector((state) => state.cachep);
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && description && selectedMenu?.id === "cachepslider") {
      dispatch(
        uploadDataWithImage({
          file,
          description,
        })
      );
      setFile(null);
      setDescription("");
    
    } else if (file && description && selectedMenu?.id === "cachep") {
      dispatch(
        uploadDataWithImage1({
          file,
          title,
          date,
          description,
        })
      );
      setFile(null);
      setDescription("");
      setTitle("");
      setDate("");
    }
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^[0-9/]*$/.test(inputValue) || inputValue === "") {
      setDate(inputValue);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    if (selectedMenu) {
      if (selectedMenu.id === "cachepslider") {
        dispatch(fetchCachepslider());
      } else if (selectedMenu.id === "cachep") {
        dispatch(fetchCachep());
      }
    }
  }, [dispatch, selectedMenu]);

  const handleDelete = (id: string) => {
    if (selectedMenu?.id === "cachepslider") {
      dispatch(deleteData(id));
    } else if (selectedMenu?.id === "cachep") {
      dispatch(deleteData1(id));
    }
  };

  const renderTable = () => {
    if (selectedMenu?.id === "cachepslider") {
      return (
        <tr>
          <th>Image</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      );
    } else if (selectedMenu?.id === "cachep") {
      return (
        <tr>
          <th>Image</th>
          <th>Title</th>
          <th>Description</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      );
    }
    return null;
  };

  const renderTableData = () => {
    if (selectedMenu?.id === "cachepslider") {
      return cachepslider.map((card) => (
        <tr key={card.id}>
          <td>
            <img
              src={card.imageUrl}
              alt=""
              width="50"
              height="50"
              style={{ borderRadius: "10px" }}
            />
          </td>
          <td>{card.description}</td>
          <td>
            <button onClick={() => handleDelete(card.id)} className="button">
              Delete
            </button>
          </td>
        </tr>
      ));
    } else if (selectedMenu?.id === "cachep") {
      return cachep.map((card) => (
        <tr key={card.id}>
          <td>
            <img
              src={card.imageUrl}
              alt={card.title}
              width="50"
              height="50"
              style={{ borderRadius: "10px" }}
            />
          </td>
          <td>{card.title}</td>
          <td>{card.description}</td>
          <td>{card.date}</td>
          <td>
            <button
              onClick={() => handleDelete(card.id)} 
              className="button"
            >
              Delete
            </button>
          </td>
        </tr>
      ));
    }
    return null;
  };

  return (
    <Layout>
      <div className="app-container">
        <ul className="menu">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to="#"
                onClick={() => setSelectedMenu(item)}
                className={selectedMenu?.id === item.id ? "active" : ""}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {selectedMenu && (
          <div className="form-container">
            <h2 className="form-heading">Add New to {selectedMenu.label}</h2>
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
                {selectedMenu?.id === "cachep" && (
                  <>
                    <input
                      type="text"
                      placeholder="Title"
                      value={title}
                      className="input-field"
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <input
                      id="date"
                      name="date"
                      type="text"
                      required
                      placeholder="DD/MM/YYYY"
                      className="input-field"
                      value={date}
                      onChange={handleDateChange}
                      maxLength={10}
                    />
                  </>
                )}
                <div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="custom-file-upload"
                  />
                </div>
                <button type="submit" className="button">
                  Add New
                </button>
              </div>
            </form>

            <div className="table-container">
              <h2 className="table-heading">Data for {selectedMenu.label}</h2>
              <table className="data-table">
                <thead>{renderTable()}</thead>
                <tbody>{renderTableData()}</tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cachep;
