import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, Modal, Select, Space, Switch, Table, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { deleteRoom, getBuildings, getEquipments, getRooms, updateRoom, createRoom } from '../../api/rooms';
import type { Building, Equipment, Room } from '../../types';

export default function RoomManagementPage() {
  // set rooms, buildings, loading, open, editing
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  // set equipments
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  
  // set form
  const [form] = Form.useForm();

  // load data
  const loadData = async () => {
    // set loading to true
    setLoading(true);


    try {
      // get rooms, buildings and equipments
      const [roomData, buildingData, equipmentData] = await Promise.all([
      getRooms(),
      getBuildings(),
      getEquipments(),
    ]);

      // set rooms, buildings and equipments
      setRooms(roomData);
      setBuildings(buildingData);
      setEquipments(equipmentData);
    } finally {
      // set loading to false
      setLoading(false);
    }
  };

  // load data
  useEffect(() => {
    void loadData();
  }, []);

  const activeRoomCount = rooms.filter((room) => room.is_active).length;
  const inactiveRoomCount = rooms.length - activeRoomCount;


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
      const hasErrorFields = typeof error === 'object' && error !== null && 'errorFields' in error;

        if (hasErrorFields) {
          return;
        }

        message.error(editing ? 'Failed to update room' : 'Failed to create room');
    }
  };

  return (

    <div className="records-page">

      <div className="records-hero">
        <div className="records-hero__copy">
          <Typography.Text className="records-hero__eyebrow">
            Admin inventory
          </Typography.Text>

          <Typography.Title level={2} className="records-hero__title">
            Room Management
          </Typography.Title>

          <Typography.Paragraph className="records-hero__desc">
            Create, edit, and review room records, availability, capacity, and assigned equipment.
          </Typography.Paragraph>

          <div className="records-pills">
            <span className="records-pill">{rooms.length} total rooms</span>
            <span className="records-pill">{activeRoomCount} active</span>
            <span className="records-pill">{inactiveRoomCount} inactive</span>
          </div>
        </div>

        <div className="records-hero__aside">
          <div className="records-hero__panel">
            <Typography.Text className="records-hero__panel-label">
              Active rooms
            </Typography.Text>

            <Typography.Title level={3} className="records-hero__panel-value">
              {activeRoomCount}
            </Typography.Title>

            <Typography.Paragraph className="records-hero__panel-copy">
              {inactiveRoomCount} inactive room{inactiveRoomCount === 1 ? '' : 's'} still need admin attention.
            </Typography.Paragraph>
          </div>
        </div>
      </div>

      <div className="records-toolbar">
        <div className="records-toolbar__content">
          <Typography.Text className="records-toolbar__title">
            Manage room records
          </Typography.Text>

          <Typography.Text className="records-toolbar__meta">
            {rooms.length} room{rooms.length === 1 ? '' : 's'} in the current list
          </Typography.Text>
        </div>

        <div className="records-toolbar__actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add Room
          </Button>
        </div>
      </div>


      {/* main card */}
      <Card className="records-table-card">

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
            { title: 'Equipment', render: (_, record: Room) => record.equipment.length ? record.equipment.map((item) => item.name).join(', ') : 'None'},
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
      </Card>

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
          <Form.Item label="Equipment" name="equipment">
            <Select
              mode="multiple"
              placeholder="Select equipment"
              options={equipments.map((item) => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>

          {/* isActive */}
          <Form.Item label="Active" name="is_active" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>

    </div>
  );

}
