import { Button, Card, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { Room } from '../../types';
import { EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';


export default function RoomCard({ room }: { room: Room }) {
  return (
    // Use Ant Design's Card component to display a cleaner room overview
    <Card className="room-card">

      {/* Display the room title and status */}
      <div className="room-card__top">
        <div>
          <Typography.Text className="room-card__building">
            {room.building?.name || 'Building not set'}
          </Typography.Text>

          <Typography.Title level={4} className="room-card__title">
            {room.name}
          </Typography.Title>
        </div>

        <Tag className={room.is_active ? 'room-card__status room-card__status--active' : 'room-card__status room-card__status--inactive'}>
          {room.is_active ? 'Available' : 'Inactive'}
        </Tag>
      </div>

      {/* Display the main room facts */}
      <div className="room-card__stats">
        <div className="room-chip">
          <TeamOutlined />
          <span>{room.capacity} seats</span>
        </div>

        <div className="room-chip">
          <EnvironmentOutlined />
          <span>{room.location}</span>
        </div>
      </div>

      {/* Display the room equipment */}
      <div>
        <Typography.Text className="room-card__section-label">
          Equipment
        </Typography.Text>

        <div className="room-card__equipment">
          {room.equipment?.length ? (
            room.equipment.map((item) => <Tag key={item.id}>{item.name}</Tag>)
          ) : (
            <Typography.Text type="secondary">No equipment listed</Typography.Text>
          )}
        </div>
      </div>

      {/* Link the user to the room detail page */}
      <div className="room-card__footer">
        <Link to={`/student/rooms/${room.id}`}>
          <Button type="primary" className="room-card__button">
            View details
          </Button>
        </Link>
      </div>

    </Card>
  );

}
