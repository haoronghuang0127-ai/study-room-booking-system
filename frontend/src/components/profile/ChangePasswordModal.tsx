import { Button, Form, Input, Modal, Space, message } from 'antd';
import { useState } from 'react';
import { changePassword } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


// Props interface for the ChangePasswordModal component
interface Props {
  open: boolean;
  onClose: () => void;
}

// ChangePasswordModal component
export default function ChangePasswordModal({ open, onClose }: Props) {
  // form and submitting state
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // add logout and navigate when change password success
  const { logout } = useAuth();
  const navigate = useNavigate();



  // Handle form submission
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // Handle form submission
  const handleFinish = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      // Set submitting to true
      setSubmitting(true);

      // Call the changePassword function
      const data = await changePassword({
        current_password: values.currentPassword,
        new_password: values.newPassword,
        confirm_password: values.confirmPassword,
      });

      // Show success message
      message.success(data.detail);

      // Reset form and close modal
      form.resetFields();
      onClose();

      // Logout and navigate to login page
      logout();
      navigate('/login', { replace: true });


    } catch (error: any) {
      // Show error message
      const detail = error?.response?.data?.detail || 'Failed to change password';
      message.error(detail);
    } finally {
      // Set submitting to false
      setSubmitting(false);
    }
  };

  return (
    // Modal of Change Password
    <Modal
      open={open}
      title="Change Password"
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
    >
      
      {/* Form for changing password */}
      <Form layout="vertical" form={form} onFinish={handleFinish}>

        {/* Current password input */}
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: 'Please enter your current password' }]}
        >
          <Input.Password placeholder="Current password" />
        </Form.Item>

        {/* New password input */}
        <Form.Item
          label="New Password"
          name="newPassword"
          dependencies={['currentPassword']}
          rules={[
            { required: true, message: 'Please enter a new password' },
            { min: 8, message: 'New password must be at least 8 characters long' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('currentPassword') !== value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('New password must be different from the current password'),
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="New password" />
        </Form.Item>
        
        {/* Confirm password input */}
        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>
        

        {/* Save changes and cancel buttons */}
        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Save Changes
            </Button>
          </Space>
        </Form.Item>
        
      </Form>
    </Modal>
  );
}
