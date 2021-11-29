document.addEventListener("DOMContentLoaded", () => {
  /* 변수 */
  const cards = document.getElementById("cards");
  const card = cards.getElementsByClassName("card");
  console.log("card");
  console.log(card);
  console.log("");
  console.log("card[0].children[0].textContent");
  console.log(card[0].children[0].textContent);
  console.log("");
  /* score */
  const board = document.getElementById("scoreBoard");
  const score = board.getElementsByTagName("tr");

  console.log(score[0].cells[0].textContent+"         |   "+score[0].cells[1].textContent+
  "   |  "+score[0].cells[2].textContent);
  console.log(score[1].cells[0].textContent+" | "+score[1].cells[1].textContent+
  " | "+score[1].cells[2].textContent);
});