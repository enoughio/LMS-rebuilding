// Email templates for Student Adda LMS
interface EmailTemplateData {
  userName: string;
  userEmail: string;
  [key: string]: any;
}

interface LibraryEmailData extends EmailTemplateData {
  libraryName: string;
  libraryAddress?: string;
  adminName?: string;
  rejectionReason?: string;
}

interface BookingEmailData extends EmailTemplateData {
  bookingId: string;
  libraryName: string;
  seatName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  libraryAddress?: string;
  libraryPhone?: string;
}

// Welcome email template for new users
export const getWelcomeEmailTemplate = (data: EmailTemplateData) => {
  const { userName } = data;
  
  return {
    subject: "Welcome to Student Adda - Your Learning Journey Begins!",
    text: `Welcome to Student Adda, ${userName}!

We're excited to have you join our community of learners. Student Adda is your gateway to premium library spaces and study resources.

What you can do now:
- Browse and book seats at premium libraries
- Connect with fellow students in our forums
- Access study tools and resources
- Manage your learning schedule

Get started by exploring libraries in your area or joining study discussions in our community forum.

If you have any questions, feel free to reach out to our support team.

Happy studying!
The Student Adda Team`,
    
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .feature-list { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .feature-list li { margin: 10px 0; }
        .cta-button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to Student Adda!</h1>
        <p>Your Learning Journey Begins Here</p>
      </div>
      
      <div class="content">
        <h2>Hello ${userName}!</h2>
        <p>We're thrilled to welcome you to Student Adda, the premier platform connecting students with quality library spaces and study resources.</p>
        
        <div class="feature-list">
          <h3>What you can do now:</h3>
          <ul>
            <li>🏛️ <strong>Browse Libraries:</strong> Find premium study spaces in your area</li>
            <li>💺 <strong>Book Seats:</strong> Reserve your perfect study spot</li>
            <li>💬 <strong>Join Forums:</strong> Connect with fellow students and share knowledge</li>
            <li>📚 <strong>Access Resources:</strong> Use our study tools and materials</li>
            <li>📅 <strong>Manage Schedule:</strong> Keep track of your bookings and study time</li>
          </ul>
        </div>
        
        <p>Ready to start your learning journey? Explore libraries near you and find your ideal study environment.</p>
        
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/libraries" class="cta-button">Explore Libraries</a>
      </div>
      
      <div class="footer">
        <p>Questions? Contact us at support@studentadda.com</p>
        <p>© 2025 Student Adda. All rights reserved.</p>
      </div>
    </body>
    </html>`
  };
};

// Library registration confirmation email
export const getLibraryRegistrationTemplate = (data: LibraryEmailData) => {
  const { userName, libraryName } = data;
  
  return {
    subject: "Library Registration Submitted - Under Review",
    text: `Dear ${userName},

Thank you for registering "${libraryName}" with Student Adda!

Your library registration has been successfully submitted and is now under review by our admin team. We'll carefully evaluate your application and get back to you within 2-3 business days.

What happens next:
1. Our team will review your library details and documentation
2. We may contact you if additional information is needed
3. You'll receive an email notification once the review is complete

If you have any questions during this process, please don't hesitate to contact us.

Best regards,
The Student Adda Team`,
    
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .status-box { background: #e8f5e8; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0; }
        .process-list { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Registration Submitted</h1>
        <p>Your library is under review</p>
      </div>
      
      <div class="content">
        <h2>Dear ${userName},</h2>
        <p>Thank you for registering <strong>"${libraryName}"</strong> with Student Adda!</p>
        
        <div class="status-box">
          <h3>📋 Status: Under Review</h3>
          <p>Your application has been successfully submitted and is now being reviewed by our admin team.</p>
        </div>
        
        <div class="process-list">
          <h3>What happens next:</h3>
          <ol>
            <li>Our team will review your library details and documentation</li>
            <li>We may contact you if additional information is needed</li>
            <li>You'll receive an email notification once the review is complete</li>
          </ol>
          <p><strong>Expected Review Time:</strong> 2-3 business days</p>
        </div>
        
        <p>We appreciate your patience during the review process. If you have any questions, please don't hesitate to contact us.</p>
      </div>
      
      <div class="footer">
        <p>Questions? Contact us at support@studentadda.com</p>
        <p>© 2025 Student Adda. All rights reserved.</p>
      </div>
    </body>
    </html>`
  };
};

// Library approval notification email
export const getLibraryApprovalTemplate = (data: LibraryEmailData) => {
  const { userName, libraryName } = data;
  
  return {
    subject: "🎉 Congratulations! Your Library Has Been Approved",
    text: `Congratulations ${userName}!

Great news! "${libraryName}" has been approved and is now live on Student Adda!

Your library profile is now visible to students, and they can start booking seats right away. Here's what you can do now:

- Access your admin dashboard to manage bookings
- Update library information and seat availability
- Monitor your library's performance and reviews
- Respond to student inquiries

We're excited to have you as part of the Student Adda community. Together, we're creating better study environments for students everywhere.

Welcome aboard!
The Student Adda Team`,
    
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px 20px; }
        .celebration { text-align: center; font-size: 48px; margin: 20px 0; }
        .action-list { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .cta-button { background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="celebration">🎉</div>
        <h1>Congratulations!</h1>
        <p>Your library has been approved</p>
      </div>
      
      <div class="content">
        <h2>Dear ${userName},</h2>
        <p>We're thrilled to inform you that <strong>"${libraryName}"</strong> has been approved and is now live on Student Adda!</p>
        
        <p>Your library profile is now visible to students across the platform, and they can start discovering and booking your study spaces.</p>
        
        <div class="action-list">
          <h3>What you can do now:</h3>
          <ul>
            <li>🏢 <strong>Manage Your Library:</strong> Access your admin dashboard</li>
            <li>💺 <strong>Monitor Bookings:</strong> Track seat reservations and availability</li>
            <li>📊 <strong>View Analytics:</strong> See your library's performance metrics</li>
            <li>⭐ <strong>Engage Students:</strong> Respond to reviews and inquiries</li>
            <li>⚙️ <strong>Update Settings:</strong> Modify library details and policies</li>
          </ul>
        </div>
        
        <p>We're excited to have you as part of the Student Adda community. Together, we're creating exceptional study environments for students everywhere.</p>
        
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/admin" class="cta-button">Access Dashboard</a>
      </div>
      
      <div class="footer">
        <p>Need help getting started? Contact us at support@studentadda.com</p>
        <p>© 2025 Student Adda. All rights reserved.</p>
      </div>
    </body>
    </html>`
  };
};

// Library rejection notification email
export const getLibraryRejectionTemplate = (data: LibraryEmailData) => {
  const { userName, libraryName, rejectionReason } = data;
  
  return {
    subject: "Library Registration Update - Additional Information Required",
    text: `Dear ${userName},

Thank you for your interest in registering "${libraryName}" with Student Adda.

After reviewing your application, we need some additional information before we can approve your library registration.

${rejectionReason ? `Feedback: ${rejectionReason}` : 'Please review the requirements and resubmit your application with the necessary updates.'}

What you can do:
- Review our library registration guidelines
- Update your application with the requested information
- Resubmit your registration for review

We want to ensure all libraries on our platform meet our quality standards, and we're here to help you through the process.

If you have any questions or need clarification, please don't hesitate to contact us.

Best regards,
The Student Adda Team`,
    
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #ff9800; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .feedback-box { background: #fff3cd; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; }
        .action-list { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .cta-button { background: #ff9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Registration Update</h1>
        <p>Additional information required</p>
      </div>
      
      <div class="content">
        <h2>Dear ${userName},</h2>
        <p>Thank you for your interest in registering <strong>"${libraryName}"</strong> with Student Adda.</p>
        
        <p>After reviewing your application, we need some additional information before we can approve your library registration.</p>
        
        ${rejectionReason ? `
        <div class="feedback-box">
          <h3>📝 Feedback:</h3>
          <p>${rejectionReason}</p>
        </div>
        ` : ''}
        
        <div class="action-list">
          <h3>Next Steps:</h3>
          <ul>
            <li>📋 Review our library registration guidelines</li>
            <li>✏️ Update your application with the requested information</li>
            <li>📤 Resubmit your registration for review</li>
          </ul>
        </div>
        
        <p>We want to ensure all libraries on our platform meet our quality standards, and we're here to help you through the process.</p>
        
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/libraries/register" class="cta-button">Update Application</a>
      </div>
      
      <div class="footer">
        <p>Questions? We're here to help at support@studentadda.com</p>
        <p>© 2025 Student Adda. All rights reserved.</p>
      </div>
    </body>
    </html>`
  };
};

// Seat booking confirmation email
export const getSeatBookingConfirmationTemplate = (data: BookingEmailData) => {
  const { userName, bookingId, libraryName, seatName, date, startTime, endTime, price, libraryAddress, libraryPhone } = data;
  
  return {
    subject: "Booking Confirmed - Your Study Seat is Reserved!",
    text: `Dear ${userName},

Your seat booking has been confirmed! Here are your booking details:

Booking ID: ${bookingId}
Library: ${libraryName}
Seat: ${seatName}
Date: ${date}
Time: ${startTime} - ${endTime}
Amount Paid: ₹${price}

${libraryAddress ? `Address: ${libraryAddress}` : ''}
${libraryPhone ? `Phone: ${libraryPhone}` : ''}

Important reminders:
- Please arrive on time for your booking
- Bring a valid ID for verification
- Follow the library's rules and guidelines
- Cancel at least 2 hours in advance if needed

We hope you have a productive study session! If you need to make any changes or have questions, please contact us.

Happy studying!
The Student Adda Team`,
    
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .booking-details { background: #e3f2fd; border: 1px solid #2196F3; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #ddd; }
        .detail-label { font-weight: bold; }
        .reminders { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ Booking Confirmed!</h1>
        <p>Your study seat is reserved</p>
      </div>
      
      <div class="content">
        <h2>Dear ${userName},</h2>
        <p>Great news! Your seat booking has been confirmed. Get ready for a productive study session!</p>
        
        <div class="booking-details">
          <h3>📋 Booking Details</h3>
          <div class="detail-row">
            <span class="detail-label">Booking ID:</span>
            <span>${bookingId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Library:</span>
            <span>${libraryName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Seat:</span>
            <span>${seatName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span>${date}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Time:</span>
            <span>${startTime} - ${endTime}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Amount Paid:</span>
            <span><strong>₹${price}</strong></span>
          </div>
          ${libraryAddress ? `
          <div class="detail-row">
            <span class="detail-label">Address:</span>
            <span>${libraryAddress}</span>
          </div>
          ` : ''}
          ${libraryPhone ? `
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span>${libraryPhone}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="reminders">
          <h3>📝 Important Reminders:</h3>
          <ul>
            <li>🕐 Please arrive on time for your booking</li>
            <li>🆔 Bring a valid ID for verification</li>
            <li>📜 Follow the library's rules and guidelines</li>
            <li>⏰ Cancel at least 2 hours in advance if needed</li>
          </ul>
        </div>
        
        <p>We hope you have an amazing and productive study session!</p>
      </div>
      
      <div class="footer">
        <p>Need to make changes? Contact us at support@studentadda.com</p>
        <p>© 2025 Student Adda. All rights reserved.</p>
      </div>
    </body>
    </html>`
  };
};

// Seat booking cancellation email
export const getSeatBookingCancellationTemplate = (data: BookingEmailData) => {
  const { userName, bookingId, libraryName, seatName, date, startTime, endTime } = data;
  
  return {
    subject: "Booking Cancelled - Confirmation",
    text: `Dear ${userName},

Your seat booking has been successfully cancelled.

Cancelled Booking Details:
Booking ID: ${bookingId}
Library: ${libraryName}
Seat: ${seatName}
Date: ${date}
Time: ${startTime} - ${endTime}

Refund Information:
Your refund will be processed according to our cancellation policy. If you're eligible for a refund, it will be credited to your original payment method within 5-7 business days.

Need another booking? Browse available seats and make a new reservation anytime on our platform.

Thank you for using Student Adda!
The Student Adda Team`,
    
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #f44336; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .booking-details { background: #ffebee; border: 1px solid #f44336; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #ddd; }
        .detail-label { font-weight: bold; }
        .refund-info { background: #e8f5e8; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0; }
        .cta-button { background: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>❌ Booking Cancelled</h1>
        <p>Your reservation has been cancelled</p>
      </div>
      
      <div class="content">
        <h2>Dear ${userName},</h2>
        <p>Your seat booking has been successfully cancelled. We're sorry to see you go!</p>
        
        <div class="booking-details">
          <h3>📋 Cancelled Booking Details</h3>
          <div class="detail-row">
            <span class="detail-label">Booking ID:</span>
            <span>${bookingId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Library:</span>
            <span>${libraryName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Seat:</span>
            <span>${seatName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span>${date}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Time:</span>
            <span>${startTime} - ${endTime}</span>
          </div>
        </div>
        
        <div class="refund-info">
          <h3>💰 Refund Information</h3>
          <p>Your refund will be processed according to our cancellation policy. If you're eligible for a refund, it will be credited to your original payment method within 5-7 business days.</p>
        </div>
        
        <p>Need another booking? Browse available seats and make a new reservation anytime!</p>
        
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/libraries" class="cta-button">Find Another Seat</a>
      </div>
      
      <div class="footer">
        <p>Questions about your cancellation? Contact us at support@studentadda.com</p>
        <p>© 2025 Student Adda. All rights reserved.</p>
      </div>
    </body>
    </html>`
  };
};
