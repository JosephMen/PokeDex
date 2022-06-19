const baseURL = 'https://pokeapi.co/api/v2/pokemon/'
const evolURL = "https://pokeapi.co/api/v2/evolution-chain/"
const speciesURL = "https://pokeapi.co/api/v2/pokemon-species/"

const inputNameDOM = document.getElementById("pokemonName")
const buttonSearch = document.getElementById('searchPokemon')
const buttonDelete = document.getElementById('deletePokemon')

buttonSearch.addEventListener('click', searchPokemon);

function searchPokemon(){
    displayInfoPokemon(inputNameDOM.value.toLowerCase())
}

//in: a number of pokemon
//out: none
//des: change the data displayed
function changeData(number){
    displayInfoPokemon(number)
}


//in: int 
//out: none
//desc: get the species belongs to pokemon id
function displaySpecies(id){
    fetch(`${speciesURL}${id}`)
    .then(response => response.json())
    .then(data => {
        const array = getEggGroup(data.egg_groups)

        const egGrpDOM = document.getElementById("pkEgGr")
        const text = array.toString();
        const egGrp = text.replace(",", ", ")
        egGrpDOM.innerText = egGrp
        displayEvol(data.evolution_chain.url)

    })
    .catch(err => {
        console.log(err)
    })
}

//Add evolutions of pokemon displayed
function displayEvolution(name){
    fetch(`${baseURL}${name}`)
    .then(response => response.json())
    .then(data => {
        const imgSrc = data.sprites.front_default

        //father from DOM
        const evolChartDOM = document.getElementById("evol")

        //new Div
        const divDOM = document.createElement("div")
        divDOM.classList.add("col")

        const pDOM = document.createElement("p")
        pDOM.innerText = name

        const imgDOM = document.createElement("img")
        imgDOM.src = imgSrc;

        //append chart element
        divDOM.appendChild(imgDOM)
        divDOM.appendChild(pDOM)

        //display on DOM
        evolChartDOM.appendChild(divDOM)


    })
    .catch(err => {
        console.log(err)
    })
}

// In: url of evolution chain
// out: none
// desc: get the data from the API
function displayEvol(url){
    fetch(url)
    .then((response) => response.json())
    .then(data => {
        console.log(data)
        const evolChain = getChainEvol(data.chain, []) // get chain evol

        //Clear the DOM
        const evolChartDOM = document.getElementById("evol")
        let evols = evolChartDOM.childNodes
        evols = Array.from(evols)
        evols.forEach(evol => {
            evol.remove(evol)
        })

        //Display all the pokemons on the array
        evolChain.forEach(evol => {
            displayEvolution(evol)
        })

        console.log(evolChain)
    })
    .catch(err => {
        console.log(err, url)
    })
}

// In: id or name from a Pokemon
// out: none
// desc: display pokemon data on the DOM
function displayInfoPokemon(number){
    fetch(`${baseURL}${number}`)
    .then(response => response.json())
    .then(data => {
        const name = data.species.name
        const idPk = data.id
        const wght = data.weight
        const hgt = data.height
        const imgSrc = data.sprites.front_default
        const ablts = []
        data.abilities.forEach( pokemon => {
            ablts.push(pokemon.ability.name)
        })
        const abls = ablts.toString().replace(",", ", ")

        const nameDOM = document.getElementById("pkName")
        const weightDOM = document.getElementById("pkW")
        const heightDOM = document.getElementById("pkH")
        const imgDOM = document.getElementById("pkImg")
        const abtDOM = document.getElementById("pkAbt")

        nameDOM.innerText = name
        weightDOM.innerText = wght
        heightDOM.innerText = hgt
        imgDOM.src = imgSrc
        abtDOM.innerText = abls

        displaySpecies(data.id)
    })
    .catch(err => {
        alert(`${err}`, "Not foundes, try another one")
    })

}

//Initialize the first pokemons
function fillPokemonList(number){
    
    const name = "None yet"
    for (let i = 1; i <= number; i++ ){
        takePokemon(i)
    }
}

//in: array with json object
//out: array of strings 
//desc: get all the egg groups names from each json object
function getEggGroup(eggGroups){
    const array = []
    eggGroups.forEach(egg => {
        array.push(egg.name)
    });
    return array
}

// In: Json, array empty
// out: array filled
// desc: get chain evol until the evol chain is empty
function getChainEvol(chain, array){
    if (chain.evolves_to.length == 0){
        array.push(chain.species.name)
        return array
    }
    else{
        array.push(chain.species.name)
        return getChainEvol(chain.evolves_to[0], array)
    }
}



// In: id or name from a Pokemon
// out: none
// desc: get the data from an specific pokemon and put it on a li
function takePokemon(name){
    fetch(`${baseURL}${name}`)
    .then((response) => response.json())
    .then((data) => {
  
        // get father 
        const ulItem = document.getElementById("pokemonList")

        //Create item list
        const liItem = document.createElement("li")

        //Set class
        liItem.classList.add("list-group-item")
        liItem.classList.add("nav-item")
        //create container
        const divItem = document.createElement("div")
        divItem.classList.add("row")
        divItem.classList.add("container")
        divItem.classList.add("info")
        divItem.classList.add("d-flex")
        divItem.classList.add("flex-row")

        //create child elements
        const imgItem = document.createElement("img")
        imgItem.src = data.sprites.front_default;
        imgItem.classList.add("col-sm")

        const pItem = document.createElement("p")
        let namePokemon = data.species.name
        pItem.innerText = `${namePokemon.charAt(0).toUpperCase() + namePokemon.slice(1)}` 
        pItem.classList.add("col-7") 
        pItem.style.color = "white"
        pItem.style.fontSize = "1.30em" 
        pItem.style.textAlign = "justify"
        pItem.style.verticalAlign = "center"


        const pNumItem = document.createElement("p")
        pNumItem.innerText = `#${data.id}`
        pNumItem.classList.add("col")
        pNumItem.style.color = "white" 

        
        //Set properties
        divItem.appendChild(imgItem)
        divItem.appendChild(pItem)
        divItem.appendChild(pNumItem)

        //set behavior
        liItem.appendChild(divItem)
        liItem.addEventListener("click", () => changeData(data.id))
        liItem.style.backgroundColor = "brown"
        liItem.style.border = "solid none solid none"
        liItem.style.borderWidth = "3px"
        liItem.style.margin = "0px"
        liItem.style.padding = "0px"
        liItem.classList.add("d-flex")
        liItem.classList.add("flex-row")


        ulItem.appendChild(liItem)      
    })
    .catch( (err) => {
        console.log(err)
    })
}


//initialize first pokemons displayed
function takePokemons(numbers){
    for( let i = 1; i <= numbers; i++){
        takePokemon(i)
    }
}

fillPokemonList(20)