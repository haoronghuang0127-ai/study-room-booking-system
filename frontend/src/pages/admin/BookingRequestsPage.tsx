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
    <Card>
      <Typography.Title level={2}>Booking Requests</Typography.Title>
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
  );
}
