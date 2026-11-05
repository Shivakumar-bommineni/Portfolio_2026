const nodemailer = require('nodemailer');

const escapeHtml = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,   // Gmail App Password (not your account password)
  },
});

exports.send = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const trimmedEmail = String(email).trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  // Prevent HTML injection and SMTP header splitting
  const safeName = escapeHtml(String(name).trim().slice(0, 100));
  const safeEmail = escapeHtml(trimmedEmail.slice(0, 150));
  const safeMessage = escapeHtml(String(message).trim().slice(0, 5000));
  const cleanSubject = `📩 Portfolio Contact from ${safeName.replace(/[\r\n]/g, ' ')}`;

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO || process.env.SMTP_USER,
      replyTo: trimmedEmail,
      subject: cleanSubject,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:24px 28px;color:#fff;">
            <h2 style="margin:0;font-size:1.25rem;">New Portfolio Contact</h2>
            <p style="margin:.5rem 0 0;opacity:.85;font-size:.875rem;">Someone reached out via your portfolio</p>
          </div>
          <div style="padding:24px 28px;background:#fff;">
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tr><td style="padding:8px 0;font-size:.8rem;color:#64748b;font-weight:700;width:80px;">NAME</td>
                  <td style="padding:8px 0;font-weight:600;">${safeName}</td></tr>
              <tr><td style="padding:8px 0;font-size:.8rem;color:#64748b;font-weight:700;">EMAIL</td>
                  <td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#2563eb;">${safeEmail}</a></td></tr>
            </table>
            <div style="background:#f8fafc;border-radius:8px;padding:16px;border-left:4px solid #2563eb;">
              <div style="font-size:.8rem;color:#64748b;font-weight:700;margin-bottom:8px;">MESSAGE</div>
              <div style="font-size:.925rem;line-height:1.7;white-space:pre-wrap;">${safeMessage}</div>
            </div>
          </div>
          <div style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:.75rem;color:#94a3b8;">
            Sent from shivakumar_dev portfolio · Reply directly to this email to respond to ${safeName}
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Email send error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
  }
};
