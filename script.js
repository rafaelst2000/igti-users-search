let color = 0;
let search = null;
let totalUsers = null;
let users = [];
let usersFilted = [];
let statistics = {
  totalFemale: 0,
  totalMale: 0,
  totalAge: 0,
  average: 0,
};
totalUsers = document.querySelector("#usersQuant");
totalUsers.innerHTML = "Nenhum usuário pesquisado";
inputSearch = document.querySelector("#input");

let userList = document.querySelector(".container-item");
let title = document.createElement("h1");
let hr = document.createElement("hr");
let totalFemale = document.createElement("h2");
let totalMale = document.createElement("h2");
let totalAge = document.createElement("h2");
let average = document.createElement("h2");

window.addEventListener("load", async () => {
  clear();
  users = await getUsers();
  inputSearch.addEventListener("keyup", filterUsers);
});

const changecolor = (event) => {
  color++;
  if (color % 2 == 0) {
    var element = document.body;
    element.classList.toggle("dark-mode");
  } else {
    var element = document.body;
    element.classList.toggle("light-mode");
  }
};

const filterUsers = async (event) => {
  clear();
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

const clear = () => {
  let listStatistics = document.querySelector(".statistics");
  listStatistics.innerHTML = "";
  title.textContent = "Estatísticas";
  average.textContent = `Sem dados.`;
  totalUsers.innerHTML = "Nenhum usuário pesquisado";

  listStatistics.appendChild(title);
  listStatistics.appendChild(average);
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

const listStatistics = (users) => {
  let listStatistics = document.querySelector(".statistics");
  listStatistics.innerHTML = "";
  statistics.totalAge = users.reduce((acc, cur) => {
    return acc + cur.age;
  }, 0);
  statistics.average = statistics.totalAge / users.length;
  statistics.totalMale = 0;
  statistics.totalFemale = 0;
  users.forEach((user) => {
    statistics.totalMale =
      user.gender === "male" ? ++statistics.totalMale : statistics.totalMale;
    statistics.totalFemale =
      user.gender === "female"
        ? ++statistics.totalFemale
        : statistics.totalFemale;
  });

  title.textContent = "Estatísticas";
  totalMale.textContent = `Sexo Masculino: ${statistics.totalMale}`;
  totalFemale.textContent = `Sexo Feminino: ${statistics.totalFemale}`;
  totalAge.textContent = `Soma das idades: ${statistics.totalAge}`;
  average.textContent = `Média de idades: ${statistics.average.toFixed(2)}`;

  listStatistics.appendChild(title);
  listStatistics.appendChild(hr);
  listStatistics.appendChild(totalMale);
  listStatistics.appendChild(totalFemale);
  listStatistics.appendChild(totalAge);
  listStatistics.appendChild(average);
};
