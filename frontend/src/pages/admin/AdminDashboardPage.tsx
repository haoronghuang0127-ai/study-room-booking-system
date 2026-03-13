import { CheckCircleOutlined, ClockCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getAllBookings } from '../../api/bookings';
import { getRooms } from '../../api/rooms';
import type { Booking, Room } from '../../types';

export default function AdminDashboardPage() {
  // set rooms and bookings state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // render the dashboard first time
  useEffect(() => {
    void (async () => {
      // get rooms and bookings
      const [roomData, bookingData] = await Promise.all([getRooms(), getAllBookings()]);

      // set rooms and bookings
      setRooms(roomData);
      setBookings(bookingData);
    })();
  }, []);

  return (
    <>
      {/* Title */}
      <Typography.Title level={2}>Admin Dashboard</Typography.Title>

      {/* Statistics for the admin */}
      <Row gutter={[16, 16]}>

        {/* Cards for Total rooms */}
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Total rooms" value={rooms.length} prefix={<HomeOutlined />} />
          </Card>
        </Col>

        {/* Cards for Pending bookings */}
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Pending bookings" value={bookings.filter((b) => b.status === 'pending').length} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>

        {/* Cards for Approved bookings */}
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Approved bookings" value={bookings.filter((b) => b.status === 'approved').length} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
