import React, { useEffect, useState } from "react";
import { Button, Form, Input, Card, Row, Col, Spin, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axiosToken from "../../context/axiosToken";
import Error404 from "../page/error404/error404";

const AdminDetailProduct = () => {
  const API = process.env.REACT_APP_API_URL_ADMIN;
  const { slug } = useParams();
  const navigate = useNavigate();

  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isError404, setIsError404] = useState(false);

  useEffect(() => {
    const fetchDetailProducts = async () => {
      try {
        const res = await axiosToken.get(`${API}/products/detail/${slug}`);

        if (!res.data.product) {
          setIsError404(true);
        } else {
          setProductDetail(res.data.product);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        message.error("Lỗi khi tải thông tin sản phẩm!");
        setIsError404(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailProducts();
  }, [slug, API]);

  if (loading)
    return (
      <Spin
        tip="Đang tải..."
        style={{ display: "block", margin: "50px auto" }}
      />
    );
  if (isError404) return <Error404 />;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <Card
        title={`Chi tiết sản phẩm: ${productDetail.title}`}
        extra={
          <Button onClick={() => navigate(-1)} type="primary">
            Quay lại
          </Button>
        }
      >
        <Row gutter={24}>
          <Col xs={24} md={10}>
            <img
              src={productDetail.thumbnail}
              alt={productDetail.title}
              style={{ width: "100%", borderRadius: 8 }}
            />
          </Col>

          <Col xs={24} md={14}>
            <Form
              layout="vertical"
              initialValues={{
                title: productDetail.title,
                description: productDetail.description,
                price: productDetail.price,
                discountPercentage: productDetail.discountPercentage,
                stock: productDetail.stock,
                slug: productDetail.slug,
              }}
            >
              <Form.Item label="Tiêu đề" name="title">
                <Input readOnly />
              </Form.Item>

              <Form.Item label="Slug" name="slug">
                <Input readOnly />
              </Form.Item>

              <Form.Item label="Mô tả" name="description">
                <Input.TextArea readOnly rows={4} />
              </Form.Item>

              <Form.Item label="Giá" name="price">
                <Input readOnly prefix="₫" />
              </Form.Item>

              <Form.Item label="Giảm giá (%)" name="discountPercentage">
                <Input readOnly suffix="%" />
              </Form.Item>

              <Form.Item label="Số lượng" name="stock">
                <Input readOnly />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AdminDetailProduct;
