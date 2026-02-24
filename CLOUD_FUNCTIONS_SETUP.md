# Firebase Cloud Functions - Auto Email Sending Setup

⚠️ **NOTE: This approach is NOT USED in your project**

**Why?** Firebase Cloud Functions requires the **Blaze (paid) plan** to deploy. Since you cannot make payments, we switched to **EmailJS** instead, which is:
- ✅ Completely FREE (200+ emails/month)
- ✅ No payment needed ever
- ✅ Easier to set up
- ✅ Already integrated in your code

**Use `EMAILJS_QUICK_START.md` instead** for the free email setup.

---

## Original Guide (For Reference Only)

## What This Does

✅ **Welcome email** when user registers  
✅ **Order confirmation email** when customer checks out  
✅ **Newsletter confirmation email** when user subscribes  

## Prerequisites

1. Firebase project already set up
2. Node.js installed on your computer
3. Firebase CLI installed

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase

```bash
firebase login
```

## Step 3: Initialize Cloud Functions in Your Project

```bash
cd /home/udara/Documents/my-webapp
firebase init functions
```

When prompted:
- Select your **aurelux-store** project
- Choose **JavaScript**
- Say yes to installing dependencies

## Step 4: Replace functions/index.js

Navigate to `functions/index.js` and replace with this code:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure your email (using Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',  // Your Gmail address
        pass: 'your-app-password'       // Gmail App Password (not regular password)
    }
});

// Email on user registration
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
    const email = user.email;
    const displayName = user.displayName || 'Guest';

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: '🎉 Welcome to AURELUX!',
        html: `
            <h2>Welcome, ${displayName}!</h2>
            <p>Thank you for creating an account with AURELUX.</p>
            <p>Explore our premium collections and discover luxury items handpicked for you.</p>
            <a href="http://localhost:8000" style="background: #1a1a1a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Start Shopping
            </a>
            <p style="margin-top: 2rem; color: #666; font-size: 0.9rem;">
                If you have any questions, reply to this email or contact us at info@aurelux.com
            </p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent to:', email);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
});

// Email on order creation
exports.sendOrderConfirmation = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async (snap, context) => {
        const order = snap.data();
        const email = order.customerEmail;
        const orderId = context.params.orderId;

        const itemsList = order.items.map(item => 
            `<li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`
        ).join('');

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: `📦 Order Confirmation - #${orderId.substring(0, 8)}`,
            html: `
                <h2>Order Confirmed!</h2>
                <p>Hi ${order.customerName},</p>
                <p>Your order has been received and will be processed shortly.</p>
                
                <h3>Order Details:</h3>
                <p><strong>Order ID:</strong> #${orderId.substring(0, 8)}</p>
                
                <h3>Items:</h3>
                <ul>
                    ${itemsList}
                </ul>
                
                <h3>Order Summary:</h3>
                <p>Subtotal: $${order.subtotal.toFixed(2)}</p>
                <p>Shipping: ${order.shipping === 0 ? 'FREE' : '$' + order.shipping.toFixed(2)}</p>
                ${order.discount > 0 ? `<p>Discount: -$${order.discount.toFixed(2)}</p>` : ''}
                <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
                
                <p style="margin-top: 2rem;">
                    You can track your order in your account. We'll send you updates as we prepare your shipment.
                </p>
                
                <p style="color: #666; font-size: 0.9rem;">
                    Questions? Contact us at info@aurelux.com
                </p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Order confirmation sent to:', email);
        } catch (error) {
            console.error('Error sending order confirmation:', error);
        }
    });

// Email on newsletter signup
exports.sendNewsletterConfirmation = functions.firestore
    .document('newsletter/{docId}')
    .onCreate(async (snap) => {
        const subscription = snap.data();
        const email = subscription.email;

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: '✨ Welcome to AURELUX Newsletter',
            html: `
                <h2>Thank You for Subscribing!</h2>
                <p>You're now part of the AURELUX community.</p>
                <p>You'll receive exclusive offers, early access to new collections, and special deals.</p>
                
                <p style="margin-top: 2rem; color: #666; font-size: 0.9rem;">
                    If you wish to unsubscribe, reply to this email with "unsubscribe".
                </p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Newsletter confirmation sent to:', email);
        } catch (error) {
            console.error('Error sending newsletter confirmation:', error);
        }
    });
```

## Step 5: Setup Gmail App Password

Firebase Cloud Functions needs a Gmail "App Password" (not your regular password).

1. Go to https://myaccount.google.com
2. Left sidebar → **Security**
3. Enable **2-Step Verification** (if not already enabled)
4. Go back to Security → **App passwords**
5. Select **Mail** and **Windows Computer** (or your device)
6. Copy the 16-character password
7. Paste it in `functions/index.js` as `pass: 'your-app-password'`

Also replace `your-email@gmail.com` with your actual Gmail address.

## Step 6: Deploy Cloud Functions

```bash
firebase deploy --only functions
```

Wait for deployment to complete.

## Step 7: Test

1. Register a new user on your website → should receive welcome email
2. Place an order → should receive order confirmation email
3. Subscribe to newsletter → should receive confirmation email

## Email Customization

Edit the `html` sections in `functions/index.js` to:
- Change colors and styling
- Add your logo
- Customize messages
- Add links to your site

## Production URL Update

When you host your site on a real domain (e.g., `https://aurelux.com`), update the links in `functions/index.js`:

Change: `http://localhost:8000`  
To: `https://yourdomain.com`

## Troubleshooting

**Emails not sending?**
- Check Firebase Console → Functions → Logs for errors
- Verify Gmail "App Password" is correct
- Ensure 2-Step Verification is enabled on Gmail
- Check spam folder

**Gmail blocks the sender?**
- Gmail may initially flag automated emails
- Mark as "Not spam" a few times
- Gmail will whitelist it automatically

## Cost

✅ **Free!** Firebase Cloud Functions has generous free tier:
- 125,000 function invocations/month free
- 40GB data transfer/month free
- Perfect for small to medium businesses

## Next Steps

1. Deploy Cloud Functions
2. Test by registering/ordering
3. Check your email for confirmations
4. Customize email templates as needed
