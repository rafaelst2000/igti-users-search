let search = null;
let totalUsers = null;
let users = [];
let usersFilted = [];
let statistics = {
  totalGenderFemale: 0,
  totalGenderMale: 0,
  totalAge: 0,
  avgAge: 0,
};
totalUsers = document.querySelector("#usersQuant");
totalUsers.innerHTML = "Nenhum usuário pesquisado";
inputSearch = document.querySelector("#input");

let userList = document.querySelector(".container-item");
let title = document.createElement("h1");
let hr = document.createElement("hr");
let totalGenderFemale = document.createElement("h2");
let totalGenderMale = document.createElement("h2");
let totalAge = document.createElement("h2");
let avgAge = document.createElement("h2");

window.addEventListener("load", async () => {
  users = await getUsers();
  usersFilted = users;

  inputSearch.addEventListener("keyup", filterUsers);

  listStatistics(usersFilted);
});

const filterUsers = async (event) => {
  const filter = event.target.value.toLowerCase();
  var hasText = !!filter && filter.trim() !== "";
  if (hasText) {
    usersFilted = await users.filter((user) => {
      return user.name.toLowerCase().includes(filter);
    });

    if (event.key === "Enter") {
      clear();
      listUsers(usersFilted);
      listStatistics(usersFilted);
    }
  }
};

clear = () => {
  let listStatistics = document.querySelector(".estatics");
  listStatistics.innerHTML = "";
  title.textContent = "Estatísticas";
  avgAge.textContent = `Sem dados.`;

  listStatistics.appendChild(title);
  listStatistics.appendChild(avgAge);
  userList.innerHTML = "";
};

const handleClick = async () => {
  filter = inputSearch.value.toLowerCase();
  var hasText = !!filter && filter.trim() !== "";
  if (hasText) {
    usersFilted = await users.filter((user) => {
      return user.name.toLowerCase().includes(filter);
    });
    listUsers(usersFilted);
    listStatistics(usersFilted);
  } else {
    clear();
  }
};

const getUsers = async () => {
  let users = await fetch(
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );
  let usersJson = await users.json();
  let usersMap = await usersJson.results.map((user) => {
    const { name, picture, dob, gender } = user;
    return {
      name: name.first + " " + name.last,
      picture,
      age: dob.age,
      gender,
    };
  });
  return usersMap;
};

const listUsers = (users) => {
  userList.innerHTML = "";
  if (users.length == 0) {
    totalUsers.textContent = "Nenhum usuário pesquisado";
    return;
  }
  totalUsers.textContent = `${users.length} usuários encontrados`;

  users
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
    .forEach((user) => {
      let div = document.createElement("div");
      div.classList.add("item");
      let p = document.createElement("p");
      let img = document.createElement("img");
      p.textContent = `${user.name}, ${user.age}`;
      img.src = user.picture.medium;

      div.appendChild(img);
      div.appendChild(p);
      userList.appendChild(div);
    });
};

const listStatistics = async (users) => {
  let listStatistics = document.querySelector(".estatics");
  listStatistics.innerHTML = "";
  statistics.totalAge = await users.reduce((acc, cur) => {
    return acc + cur.age;
  }, 0);
  statistics.avgAge = statistics.totalAge / users.length;
  statistics.totalGenderMale = 0;
  statistics.totalGenderFemale = 0;
  await users.forEach((user) => {
    statistics.totalGenderMale =
      user.gender === "male"
        ? ++statistics.totalGenderMale
        : statistics.totalGenderMale;
    statistics.totalGenderFemale =
      user.gender === "female"
        ? ++statistics.totalGenderFemale
        : statistics.totalGenderFemale;
  });

  title.textContent = "Estatísticas";
  totalGenderMale.textContent = `Sexo Masculino: ${statistics.totalGenderMale}`;
  totalGenderFemale.textContent = `Sexo Feminino: ${statistics.totalGenderFemale}`;
  totalAge.textContent = `Soma das idades: ${statistics.totalAge}`;
  avgAge.textContent = `Média de idades: ${statistics.avgAge.toFixed(2)}`;

  listStatistics.appendChild(title);
  listStatistics.appendChild(hr);
  listStatistics.appendChild(totalGenderMale);
  listStatistics.appendChild(totalGenderFemale);
  listStatistics.appendChild(totalAge);
  listStatistics.appendChild(avgAge);
};
