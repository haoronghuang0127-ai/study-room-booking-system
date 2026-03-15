import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Select, Space, Switch, Table, Tag, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { createAdminUser, deleteAdminUser, getAdminUsers, updateAdminUser } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import type { AdminUser, AdminUserPayload } from '../../types';

function getFieldMessage(value?: string[] | string) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as {
      response?: {
        data?: {
          detail?: string;
          username?: string[] | string;
          password?: string[] | string;
          email?: string[] | string;
        }
      }
    }).response;

    if (response?.data?.detail) {
      return response.data.detail;
    }

    const usernameMessage = getFieldMessage(response?.data?.username);
    if (usernameMessage) {
      return usernameMessage;
    }

    const passwordMessage = getFieldMessage(response?.data?.password);
    if (passwordMessage) {
      return passwordMessage;
    }

    const emailMessage = getFieldMessage(response?.data?.email);
    if (emailMessage) {
      return emailMessage;
    }
  }

  return fallback;
}

export default function UserManagementPage() {
  // get the current login user so the page can protect the active admin account
  const { user } = useAuth();

  // set users, loading, open, editing and form state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form] = Form.useForm();

  // load all users for the admin page
  const loadData = async () => {
    // set loading to true
    setLoading(true);

    try {
      // get the users
      const data = await getAdminUsers();
      // set users
      setUsers(data);
    } catch {
      // show error
      message.error('Failed to load users');
    } finally {
      // set loading to false
      setLoading(false);
    }
  };

  // load data
  useEffect(() => {
    void loadData();
  }, []);

  const adminCount = users.filter((item) => item.role === 'admin').length;
  const studentCount = users.length - adminCount;
  const activeCount = users.filter((item) => item.is_active).length;
  const inactiveCount = users.length - activeCount;


  // open create
  const openCreate = () => {
    // reset the editing user and form state
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      role: 'student',
      is_active: true,
    });

    // open the dialog
    setOpen(true);
  };

  // open edit
  const openEdit = (managedUser: AdminUser) => {
    // set the editing user
    setEditing(managedUser);

    // set the form fields
    form.setFieldsValue({
      username: managedUser.username,
      email: managedUser.email,
      role: managedUser.role,
      is_active: managedUser.is_active,
      password: undefined,
    });

    // open the dialog
    setOpen(true);
  };

  // handle delete
  const handleDelete = async (id: number) => {
    try {
      // delete the user
      await deleteAdminUser(id);
      message.success('User deleted');

      // reload
      await loadData();
    } catch (error) {
      // show error
      message.error(getErrorMessage(error, 'Failed to delete user'));
    }
  };

  // handle submit
  const handleSubmit = async () => {
    try {
      // validate the form
      const values = await form.validateFields();
      const payload: AdminUserPayload = {
        username: values.username,
        email: values.email,
        role: values.role,
        is_active: values.is_active,
      };

      // only send password when the admin enters a new one
      if (values.password) {
        payload.password = values.password;
      }

      // check if the form is create or update
      if (editing) {
        await updateAdminUser(editing.id, payload);
        message.success('User updated');
      } else {
        await createAdminUser(payload);
        message.success('User created');
      }

      // close the dialog
      setOpen(false);

      // reload the data
      await loadData();
    } catch (error) {
      const hasErrorFields = typeof error === 'object' && error !== null && 'errorFields' in error;

      if (hasErrorFields) {
        return;
      }

      // show error
      message.error(getErrorMessage(error, editing ? 'Failed to update user' : 'Failed to create user'));
    }
  };

  return (
    <div className="records-page">

      <div className="records-hero">
        <div className="records-hero__copy">
          <Typography.Text className="records-hero__eyebrow">
            Admin accounts
          </Typography.Text>

          <Typography.Title level={2} className="records-hero__title">
            User Management
          </Typography.Title>

          <Typography.Paragraph className="records-hero__desc">
            Create, edit, and maintain student and admin accounts without leaving the admin workspace.
          </Typography.Paragraph>

          <div className="records-pills">
            <span className="records-pill">{users.length} total users</span>
            <span className="records-pill">{adminCount} admin</span>
            <span className="records-pill">{studentCount} student</span>
            <span className="records-pill">{inactiveCount} inactive</span>
          </div>
        </div>

        <div className="records-hero__aside">
          <div className="records-hero__panel">
            <Typography.Text className="records-hero__panel-label">
              Active accounts
            </Typography.Text>

            <Typography.Title level={3} className="records-hero__panel-value">
              {activeCount}
            </Typography.Title>

            <Typography.Paragraph className="records-hero__panel-copy">
              {inactiveCount} account{inactiveCount === 1 ? '' : 's'} are currently inactive.
            </Typography.Paragraph>
          </div>
        </div>
      </div>

      <div className="records-toolbar">
        <div className="records-toolbar__content">
          <Typography.Text className="records-toolbar__title">
            Manage user records
          </Typography.Text>

          <Typography.Text className="records-toolbar__meta">
            {users.length} account{users.length === 1 ? '' : 's'} loaded in the current list
          </Typography.Text>
        </div>

        <div className="records-toolbar__actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add User
          </Button>
        </div>
      </div>


      <Card className="records-table-card">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={users}
          columns={[
            { title: 'Username', dataIndex: 'username' },
            { title: 'Email', dataIndex: 'email' },
            {
              title: 'Role',
              dataIndex: 'role',
              render: (role: AdminUser['role']) => (
                <Tag color={role === 'admin' ? 'gold' : 'blue'}>
                  {role}
                </Tag>
              ),
            },
            {
              title: 'Active',
              dataIndex: 'is_active',
              render: (value: boolean) => (value ? 'Yes' : 'No'),
            },
            { title: 'Bookings', dataIndex: 'booking_count' },
            { title: 'Reviews', dataIndex: 'review_count' },
            { title: 'Processed', dataIndex: 'processed_booking_count' },
            {
              title: 'Actions',
              render: (_, record: AdminUser) => (
                <Space>
                  <Button icon={<EditOutlined />} onClick={() => openEdit(record)}>Edit</Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record.id)}
                    disabled={record.id === user?.id}
                  >
                    Delete
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        open={open}
        title={editing ? 'Edit user' : 'Create user'}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        destroyOnHidden
      >
        <Form layout="vertical" form={form}>
          {/* username */}
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please enter a username' }]}
          >
            <Input />
          </Form.Item>

          {/* email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter an email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>

          {/* password */}
          <Form.Item
            label={editing ? 'New password' : 'Password'}
            name="password"
            rules={[
              {
                validator(_, value) {
                  if (!editing && !value) {
                    return Promise.reject(new Error('Please enter a password'));
                  }

                  if (value && value.length < 8) {
                    return Promise.reject(new Error('Password must be at least 8 characters long'));
                  }

                  return Promise.resolve();
                },
              },
            ]}
            extra={editing ? 'Leave blank if you do not want to change the password.' : undefined}
          >
            <Input.Password />
          </Form.Item>

          {/* role */}
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select
              options={[
                { label: 'Student', value: 'student' },
                { label: 'Admin', value: 'admin' },
              ]}
            />
          </Form.Item>

          {/* active status */}
          <Form.Item label="Active" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
}
