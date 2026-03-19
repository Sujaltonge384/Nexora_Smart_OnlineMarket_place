let currentIndex = 0;
const slider = document.getElementById("slider");
const dots = document.querySelectorAll(".dot");

function updateSlider(){
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;

  dots.forEach(dot => dot.classList.remove("active"));
  dots[currentIndex].classList.add("active");
}

function nextSlide(){
  currentIndex++;
  if(currentIndex > 4){
    currentIndex = 0;
  }
  updateSlider();
}

setInterval(nextSlide, 5000);

/* DOT CLICK */
dots.forEach((dot,index)=>{
  dot.addEventListener("click",()=>{
    currentIndex = index;
    updateSlider();
  });
});



