const $animalForm = document.querySelector('#animals-form');
const $displayArea = document.querySelector('#display-area');

//generates cards for each animal and prints to page
const printResults = resultArr => {
  console.log(resultArr);

  const animalHTML = resultArr.map(({ id, name, personalityTraits, species, diet }) => {
    return `
  <div class="col-12 col-md-5 mb-3">
    <div class="card p-3" data-id=${id}>
      <h4 class="text-primary">${name}</h4>
      <p>Species: ${species.substring(0, 1).toUpperCase() + species.substring(1)}<br/>
      Diet: ${diet.substring(0, 1).toUpperCase() + diet.substring(1)}<br/>
      Personality Traits: ${personalityTraits
        .map(trait => `${trait.substring(0, 1).toUpperCase() + trait.substring(1)}`)
        .join(', ')}</p>
    </div>
  </div>
    `;
  });

  $displayArea.innerHTML = animalHTML.join('');
};


const getAnimals = (formData = {}) => {
  //if nothing passed into formData, then the req will be /api/animals
  let queryUrl = '/api/animals?';

  //Object.entries returns an array of the object's own string-keyed property pairs (key/value)
  Object.entries(formData).forEach(([key, value]) => {
    //if queries are passed into formData, they are added to the request
    queryUrl += `${key}=${value}&`;
  });

  console.log(queryUrl);

  fetch(queryUrl)
  .then(response => {
    if (!response.ok) {
      return alert('Error: ' + response.statusText);
    }
    return response.json();
  })
  .then(animalData => {
    console.log(animalData);
    printResults(animalData);
  });
};

//gather form input data and package into an obj to send to getAnimals() as formData argument
const handleGetAnimalsSubmit = event => {
  event.preventDefault();
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const personalityTraitArr = [];
  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;

  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraitArr.push(selectedTraits[i].value);
  }

  const personalityTraits = personalityTraitArr.join(',');

  const animalObject = { diet, personalityTraits };

  getAnimals(animalObject);
};

$animalForm.addEventListener('submit', handleGetAnimalsSubmit);

getAnimals();
