const carousels = document.querySelectorAll(".slides");

/*carousels.forEach((carousel) => {
  const totalSlides = carousel.children.length;
  let currentSlide = 0;
  setInterval(() => {
    const currentSlideWidth = carousel.children[currentSlide].clientWidth;
    currentSlide += 1; //move to next slide
    if (currentSlide >= totalSlides) currentSlide = 0; //reset
    carousel.scrollTo(currentSlideWidth * currentSlide, 0);
  }, 2000);
});*/
