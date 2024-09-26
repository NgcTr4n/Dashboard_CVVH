import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import { Link } from "react-router-dom";
import "../form.css";
import {
  deleteData1,
  fetchQuangtruongslider1,
  uploadDataWithImage1,
} from "../../features/quangtruongslider1Slice";
import {
  deleteData2,
  fetchQuangtruongslider2,
  uploadDataWithImage2,
} from "../../features/quangtruongslider2Slice";
import {
  deleteData3,
  fetchQuangtruongslider3,
  uploadDataWithImage3,
} from "../../features/quangtruongslider3Slice";
import {
  deleteData4,
  fetchQuangtruongslider4,
  uploadDataWithImage4,
} from "../../features/quangtruongslider4Slice";
import {
  deleteData,
  fetchQuangtruong,
  uploadDataWithImage,
} from "../../features/quangtruongfooterSlice";

import { useAppDispatch, useAppSelector } from "../../hooks";

interface MenuItem {
  id: string;
  label: string;
  path: string;
}

const Quangtruong = () => {
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [menuItems] = useState<MenuItem[]>([
    {
      id: "quangtruongslider1",
      label: "Slider 1",
      path: "/gioithieu/quangtruongslider1",
    },
    {
      id: "quangtruongslider2",
      label: "Slider 2",
      path: "/gioithieu/quangtruongslider2",
    },
    {
      id: "quangtruongslider3",
      label: "Slider 3",
      path: "/gioithieu/quangtruongslider3",
    },
    {
      id: "quangtruongslider4",
      label: "Slider 4",
      path: "/gioithieu/quangtruongslider4",
    },
    { id: "quangtruong", label: "Footer", path: "/gioithieu/footer" },
  ]);

  const dispatch = useAppDispatch();
  const {
    quangtruongslider1,
    loading: loadingSlider1,
    error: errorSlider1,
  } = useAppSelector((state) => state.quangtruongslider1);

  const {
    quangtruongslider2,
    loading: loadingSlider2,
    error: errorSlider2,
  } = useAppSelector((state) => state.quangtruongslider2);
  const {
    quangtruongslider3,
    loading: loadingSlider3,
    error: errorSlider3,
  } = useAppSelector((state) => state.quangtruongslider3);
  const {
    quangtruongslider4,
    loading: loadingSlider4,
    error: errorSlider4,
  } = useAppSelector((state) => state.quangtruongslider4);
  const {
    quangtruong,
    loading: loading,
    error: error,
  } = useAppSelector((state) => state.quangtruong);
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && description && selectedMenu?.id === "quangtruongslider1") {
      dispatch(
        uploadDataWithImage1({
          file,
          description,
        })
      );
      setFile(null);
      setDescription("");
    } else if (
      file &&
      description &&
      selectedMenu?.id === "quangtruongslider2"
    ) {
      dispatch(
        uploadDataWithImage2({
          file,
          description,
        })
      );
      setFile(null);
      setDescription("");
    } else if (
      file &&
      description &&
      selectedMenu?.id === "quangtruongslider3"
    ) {
      dispatch(
        uploadDataWithImage3({
          file,
          description,
        })
      );
      setFile(null);
      setDescription("");
    } else if (
      file &&
      description &&
      selectedMenu?.id === "quangtruongslider4"
    ) {
      dispatch(
        uploadDataWithImage4({
          file,
          description,
        })
      );
      setFile(null);
      setDescription("");
    } else if (file && description && selectedMenu?.id === "quangtruong") {
      dispatch(
        uploadDataWithImage({
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
      if (selectedMenu.id === "quangtruongslider1") {
        dispatch(fetchQuangtruongslider1());
      } else if (selectedMenu.id === "quangtruongslider2") {
        dispatch(fetchQuangtruongslider2());
      } else if (selectedMenu.id === "quangtruongslider3") {
        dispatch(fetchQuangtruongslider3());
      } else if (selectedMenu.id === "quangtruongslider4") {
        dispatch(fetchQuangtruongslider4());
      } else if (selectedMenu.id === "quangtruong") {
        dispatch(fetchQuangtruong());
      }
    }
  }, [dispatch, selectedMenu]);

  const handleDelete = (id: string) => {
    if (selectedMenu?.id === "quangtruongslider1") {
      dispatch(deleteData1(id));
    } else if (selectedMenu?.id === "quangtruongslider2") {
      dispatch(deleteData2(id));
    } else if (selectedMenu?.id === "quangtruongslider3") {
      dispatch(deleteData3(id));
    } else if (selectedMenu?.id === "quangtruongslider4") {
      dispatch(deleteData4(id));
    } else if (selectedMenu?.id === "quangtruong") {
      dispatch(deleteData(id));
    }
  };
  const renderTable = () => {
    if (
      selectedMenu?.id === "quangtruongslider1" ||
      selectedMenu?.id === "quangtruongslider2" ||
      selectedMenu?.id === "quangtruongslider3" ||
      selectedMenu?.id === "quangtruongslider4"
    ) {
      return (
        <tr>
          <th>Image</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      );
    } else if (selectedMenu?.id === "quangtruong") {
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
    if (selectedMenu?.id === "quangtruongslider1") {
      return quangtruongslider1.map((card) => (
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
    } else if (selectedMenu?.id === "quangtruongslider2") {
      return quangtruongslider2.map((card) => (
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
    } else if (selectedMenu?.id === "quangtruongslider3") {
      return quangtruongslider3.map((card) => (
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
    } else if (selectedMenu?.id === "quangtruongslider4") {
      return quangtruongslider4.map((card) => (
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
    } else if (selectedMenu?.id === "quangtruong") {
      return quangtruong.map((card) => (
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
              onClick={() => handleDelete(card.id)} // Gọi hàm delete
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
                {selectedMenu?.id === "quangtruong" && (
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
                  {" "}
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

export default Quangtruong;
