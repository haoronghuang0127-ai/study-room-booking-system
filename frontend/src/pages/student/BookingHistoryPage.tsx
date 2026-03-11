import { Card, Table, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getMyBookings } from '../../api/bookings';
import type { Booking } from '../../types';
import { formatDate, formatTime } from '../../utils/format';

export default function BookingHistoryPage() {
  //  set  bookings and loading state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  //  fetch my bookings
  useEffect(() => {
    void (async () => {
      // Set the loading state to true
      setLoading(true);

      // Fetch my bookings and set the bookings state
      try {
        const data = await getMyBookings();
        setBookings(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  

  // filter bookings by status (cancelled, rejected)
  const history = useMemo(() => bookings.filter(
      (item) => ['cancelled', 'rejected'].includes(item.status)
    ), [bookings]
  );

  return (
    <Card>
      <Typography.Title level={2}>Booking History</Typography.Title>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={history}
        columns={[
          { title: 'Room', dataIndex: 'room_name' },
          { title: 'Date', dataIndex: 'booking_date', render: (booking_date) => formatDate(booking_date) },
          { title: 'Start', dataIndex: 'start_time', render: (start_time) => formatTime(start_time) },
          { title: 'End', dataIndex: 'end_time', render: (end_time) => formatTime(end_time) },
     
        ]}
      />
    </Card>
  );
}
