import {
  MailOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Descriptions, Space, Tag, Typography } from 'antd';
import type { User } from '../../types';

// Interface for the props
interface Props {
  user: User | null;
}

// Component to display a summary of the user's profile
export default function ProfileSummaryCard({ user }: Props) {
  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space align="start" size="large" wrap>

            {/* Avatar(Icon) for the user */}
            <Avatar
            size={72}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1677ff', flexShrink: 0 }}
            />

            {/* User's name, email, and role */}
            <Space direction="vertical" size={4}>

                {/* User's name */}
                <Typography.Title level={3} style={{ margin: 0 }}>
                {user?.username || 'User'}
                </Typography.Title>

                {/* User's email and role */}
                <Space wrap size={8}>

                    {/* Email address */}
                    <Typography.Text type="secondary">
                        <MailOutlined style={{ marginRight: 6 }} />
                        {user?.email || 'No email address'}
                    </Typography.Text>

                    {/* User's role */}
                    <Tag
                        color={user?.role === 'admin' ? 'gold' : 'blue'}
                        icon={<SafetyCertificateOutlined />}
                    >
                        {user?.role || 'user'}
                    </Tag>
                </Space>


            </Space>


        </Space>

        {/* User details (Text)*/}
        <Descriptions
          column={1}
          colon={false}
          labelStyle={{ width: 120, fontWeight: 600, color: '#667085' }}
          contentStyle={{ color: '#101828' }}
        >
            {/* username */}
            <Descriptions.Item label="Username">{user?.username || '-'}</Descriptions.Item>

            {/* email */}
            <Descriptions.Item label="Email">{user?.email || '-'}</Descriptions.Item>

            {/* role */}
            <Descriptions.Item label="Role">

                {/* User's role using a tag with different colors */}
                <Tag color={user?.role === 'admin' ? 'gold' : 'blue'}>
                {user?.role || '-'}
                </Tag>
                
            </Descriptions.Item>

        </Descriptions>
        
      </Space>

    </Card>
  );
}
