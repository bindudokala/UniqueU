import sendGridMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable is not set");
}

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, orderId, orderDetails } = req.body;

  const msg = {
    to: email,
    from: 'uniqueu.app@gmail.com', // Ensure this email is verified in SendGrid
    subject: 'Order Confirmation',
    text: `Thank you for your order! Order ID: ${orderId}. Total: $${orderDetails.total}`,
    html: `<p>Thank you for your order!</p><p>Order ID: ${orderId}</p><p>Total: $${orderDetails.total}</p>`,
  };

  try {
    await sendGridMail.send(msg);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error);
    return res.status(500).json({ message: 'Error sending email', error: error.response ? error.response.body : error });
  }
};
