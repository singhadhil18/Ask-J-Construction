(() => {
  const form = document.querySelector('form[aria-label="Contact"]');
  if (!form) return;
  const note = document.getElementById('contact-send-note');
  const value = label => form.querySelector(`[aria-label="${label}"]`)?.value.trim() || '';
  const names = [...form.querySelectorAll('[name="first_name"], [name="last_name"]')];
  const validateName = field => field.setCustomValidity(field.value.trim() ? '' : 'Please enter your name.');
  names.forEach(field => field.addEventListener('input', () => validateName(field)));
  form.addEventListener('submit', event => {
    event.preventDefault();
    names.forEach(validateName);
    if (!form.reportValidity()) return;
    const channel = event.submitter?.dataset.sendVia || 'email';
    const subject = value('Subject') || 'Website enquiry — ASKJ Construction';
    const body = [
      'Hello ASKJ Construction,', '',
      `Name: ${value('First Name')} ${value('Last Name')}`,
      `Email: ${value('Email')}`,
      `Phone: ${value('Phone') || 'Not provided'}`,
      `Address: ${value('Address') || 'Not provided'}`,
      `Subject: ${subject}`, '',
      value('Message') || 'Please contact me about my project.'
    ].join('\n');
    if (channel === 'whatsapp') {
      const link = `https://wa.me/27785680809?text=${encodeURIComponent(body)}`;
      window.open(link, '_blank', 'noopener,noreferrer');
      note.textContent = 'Review your enquiry in WhatsApp and press Send. If nothing opened, allow pop-ups and try again.';
    } else {
      window.location.href = `mailto:askjconstruction@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      note.textContent = 'Review your enquiry in your email app and press Send. An email app must be configured on your device.';
    }
  });
})();
