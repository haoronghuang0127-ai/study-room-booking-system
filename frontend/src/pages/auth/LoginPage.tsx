import { Button, Card, Form, Input, Typography, message } from 'antd';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen';
import { useAuth } from '../../contexts/AuthContext';
import { getStoredUser } from '../../utils/auth';
import { getDefaultRouteByRole } from '../../utils/defaultRoute';

export default function LoginPage() {
  // Get the login, isAuthenticated, loading, and user functions from the AuthContext
  const { login, isAuthenticated, loading, user } = useAuth();
  // Get the navigate and location functions from react-router
  const navigate = useNavigate();
  // Get the current location
  const location = useLocation();

  if (loading) {
    return <LoadingScreen text="Checking session..." />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={getDefaultRouteByRole(user.role)} replace />;
  }

  // Function to handle form submission
  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      // Call the login function from the AuthContext
      await login(values);

      const currentUser = getStoredUser();
      const fallback = currentUser ? getDefaultRouteByRole(currentUser.role) : '/student';
      const target = (location.state as any)?.from?.pathname || fallback;
      message.success('Login successful');
      navigate(target);
    } catch (error: any) {
      // Extract the error message from the API response, or use a default message if not available
      const detail = error?.response?.data?.detail || 'Login failed';
      message.error(detail);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Typography.Title level={2}>Login</Typography.Title>
        <Typography.Paragraph>Use your account to manage study room bookings.</Typography.Paragraph>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please enter your username' }]}>
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text>
          Do not have an account? <Link to="/register">Register now</Link>
        </Typography.Text>
      </Card>
    </div>
  );
}
