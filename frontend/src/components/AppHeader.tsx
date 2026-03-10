import { Button, Layout, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AppHeader() {
  // Get the user information and logout function from the AuthContext
  const { user, logout } = useAuth();

  // Get the navigate function from react-router
  const navigate = useNavigate();

  // Handle the logout action by calling the logout function and navigating to the login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  //
  return (
    // Use Ant Design's Layout.Header component to create a header with a white background and a bottom border
    <Layout.Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 24px' }}>

      {/* Use Space to layout the title and user actions with space between them */}
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>

        {/* Link the title to the home page using react-router's Link component */}
        <Link to="/">
          <Typography.Title level={4} style={{ margin: 0 }}>
            Study Room Booking
          </Typography.Title>
        </Link>

        {/* If the user is logged in, show their username and role, 
        along with a logout button. Otherwise, show login and register buttons. */}
        <Space>
          {user ? (
            <>
              <Typography.Text>{user.username} ({user.role})</Typography.Text>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button>Login</Button></Link>
              <Link to="/register"><Button type="primary">Register</Button></Link>
            </>
          )}
        </Space>
      </Space>
    </Layout.Header>
  );
}
