let mxSlideIndex = 0;

function moveSlide(id, direction) {
  const slides = document.getElementById(`${id}-carousel`);
  const totalSlides = slides.children.length;

  if (id === 'mx') {
    mxSlideIndex += direction;
    if (mxSlideIndex < 0) mxSlideIndex = totalSlides - 1;
    if (mxSlideIndex >= totalSlides) mxSlideIndex = 0;
    slides.style.transform = `translateX(-${mxSlideIndex * 100}%)`;
  }
}