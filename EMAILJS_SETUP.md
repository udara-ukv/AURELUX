# EmailJS - Free Email Setup (No Payment Required)

This setup uses **EmailJS** to send automated emails completely for free. No backend, no payment, no Cloud Functions needed!

## What This Does

✅ **Welcome email** when user registers  
✅ **Order confirmation email** when customer checks out  
✅ **Newsletter confirmation email** when user subscribes  

## Step 1: Create Free EmailJS Account

1. Go to https://www.emailjs.com
2. Click **Sign Up Free**
3. Create account with email/password
4. Verify your email

## Step 2: Create Email Service

1. Go to **Email Services** (in dashboard)
2. Click **Add New Service**
3. Choose **Gmail** (or your email provider)
4. Connect your Gmail account (follow prompts)
5. Copy your **Service ID** (looks like `service_abc123def`)

## Step 3: Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Name it: `welcome_email`
4. In the template editor:

```
Subject: Welcome to AURELUX!

Hello {{user_name}},

Thank you for creating an account with AURELUX. Explore our premium collections and discover luxury items handpicked for you.

Visit us: http://localhost:8000

Questions? Contact us at info@aurelux.com
```

5. Click **Save**
6. Copy your **Template ID** (looks like `template_abc123def`)

## Step 4: Create Order Confirmation Template

1. Click **Create New Template**
2. Name it: `order_confirmation_email`
3. In the template:

```
Subject: Order Confirmation #{{order_id}}

Hi {{customer_name}},

Your order has been received!

Order ID: #{{order_id}}

Items:
{{items_list}}

Order Summary:
Subtotal: ${{subtotal}}
Shipping: {{shipping}}
Discount: -${{discount}}
Total: ${{total}}

We'll send updates as we prepare your shipment.

Questions? Contact us at info@aurelux.com
```

5. Click **Save** and copy the **Template ID**

## Step 5: Create Newsletter Template

1. Click **Create New Template**
2. Name it: `newsletter_confirmation`
3. In the template:

```
Subject: Welcome to AURELUX Newsletter

Thank you for subscribing!

You're now part of the AURELUX community. You'll receive exclusive offers, early access to new collections, and special deals.

To unsubscribe, reply to this email with "unsubscribe".
```

4. Click **Save** and copy the **Template ID**

## Step 6: Get Your Public Key

1. Go to **Account** (or **API Keys**)
2. Copy your **Public Key** (looks like `abc123def456ghi789`)

## Step 7: Add EmailJS to Your Website

Add this to the `<head>` section of **index.html**:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js"></script>
```

## Step 8: Initialize EmailJS in script.js

At the very top of **script.js**, add:

```javascript
// Initialize EmailJS
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key
```

## Step 9: Update Registration to Send Welcome Email

In **script.js**, find the registration success part and add:

```javascript
// After successful user creation
emailjs.send("YOUR_SERVICE_ID", "welcome_email", {
    user_email: email,
    user_name: displayName || "Guest"
}).then(() => {
    console.log("Welcome email sent!");
}).catch(error => {
    console.log("Email error:", error);
});
```

## Step 10: Update Checkout to Send Order Email

In **cart.js**, after order is saved to Firestore, add:

```javascript
// Send order confirmation email
const itemsList = cart.map(item => 
    `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
).join("\n");

emailjs.send("YOUR_SERVICE_ID", "order_confirmation_email", {
    customer_email: email,
    customer_name: name,
    order_id: orderId.substring(0, 8),
    items_list: itemsList,
    subtotal: subtotal.toFixed(2),
    shipping: shipping === 0 ? "FREE" : "$" + shipping.toFixed(2),
    discount: discount > 0 ? "-$" + discount.toFixed(2) : "$0.00",
    total: total.toFixed(2)
}).then(() => {
    console.log("Order confirmation sent!");
}).catch(error => {
    console.log("Email error:", error);
});
```

## Step 11: Update Newsletter Signup

Find newsletter subscription in **script.js** and add:

```javascript
// After saving to Firestore
emailjs.send("YOUR_SERVICE_ID", "newsletter_confirmation", {
    subscriber_email: email
}).then(() => {
    console.log("Newsletter confirmation sent!");
}).catch(error => {
    console.log("Email error:", error);
});
```

## Step 12: Replace Placeholders

In your code, replace:
- `YOUR_PUBLIC_KEY` → Your actual EmailJS Public Key
- `YOUR_SERVICE_ID` → Your actual Service ID

## Test It

1. Open http://localhost:8000
2. Register a new user
3. Check your email for welcome email
4. Add items to cart and checkout
5. Check email for order confirmation
6. Subscribe to newsletter
7. Check email for newsletter confirmation

## Free Tier Limits

✅ **200 emails/month free** (plenty for testing and small business)
✅ **No credit card required**
✅ **Easy upgrade later if needed**

## Customization

To edit email templates:
1. Go to EmailJS dashboard → **Email Templates**
2. Click template name
3. Edit subject and message
4. Click **Save**

Changes take effect immediately!

## Troubleshooting

**Emails not arriving?**
- Check spam folder
- Verify Public Key and Service ID are correct
- Check browser console for errors
- Make sure Gmail is connected in EmailJS

**Getting errors in console?**
- Reload page after adding EmailJS script
- Check that Public Key is valid
- Verify template names match your code

**Want more emails per month?**
- Upgrade anytime (click **Upgrade** in dashboard)
- Reasonable pricing for businesses
- Or stick with 200/month forever!
