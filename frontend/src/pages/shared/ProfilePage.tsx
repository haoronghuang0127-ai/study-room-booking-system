import { LockOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useState } from 'react';
import ChangePasswordModal from '../../components/profile/ChangePasswordModal';
import ProfileSummaryCard from '../../components/profile/ProfileSummaryCard';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {

  // Get the user information from the AuthContext
  const { user } = useAuth();

  // Control the password modal
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>

      {/* Profile section */}
      <ProfileSummaryCard user={user} />

      {/* Security section (Change password)*/}
      <Card
        title="Security"
        extra={
          <Button
            type="primary"
            icon={<LockOutlined />}
            onClick={() => setPasswordOpen(true)}
          >
            Change Password
          </Button>
        }
      >

        {/* Title for the security section */}
        <Typography.Paragraph style={{ marginBottom: 8 }}>
          To keep your account secure, update your password regularly.
        </Typography.Paragraph>

        {/* Tips for changing the password */}
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Click the button above to open the password change form.
        </Typography.Paragraph>
      </Card>

      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />

    </Space>
  );
}
