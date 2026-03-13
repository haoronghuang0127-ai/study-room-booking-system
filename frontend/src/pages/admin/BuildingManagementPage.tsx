import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Space, Table, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { createBuilding, deleteBuilding, getBuildings, updateBuilding } from '../../api/rooms';
import type { Building } from '../../types';

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { detail?: string } } }).response;
    if (response?.data?.detail) {
      return response.data.detail;
    }
  }

  return fallback;
}

export default function BuildingManagementPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Building | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getBuildings();
      setBuildings(data);
    } catch {
      message.error('Failed to load buildings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (building: Building) => {
    setEditing(building);
    form.setFieldsValue({
      name: building.name,
      campus_area: building.campus_area,
      opening_hours: building.opening_hours,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBuilding(id);
      message.success('Building deleted');
      await loadData();
    } catch (error) {
      message.error(getErrorMessage(error, 'Failed to delete building'));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editing) {
        await updateBuilding(editing.id, values);
        message.success('Building updated');
      } else {
        await createBuilding(values);
        message.success('Building created');
      }

      setOpen(false);
      await loadData();
    } catch (error) {
      const hasErrorFields = typeof error === 'object' && error !== null && 'errorFields' in error;

      if (hasErrorFields) {
        return;
      }

      message.error(getErrorMessage(error, editing ? 'Failed to update building' : 'Failed to create building'));
    }
  };

  return (
    <Card
      title={<Typography.Title level={3} style={{ margin: 0 }}>Building Management</Typography.Title>}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Add Building</Button>}
    >
      <Table
        rowKey="id"
        loading={loading}
        dataSource={buildings}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Campus Area', dataIndex: 'campus_area' },
          { title: 'Opening Hours', dataIndex: 'opening_hours' },
          {
            title: 'Actions',
            render: (_, record: Building) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => openEdit(record)}>Edit</Button>
                <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Delete</Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        open={open}
        title={editing ? 'Edit building' : 'Create building'}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        destroyOnHidden
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Building name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Campus area" name="campus_area"><Input /></Form.Item>
          <Form.Item label="Opening hours" name="opening_hours"><Input placeholder="For example: 08:00-22:00" /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
