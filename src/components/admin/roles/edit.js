import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Checkbox, Row, Col, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axiosToken from "../../context/axiosToken";

export default function EditRole() {
  const API = process.env.REACT_APP_API_URL_ADMIN;
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  // Danh sách quyền — bạn có thể lấy từ DB nếu muốn
  const PERMISSIONS = [
    { label: "Xem danh mục", value: "products-category_view" },
    { label: "Tạo danh mục", value: "products-category_create" },
    { label: "Sửa danh mục", value: "products-category_update" },
    { label: "Xoá danh mục", value: "products-category_delete" },

    { label: "Xem sản phẩm", value: "products_view" },
    { label: "Tạo sản phẩm", value: "products_create" },
    { label: "Sửa sản phẩm", value: "products_update" },
    { label: "Xoá sản phẩm", value: "products_delete" },

    { label: "Xem tài khoản", value: "accounts_view" },
    { label: "Tạo tài khoản", value: "accounts_create" },
    { label: "Sửa tài khoản", value: "accounts_update" },
    { label: "Xoá tài khoản", value: "accounts_delete" },
    { label: "Khôi phục tài khoản", value: "accounts_bin" },

    { label: "Xem nhóm quyền", value: "roles_view" },
    { label: "Tạo nhóm quyền", value: "roles_create" },
    { label: "Sửa nhóm quyền", value: "roles_update" },
    { label: "Xoá nhóm quyền", value: "roles_delete" },

    { label: "Xem quyền", value: "permissions_view" },
    { label: "Sửa quyền", value: "permissions_update" },
  ];

  // ==========================
  // Fetch data from API
  // ==========================
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axiosToken.get(`${API}/roles/${id}`);
        console.log("res: ", res);

        const data = res.data;

        console.log("data: ", data);

        form.setFieldsValue({
          title: data.title,
          description: data.description,
          permissions: data.permissions,
        });
      } catch (error) {
        message.error("Không thể tải dữ liệu nhóm quyền!");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [API, id, form]);

  // ==========================
  // Submit update
  // ==========================
  const onFinish = async (values) => {
    try {
      await axiosToken.patch(`${API}/roles/update/${id}`, values);
      message.success("Cập nhật nhóm quyền thành công!");
      navigate("/admin/roles");
    } catch (error) {
      message.error("Cập nhật thất bại!");
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <Card title="Chỉnh sửa nhóm quyền" bordered={false}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Tên nhóm quyền */}
        <Form.Item
          label="Tên nhóm quyền"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tên nhóm quyền" }]}
        >
          <Input placeholder="VD: Admin, Nhân viên kho..." />
        </Form.Item>

        {/* Mô tả */}
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} placeholder="Mô tả nhóm quyền" />
        </Form.Item>

        <h3 style={{ marginTop: 20 }}>Quyền truy cập</h3>

        {/* Checkbox quyền */}
        <Form.Item name="permissions">
          <Checkbox.Group style={{ width: "100%" }}>
            <Row gutter={[0, 10]}>
              {PERMISSIONS.map((per) => (
                <Col span={8} key={per.value}>
                  <Checkbox value={per.value}>{per.label}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: 200 }}>
            Cập nhật nhóm quyền
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
