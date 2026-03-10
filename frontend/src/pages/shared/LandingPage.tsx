import { ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Layout, Row, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../contexts/AuthContext';
import { getDefaultRouteByRole } from '../../utils/defaultRoute';

export default function LandingPage() {
  // Get the user information from the AuthContext
  const { user } = useAuth();
  // Get the navigate function from react-router
  const navigate = useNavigate();

  // Function to handle login button click
  const handleLoginBtnClick = () => {
    // Navigate to the appropriate route based on user information
    navigate(user ? getDefaultRouteByRole(user.role) : '/login');
  };

  return (
    // Use Ant Design's Layout component to create a layout with a white background
    <Layout style={{ minHeight: '100vh', background: '#f5f7fb' }}>
      {/* Render the header component */}
      <AppHeader />

      {/* Render the content area */}
      <Layout.Content style={{ padding: '48px 24px' }}>

        {/* Render a grid layout with two columns */}
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          {/* Render a row with two columns */}
          <Row gutter={[24, 24]} align="middle">

            {/* Render the left column */}
            <Col xs={24} lg={14}>
              <Space direction="vertical" size="large">
                <Typography.Title style={{ margin: 0 }}>
                  Book study rooms faster and avoid time conflicts.
                </Typography.Title>
                <Typography.Paragraph style={{ fontSize: 16 }}>
                  This system helps students browse study rooms, check availability, create bookings, track reservations, and manage room use more efficiently.
                </Typography.Paragraph>
                <Space wrap>
                  <Link to="/register"><Button type="primary" size="large">Get started</Button></Link>
                  {/* Render a button that navigates to the login page */}
                  <Button size="large" onClick={handleLoginBtnClick}>
                    {user ? 'Go to dashboard' : 'Login'}
                  </Button>
                </Space>
              </Space>
            </Col>

            {/*Render the right column */}
            <Col xs={24} lg={10}>
              <Card>
                <Space direction="vertical" size="middle">
                  {[
                    'Browse rooms by capacity, location and equipment',
                    'Create bookings with date and time selection',
                    'View upcoming bookings and booking history',
                    'Support admin review and room management',
                  ].map((item) => (
                    <Space key={item} align="start">
                      <CheckCircleOutlined style={{ color: '#1677ff', marginTop: 4 }} />
                      <Typography.Text>{item}</Typography.Text>
                    </Space>
                  ))}
                  <Link to="/student/rooms">
                    <Button type="link" icon={<ArrowRightOutlined />}>Explore rooms</Button>
                  </Link>
                </Space>
              </Card>
            </Col>

          </Row>
        </div>

      </Layout.Content>
    </Layout>
  );
}

