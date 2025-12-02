import React, { useEffect, useState } from "react";
import { Button, Row, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import axiosToken from "../../context/axiosToken";
import { DataTree, TableTree } from "../mixins/table-tree";

function AdminProductsCategory({ permissions }) {
  const API = process.env.REACT_APP_API_URL_ADMIN;
  const [productsCategory, setProductsCategory] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProductsCategory = async () => {
    try {
      const res = await axiosToken.get(`${API}/products-category`);

      if (res.data.categories) {
        setProductsCategory(res.data.categories);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsCategory();
  }, []);

  useEffect(() => {
    if (productsCategory.length > 0) {
      const tree = DataTree({ items: productsCategory, level: 1 });
      setTreeData(tree);
    }
  }, [productsCategory]);

  // 📌 Xem chi tiết
  const handleDetail = (record) => {
    navigate(`/admin/products-category/detail/${record._id}`);
  };

  // 📌 Sửa
  const handleEdit = (record) => {
    navigate(`/admin/products-category/edit/${record._id}`);
  };

  // 📌 Xóa có confirm
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa?",
      content: `Danh mục: ${record.title}`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",

      onOk: async () => {
        try {
          const res = await axiosToken.delete(
            `${API}/products-category/delete/${record._id}`
          );
          message.success("Xóa danh mục thành công!");
          fetchProductsCategory(); // reload danh sách
        } catch (error) {
          message.error("Xóa danh mục thất bại!");
        }
      },
    });
  };

  const handleAddCategory = () => {
    navigate(`/admin/products-category/create`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="product">
        <div>
          <h1>Danh mục sản phẩm</h1>
        </div>
        <Row>
          {permissions?.includes("products_create") && (
            <Button type="primary" onClick={handleAddCategory}>
              Thêm danh mục
            </Button>
          )}
        </Row>
        {productsCategory.length > 0 ? (
          <div className="mt-2">
            <TableTree
              data={treeData}
              permissions={permissions}
              onDetail={handleDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default AdminProductsCategory;
