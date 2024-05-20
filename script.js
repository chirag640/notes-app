const addButton = document.getElementById("add");
const searchInput = document.getElementById("search");
const notes = JSON.parse(localStorage.getItem("notes")) || [];

const updateLocalStorage = () => {
  const notesData = [];
  document.querySelectorAll(".note").forEach((note) => {
    const title = note.querySelector(".title").value;
    const text = note.querySelector("textarea").value;
    const color = note.style.backgroundColor;
    notesData.push({ title, text, color });
  });
  localStorage.setItem("notes", JSON.stringify(notesData));
};

const addNewNote = (noteData = { title: "", text: "", color: "#fff" }) => {
  const { title, text, color } = noteData;
  const note = document.createElement("div");
  note.classList.add("note");
  note.style.backgroundColor = color;
  note.innerHTML = `
    <input type="color" class="color-picker" value="${color}" />
    <input type="text" class="title" placeholder="Title" value="${title}" />
    <div class="tools">
      <button class="edit"><i class="fas fa-edit"></i></button>
      <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>
    <div class="main ${text ? "" : "hidden"}"></div>
    <textarea class="${text ? "hidden" : ""}"></textarea>`;

  const colorPicker = note.querySelector(".color-picker");
  const titleInput = note.querySelector(".title");
  const editButton = note.querySelector(".edit");
  const deleteButton = note.querySelector(".delete");
  const main = note.querySelector(".main");
  const textArea = note.querySelector("textarea");

  textArea.value = text;
  main.innerHTML = marked(text);

  colorPicker.addEventListener("input", (e) => {
    note.style.backgroundColor = e.target.value;
    updateLocalStorage();
  });

  titleInput.addEventListener("input", updateLocalStorage);
  
  deleteButton.addEventListener("click", () => {
    note.remove();
    updateLocalStorage();
  });

  editButton.addEventListener("click", () => {
    main.classList.toggle("hidden");
    textArea.classList.toggle("hidden");
  });

  textArea.addEventListener("input", (e) => {
    const { value } = e.target;
    main.innerHTML = marked(value);
    updateLocalStorage();
  });

  document.body.appendChild(note);
};

addButton.addEventListener("click", () => addNewNote());

if (notes) {
  notes.forEach((note) => addNewNote(note));
}

searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  document.querySelectorAll(".note").forEach((note) => {
    const title = note.querySelector(".title").value.toLowerCase();
    console.log(`Searching for "${searchValue}" in title: "${title}"`);
    note.style.display = title.includes(searchValue) ? "block" : "none";
  });
});
