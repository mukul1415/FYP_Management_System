export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px; background-color: #ffffff; color: #1f2937;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #3b82f6; margin: 0;">FYP SYSTEM 🔒</h2>
            <p style="font-size: 14px; color: #6b7280; margin-top: 5px;">
                Password Reset Request
            </p>
        </div>

        <!-- Body -->
        <p style="font-size: 16px;">Hello,</p>

        <p style="font-size: 15px; line-height: 1.6;">
            We received a request to reset your password. Click the button below to create a new password:
        </p>

        <!-- Button -->
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetPasswordUrl}" 
               style="display: inline-block; padding: 12px 25px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: #3b82f6; border-radius: 6px; text-decoration: none;">
               Reset Password
            </a>
        </div>

        <!-- Expiry Info -->
        <p style="font-size: 14px; color: #374151;">
            This link will expire in <strong>15 minutes</strong>.
        </p>

        <!-- Backup Link -->
        <p style="font-size: 14px; color: #374151;">
            If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p style="font-size: 13px; color: #2563eb; word-break: break-all;">
            ${resetPasswordUrl}
        </p>

        <!-- Footer -->
        <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />

        <div style="text-align: center; font-size: 13px; color: #6b7280;">
            <p>Thank you,<br><strong>BookWorm Team</strong></p>
            <p style="font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>

    </div>
    `;
}

/**
 * Request Accepted Email
 */
export function generateRequestAcceptedTemplate(supervisorName) {
  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#10b981;">✅ Supervisor Request Accepted</h2>
      <p>Your supervisor request has been accepted by <strong>${supervisorName}</strong>.</p>
      <p>You can now start working on your project and upload files.</p>
    </div>
  `;
}

/**
 * Request Rejected Email
 */
export function generateRequestRejectedTemplate(supervisorName) {
  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#ef4444;">❌ Supervisor Request Rejected</h2>
      <p>Your supervisor request has been rejected by <strong>${supervisorName}</strong>.</p>
      <p>You can try requesting another supervisor.</p>
    </div>
  `;
}
