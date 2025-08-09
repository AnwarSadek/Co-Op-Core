// Admin credentials
const adminUsername = "admin";
const adminPassword = "admin123";

// Function to handle admin login
function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === adminUsername && password === adminPassword) {
    localStorage.setItem("userRole", "admin");
    alert("Welcome Admin!");
    window.location.href = "index.html";
  } else {
    alert("Invalid admin login credentials!");
  }
}

// Member login form submit handler
document.getElementById("memberLoginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const uidInput = document.getElementById("memberUID").value.trim();
  const players = JSON.parse(localStorage.getItem("players")) || [];

  const member = players.find(p => p.uid === uidInput);
  if (member) {
    localStorage.setItem("userRole", "member");
    localStorage.setItem("memberUID", uidInput);
    alert(`Welcome ${member.name}!`);
    window.location.href = "index.html"; // or member dashboard page
  } else {
    alert("UID not found. Please check and try again.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const profilesContainer = document.getElementById("profilesContainer");
  const searchInput = document.getElementById("search");

  // Load players from localStorage or default list
  let players = JSON.parse(localStorage.getItem("players")) || [
    {
      name: "Anwar Sadak",
      uid: "800012345",
      mainChar: "Wanderer",
      enkaLink: "https://enka.network/u/800012345/",
      image: "https://via.placeholder.com/150"
    },
    {
      name: "Simmi",
      uid: "800098765",
      mainChar: "Yae Miko",
      enkaLink: "https://enka.network/u/800098765/",
      image: "https://via.placeholder.com/150"
    }
  ];

  // Function to render profiles on page
  function renderProfiles(list) {
    if (!profilesContainer) return;

    profilesContainer.innerHTML = "";

    if (list.length === 0) {
      profilesContainer.innerHTML = "<p>No players found.</p>";
      return;
    }

    list.forEach(player => {
      const card = document.createElement("div");
      card.className = "profile-card";
      
      card.innerHTML = `
        <img src="${player.image}" alt="${player.name}" />
        <h3>${player.name}</h3>
        <p><strong>UID:</strong> ${player.uid}</p>
        <p><strong>Main:</strong> ${player.mainChar}</p>
        <a href="${player.enkaLink}" target="_blank">View Enka</a>
      `;

      // Show edit/delete buttons if admin logged in
      if (localStorage.getItem("userRole") === "admin") {
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => {
          window.location.href = `add.html?editUID=${player.uid}`;
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => {
          if (confirm(`Delete profile for ${player.name}?`)) {
            players = players.filter(p => p.uid !== player.uid);
            localStorage.setItem("players", JSON.stringify(players));
            renderProfiles(players);
          }
        };

        card.appendChild(editBtn);
        card.appendChild(delBtn);
      }

      // Allow member to edit only their own profile
      if (localStorage.getItem("userRole") === "member" && localStorage.getItem("memberUID") === player.uid) {
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit My Profile";
        editBtn.onclick = () => {
          window.location.href = `add.html?editUID=${player.uid}`;
        };
        card.appendChild(editBtn);
      }

      profilesContainer.appendChild(card);
    });
  }

  // Initial render
  renderProfiles(players);

  // Search input filter
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const query = e.target.value.toLowerCase();
      const filtered = players.filter(player =>
        player.name.toLowerCase().includes(query)
      );
      renderProfiles(filtered);
    });
  }
});