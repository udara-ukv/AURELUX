// admin-settings.js - EmailJS settings management for admin dashboard

document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('saveEmailSettings');
  const testBtn = document.getElementById('testEmailSettings');
  const statusEl = document.getElementById('emailSettingsStatus');

  if (saveBtn) saveBtn.addEventListener('click', saveEmailSettings);
  if (testBtn) testBtn.addEventListener('click', testEmailSettings);

  // Load settings when dashboard is shown
  loadEmailSettings();
});

async function loadEmailSettings() {
  try {
    if (!window.db) return;
    const doc = await window.db.collection('settings').doc('email').get();
    if (!doc.exists) return;
    const data = doc.data();
    document.getElementById('emailServiceId').value = data.serviceId || '';
    document.getElementById('emailContactTemplate').value = data.contactTemplate || '';
    document.getElementById('emailOrderTemplate').value = data.orderTemplate || '';
  } catch (err) {
    console.warn('Failed to load email settings', err);
  }
}

async function saveEmailSettings() {
  const serviceId = (document.getElementById('emailServiceId')||{}).value || '';
  const contactTemplate = (document.getElementById('emailContactTemplate')||{}).value || '';
  const orderTemplate = (document.getElementById('emailOrderTemplate')||{}).value || '';
  const statusEl = document.getElementById('emailSettingsStatus');

  try {
    if (!window.db) {
      statusEl.textContent = 'Firestore not connected';
      return;
    }
    await window.db.collection('settings').doc('email').set({
      serviceId, contactTemplate, orderTemplate
    }, { merge: true });
    statusEl.textContent = 'Saved';
    setTimeout(()=> statusEl.textContent = '', 2500);
  } catch (err) {
    console.error('Failed to save email settings', err);
    statusEl.textContent = 'Save failed';
  }
}

async function testEmailSettings() {
  const statusEl = document.getElementById('emailSettingsStatus');
  statusEl.textContent = 'Sending test…';

  const serviceId = (document.getElementById('emailServiceId')||{}).value || 'service_9b6hlzf';
  const contactTemplate = (document.getElementById('emailContactTemplate')||{}).value || 'template_contact';

  try {
    if (typeof sendEmailAsync === 'undefined') {
      statusEl.textContent = 'EmailJS not available';
      return;
    }

    // Send a simple test email to the admin email
    const adminEmail = (document.getElementById('adminEmail')||{}).value || '';
    await sendEmailAsync(serviceId, contactTemplate, {
      from_name: 'AURELUX Admin Test',
      user_email: adminEmail || 'admin@example.com',
      message: 'This is a test email from the Admin panel.'
    });

    statusEl.textContent = 'Test sent (check inbox)';
    setTimeout(()=> statusEl.textContent = '', 3000);
  } catch (err) {
    console.error('Test email failed', err);
    statusEl.textContent = 'Test failed';
  }
}
