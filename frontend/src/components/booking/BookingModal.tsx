import { Button, DatePicker, Form, Modal, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import { createBooking } from '../../api/bookings';
// import { useState } from 'react';

// Props interface for the BookingModal component, defining the expected props and their types
interface Props {
  open: boolean;
  roomId: number;
  roomName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingModal({ open, roomId, roomName, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  // const [submitting, setSubmitting] = useState(false);



  const handleFinish = async (values: any) => {
    try {
      
      // Call the createBooking function from the API to create a new booking
      await createBooking({
        room: roomId,
        booking_date: values.booking_date.format('YYYY-MM-DD'),
        start_time: values.start_time.format('HH:mm:ss'),
        end_time: values.end_time.format('HH:mm:ss'),
      });

      // Show a success message, reset the form, call the onSuccess callback, and close the modal
      message.success('Booking created successfully');

      // Reset the form fields to clear the input values for the next booking
      form.resetFields();

      // Call the onSuccess callback to allow the parent component to refresh the booking list or perform other actions
      onSuccess();
      // Call the onClose callback to close the modal after successful booking creation
      onClose();
    } catch (error: any) {
      // Extract the error message from the API response, or use a default message if not available
      const detail = error?.response?.data?.non_field_errors?.[0] || 'Failed to create booking';
      // Show an error message to the user if the booking creation fails
      message.error(detail);
    }
  };

  return (
    // Render the modal with a form for booking details
    <Modal open={open} title={`Book ${roomName}`} onCancel={onClose} footer={null} destroyOnHidden>

      {/* Use Ant Design's Form component to create a vertical form layout, with form validation rules for each field.
      The form will call the handleFinish function when submitted successfully. */}
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        {/* Form item for selecting the booking date, with a date picker that disables past dates. */}
        <Form.Item label="Date" name="booking_date" rules={[{ required: true, message: 'Please select a date' }]}>
          <DatePicker style={{ width: '100%' }} 
          placeholder="Select a date or input the date manually (YYYY-MM-DD)"
          disabledDate={(current) => current && current < dayjs().startOf('day')} />
        </Form.Item>

        {/* Form items for selecting the start and end times, with time pickers that allow selection in 30-minute increments. */}
        <Form.Item label="Start Time" name="start_time" rules={[{ required: true, message: 'Please select a start time' }]}>
          <TimePicker style={{ width: '100%' }} 
          placeholder="Select a time or input the time manually (HH:mm)"
          format="HH:mm" minuteStep={30} />
        </Form.Item>
        <Form.Item label="End Time" name="end_time" rules={[{ required: true, message: 'Please select an end time' }]}>
          <TimePicker style={{ width: '100%' }} 
          placeholder="Select a time or input the time manually (HH:mm)"
          format="HH:mm" minuteStep={30} />
        </Form.Item>

          {/* Form item for the submit button, which will trigger the form submission when clicked. */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Confirm booking
          </Button>
        </Form.Item>

      </Form>


      {/* <Input.TextArea
        aria-label="Booking note"
        value="Status updates such as booking confirmed or room conflict will also be shown in message alerts."
        autoSize
        readOnly
      /> */}
    </Modal>
  );
}
