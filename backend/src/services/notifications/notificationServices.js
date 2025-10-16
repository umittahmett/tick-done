import { createTransport } from 'nodemailer';
import { AppError } from "../../utils/appError.js";
import Notification from "../../models/Notification.js";
import User from "../../models/User.js";
import dotenv from 'dotenv';

dotenv.config();

export async function sendNotification({ channel, to, subject, content, type = 'generic' }) {
  if (!channel || !to || !subject || !content) {
    console.error('sendNotification için gerekli parametreler eksik.');
    return;
  }

  const user = await User.findOne({ _id: to._id });
  if (!user) throw new AppError('User not found', 404);

  const channelsToSend = Array.isArray(channel) ? channel : [channel];

  const basePayload = {
    user: to._id,
    type,
    subject,
    content,
  };

  for (const currentChannel of channelsToSend) {
    if (currentChannel === 'app') {
      const notification = new Notification({
        ...basePayload,
        channel: 'app',
      });
      await notification.save();
      console.log('App notification saved successfully');
    } 
    else if (currentChannel === 'email') {
      try {
        const transporter = createTransport({
          host: process.env.BREVO_HOST,
          port: process.env.BREVO_PORT,
          secure: false,
          auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_API_KEY,
          },
        });

        await transporter.sendMail({
          from: process.env.DEFAULT_SENDER_EMAIL,
          to: user.email,
          subject: subject,
          html: content,
        });
        
        console.log('Email sent successfully');

        const notification = new Notification({
          ...basePayload,
          channel: 'email',
          read: true,
        });
        await notification.save();
        console.log('Email notification log saved successfully');

      } catch (error) {
        console.error('Email could not be sent:', error);
      }
    }
  }
}