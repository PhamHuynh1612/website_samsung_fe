import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axiosToken from '../../context/axiosToken';

function AdminRoleDetail() {
  const API = process.env.REACT_APP_API_URL_ADMIN;
  const { id } = useParams();

  console.log("id: ", id)
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axiosToken.get(`${API}/roles/${id}`);

         console.log("res: ", res)
        setRole(res.data.role);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [API, id]);

  if (loading) return <Spin size="large" style={{ marginTop: 50 }} />;
  if (error) return <div>Error: {error}</div>;
  if (!role) return <div>Không tìm thấy nhóm quyền</div>;

  return (
    <div style={{ maxWidth: 800 }}>
      <Card title="Chi tiết nhóm quyền" bordered={false}>
        <h3><b>Tên nhóm quyền:</b> {role.title}</h3>

        <p><b>Mô tả:</b> {role.description || '—'}</p>

        <p><b>Danh sách quyền:</b></p>
        <div style={{ marginBottom: 16 }}>
          {role.permissions.length > 0 ? (
            role.permissions.map((p) => (
              <Tag color="blue" key={p} style={{ padding: '5px 10px' }}>
                {p}
              </Tag>
            ))
          ) : (
            <i>Không có quyền nào</i>
          )}
        </div>

        <p><b>Ngày tạo:</b> {new Date(role.createdAt).toLocaleString()}</p>
        <p><b>Cập nhật lúc:</b> {new Date(role.updatedAt).toLocaleString()}</p>

        <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
          <Button type="primary"
            onClick={() => navigate(`/admin/roles/edit/${role._id}`)}
          >
            Sửa
          </Button>

          <Button onClick={() => navigate('/admin/roles')}>
            Quay lại
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default AdminRoleDetail;
