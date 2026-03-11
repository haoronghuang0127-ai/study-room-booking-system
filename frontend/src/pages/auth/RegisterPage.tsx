import { Button, Card, Form, Input, Radio, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
  // Get the register function from the AuthContext
  const { register } = useAuth();
  // Get the navigate function from react-router
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (values: { username: string; email: string; password: string; role: 'student' | 'admin' }) => {
    try {
      await register(values);
      message.success('Registration successful');
      navigate(values.role === 'admin' ? '/admin' : '/student');
    } catch (error: any) {
      const detail = error?.response?.data?.username?.[0] || 'Registration failed';
      message.error(detail);
    }
  };

  return (
    // Container for the registration form
    <div className="auth-page">

      {/* Use Ant Design's Card component to create a card with a white background */}
      <Card className="auth-card">
        <Typography.Title level={2}>Register</Typography.Title>
        <Typography.Paragraph>Create your account to start booking rooms.</Typography.Paragraph>

        {/* Use Ant Design's Form component to create a registration form */}
        <Form layout="vertical" onFinish={handleSubmit} initialValues={{ role: 'student' }}>

          {/* Form fields for username */}
          <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please enter a username' }]}>
            <Input autoComplete="username" />
          </Form.Item>

          {/* Form fields for email */}
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Please enter a valid email' }]}>
            <Input autoComplete="email" />
          </Form.Item>

          {/* Form fields for password */}
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }, { min: 8, message: 'Password must be at least 8 characters' }]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          {/* Form field for role */}
          <Form.Item label="Role" name="role">
            <Radio.Group>
              <Radio value="student">Student</Radio>
              <Radio value="admin">Admin</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Submit button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
          
        </Form>

        <Typography.Text>
          Already have an account? <Link to="/login">Login</Link>
        </Typography.Text>
      </Card>
    </div>
  );
}
