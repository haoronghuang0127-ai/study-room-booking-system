import { Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { Room } from '../../types';

export default function RoomCard({ room }: { room: Room }) {
  return (
    // Use Ant Design's Card component to display the room information, 
    // with the room name as the title and a status tag as an extra element
    <Card title={room.name} 
    extra={<Tag color={room.is_active ? 'green' : 'red'}>{room.is_active ? 'Available' : 'Inactive'}</Tag>}>

      {/* Use Descriptions to layout the room details in a vertical format, with labels and values. */}
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Capacity">{room.capacity}</Descriptions.Item>
        <Descriptions.Item label="Location">{room.location}</Descriptions.Item>
        <Descriptions.Item label="Building">{room.building?.name}</Descriptions.Item>
        <Descriptions.Item label="Equipment">

          {/* Use Space to layout the equipment tags with wrapping. 
          If there are no equipment items, show a secondary text message. */}
          <Space wrap>
            {room.equipment?.length ? 
            room.equipment.map((item) => <Tag key={item.id}>{item.name}</Tag>) : 
            <Typography.Text type="secondary">No equipment listed</Typography.Text>}
          </Space>

        </Descriptions.Item>

      </Descriptions>
      
      {/* Use Space to layout the action buttons with some margin on top. */}
      <Space style={{ marginTop: 16 }}>

        {/* Link the "View details" button to the room details page passing the room ID in the URL. */}
        <Link to={`/student/rooms/${room.id}`}>
          <Button type="primary">View details</Button>
        </Link>

      </Space>
      
    </Card>
  );
}
