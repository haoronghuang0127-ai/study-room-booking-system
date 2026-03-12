import { Flex, Spin, Typography } from 'antd';

// A simple loading screen component that displays a spinner and optional text
export default function LoadingScreen({ text = 'Loading...' }: { text?: string }) {
  return (
    // Center the spinner and text vertically and horizontally, with a minimum height to ensure it's visible
    <Flex vertical align="center" justify="center" style={{ minHeight: '60vh' }} gap={16}>
      <Spin size="large" />
      
      {/* Display the text below the spinner */}
      <Typography.Text>{text}</Typography.Text>
    </Flex>
  );
}

