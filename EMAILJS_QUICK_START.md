# EMAILJS FREE SETUP - Quick Start (5 Minutes)

## Why EmailJS?
✅ **Completely FREE** - No payment ever  
✅ **200+ emails/month** free forever  
✅ **No backend needed** - Works directly from your website  
✅ **Already integrated** into your code  

## Step 1: Create Free EmailJS Account (2 min)

1. Go to https://www.emailjs.com
2. Click **Sign Up Free**
3. Create account with email/password
4. Verify your email

## Step 2: Connect Your Email (1 min)

1. In EmailJS dashboard, go **Email Services**
2. Click **Add New Service**
3. Select **Gmail** 
4. Click **Connect Gmail** and authorize
5. Copy your **Service ID** (looks like `service_abc123xyz`)

## Step 3: Create Email Templates (2 min)

You need to create 3 email templates. For each one:

### Template 1: Welcome Email
1. Go to **Email Templates** → **Create New**
2. Name: `welcome_email` (IMPORTANT: use exact name)
3. Subject: `Welcome to AURELUX!`
4. Content:
```
Hello {{user_name}},

Thank you for creating an account with AURELUX!

Explore our premium collections at http://localhost:8000

Questions? Email us at info@aurelux.com

Best regards,
AURELUX Team
```
5. Click **Save** and copy the **Template ID**
6. Replace in code: `template_2go1h35` → your Template ID (this is your welcome email)

### Template 2: Order Confirmation  
1. **Create New** → Name: `order_confirmation_email`
2. Subject: `Order Confirmation #{{order_id}}`
3. Content:
```
Hi {{customer_name}},

Your order #{{order_id}} has been received!

Items:
{{items_list}}

Summary:
Subtotal: ${{subtotal}}
Shipping: {{shipping}}
Discount: {{discount}}
Total: ${{total}}

We'll send updates as we prepare your shipment.

Thanks for your purchase!
```
4. Save and copy Template ID
5. Replace in code: `template_ukyzry9` → your Template ID (this is your order confirmation)

### Template 3: Newsletter  
1. **Create New** → Name: `newsletter_confirmation`
2. Subject: `Welcome to AURELUX Newsletter`
3. Content:
```
Thank you for subscribing!

You're now part of the AURELUX community.

You'll receive exclusive offers and early access to new collections.

Best regards,
AURELUX Team
```
4. Save and copy Template ID
5. **NOTE:** Newsletter emails not sent automatically (requires paid subscription). Emails stored in Firestore only.

## Step 4: Update Your Code

Open **script.js** and find this line (near the top):
```javascript
emailjs.init("service_3q8r9zk");
```

Replace `service_3q8r9zk` with your actual Service ID.

Also replace these template IDs in script.js and cart.js:
- `template_2go1h35` → Your welcome email template ID (already set)
- `template_ukyzry9` → Your order confirmation template ID (already set)

## Step 5: Test It!

1. Open http://localhost:8000
2. Register a new account → Check email for welcome email
3. Add items to cart → Checkout → Check email for order confirmation
4. Subscribe to newsletter → Check email for newsletter confirmation

## That's It! 🎉

Emails are now fully functional and completely **FREE**!

## Need Help?

**Emails not arriving?**
- Check spam folder first
- Make sure Gmail is connected in EmailJS
- Verify template names and IDs are correct
- Check browser console for errors (F12)

**Want to customize email content?**
- Edit templates in EmailJS dashboard
- Changes take effect immediately
- No code changes needed

**Need more emails per month?**
- Free tier has 200/month - enough for testing
- Can upgrade anytime for more
- Reasonable pricing for growing businesses
