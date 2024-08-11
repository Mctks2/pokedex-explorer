// Inicia o slide principal utilizando Swiper
var slideHero = new Swiper(".slide-hero", {
  effect: 'fade',
  pagination: {
    el: ".slide-hero .main-area .area-explore .swiper-pagination",
  },
});

// Seleciona elementos HTML necessários
const cardPokemons = document.querySelectorAll('.js-open-details-pokemon');
const btnCloseModal = document.querySelector('.js-close-modal-details-pokemon');
const btnDropdownSelect = document.querySelector('.js-open-select-custom');
const areaPokemons = document.getElementById('js-list-pokemons');
const countPokemons = document.getElementById('js-count-pokemons');
const areaTypes = document.getElementById('js-type-area');
const areaTypesMobile = document.querySelector('.dropdown-select');
const btnLoadMore = document.getElementById('js-btn-load-more');

// Adiciona eventos para abrir detalhes do Pokémon ao clicar no card
cardPokemons.forEach(card => {
  card.addEventListener('click', openDetailsPokemon);
});

// Adiciona evento para fechar modal de detalhes do Pokémon
if (btnCloseModal) {
  btnCloseModal.addEventListener('click', closeDetailsPokemon);
}

// Adiciona evento para abrir dropdown de seleção customizada
btnDropdownSelect.addEventListener('click', () => {
  btnDropdownSelect.parentElement.classList.toggle('active');
});

// Função que capitaliza a primeira letra de uma string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Função para criar um card de Pokémon
function createCardPokemon(code, type, name, imageSrc) {
  const card = document.createElement('button');
  card.classList = `card-pokemon js-open-details-pokemon ${type}`;
  card.setAttribute('code-pokemon', code);
  areaPokemons.appendChild(card);

  const image = document.createElement('div');
  image.classList = 'image';
  card.appendChild(image);

  const imageElement = document.createElement('img');
  imageElement.className = 'thumb-img';
  imageElement.setAttribute('src', imageSrc);
  image.appendChild(imageElement);

  const infoCardPokemon = document.createElement('div');
  infoCardPokemon.classList = 'info';
  card.appendChild(infoCardPokemon);

  const infoTextPokemon = document.createElement('div');
  infoTextPokemon.classList = 'text';
  infoCardPokemon.appendChild(infoTextPokemon);

  const codePokemon = document.createElement('span');
  codePokemon.textContent = formatPokemonCode(code);
  infoTextPokemon.appendChild(codePokemon);

  const namePokemon = document.createElement('h3');
  namePokemon.textContent = capitalizeFirstLetter(name);
  infoTextPokemon.appendChild(namePokemon);

  const areaIcon = document.createElement('div');
  areaIcon.classList = 'icon';
  infoCardPokemon.appendChild(areaIcon);

  const imgType = document.createElement('img');
  imgType.setAttribute('src', `img/icon-types/${type}.svg`);
  areaIcon.appendChild(imgType);
}

// Função para formatar o código do Pokémon
function formatPokemonCode(code) {
  return (code < 10) ? `#00${code}` : (code < 100) ? `#0${code}` : `#${code}`;
}

// Função para listar todos os Pokémons a partir da API
function listPokemons(urlApi) {
  axios.get(urlApi)
    .then(response => {
      const { results, count } = response.data;
      countPokemons.innerText = count;

      results.forEach(pokemon => {
        const urlApiDetails = pokemon.url;
        axios.get(urlApiDetails)
          .then(response => {
            const { name, id, sprites, types } = response.data;

            const infoCard = {
              name: name,
              code: id,
              image: sprites.other.dream_world.front_default,
              type: types[0].type.name
            }

            createCardPokemon(infoCard.code, infoCard.type, infoCard.name, infoCard.image);

            // Reaplica o evento de abrir detalhes após criar novos cards
            const cardPokemons = document.querySelectorAll('.js-open-details-pokemon');
            cardPokemons.forEach(card => {
              card.addEventListener('click', openDetailsPokemon);
            });
          });
      });
    });
}

// Função para abrir modal de detalhes do Pokémon
function openDetailsPokemon() {
  document.documentElement.classList.add('open-modal');
  
  const codePokemon = this.getAttribute('code-pokemon');
  const imagePokemon = this.querySelector('.thumb-img');
  const iconTypePokemon = this.querySelector('.info .icon img');
  const namePokemon = this.querySelector('.info h3');
  const codeStringPokemon = this.querySelector('.info span');

  const modalDetails = document.getElementById('js-modal-details');
  const imgPokemonModal = document.getElementById('js-image-pokemon-modal');
  const iconTypePokemonModal = document.getElementById('js-image-type-modal');
  const namePokemonModal = document.getElementById('js-name-pokemon-modal');
  const codePokemonModal = document.getElementById('js-code-pokemon-modal');
  const heightPokemonModal = document.getElementById('js-height-pokemon');
  const weightPokemonModal = document.getElementById('js-weight-pokemon');
  const mainAbilitiesPokemonModal = document.getElementById('js-main-abilities');

  imgPokemonModal.setAttribute('src', imagePokemon.getAttribute('src'));
  modalDetails.setAttribute('type-pokemon-modal', this.classList[2]);
  iconTypePokemonModal.setAttribute('src', iconTypePokemon.getAttribute('src'));

  namePokemonModal.textContent = namePokemon.textContent;
  codePokemonModal.textContent = codeStringPokemon.textContent;

  axios.get(`https://pokeapi.co/api/v2/pokemon/${codePokemon}`)
    .then(response => {
      const data = response.data;

      const infoPokemon = {
        mainAbilities: capitalizeFirstLetter(data.abilities[0].ability.name),
        types: data.types,
        weight: data.weight,
        height: data.height,
        abilities: data.abilities,
        stats: data.stats,
        urlType: data.types[0].type.url
      }

      // Função para listar os tipos do Pokémon
      function listPokemonTypes() {
        const areaTypesModal = document.getElementById('js-types-pokemon');
        areaTypesModal.innerHTML = "";

        infoPokemon.types.forEach(itemType => {
          const itemList = document.createElement('li');
          areaTypesModal.appendChild(itemList);

          const spanList = document.createElement('span');
          spanList.classList = `tag-type ${itemType.type.name}`;
          spanList.textContent = capitalizeFirstLetter(itemType.type.name);
          itemList.appendChild(spanList);
        });
      }

      // Função para listar as fraquezas do Pokémon
      function listPokemonWeaknesses() {
        const areaWeak = document.getElementById('js-area-weak');
        areaWeak.innerHTML = "";

        axios.get(infoPokemon.urlType)
          .then(response => {
            const weaknesses = response.data.damage_relations.double_damage_from;
            weaknesses.forEach(itemType => {
              const itemListWeak = document.createElement('li');
              areaWeak.appendChild(itemListWeak);

              const spanList = document.createElement('span');
              spanList.classList = `tag-type ${itemType.name}`;
              spanList.textContent = capitalizeFirstLetter(itemType.name);
              itemListWeak.appendChild(spanList);
            });
          });
      }

      // Preenche as informações do modal
      heightPokemonModal.textContent = `${infoPokemon.height / 10}m`;
      weightPokemonModal.textContent = `${infoPokemon.weight / 10}kg`;
      mainAbilitiesPokemonModal.textContent = infoPokemon.mainAbilities;

      // Atualiza as barras de status do Pokémon
      const statsHp = document.getElementById('js-stats-hp');
      const statsAttack = document.getElementById('js-stats-attack');
      const statsDefense = document.getElementById('js-stats-defense');
      const statsSpAttack = document.getElementById('js-stats-sp-attack');
      const statsSpDefense = document.getElementById('js-stats-sp-defense');
      const statsSpeed = document.getElementById('js-stats-speed');

      statsHp.style.width = `${infoPokemon.stats[0].base_stat}%`;
      statsAttack.style.width = `${infoPokemon.stats[1].base_stat}%`;
      statsDefense.style.width = `${infoPokemon.stats[2].base_stat}%`;
      statsSpAttack.style.width = `${infoPokemon.stats[3].base_stat}%`;
      statsSpDefense.style.width = `${infoPokemon.stats[4].base_stat}%`;
      statsSpeed.style.width = `${infoPokemon.stats[5].base_stat}%`;

      listPokemonTypes();
      listPokemonWeaknesses();
    });
}

// Função para fechar o modal de detalhes do Pokémon
function closeDetailsPokemon() {
  document.documentElement.classList.remove('open-modal');
}

// Função para listar todos os tipos de Pokémon na API
function listPokemonTypes() {
  axios.get('https://pokeapi.co/api/v2/type')
    .then(response => {
      const { results } = response.data;

      results.forEach((type, index) => {
        if (index < 18) {
          createTypeElement(type, index, areaTypes);
          createTypeElement(type, index, areaTypesMobile);
        }
      });
    });
}

// Função para criar um elemento de tipo de Pokémon
function createTypeElement(type, index, areaElement) {
  const itemType = document.createElement('li');
  areaElement.appendChild(itemType);

  const buttonType = document.createElement('button');
  buttonType.classList = `type-filter type-${type.name}`;
  buttonType.setAttribute('code-type', index + 1);
  itemType.appendChild(buttonType);

  const iconType = document.createElement('div');
  iconType.classList = 'icon';
  buttonType.appendChild(iconType);

  const iconElement = document.createElement('img');
  iconElement.setAttribute('src', `img/icon-types/${type.name}.svg`);
  iconType.appendChild(iconElement);

  const nameType = document.createElement('div');
  nameType.classList = 'name';
  nameType.textContent = capitalizeFirstLetter(type.name);
  buttonType.appendChild(nameType);

  // Adiciona eventos ao clicar no botão de filtro de tipo
  buttonType.addEventListener('click', filterByTypePokemon);
}

// Função para carregar mais Pokémons na lista
btnLoadMore.addEventListener('click', () => {
  const offset = areaPokemons.children.length;
  listPokemons(`https://pokeapi.co/api/v2/pokemon?limit=9&offset=${offset}`);
});

// Função para filtrar os Pokémons por tipo
function filterByTypePokemon() {
  const idType = this.getAttribute('code-type');
  const areaPokemons = document.getElementById('js-list-pokemons');
  const allBtnTypes = document.querySelectorAll('.type-filter');
  areaPokemons.innerHTML = "";

  allBtnTypes.forEach(button => {
    button.classList.remove('active');
  });
  
  this.classList.add('active');

  if (idType) {
    listPokemons(`https://pokeapi.co/api/v2/type/${idType}`);
  } else {
    listPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');
  }
}

// Chama funções iniciais
listPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');
listPokemonTypes();
