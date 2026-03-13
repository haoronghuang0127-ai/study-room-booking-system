import { BookOutlined, CalendarOutlined, DashboardOutlined, SearchOutlined } from '@ant-design/icons';
import BaseLayout from './BaseLayout';
import type { NavigationItem } from '../../types/navigation';

// Define the navigation items
const items: NavigationItem[] = [
  { key: '/student', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/student/rooms', icon: <SearchOutlined />, label: 'Browse Rooms' },
  { key: '/student/bookings', icon: <CalendarOutlined />, label: 'My Bookings' },
  { key: '/student/history', icon: <BookOutlined />, label: 'Booking History' },
];

// Export the StudentLayout component using the BaseLayout
export default function StudentLayout() {
  return <BaseLayout items={items} defaultPath="/student" />;
}