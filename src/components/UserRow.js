import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

const UserRow = ({
  data,
  selectedIds,
  handleDelete,
  handleEdit,
  handleCheck,
}) => {
  const [canEdit, setCanEdit] = useState(false);
  const [currentValue, setCurrentValue] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentValue({ ...currentValue, [name]: value });
  };

  const performEdit = () => {
    setCanEdit(true);
  };

  const handleSave = () => {
    if (!validation(currentValue)) return;
    setCanEdit(false);
    handleEdit(currentValue);
  };
  const validation = (data) => {
    if (data.name.length === 0) {
      alert("Username is a required field");
      return false;
    } else if (data.email.length === 0) {
      alert("Email is a required field");
      return false;
    } else if (data.role.length === 0) {
      alert("Role is a required field");
      return false;
    } else return true;
  };
  return (
    <tr key={data.id} className={data.isChecked ? "selected" : ""}>
      <td>
        <input
          type="checkbox"
          onChange={(e) => handleCheck(e, data.id)}
          // checked={data.isChecked ? "checked" : ""}
          checked={selectedIds.has(data.id)}
        />
      </td>
      <td>
        {canEdit === true ? (
          <input
            type="text"
            name="name"
            value={currentValue.name}
            onChange={handleChange}
          />
        ) : (
          data.name
        )}
      </td>
      <td>
        {canEdit === true ? (
          <input
            type="email"
            name="email"
            value={currentValue.email}
            onChange={handleChange}
          />
        ) : (
          data.email
        )}
      </td>
      <td>
        {canEdit === true ? (
          <input
            type="text"
            name="role"
            value={currentValue.role}
            onChange={handleChange}
          />
        ) : (
          data.role
        )}
      </td>
      <td className="actions">
        {canEdit === false ? (
          <EditIcon onClick={performEdit} />
        ) : (
          <SaveIcon onClick={handleSave} />
        )}
        <DeleteIcon onClick={() => handleDelete(data.id)} />
      </td>
    </tr>
  );
};

export default UserRow;
