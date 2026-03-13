import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Space, Table, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { createEquipment, deleteEquipment, getEquipments, updateEquipment } from '../../api/rooms';
import type { Equipment } from '../../types';

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { detail?: string } } }).response;
    if (response?.data?.detail) {
      return response.data.detail;
    }
  }

  return fallback;
}

export default function EquipmentManagementPage() {
  // set equipments, loading, open, editing and form state
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [form] = Form.useForm();

  // load data
  const loadData = async () => {
    // set loading to true
    setLoading(true);

    try {
      // get equipments
      const data = await getEquipments();
      // set equipments
      setEquipments(data);
    } catch {
      // show error
      message.error('Failed to load equipments');
    } finally {
        // set loading to false
      setLoading(false);
    }
  };

  // load data
  useEffect(() => {
    void loadData();
  }, []);

  // open create
  const openCreate = () => {
    // reset the form
    setEditing(null);

    // set the status to available
    form.resetFields();
    form.setFieldsValue({ status: 'available' });

    // open the dialog
    setOpen(true);
  };

  const openEdit = (equipment: Equipment) => {
    // set the editing room
    setEditing(equipment);

    // set the form
    form.setFieldsValue({
      name: equipment.name,
      status: equipment.status,
    });

    // open the dialog
    setOpen(true);
  };

  // handle delete
  const handleDelete = async (id: number) => {
    try {
      // delete the room
      await deleteEquipment(id);
      message.success('Equipment deleted');

      // reload
      await loadData();
    } catch (error) {
      // show error
      message.error(getErrorMessage(error, 'Failed to delete equipment'));
    }
  };

  // handle submit
  const handleSubmit = async () => {
    try {
      // validate the form
      const values = await form.validateFields();
      
      // just to make sure the form is create or update
      if (editing) {
        await updateEquipment(editing.id, values);
        message.success('Equipment updated');
      } else {
        await createEquipment(values);
        message.success('Equipment created');
      }
      
      // close the dialog
      setOpen(false);
      await loadData();
    } catch (error) {
      // check if there are error fields
      const hasErrorFields = typeof error === 'object' && error !== null && 'errorFields' in error;
      
      // if there are error fields, return
      if (hasErrorFields) {
        return;
      }

      // show error
      message.error(getErrorMessage(error, editing ? 'Failed to update equipment' : 'Failed to create equipment'));
    }
  };

  return (
    <Card
      title={<Typography.Title level={3} style={{ margin: 0 }}>Equipment Management</Typography.Title>}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Add Equipment</Button>}
    >
      <Table
        rowKey="id"
        loading={loading}
        dataSource={equipments}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Status', dataIndex: 'status' },
          {
            title: 'Actions',
            render: (_, record: Equipment) => (
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
        title={editing ? 'Edit equipment' : 'Create equipment'}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        destroyOnHidden
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Equipment name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
