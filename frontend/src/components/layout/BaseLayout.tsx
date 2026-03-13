import { Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppHeader from '../AppHeader';
import type { NavigationItem } from '../../types/navigation';


interface BaseLayoutProps{
    items: any[];
    defaultPath: string;
}



export default function BaseLayout({items, defaultPath}: BaseLayoutProps) {
    // Use the useLocation hook to get the current location
    const location = useLocation();
    // Use the useNavigate hook to get the navigate function for programmatic navigation
    const navigate = useNavigate();

    // Function to handle menu item clicks and navigate to the corresponding route
    const handleMenuClick = ({ key }: {key : string}) =>{
        navigate(key);
    }

    // Determine the selected menu item based on the current location
    const selected = getSelectedKey(location, items,defaultPath);

    return (
        // Render the layout with 100% viewport height
        <Layout style={{ minHeight: '100vh' }}>

            {/* Render the header component */}
            <AppHeader />

            {/* Render the sidebar and content */}
            <Layout>
              {/* Render the sidebar with a breakpoint for responsiveness, and a menu with navigation items */}
              <Layout.Sider breakpoint="lg" collapsedWidth="0" width={220} theme="light">
                  <Menu
                    mode="inline"
                    selectedKeys={selected ? [selected] : []}
                    items={items}
                    onClick={handleMenuClick}
                    style={{ height: '100%', borderInlineEnd: 0 }}
                  />
              </Layout.Sider>

              
              <Layout.Content style={{ padding: 24 }}>
                  <Outlet />
              </Layout.Content>
            </Layout>

        </Layout>
    );
}


// function to determine the selected menu item based on the current location
function getSelectedKey(location: any, items: NavigationItem[], defaultPath: string){
  // Get the current pathname from the location object
  const pathname = location.pathname;

  // Keep defaultPath for the base route
  if (pathname === defaultPath) {
    return defaultPath;
  }

  // First check whether the current route exactly matches a menu item
  for (const item of items) {
    if (pathname === item.key) {
      return item.key;
    }
  }

  // If it is a nested route, keep the longest matched menu key
  let selectedKey = '';

  for (const item of items) {
    const isSubPathMatch = pathname.startsWith(`${item.key}/`);

    if (isSubPathMatch && item.key.length > selectedKey.length) {
      selectedKey = item.key;
    }
  }

  // If no matching menu item is found, return an empty string
  return selectedKey;
}
