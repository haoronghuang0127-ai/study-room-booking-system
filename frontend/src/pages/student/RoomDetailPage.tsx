import { Button, Card, Descriptions, List, Rate, Space, Tag, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createReview, getReviews } from '../../api/reviews';
import { getRoomDetail } from '../../api/rooms';
import BookingModal from '../../components/BookingModal';
import LoadingScreen from '../../components/LoadingScreen';
import type { Review, Room } from '../../types';
import { formatDateTime } from '../../utils/format';

export default function RoomDetailPage() {
  // Get the room ID from the URL
  const { id } = useParams();
  // Set up room, reviews, loading, and bookingOpen state variables
  const [room, setRoom] = useState<Room | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Function to fetch room details and reviews
  const loadData = async () => {

    //  Return early if the room ID is not available
    if(!id){
      return 
    }

    // Set the loading state to true
    setLoading(true);

    // Fetch room details and reviews
    try {
      const [roomData, reviewData] = await Promise.all([getRoomDetail(id), getReviews(Number(id))]);
      // Set the room and reviews state
      setRoom(roomData);
      setReviews(reviewData);
    } finally {
      // Set the loading state to false
      setLoading(false);
    }
  };

  // Call the loadData function when the room ID changes
  useEffect(() => {
    void loadData();
  }, [id]);

  // Render the loading screen while the room details are being fetched
  if (loading){
    return <LoadingScreen text="Loading room details..." />;
  }

  // Render a message if the room is not found
  if (!room){
    return <Typography.Text>Room not found.</Typography.Text>;
  }

  const handleQuickReview = async () => {
    try {
      await createReview({ room: room.id, rating: 5, comment: 'Good room for study.' });
      message.success('Review submitted');
      await loadData();
    } catch {
      message.error('Failed to submit review');
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>

      {/* Render a card with room details */}
      <Card
        title={room.name}
        extra={<Tag color={room.is_active ? 'green' : 'red'}>{room.is_active ? 'Available' : 'Inactive'}</Tag>}
      >

        {/* Render a description list with room details */}
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Capacity">{room.capacity}</Descriptions.Item>
          <Descriptions.Item label="Location">{room.location}</Descriptions.Item>
          <Descriptions.Item label="Building">{room.building?.name}</Descriptions.Item>
          <Descriptions.Item label="Equipment">
            <Space wrap>
              {room.equipment.map((item) => <Tag key={item.id}>{item.name}</Tag>)}
            </Space>
          </Descriptions.Item>
        </Descriptions>

        {/* Render action buttons */}
        <Space style={{ marginTop: 16 }} wrap>
          <Button type="primary" onClick={() => setBookingOpen(true)}>Book this room</Button>
          <Button onClick={handleQuickReview}>Leave quick 5-star review</Button>
        </Space>
      </Card>

      {/* Render a card with room reviews */}
      <Card title="Room Reviews">
        <List
          locale={{ emptyText: 'No reviews yet' }}
          dataSource={reviews}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Space><span>{item.student_username}</span><Rate disabled value={item.rating} /></Space>}
                description={<>{item.comment}<br />{formatDateTime(item.created_at)}</>}
              />
            </List.Item>
          )}
        />
      </Card>
      
      {/* Render the booking modal */}
      <BookingModal
        open={bookingOpen}
        roomId={room.id}
        roomName={room.name}
        onClose={() => setBookingOpen(false)}
        onSuccess={loadData}
      />
    </Space>
  );
}
