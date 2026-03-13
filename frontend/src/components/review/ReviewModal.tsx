import { Button, Form, Input, Modal, Rate, message } from 'antd';
import { createReview } from '../../api/reviews';

interface Props {
  open: boolean;
  bookingId: number;
  roomName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ open, bookingId, roomName, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();

  const handleFinish = async (values: { rating: number; comment?: string }) => {
    try {
      await createReview({
        booking: bookingId,
        rating: values.rating,
        comment: values.comment || '',
      });

      message.success('Review submitted');
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error: any) {
      const detail =
        error?.response?.data?.non_field_errors?.[0] ||
        error?.response?.data?.detail ||
        'Failed to submit review';

      message.error(detail);
    }
  };

  return (
    <Modal open={open} title={`Review ${roomName}`} onCancel={onClose} footer={null} destroyOnHidden>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item label="Rating" name="rating" rules={[{ required: true, message: 'Please give a rating' }]}>
          <Rate />
        </Form.Item>
        <Form.Item label="Comment" name="comment">
          <Input.TextArea rows={4} placeholder="Write your review" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit review
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
