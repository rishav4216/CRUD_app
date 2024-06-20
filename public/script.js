document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.getElementById("user-form");
  const userList = document.getElementById("user-list");
  const userIdInput = document.getElementById("user-id");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const submitButton = document.getElementById("submit-button");

  const fetchUsers = async () => {
    const response = await fetch("http://localhost:3000/users");
    console.log(response);
    const users = await response.json();
    userList.innerHTML = "";
    users.forEach((user) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${user.name} (${user.email})</span>
                            <button onclick="deleteUser(${user.id})">Delete</button>
                            <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Edit</button>`;
      userList.appendChild(li);
    });
  };

  const createUser = async (user) => {
    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    fetchUsers();
  };

  const updateUser = async (id, user) => {
    await fetch(`http://localhost:3000/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    });
    fetchUsers();
  };

  window.deleteUser = deleteUser;

  window.editUser = (id, name, email) => {
    userIdInput.value = id;
    nameInput.value = name;
    emailInput.value = email;
    submitButton.textContent = "Update";
  };

  userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = userIdInput.value;
    const name = nameInput.value;
    const email = emailInput.value;

    if (id) {
      updateUser(id, { name, email });
      userIdInput.value = "";
      submitButton.textContent = "Create";
    } else {
      createUser({ name, email });
    }

    nameInput.value = "";
    emailInput.value = "";
  });

  fetchUsers();
});
