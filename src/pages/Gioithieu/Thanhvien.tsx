import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import { Link } from "react-router-dom";
import "../form.css";
import {
  deleteData,
  fetchThanhviennhahang,
  updateData,
  uploadDataWithImage,
} from "../../features/thanhviennhahangSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  deleteThanhviencf,
  fetchThanhviencf,
  updateThanhvien,
  uploadThanhviencfWithImage,
} from "../../features/thanhviencfSlice";

interface MenuItem {
  id: string;
  label: string;
  path: string;
}

const Thanhvien = () => {
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [menuItems] = useState<MenuItem[]>([
    { id: "nhahangthuyta", label: "Nhà hàng thủy tạ", path: "/gioithieu/nhahangthuyta" },
    { id: "caphevuonda", label: "Cà phê vườn đá", path: "/gioithieu/caphevuonda" },
  ]);

  const dispatch = useAppDispatch();
  const { thanhviennhahang, loading: loadingNhahang, error: errorNhahang } = useAppSelector(
    (state) => state.thanhviennhahang
  );

  const { thanhviencf, loading: loadingCf, error: errorCf } = useAppSelector(
    (state) => state.thanhviencf
  );

  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const fileToUpload = file ? file : undefined;

    if (editId) {
      // Xử lý cập nhật dữ liệu
      if (description && selectedMenu?.id === "nhahangthuyta") {
        dispatch(
          updateData({
            id: editId,
            description,
            file: fileToUpload,
          })
        );
      } else if (description && selectedMenu?.id === "caphevuonda") {
        dispatch(
          updateThanhvien({
            id: editId,
            description,
            file: fileToUpload,
          })
        );
      }
      setEditId(null);
    } else {
      // Xử lý thêm mới
      if (file && description && selectedMenu?.id === "nhahangthuyta") {
        dispatch(
          uploadDataWithImage({
            file,
            description,
          })
        );
      } else if (file && description && selectedMenu?.id === "caphevuonda") {
        dispatch(
          uploadThanhviencfWithImage({
            file,
            description,
          })
        );
      }
    }

    setFile(null);
    setDescription("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleEdit = (card: { id: string; description: string; imageUrl?: string }) => {
    setEditId(card.id);
    setDescription(card.description);
    setFile(null);  
  };
  

  useEffect(() => {
    if (selectedMenu) {
      if (selectedMenu.id === "nhahangthuyta") {
        dispatch(fetchThanhviennhahang());
      } else if (selectedMenu.id === "caphevuonda") {
        dispatch(fetchThanhviencf());
      }
    }
  }, [dispatch, selectedMenu]);

  const handleDelete = (id: string) => {
    if (selectedMenu?.id === "nhahangthuyta") {
      dispatch(deleteData(id));
    } else if (selectedMenu?.id === "caphevuonda") {
      dispatch(deleteThanhviencf(id));
    }
  };

  const renderTableData = () => {
    if (selectedMenu?.id === "nhahangthuyta") {
      return thanhviennhahang.map((card) => (
        <tr key={card.id}>
          <td>
            <img
              src={card.imageUrl} // Cung cấp giá trị mặc định nếu imageUrl là undefined
              alt=""
              width="50"
              height="50"
              style={{ borderRadius: "10px" }}
            />
          </td>
          <td>{card.description}</td>
          <td>
            <button onClick={() => handleEdit(card)} className="button">
              Edit
            </button>
            <button onClick={() => handleDelete(card.id)} className="button">
              Delete
            </button>
          </td>
        </tr>
      ));
    } else if (selectedMenu?.id === "caphevuonda") {
      return thanhviencf.map((card) => (
        <tr key={card.id}>
          <td>
            <img
              src={card.imageUrl || "default-image-url.png"} // Cung cấp giá trị mặc định nếu imageUrl là undefined
              alt=""
              width="50"
              height="50"
              style={{ borderRadius: "10px" }}
            />
          </td>
          <td>{card.description}</td>
          <td>
            <button onClick={() => handleEdit(card)} className="button">
              Edit
            </button>
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
            <h2 className="form-heading">
              {editId ? "Edit" : "Add New"} to {selectedMenu.label}
            </h2>
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
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="custom-file-upload"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={!description || (!file && !editId)} // Cho phép submit khi đang edit mà không cần file
                  className="button"
                >
                  {editId ? "Update" : "Add New"}
                </button>
              </div>
            </form>

            <div className="table-container">
              <h2 className="table-heading">Data for {selectedMenu.label}</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{renderTableData()}</tbody>
              </table>
            </div>
          </div>
        )}

        {(errorNhahang || errorCf) && (
          <div className="error-message">{errorNhahang || errorCf}</div>
        )}
        {(loadingNhahang || loadingCf) && (
          <div className="loading-message">Loading...</div>
        )}
      </div>
    </Layout>
  );
};

export default Thanhvien;
