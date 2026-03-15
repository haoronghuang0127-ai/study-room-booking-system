import { Button, Card, Space, Table, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { approveBooking, getAllBookings, rejectBooking } from '../../api/bookings';
import StatusTag from '../../components/StatusTag';
import type { Booking } from '../../types';
import { formatDate, formatTime } from '../../utils/format';

export default function BookingRequestsPage() {
  // set bookings and loading state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);


  // load data
  const loadData = async () => {

    // set loading to true
    setLoading(true);

    try {
      // get all bookings
      const data = await getAllBookings();

      // set bookings
      setBookings(data);
    } finally {
      // set loading to false
      setLoading(false);
    }
  };

  // load data
  useEffect(() => {
    void loadData();
  }, []);

  const pendingCount = bookings.filter((item) => item.status === 'pending').length;
  const approvedCount = bookings.filter((item) => item.status === 'approved').length;
  const processedCount = bookings.length - pendingCount;



  // function for the approve button
  const handleApprove = async (id: number) => {
    try {
      // approve the booking
      await approveBooking(id);
      message.success('Booking approved');

      // reload
      await loadData();
    } catch {
      // show error
      message.error('Failed to approve booking');
    }
  };


  // function for the reject button
  const handleReject = async (id: number) => {
    try {
      // reject the booking
      await rejectBooking(id);
      message.success('Booking rejected');

      // reload
      await loadData();
    } catch {
      // show error
      message.error('Failed to reject booking');
    }
  };

  return (
    <div className="records-page">

      <div className="records-hero">
        <div className="records-hero__copy">
          <Typography.Text className="records-hero__eyebrow">
            Admin approvals
          </Typography.Text>

          <Typography.Title level={2} className="records-hero__title">
            Booking Requests
          </Typography.Title>

          <Typography.Paragraph className="records-hero__desc">
            Review student requests, approve valid bookings, and reject requests that cannot be fulfilled.
          </Typography.Paragraph>

          <div className="records-pills">
            <span className="records-pill">{bookings.length} total requests</span>
            <span className="records-pill">{pendingCount} pending</span>
            <span className="records-pill">{approvedCount} approved</span>
            <span className="records-pill">{processedCount} processed</span>
          </div>
        </div>

        <div className="records-hero__aside">
          <div className="records-hero__panel">
            <Typography.Text className="records-hero__panel-label">
              Pending queue
            </Typography.Text>

            <Typography.Title level={3} className="records-hero__panel-value">
              {pendingCount}
            </Typography.Title>

            <Typography.Paragraph className="records-hero__panel-copy">
              request{pendingCount === 1 ? '' : 's'} are waiting for admin review.
            </Typography.Paragraph>
          </div>
        </div>
      </div>

      <div className="records-toolbar">
        <div className="records-toolbar__content">
          <Typography.Text className="records-toolbar__title">
            Approval request list
          </Typography.Text>

          <Typography.Text className="records-toolbar__meta">
            {bookings.length} request{bookings.length === 1 ? '' : 's'} loaded
          </Typography.Text>
        </div>
      </div>


      <Card className="records-table-card">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={bookings}
          columns={[
            { title: 'Student', dataIndex: 'student_username' },
            { title: 'Room', dataIndex: 'room_name' },
            { title: 'Date', dataIndex: 'booking_date', render: (booking_date) => formatDate(booking_date) },
            { title: 'Start', dataIndex: 'start_time', render: (start_time) => formatTime(start_time) },
            { title: 'End', dataIndex: 'end_time', render: (end_time) => formatTime(end_time) },
            { title: 'Status', dataIndex: 'status', render: (value: string) => <StatusTag status={value} /> },
            {
              title: 'Actions',
              render: (_, record: Booking) => (
                <Space>
                  {/* Approve button */}
                  <Button type="primary" onClick={() => handleApprove(record.id)} disabled={record.status !== 'pending'}>
                    Approve
                  </Button>

                  {/* Reject button */}
                  <Button danger onClick={() => handleReject(record.id)} disabled={record.status !== 'pending'}>
                    Reject
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
