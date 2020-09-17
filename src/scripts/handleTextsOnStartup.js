const buttonLetters = document.querySelector("#button-letters");
const texts = Array.from(document.getElementsByClassName("text"));

export const handleTextsOnStartup = () => {
  if (buttonLetters && buttonLetters.textContent) {
    buttonLetters.innerHTML = "dumpbott.speak( )";
    buttonLetters.innerHTML = buttonLetters.textContent.replace(
      /\S/g,
      "<span class='letter'>$&</span>"
    );
  }
  texts.forEach(text => (text.style.opacity = 1));
};
