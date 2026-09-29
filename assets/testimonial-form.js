(() => {
  const form = document.getElementById('testimonial-form');
  if (!form) return;
  const pane = form.closest('.testimonial-pane');
  const success = pane.querySelector('.review-success');
  const error = form.querySelector('.review-error');
  const button = form.querySelector('button[type="submit"]');
  const stars = [...form.querySelectorAll('.review-star')];
  let sending = false;
  const showRating = value => stars.forEach((star, i) => star.classList.toggle('is-selected', i < value));
  form.addEventListener('change', event => {
    if (event.target.name !== 'rating') return;
    const rating = Number(event.target.value);
    showRating(rating);
    form.querySelector('.review-rating-note').textContent = `${rating} out of 5 stars`;
  });
  form.querySelector('.review-stars').addEventListener('pointerover', event => {
    if (event.pointerType !== 'mouse') return;
    const star = event.target.closest('.review-star');
    if (star) showRating(Number(star.querySelector('input').value));
  });
  form.querySelector('.review-stars').addEventListener('pointerleave', () => showRating(Number(form.elements.rating.value)));
  const closePane = async () => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const height = pane.getBoundingClientRect().height;
    if (!reduce) await form.animate([{opacity:1}, {opacity:0}], {duration:140,fill:'forwards'}).finished;
    form.hidden = true;
    success.hidden = false;
    const finalHeight = pane.getBoundingClientRect().height;
    if (!reduce) {
      const collapse = pane.animate([{height:`${height}px`}, {height:`${finalHeight}px`}], {duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
      success.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,delay:100,fill:'backwards'});
      await collapse.finished;
    }
    success.focus({preventScroll:true});
    success.scrollIntoView({block:'center',behavior:reduce ? 'instant' : 'smooth'});
  };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    if (!form.elements.first_name.value.trim() || form.elements.testimonial.value.trim().length < 10) {
      error.textContent = 'Please enter your name and a testimonial of at least 10 characters.';
      error.hidden = false;
      return;
    }
    sending = true;
    button.disabled = true;
    button.textContent = 'Closing…';
    form.setAttribute('aria-busy', 'true');
    error.hidden = true;
    try {
      await closePane();
    } catch (_) {
      error.textContent = 'The preview could not finish. Please try again. Your text is still here.';
      error.hidden = false;
    } finally {
      sending = false;
      button.disabled = false;
      button.textContent = 'Submit';
      form.removeAttribute('aria-busy');
    }
  });
  button.disabled = false;
})();
