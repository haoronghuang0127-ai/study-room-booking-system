import { BankOutlined, CheckSquareOutlined, DashboardOutlined, HomeOutlined, MessageOutlined, TeamOutlined, ToolOutlined } from '@ant-design/icons';
import BaseLayout from './BaseLayout';
import type { NavigationItem } from '../../types/navigation';

// Define the navigation items
const items: NavigationItem[] = [
  { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/admin/rooms', icon: <HomeOutlined />, label: 'Room Management' },
  { key: '/admin/buildings', icon: <BankOutlined />, label: 'Building Management' },
  { key: '/admin/equipments', icon: <ToolOutlined />, label: 'Equipment Mgmt' },
  { key: '/admin/requests', icon: <CheckSquareOutlined />, label: 'Booking Requests' },
  { key: '/admin/support', icon: <MessageOutlined />, label: 'Support Desk' },
  { key: '/admin/users', icon: <TeamOutlined />, label: 'User Management' },
];

// Export the AdminLayout component using the BaseLayout
export default function AdminLayout() {
  return <BaseLayout items={items} defaultPath="/admin" />;
}
