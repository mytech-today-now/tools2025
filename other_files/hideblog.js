document.addEventListener('DOMContentLoaded', () => {
  const postList = document.querySelector('.blog-posts');
  if (!postList) return;

  // Toggle visibility on click
  postList.addEventListener('click', (e) => {
    e.stopPropagation();               // don’t let this click bubble out
    postList.classList.toggle('active');
  });

  // Hide again when mouse leaves the entire container
  postList.addEventListener('mouseleave', () => {
    postList.classList.remove('active');
  });

  // (Optional) clicking anywhere else closes it
  document.addEventListener('click', (e) => {
    if (!postList.contains(e.target)) {
      postList.classList.remove('active');
    }
  });
});
