const links = document.querySelectorAll(".topbar nav a");

const markCurrent = () => {
  const spot = window.scrollY + 120;
  let current = links[0];

  links.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section && section.offsetTop <= spot) {
      current = link;
    }
  });

  links.forEach((link) => link.classList.toggle("active", link === current));
};

document.addEventListener("scroll", markCurrent, { passive: true });
markCurrent();
