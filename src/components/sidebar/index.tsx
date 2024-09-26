import React, { useState } from "react";
import {
  FaHome,
  FaCompass,
  FaInfoCircle,
  FaTicketAlt,
  FaCalendarAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import "./Sidebar.css";

interface MenuItem {
  id: string;
  icon: JSX.Element;
  label: string;
  path: string;
  submenu?: { label: string; link: string }[];
}

interface SidebarProps {
  position?: "left" | "right";
}

const Sidebar: React.FC<SidebarProps> = ({ position = "left" }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: "home", icon: <FaHome />, label: "Trang chủ", path: "/" },
    {
      id: "khampha",
      icon: <FaCompass />,
      label: "Khám phá",
      path: "/khampha",
      submenu: [
        { label: "Map", link: "/khampha/map" },
        { label: "Cá chép nhào lộn", link: "/khampha/cachep" },
        { label: "Khỉ đuôi dài", link: "/khampha/khiduoidai" },
        { label: "Quảng trường vua Hùng", link: "/khampha/quangtruong" },
        { label: "Thực vật", link: "/khampha/thucvat" },
      ],
    },
    {
      id: "gioithieu",
      icon: <FaInfoCircle />,
      label: "Giới thiệu",
      path: "/gioithieu",
      submenu: [
        { label: "Lịch sử", link: "/gioithieu/lichsu" },
        { label: "Thành viên", link: "/gioithieu/thanhvien" },
      ],
    },
    { id: "giave", icon: <FaTicketAlt />, label: "Giá vé", path: "/giave" },

    {
      id: "sukien",
      icon: <FaCalendarAlt />,
      label: "Sự kiện",
      path: "/watershow",
      submenu: [
        { label: "Card Slider", link: "/watershow/cardslider" },
        { label: "Card List", link: "/watershow/cardlist" },
        { label: "Card Footer", link: "/watershow/cardfooter" },
      ],
    },
  ]);

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSubmenuToggle = (id: string) => {
    setOpenSubmenu(openSubmenu === id ? null : id); // Toggle the submenu visibility
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setMenuItems(items);
  };

  return (
    <div className={`sidebar ${position} ${isOpen ? "open" : "closed"}`}>
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className="p-4">
        <h2 className={`menu-header ${!isOpen && "hidden"}`}>Menu</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sidebar-menu">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {menuItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`menu-item ${!isOpen && "closed"}`}
                      >
                        <div
                          onClick={() =>
                            item.submenu && handleSubmenuToggle(item.id)
                          }
                          className="main-menu flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center">
                            <span className="icon">{item.icon}</span>
                            {isOpen && (
                              <span className="label">{item.label}</span>
                            )}
                          </div>
                          {item.submenu && isOpen && (
                            <FaChevronDown
                              className={`chevron-icon ${
                                openSubmenu === item.id ? "rotate" : ""
                              }`}
                            />
                          )}
                        </div>
                        {item.submenu && openSubmenu === item.id && (
                          <ul className="submenu">
                            {item.submenu.map((submenuItem, idx) => (
                              <li key={idx}>
                                <Link to={submenuItem.link}>
                                  {submenuItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Sidebar;
