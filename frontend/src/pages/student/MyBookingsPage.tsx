import { Button, Card, Space, Table, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { cancelBooking, getMyBookings } from '../../api/bookings';
import type { Booking } from '../../types';
import { formatDate, formatTime } from '../../utils/format';

export default function MyBookingsPage() {
  //  set  bookings and loading state 
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);


  //  fetch my bookings
  const loadData = async () => {
    // Set the loading state to true
    setLoading(true);

    // Fetch my bookings and set the bookings state
    try {
      const data = await getMyBookings();
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  // load my bookings
  useEffect(() => {
    void loadData();
  }, []);

  // filter bookings by status (pending, approved)
  const upcoming = useMemo(() => bookings.filter(
      (item) => ['pending', 'approved'].includes(item.status)
    )
  , [bookings]);
  
  // cancel booking
  const handleCancel = async (id: number) => {
    try {
      // cancel booking
      await cancelBooking(id);
      message.success('Booking cancelled');
      // reload
      await loadData();
    } catch {
      message.error('Failed to cancel booking');
    }
  };

  return (
    <Card>
      <Typography.Title level={2}>My Bookings</Typography.Title>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={upcoming}
        pagination={{ pageSize: 6 }}
        columns={[
          { title: 'Room', dataIndex: 'room_name', key: 'room_name' },
          { title: 'Date', dataIndex: 'booking_date', render: (booking_date) => formatDate(booking_date) },
          { title: 'Start', dataIndex: 'start_time', render: (start_time) => formatTime(start_time) },
          { title: 'End', dataIndex: 'end_time', render: (end_time) => formatTime(end_time) },
          {
            title: 'Action',
            render: (_, booking: Booking) => (
              <Space>
                <Button danger onClick={() => handleCancel(booking.id)} disabled={booking.status === 'cancelled'}>
                  Cancel
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </Card>
  );
}
