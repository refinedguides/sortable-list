document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelector(".skills");
  const addSkillButton = document.querySelector(".add-skill");
  const skillModal = document.querySelector(".skill-modal");
  const skillInput = skillModal.querySelector("#skill");

  //* functions

  // create the list item element
  const createListItem = (text) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.innerHTML = `<span>${text}</span><button>&times;</button>`;

    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "");
      setTimeout(() => e.target.classList.add("dragging"), 0);
    });

    li.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");

      // update local storage
      saveItems();
    });

    return li;
  };

  // update the rankings
  const updateCounter = () => {
    skills.style.counterReset = "none";

    setTimeout(() => {
      skills.style.counterReset = "rank";
    }, 0);
  };

  // save the list to local storage
  const saveItems = () => {
    const items = [...skills.querySelectorAll("li span")].map(
      (span) => span.textContent
    );

    localStorage.setItem("top-skills", JSON.stringify(items));
  };

  // load the list from local storage
  const loadItems = () => {
    const items = JSON.parse(localStorage.getItem("top-skills")) || [];

    // clear the skills list
    skills.innerHTML = "";

    items.forEach((item) => {
      skills.appendChild(createListItem(item));
    });
  };

  loadItems();

  //* event listeners

  // display modal
  addSkillButton.addEventListener("click", () => {
    skillModal.showModal();
  });

  // hide modal
  skillModal.addEventListener("click", (e) => {
    // check if the clicked element is the modal itself
    if (e.target === e.currentTarget) {
      skillModal.close();
    }
  });

  // reset the form
  skillModal.addEventListener("close", () => {
    skillModal.querySelector("form").reset();
  });

  // handle form submit
  skillModal.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault(); // prevent form submission

    const skill = skillInput.value.trim();

    if (skill) {
      // create the list item and append to skills list
      skills.appendChild(createListItem(skill));

      // close the modal
      skillModal.close();

      // hide keyboard on mobile by blurring the input
      skillInput.blur();

      // update local storage
      saveItems();
    }
  });

  // handle remove item
  skills.addEventListener("click", (e) => {
    // check if the clicked element is the remove button
    if (e.target.tagName === "BUTTON") {
      const li = e.target.closest("li");

      // remove the list item from skills
      skills.removeChild(li);

      // update the rankings after list is modified
      updateCounter();

      // update local storage
      saveItems();
    }
  });

  // handle dragging over other items
  skills.addEventListener("dragover", (e) => {
    e.preventDefault(); // allow drop
    e.dataTransfer.dropEffect = "move";

    const target = e.target.closest("li");
    const draggedItem = document.querySelector(".dragging");

    if (target && target !== draggedItem) {
      // calculate the center of the target element relative to viewport
      const { top, height } = target.getBoundingClientRect();
      const midPoint = top + height / 2;

      // check if the pointer is below the center of the target element
      if (e.clientY > midPoint) {
        // insert after the target element
        target.after(draggedItem);
      } else {
        // insert before the target element
        target.before(draggedItem);
      }
    }
  });

  // handle the drop event
  skills.addEventListener("drop", (e) => {
    e.preventDefault(); // prevent default browser handling

    // update local storage
    saveItems();
  });
});
