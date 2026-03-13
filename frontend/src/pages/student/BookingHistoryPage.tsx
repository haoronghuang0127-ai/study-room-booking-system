import { Card, Table, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getMyBookings } from '../../api/bookings';
import StatusTag from '../../components/StatusTag';
import type { Booking } from '../../types';
import { formatDate, formatTime } from '../../utils/format';
import dayjs from 'dayjs';


export default function BookingHistoryPage() {
  //  set  bookings, loading and reviewBooking state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

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

  //  fetch my bookings
  useEffect(() => {
    loadData();
  }, []);
  
  // check whether an approved booking has already ended
  const isEndedBooking = (item: Booking) => {
    return item.status === 'approved' && dayjs(`${item.booking_date} ${item.end_time}`).isBefore(dayjs());
  };

  // filter bookings if the booking is ended or inactive
  const history = useMemo(() => bookings.filter((item) => {
    // check if the booking is ended
    const isEndedApproved = isEndedBooking(item);

    // check if the booking is inactive
    const isInactive = ['cancelled', 'rejected'].includes(item.status);

    // return true if the booking is ended or inactive
    return isEndedApproved || isInactive;
  }), [bookings]);

  

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
          { title: 'Status', dataIndex: 'status', render: (value: string) => <StatusTag status={value} /> },
          { title: 'Review', 
            render: (_, booking: Booking) =>{
              if (booking.status !== 'approved') {
                return '-';
              }



              return '-';
            }
          }
        ]}
      />



    </Card>
  );
}
