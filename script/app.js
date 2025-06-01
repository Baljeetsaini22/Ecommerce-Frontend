console.log("E-Commerce Website Loaded");
/**
 * @description this is harmburger
 * @returns get menu icon on mobile view
 * @function harmburger()
*/
function hamburger(){
    document.addEventListener("DOMContentLoaded", () => { 
        const hamburger = document.getElementById("hamburger");
        const navMenu = document.querySelector(".nav-menu");
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("open");
        });
    });
}
hamburger()