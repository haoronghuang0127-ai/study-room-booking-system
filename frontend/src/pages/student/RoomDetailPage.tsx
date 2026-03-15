import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  MessageOutlined,
  StarFilled,
  TeamOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Button, Card, List, Rate, Space, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getReviews } from '../../api/reviews';
import { getRoomDetail } from '../../api/rooms';
import BookingModal from '../../components/booking/BookingModal';
import LoadingScreen from '../../components/LoadingScreen';
import type { Review, Room } from '../../types';
import { formatDateTime } from '../../utils/format';

export default function RoomDetailPage() {
  // Get the room ID from the URL
  const { id } = useParams();

  // Get the navigate function
  const navigate = useNavigate();

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

  const averageRating = reviews.length
    ? Number((reviews.reduce((total, item) => total + item.rating, 0) / reviews.length).toFixed(1))
    : 0;

  const equipmentCount = room.equipment?.length || 0;

  const bookingStatusMessage = getbookingStatusMesage(room);



    return (
    <>
      <div className="room-detail-page">

        {/* Render a back button */}
        <Button className="room-detail-back" icon={<ArrowLeftOutlined />} onClick={() => navigate('/student/rooms')}>
          Back to Browse Rooms
        </Button>

        {/* Render the room hero section */}
        <div className="room-detail-hero">
          <div className="room-detail-hero__content">
            <Typography.Text className="room-detail-hero__eyebrow">
              {room.building?.name || 'Study room'}
            </Typography.Text>

            <div className="room-detail-hero__title-row">
              <Typography.Title level={2} className="room-detail-hero__title">
                {room.name}
              </Typography.Title>

              <Tag className={room.is_active ? 'room-card__status room-card__status--active' : 'room-card__status room-card__status--inactive'}>
                {room.is_active ? 'Available' : 'Inactive'}
              </Tag>
            </div>

            <Typography.Paragraph className="room-detail-hero__copy">
              Review the location, capacity, equipment, and student feedback before creating a booking request.
            </Typography.Paragraph>

            <div className="room-detail-hero__meta">
              <div className="room-detail-meta-chip">
                <EnvironmentOutlined />
                <span>{room.location}</span>
              </div>

              <div className="room-detail-meta-chip">
                <TeamOutlined />
                <span>{room.capacity} seats</span>
              </div>

              <div className="room-detail-meta-chip">
                <ToolOutlined />
                <span>{equipmentCount} equipment item{equipmentCount === 1 ? '' : 's'}</span>
              </div>
            </div>
          </div>

          <div className="room-detail-hero__side">
            <div className="room-detail-score">
              <Typography.Text className="room-detail-score__label">
                Room rating
              </Typography.Text>

              <div className="room-detail-score__value-row">
                <Typography.Title level={2} className="room-detail-score__value">
                  {reviews.length ? averageRating : 'New'}
                </Typography.Title>

                <Rate disabled allowHalf value={averageRating} />
              </div>

              <Typography.Paragraph className="room-detail-score__copy">
                {reviews.length
                  ? `${reviews.length} student review${reviews.length === 1 ? '' : 's'} available for this room.`
                  : 'No reviews yet. The first completed booking can become the first review.'}
              </Typography.Paragraph>
            </div>
          </div>
        </div>

        <div className="room-detail-grid">

          {/* Render a card with room details */}
          <Card className="room-detail-card">
            <Typography.Title level={4} className="room-detail-card__title">
              Room information
            </Typography.Title>

            <div className="room-detail-facts">
              <div className="room-detail-fact">
                <Typography.Text className="room-detail-fact__label">Building</Typography.Text>
                <Typography.Text className="room-detail-fact__value">{room.building?.name || 'Not set'}</Typography.Text>
              </div>

              <div className="room-detail-fact">
                <Typography.Text className="room-detail-fact__label">Location</Typography.Text>
                <Typography.Text className="room-detail-fact__value">{room.location}</Typography.Text>
              </div>

              <div className="room-detail-fact">
                <Typography.Text className="room-detail-fact__label">Capacity</Typography.Text>
                <Typography.Text className="room-detail-fact__value">{room.capacity} seats</Typography.Text>
              </div>

              <div className="room-detail-fact">
                <Typography.Text className="room-detail-fact__label">Opening hours</Typography.Text>
                <Typography.Text className="room-detail-fact__value">{room.building?.opening_hours || 'Not provided'}</Typography.Text>
              </div>
            </div>

            <div>
              <Typography.Text className="room-detail-section-label">
                Equipment
              </Typography.Text>

              <div className="room-detail-equipment">
                {room.equipment.length ? (
                  room.equipment.map((item) => <Tag key={item.id}>{item.name}</Tag>)
                ) : (
                  <Typography.Text type="secondary">No equipment listed</Typography.Text>
                )}
              </div>
            </div>
          </Card>

          {/* Render a side card with booking actions */}
          <Card className="room-detail-card">
            <Typography.Title level={4} className="room-detail-card__title">
              Booking access
            </Typography.Title>

            <Typography.Paragraph>
              {bookingStatusMessage}
            </Typography.Paragraph>

            <div className="guide-list">
              <div className="guide-item">
                <div className="guide-item__header">
                  <Typography.Text className="guide-item__title">Choose a date</Typography.Text>
                  <span className="guide-item__badge">Step 1</span>
                </div>

                <Typography.Text className="guide-item__desc">
                  Pick a future date that fits your study plan before selecting time slots.
                </Typography.Text>
              </div>

              <div className="guide-item">
                <div className="guide-item__header">
                  <Typography.Text className="guide-item__title">Select a time range</Typography.Text>
                  <span className="guide-item__badge">Step 2</span>
                </div>

                <Typography.Text className="guide-item__desc">
                  The booking form uses start and end time fields, so make sure the time range is accurate.
                </Typography.Text>
              </div>

              <div className="guide-item">
                <div className="guide-item__header">
                  <Typography.Text className="guide-item__title">Wait for review</Typography.Text>
                  <span className="guide-item__badge">Step 3</span>
                </div>

                <Typography.Text className="guide-item__desc">
                  After submission, track the request status from My Bookings until it is approved or rejected.
                </Typography.Text>
              </div>
            </div>

            <Button
              type="primary"
              block
              className="room-detail-book-btn"
              disabled={!room.is_active}
              onClick={() => {
                if (room.is_active) {
                  setBookingOpen(true);
                }
              }}
            >
              {room.is_active ? 'Book this room' : 'Room is inactive'}
            </Button>
          </Card>

        </div>

        {/* Render a card with room reviews */}
        <Card className="room-detail-card">
          <div className="room-detail-reviews__heading">
            <div>
              <Typography.Title level={4} className="room-detail-card__title">
                Room Reviews
              </Typography.Title>

              <Typography.Paragraph>
                Read student feedback before deciding whether this room fits your study session.
              </Typography.Paragraph>
            </div>

            <div className="room-detail-reviews__badge">
              <MessageOutlined />
              <span>{reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
            </div>
          </div>

          <List
            locale={{ emptyText: 'No reviews yet' }}
            dataSource={reviews}
            renderItem={(item) => (
              <List.Item className="room-review-item">
                <div className="room-review-item__header">
                  <div className="room-review-item__meta">
                    <Typography.Text strong>{item.student_username}</Typography.Text>
                    <Typography.Text type="secondary">{formatDateTime(item.created_at)}</Typography.Text>
                  </div>

                  <div className="room-review-item__rating">
                    <Space size="small">
                      <StarFilled className="room-review-star" />
                      <Typography.Text strong>{item.rating}/5</Typography.Text>
                    </Space>

                    <Rate disabled value={item.rating} />
                  </div>
                </div>

                <Typography.Paragraph className="room-review-item__comment">
                  {item.comment || 'No comment provided.'}
                </Typography.Paragraph>
              </List.Item>
            )}
          />
        </Card>

      </div>

      {/* Render the booking modal */}
      <BookingModal
        open={bookingOpen}
        roomId={room.id}
        roomName={room.name}
        onClose={() => setBookingOpen(false)}
        onSuccess={loadData}
      />
    </>
  );

}



function getbookingStatusMesage(room: Room) {
  const bookingStatusMessage = room.is_active
    ? 'This room is active and can currently accept booking requests.'
    : 'This room is marked as inactive, so new booking requests are unavailable right now.';

  return bookingStatusMessage;
}
