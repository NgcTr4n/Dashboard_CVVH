import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import { Link } from "react-router-dom";
import "../form.css";
import {
  deleteData,
  fetchThucvatCard,
  uploadDataWithImage,
} from "../../features/thucvatSlice";

import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchThucvat,
  uploadDataWithImage1,
  deleteData1,
} from "../../features/thucvatfooterSlice";

interface MenuItem {
  id: string;
  label: string;
  path: string;
}

const Thucvat = () => {
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [menuItems] = useState<MenuItem[]>([
    {
      id: "thucvatcard",
      label: "Card List",
      path: "/gioithieu/thucvatcard",
    },
    { id: "thucvat", label: "Footer", path: "/gioithieu/thucvat" },
  ]);

  const dispatch = useAppDispatch();
  const {
    thucvatcard,
    loading: loadingSlider1,
    error: errorSlider1,
  } = useAppSelector((state) => state.thucvatcard);

  const {
    thucvat,
    loading: loading,
    error: error,
  } = useAppSelector((state) => state.thucvat);
  
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [link, setLink] = useState<string>(""); // Added link state
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      file &&
      title &&
      description &&
      link &&
      date &&
      selectedMenu?.id === "thucvatcard"
    ) {
      dispatch(
        uploadDataWithImage({
          file,
          description,
          title,
          date,
          link,
        })
      );
      setFile(null);
      setDescription("");
      setTitle("");
      setDate("");
      setLink("");
    } else if (file && description && selectedMenu?.id === "thucvat") {
      dispatch(
        uploadDataWithImage1({
          file,
          description,
          title,
          date,
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
      if (selectedMenu.id === "thucvatcard") {
        dispatch(fetchThucvatCard());
      } else if (selectedMenu.id === "thucvat") {
        dispatch(fetchThucvat());
      }
    }
  }, [dispatch, selectedMenu]);

  const handleDelete = (id: string) => {
    if (selectedMenu?.id === "thucvatcard") {
      dispatch(deleteData(id));
    } else if (selectedMenu?.id === "thucvat") {
      dispatch(deleteData1(id));
    }
  };

  const renderTable = () => {
    if (selectedMenu?.id === "thucvatcard") {
      return (
        <tr>
          <th>Image</th>
          <th>Title</th>
          <th>Description</th>
          <th>Date</th>
          <th>Link</th>
          <th>Actions</th>
        </tr>
      );
    } else if (selectedMenu?.id === "thucvat") {
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
    if (selectedMenu?.id === "thucvatcard") {
      return thucvatcard.map((card) => (
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
          <td>{card.title}</td>
          <td>{card.description}</td>
          <td>{card.date}</td>
          <td>{card.link}</td>
          <td>
            <button onClick={() => handleDelete(card.id)} className="button">
              Delete
            </button>
          </td>
        </tr>
      ));
    } else if (selectedMenu?.id === "thucvat") {
      return thucvat.map((card) => (
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
            <button onClick={() => handleDelete(card.id)} className="button">
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
                                    {selectedMenu?.id === "thucvatcard" && (

                    <input
                      id="link"
                      name="link"
                      type="text"
                      required
                      placeholder="Link"
                      className="input-field"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  )}

                  </>
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

export default Thucvat;
