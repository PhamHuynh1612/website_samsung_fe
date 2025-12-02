import React, { useEffect, useState } from "react";
import { Button, Row, Table, Modal, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosToken from "../../context/axiosToken";

const { confirm } = Modal;

function AdminUsers() {
  const API = process.env.REACT_APP_API_URL_ADMIN;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axiosToken.get(`${API}/users`);
        setUsers(res.data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [API]);

  const handleAddUser = () => navigate("/admin/accounts/create");
  const handleDetail = (record) =>
    navigate(`/admin/accounts/detail/${record._id}`);
  const handleEdit = (record) => navigate(`/admin/accounts/edit/${record._id}`);

  const handleDelete = (record) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa tài khoản này?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      okButtonProps: {
        style: {
          background: "linear-gradient(135deg, #6253e1, #04befe)",
          color: "#fff",
        },
      },
      async onOk() {
        setLoading(true);
        try {
          const res = await axiosToken.patch(
            `${API}/users/delete/${record._id}`
          );
          if (res.data.code === 200) {
            setUsers((prev) => prev.filter((u) => u._id !== record._id));
            message.success("Xóa tài khoản thành công!");
          } else {
            message.error(res.data.message || "Xóa thất bại!");
          }
        } catch (err) {
          console.error(err);
          message.error("Xóa thất bại!");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Phân quyền",
      key: "role",
      render: (_, record) => record.role?.title || "",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => handleDetail(record)}>Chi tiết</Button>
          <Button onClick={() => handleEdit(record)} type="primary">
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddUser}>
          Thêm người dùng
        </Button>
        <span className="bin">
          <DeleteOutlined /> Thùng rác
        </span>
      </Row>
      <Table
        columns={columns}
        dataSource={users.map((u) => ({ ...u, key: u._id }))}
        rowKey="key"
      />
    </div>
  );
}

export default AdminUsers;
