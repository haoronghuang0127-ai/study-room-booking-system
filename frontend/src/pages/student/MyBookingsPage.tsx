import { Button, Card, Space, Table, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { cancelBooking, getMyBookings } from '../../api/bookings';
import StatusTag from '../../components/StatusTag';
import type { Booking } from '../../types';
import { formatDate, formatTime } from '../../utils/format';
import dayjs from 'dayjs';


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

  // check whether an approved booking has already ended
  const isEndedBooking = (item: Booking) => {
    return item.status === 'approved' && dayjs(`${item.booking_date} ${item.end_time}`).isBefore(dayjs());
  };

  // filter bookings by status (pending, approved)
  const upcoming = useMemo(() => bookings.filter((item) => {
    if (item.status === 'pending') {
      return true;
    }

    if (item.status === 'approved') {
      return !isEndedBooking(item);
    }

    return false;
  }), [bookings]);


  const pendingCount = upcoming.filter((item) => item.status === 'pending').length;
  const approvedUpcomingCount = upcoming.filter((item) => item.status === 'approved').length;

  
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
    <div className="records-page">

      <div className="records-hero">
        <div className="records-hero__copy">
          <Typography.Text className="records-hero__eyebrow">
            Student bookings
          </Typography.Text>

          <Typography.Title level={2} className="records-hero__title">
            My Bookings
          </Typography.Title>

          <Typography.Paragraph className="records-hero__desc">
            Track active requests and approved reservations that have not ended yet.
          </Typography.Paragraph>

          <div className="records-pills">
            <span className="records-pill">{upcoming.length} active bookings</span>
            <span className="records-pill">{pendingCount} pending</span>
            <span className="records-pill">{approvedUpcomingCount} approved upcoming</span>
          </div>
        </div>

        <div className="records-hero__aside">
          <div className="records-hero__panel">
            <Typography.Text className="records-hero__panel-label">
              Current results
            </Typography.Text>

            <Typography.Title level={3} className="records-hero__panel-value">
              {upcoming.length}
            </Typography.Title>

            <Typography.Paragraph className="records-hero__panel-copy">
              booking{upcoming.length === 1 ? '' : 's'} still need your attention.
            </Typography.Paragraph>
          </div>
        </div>
      </div>

      

      <div className="records-toolbar">
        <div className="records-toolbar__content">
          <Typography.Text className="records-toolbar__title">
            Active reservation list
          </Typography.Text>

          <Typography.Text className="records-toolbar__meta">
            {upcoming.length} booking{upcoming.length === 1 ? '' : 's'} found
          </Typography.Text>
        </div>
      </div>


      <Card className="records-table-card">
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
            { title: 'Status', dataIndex: 'status', render: (status: string) => <StatusTag status={status} /> },
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

    </div>
  );

}
