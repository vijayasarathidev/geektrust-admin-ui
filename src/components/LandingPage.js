import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "./LandingPage.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import UserRow from "./UserRow";

const PAGE_SIZE = 10;

function UserTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      });
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      Object.values(user).some((value) => value.toString().includes(searchTerm))
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    if (checked) {
      const ids = filteredUsers
        .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
        .map((user) => user.id);
      const newSelectedIds = new Set([...selectedIds, ...ids]);
      setSelectedIds(newSelectedIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (event, id) => {
    const checked = event.target.checked;
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleDeleteSelected = () => {
    const remainingUsers = filteredUsers.filter(
      (user) => !selectedIds.has(user.id)
    );
    setUsers(remainingUsers);
    setSelectedIds(new Set());
    const selectAllCheckbox = document.getElementById("selectAll");
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = false;
    }
  };

  const handleEdit = (modifiedUser) => {
    const modifiedUsersData = users.map((user) => {
      if (user.id === modifiedUser.id) {
        user.name = modifiedUser.name;
        user.email = modifiedUser.email;
        user.role = modifiedUser.role;
      }
      return user;
    });
    setUsers(modifiedUsersData);
  };

  const handleDelete = (id) => {
    const remainingUsers = users.filter((user) => user.id !== id);
    setUsers(remainingUsers);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const visibleUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="table-manual">
      <div className="table-search">
        <input
          type="text"
          value={searchTerm}
          className="input"
          onChange={handleSearch}
          placeholder="Search"
        />
        <SearchIcon fontSize="medium" sx={{ color: "#000", mr: 1 }} />
      </div>
     {/* table starts */}
      <table>
        <thead>
          <tr>
            <th>
              <input
                id="selectAll"
                type="checkbox"
                onChange={handleSelectAll}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleUsers.map((data) => (
            <UserRow
              key={data.id}
              data={data}
              selectedIds={selectedIds}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleCheck={handleSelect}
            />
          ))}
        </tbody>
      </table>
      {/* footer page buttons & delete button */}
      <div  className="footer">
        <button
          className="page-item"
          disabled={currentPage === 1}
          onClick={(event) => handlePageChange(event, 1)}
        >
          <KeyboardDoubleArrowLeftIcon fontSize="small" />
        </button>
        <button
          className="page-item"
          disabled={currentPage === 1}
          onClick={(event) => handlePageChange(event, currentPage - 1)}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            className="page-item"
            key={index}
            disabled={currentPage === index + 1}
            onClick={(event) => handlePageChange(event, index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="page-item"
          disabled={currentPage === totalPages}
          onClick={(event) => handlePageChange(event, currentPage + 1)}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </button>
        <button
          className="page-item"
          disabled={currentPage === totalPages}
          onClick={(event) => handlePageChange(event, totalPages)}
        >
          <KeyboardDoubleArrowRightIcon fontSize="small" />
        </button>
        <button className="delete-icon" onClick={handleDeleteSelected}>Delete Selected</button>
      </div>
    </div>
  );
}

export default UserTable;
