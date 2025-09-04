const transporter = require('../config/nodemailer');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, city, country, feedback } = req.body;

    // Basic validation
    if (!name || !email || !phone || !city || !country || !feedback) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Send thank you email to user
    const userMail = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Thank you for contacting Vivan Hotel',
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to Vivan Hotel. We have received your message and our team will get back to you shortly.</p>
        <p>Submitted details:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>City:</strong> ${city}</li>
          <li><strong>Country:</strong> ${country}</li>
        </ul>
        <p><strong>Message:</strong></p>
        <p>${feedback}</p>
        <p>Regards,<br/>Vivan Hotel Team</p>
      `
    };

    // Send details to admin
    const adminMail = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: 'New contact form submission',
      html: `
        <h3>New Contact Submission</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>City:</strong> ${city}</li>
          <li><strong>Country:</strong> ${country}</li>
        </ul>
        <p><strong>Feedback:</strong></p>
        <p>${feedback}</p>
      `
    };

    await Promise.all([
      transporter.sendMail(userMail),
      transporter.sendMail(adminMail)
    ]);

    res.status(200).json({ message: 'Thank you for contacting us. We have sent a confirmation email.' });
  } catch (err) {
    console.error('submitContact error:', err);
    res.status(500).json({ message: 'Failed to submit contact form', error: err.message });
  }
};


