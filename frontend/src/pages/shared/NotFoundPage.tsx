import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (

    // Use Ant Design's Result component to display a 404 error message
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={extra()}
    />
  );
}


// Function to render the back home button
function extra() {
  return (
    <Link to="/">
      <Button type="primary">Back Home</Button>
    </Link>
  );
}

