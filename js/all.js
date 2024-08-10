// Inicializa o Swiper para o slide hero com efeito de fade
var slide_hero = new Swiper(".slide-hero", {
    effect: "fade",
    pagination: {
      el: ".slide-hero .main-area .area-explore .swiper-pagination",
    },
  });
  
  // Seleciona todos os elementos de cartão de Pokémon
  var cardPokemon = document.querySelectorAll(".js-open-details-pokemon");
  
  // Seleciona o botão de fechar modal de detalhes do Pokémon
  var btnCloseModal = document.querySelector(".js-close-modal-details-pokemon");
  
  // Seleciona o elemento que mostra a contagem de Pokémons
  var countPokemons = document.getElementById("js-count-pokemons");
  
  // Seleciona o botão de dropdown customizado
  var btnDropdownSelect = document.querySelector(".js-open-select-custom");
  
  // Seleciona a área que contém a lista de Pokémons
  var areaPokemons = document.getElementById("js-list-pokemons");
  
  // Adiciona evento de clique em cada cartão de Pokémon para abrir os detalhes
  cardPokemon.forEach(function (e) {
    e.addEventListener("click", openDetailsPokemon);
  });
  
  // Adiciona evento de clique no botão de fechar modal se ele existir
  if (btnCloseModal) {
    btnCloseModal.addEventListener("click", closeDetailsPokemon);
  }
  
  // Adiciona evento de clique no botão de dropdown customizado
  if (btnDropdownSelect) {
    btnDropdownSelect.addEventListener("click", function () {
      btnDropdownSelect.parentElement.classList.toggle("active");
    });
  }
  
  // Função para abrir o modal de detalhes do Pokémon
  function openDetailsPokemon() {
    document.documentElement.classList.add("open-modal");
  }
  
  // Função para fechar o modal de detalhes do Pokémon
  function closeDetailsPokemon() {
    document.documentElement.classList.remove("open-modal");
  }
  