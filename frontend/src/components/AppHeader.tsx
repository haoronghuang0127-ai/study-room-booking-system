import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Space, Typography, type MenuProps } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfileRouteByRole } from '../utils/defaultRoute';

export default function AppHeader() {
  // Application name
  const appName = 'StudyNest Reserve';


  // Get the user information and logout function from the AuthContext
  const { user, logout } = useAuth();

  // Get the navigate function from react-router
  const navigate = useNavigate();

  // Handle the logout action by calling the logout function and navigating to the login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  // Handle dropdown menu click
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (!user) {
      return;
    }

    if (key === 'profile') {
      navigate(getProfileRouteByRole(user.role));
      return;
    }

    if (key === 'logout') {
      handleLogout();
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  //
  return (
    // Use Ant Design's Layout.Header component to create a header with a white background and a bottom border
    <Layout.Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 24px' }}>

      {/* Use Space to layout the title and user actions with space between them */}
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>

        {/* Use Link to create a link to the home page */}
        <Link to="/" style={{ color: 'inherit' }}>

          {/* Use Space to layout the logo and title with some spacing */}
          <Space size={14} align="center" style={{display: 'flex', alignItems: 'center', lineHeight: 1}}>

            {/* Logo of the application */}
            <img
            src="/studynest-mark.png"
            alt={`${appName} logo`}
            style={{
              width: 34,
              height: 34,
              objectFit: 'contain',
              display: 'block',
              flexShrink: 0
            }}
          />

            {/* Title of the application */}
            <Typography.Title level={4} style={{ margin: 0, lineHeight: 1, transform: 'translateY(1px)'}}>
              {appName}
            </Typography.Title>
            
          </Space>
          
        </Link>

        {/* If the user is logged in, show their username and role, 
        along with a logout button. Otherwise, show login and register buttons. */}
        <Space>
          {user ? (
            <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={['click']}>
              <Button type="text" style={{ height: 'auto', padding: 4 }}>
                <Space size="small">
                  <Avatar icon={<UserOutlined />} />
                  <Typography.Text>{user.username}</Typography.Text>
                </Space>
              </Button>
            </Dropdown>
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
