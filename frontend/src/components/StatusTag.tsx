import { Tag } from 'antd';


export default function StatusTag({ status }: { status?: string }) {
  
  const item = getItem(status);

  return <Tag color={item.color}>{item.label}</Tag>;
}


// Define a configuration object that maps normalized status values to their corresponding color and label
const CONFIG: Record<string, { color: string; label: string }> = {
  approved: { color: 'green', label: 'Approved' },
  pending: { color: 'gold', label: 'Pending' },
  rejected: { color: 'red', label: 'Rejected' },
  cancelled: { color: 'default', label: 'Cancelled' },
};


function getItem(status? : string){
  // Normalize the status string to lowercase for consistent comparison
  const normalized = status?.toLowerCase();

  

  // Use the normalized status to look up the corresponding item in the config, 
  // or default to a generic item if the status is not recognized
  const key = normalized || 'pending';

  // Define a default item to use if the status is not found in the config
  const defaultItem = { color: 'default', label: status || 'Unknown' };

  // Get the item from the config based on the key, or use the default item if the key is not found
  const item = CONFIG[key] || defaultItem;

  return item;
}
