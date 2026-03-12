import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, Modal, Select, Space, Switch, Table, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { deleteRoom, getBuildings, getRooms, updateRoom, createRoom } from '../../api/rooms';
import type { Building, Room } from '../../types';

export default function RoomManagementPage() {
  // set rooms, buildings, loading, open, editing
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  
  // set form
  const [form] = Form.useForm();

  // load data
  const loadData = async () => {
    setLoading(true);
    try {
      // get rooms and buildings
      const [roomData, buildingData] = await Promise.all([getRooms(), getBuildings()]);

      // set rooms and buildings
      setRooms(roomData);
      setBuildings(buildingData);
    } finally {
      setLoading(false);
    }
  };

  // load data
  useEffect(() => {
    void loadData();
  }, []);

  // open create, the click function for the add room button
  const openCreate = () => {
    // set the edit to null because it is a new room
    setEditing(null);

    // reset the form
    form.resetFields();
    // set the new rooom is_active to true and the equipment to empty
    form.setFieldsValue({ is_active: true, equipment: [] });

    // open the dialog
    setOpen(true);
  };

  // the fucntion for the edit button
  const openEdit = (room: Room) => {
    // set the editing room
    setEditing(room);

    // set the form
    form.setFieldsValue({
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      is_active: room.is_active,
      building: room.building.id,
      equipment: room.equipment.map((item) => item.id),
    });

    // open the dialog
    setOpen(true);
  };


  // the function for the delete button
  const handleDelete = async (id: number) => {
    try {
      // delete the room
      await deleteRoom(id);
      message.success('Room deleted');


      // reload
      await loadData();
    } catch {
      // show error if failed
      message.error('Failed to delete room');
    }
  };

  // the function for the submit button of the dialog
  const handleSubmit = async () => {
    try {
      // validate the form
      const values = await form.validateFields();

      // just to make sure the form is create or update
      if (editing) {
        // update the room
        await updateRoom(editing.id, values);
        message.success('Room updated');
      } else {
        // create the room
        await createRoom(values);
        message.success('Room created');
      }

      // close the dialog
      setOpen(false);

      // reload
      await loadData();
    } catch (error) {
      if (error) {
        // ignore form validation interruption
      }
    }
  };

  return (

    // main card
    <Card
      title={<Typography.Title level={3} style={{ margin: 0 }}>Room Management</Typography.Title>}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Add Room</Button>}
    >

      {/* table */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={rooms}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Building', render: (_, record: Room) => record.building.name },
          { title: 'Capacity', dataIndex: 'capacity' },
          { title: 'Location', dataIndex: 'location' },
          { title: 'Active', render: (_, record: Room) => (record.is_active ? 'Yes' : 'No') },
          {
            title: 'Actions',
            render: (_, record: Room) => (
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
        title={editing ? 'Edit room' : 'Create room'}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        destroyOnHidden
      >

        {/* room form */}
        <Form layout="vertical" form={form}>
          {/* room name */}
          <Form.Item label="Room name" name="name" rules={[{ required: true }]}><Input /></Form.Item>

          {/* capacity */}
          <Form.Item label="Capacity" name="capacity" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          
          {/* location */}
          <Form.Item label="Location" name="location" rules={[{ required: true }]}><Input /></Form.Item>

          {/* building */}
          <Form.Item label="Building" name="building" rules={[{ required: true }]}>
            <Select options={buildings.map((item) => ({ label: item.name, value: item.id }))} />
          </Form.Item>

          {/* equipment */}
          <Form.Item label="Equipment IDs" name="equipment">
            <Select mode="tags" placeholder="Enter equipment IDs such as 1,2" tokenSeparators={[',']} />
          </Form.Item>

          {/* isActive */}
          <Form.Item label="Active" name="is_active" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
