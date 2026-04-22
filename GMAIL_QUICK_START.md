# Quick Start: Gmail Email Verification Setup

## 5-Minute Gmail Setup

### Step 1: Create Gmail App Password (3 minutes)

1. **Go to Google Account Security**
   - Open: https://myaccount.google.com/security
   - Sign in with your Google account

2. **Enable 2-Factor Authentication** (if not already enabled)
   - Click "2-Step Verification"
   - Follow the prompts

3. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select: Mail → Windows Computer
   - Copy the 16-character password generated

### Step 2: Update Backend Configuration (1 minute)

Open: `Backend/src/main/resources/application.properties`

Update these lines:
```properties
# Replace YOUR_EMAIL with your Gmail address
spring.mail.username=YOUR_EMAIL@gmail.com
# Replace APP_PASSWORD with the 16-character password
spring.mail.password=APP_PASSWORD
```

**Example:**
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=john.doe@gmail.com
spring.mail.password=abcd efgh ijkl mnop
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
spring.mail.from=noreply@spendwise.com
app.frontend.url=http://localhost:3000
```

### Step 3: Restart Backend (1 minute)

1. Stop the running backend (Ctrl+C)
2. Run: `mvn clean install`
3. Start the backend again

---

## Test It!

### Test Registration Flow

1. **Navigate to registration**: http://localhost:3000/register

2. **Fill in the form:**
   - Username: `testuser123`
   - Email: `your-email@gmail.com` (use your Gmail)
   - First Name: `John`
   - Last Name: `Doe`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
   - ✓ Agree to terms

3. **Click "Get started →"**

4. **Check your Gmail inbox**
   - Look for email from: `noreply@spendwise.com`
   - Subject: "Verify Your SpendWise Account Email"
   - It should arrive in 10-30 seconds

5. **Click the verification link** in the email
   - You'll see a success page
   - Automatically redirected to login

6. **Login with verified account:**
   - Username: `testuser123`
   - Password: `TestPass123!`
   - ✓ Success!

---

## Email Not Arriving?

### Quick Checklist

- [ ] Gmail credentials are correct (check for typos)
- [ ] 2-Factor Authentication is enabled on Gmail account
- [ ] Using the 16-character **app password** (not regular password)
- [ ] Backend was restarted after config change
- [ ] Check email address is spelled correctly
- [ ] Check Gmail spam folder
- [ ] Check backend logs for errors

### Check Backend Logs

Look for lines like:
```
Verification email sent successfully to: your-email@gmail.com
```

Or error:
```
Failed to send verification email to: your-email@gmail.com
```

---

## Environment Variables (Optional but Recommended)

For security, don't hardcode credentials. Use environment variables:

### Windows PowerShell
```powershell
$env:SPRING_MAIL_USERNAME="your-email@gmail.com"
$env:SPRING_MAIL_PASSWORD="abcd efgh ijkl mnop"
```

### Update application.properties
```properties
spring.mail.username=${SPRING_MAIL_USERNAME}
spring.mail.password=${SPRING_MAIL_PASSWORD}
```

---

## What the User Sees

### Registration Page
- ✓ New email field
- ✓ First name & last name fields
- ✓ Password strength indicator
- ✓ Terms checkbox

### After Registration
- ✓ Success message: "Registration successful! Please check your email to verify your account."
- ✓ Redirects to login

### Email Contains
- ✓ Professional HTML email template
- ✓ Verification button
- ✓ Backup link for copy-paste
- ✓ Expiration warning (24 hours)

### After Clicking Verification Link
- ✓ Loading state
- ✓ Success page with checkmark
- ✓ Auto-redirect to login
- ✓ Manual redirect button

### First Login
- ✓ Verified user can log in successfully
- ✓ Unverified users get error: "Please verify your email before logging in."

---

## Common Issues & Fixes

### ❌ "Authentication failed"
**Fix:** Ensure you're using the 16-character **app password**, not your regular Gmail password.

### ❌ "Connection refused"
**Fix:** 
- Verify port 587 is correct
- Check internet connection
- Restart backend

### ❌ "Email not received"
**Fix:**
- Check spam folder
- Wait 30 seconds (first email is slow)
- Try registering again
- Check backend logs for errors

### ❌ "Verification link doesn't work"
**Fix:**
- Ensure backend is running
- Check URL has correct token
- Token valid for 24 hours only
- Try registering again if expired

---

## Verification Email Preview

**Email Template Features:**
- ✉️ Professional branding
- 🎯 Clear call-to-action button
- 🔗 Backup verification link
- ⏰ Expiration notice
- 🔒 Security information
- 📱 Responsive design

---

## Next: Production Deployment

When deploying to production:

1. **Get production email:**
   - Use SendGrid (recommended)
   - Or AWS SES
   - Or company email server

2. **Update frontend URL:**
   ```properties
   app.frontend.url=https://your-domain.com
   ```

3. **Use environment variables:**
   - Store in server environment
   - Or use secrets manager

4. **Test thoroughly:**
   - Test verification flow
   - Test with multiple emails
   - Monitor logs

---

## Files Changed

- ✅ `Backend/pom.xml` - Added mail dependency
- ✅ `Backend/service/EmailService.java` - Email sending logic
- ✅ `Backend/service/UserService.java` - Calls email service
- ✅ `Backend/resources/application.properties` - Email config
- ✅ `frontend/components/VerifyEmail.js` - Verification page
- ✅ `frontend/App.js` - Added verification route

---

## Still Need Help?

Refer to the full guide: `EMAIL_SETUP_GUIDE.md`

## Quick Reference

| Item | Value |
|------|-------|
| SMTP Host | smtp.gmail.com |
| SMTP Port | 587 |
| Requires TLS | Yes |
| Requires Authentication | Yes |
| Verification Link Expires | 24 hours |
| Email Template | HTML with styling |

---

**Setup Time:** ~5 minutes
**Difficulty:** ⭐⭐ Easy
**Cost:** Free (using personal Gmail)
