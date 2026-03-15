import { UserOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppHeader from '../AppHeader';
import type { NavigationItem } from '../../types/navigation';
import { getProfileRouteByRole } from '../../utils/defaultRoute';


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
    const selected = getSelectedKey(location.pathname, items, defaultPath);

    // Get the profile path based on the current layout type
    const profilePath = getProfileRouteByRole(defaultPath === '/admin' ? 'admin' : 'student');

    return (
        // Render the layout with 100% viewport height
        <Layout className="app-shell">

            {/* Render the header component */}
            <AppHeader />

            {/* Render the sidebar and content */}
            <div className="app-shell__body">

              {/* Render the sidebar with a menu and a white navigation card */}
              <aside className="app-shell__aside">
                  <div className="app-shell__nav">

                    <Typography.Text className="app-shell__nav-label">
                      Navigation
                    </Typography.Text>

                    <Menu
                      mode="inline"
                      selectedKeys={selected ? [selected] : []}
                      items={items}
                      onClick={handleMenuClick}
                      className="app-shell__menu"
                    />

                    {/* Render a footer action for quick profile access */}
                    <div className="app-shell__nav-footer">
                      <Typography.Text className="app-shell__nav-footer-copy">
                        Need account settings or password changes?
                      </Typography.Text>

                      <Button icon={<UserOutlined />} block onClick={() => navigate(profilePath)}>
                        Open profile
                      </Button>
                    </div>
                  </div>
              </aside>

              <Layout.Content className="app-shell__content">
                  <div className="app-shell__panel">
                    <Outlet />
                  </div>
              </Layout.Content>
            </div>

        </Layout>
    );

}


// function to determine the selected menu item based on the current location
function getSelectedKey(pathname: string, items: NavigationItem[], defaultPath: string){
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
