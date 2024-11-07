import sendGridMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable is not set");
}

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, orderId, orderDetails } = req.body;
  
  const orderDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const estimatedDeliveryDate = new Date(orderDetails.estimatedDelivery).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  
  const generateOrderItemsHtml = (items) => {
    return items.map((item, index) => `
      <div style="display: flex; align-items: center; ${index !== orderDetails.items.length - 1 ? 'border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 15px;' : 'padding-bottom: 15px;'}">
        <img src="${item.imageUrl || 'default-image-url.jpg'}" alt="${item.name}" style="width: 80px; height: auto; border-radius: 5px; margin-right: 15px;">
        <div style="display: flex; flex-direction: row; justify-content: center;">
          <p style="margin: 0; font-size: 16px; font-weight: bold;">${item.name}</p>
          <p style="margin: 5px 0; font-size: 16px; color: #333;">Price: <strong>$${item.price}</strong></p>
          <p style="margin: 5px 0; color: #888;">Size: <strong>${item.size}</strong></p>
        </div>
      </div>
    `).join('');
  };

  const msg = {
    to: email,
    from: 'uniqueu.app@gmail.com',
    subject: 'UniqueU Order Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="text-align: center; color: #000;">Thank you for your order!</h2>
        <p style="font-size: 16px;">Hi,</p>
        <p style="font-size: 16px;">Your order has been placed successfully.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Your Order Details</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Order placed on:</strong> ${orderDate}</p>
          <p><strong>Estimated Delivery:</strong> ${estimatedDeliveryDate}</p>
        </div>
        
        <div style="padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; margin-top: 20px;">
          <h4>Items you have purchased</h4>
          <div style="padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; margin-top: 20px;">
            ${generateOrderItemsHtml(orderDetails.items)}
          </div>
        </div>

        <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h4>Price Details</h4>
          <p><strong>Order Sub-total:</strong> $${orderDetails.subtotal}</p>
          <p><strong>Sales Tax (5%):</strong> $${orderDetails.tax}</p>
          <h3 style="margin-top: 10px; font-weight: bold;">Grand Total: $${orderDetails.total}</h3>
        </div>
        
        <p style="font-size: 16px; margin-top: 20px;">We hope to deliver your order by the estimated date. Thank you for shopping with us!</p>
      </div>
    `,
  };

  try {
    await sendGridMail.send(msg);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error);
    return res.status(500).json({ message: 'Error sending email', error: error.response ? error.response.body : error });
  }
};
