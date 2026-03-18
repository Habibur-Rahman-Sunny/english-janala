// 1️⃣  API endpoint for getting all lesson levels
const url = "https://openapi.programming-hero.com/api/levels/all";

// 2️⃣ Fetch all lessons and send the data to displayLessons function
//    → This runs first, so buttons can be rendered before user clicks
const showMessage = () =>{
fetch(url)
.then(response => response.json())
.then(jsObject => displayLessons(jsObject.data));
}
showMessage()


// 4️⃣ Fetch words of a specific lesson level when a lesson button is clicked
//    → This runs after user clicks a lesson button 
const loadLevelWord = (id) => {
  addLoadSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
    .then(res => res.json())
    .then(JsObject => {
      //Remove all active class of lesson btn
        removeActiveBtn()
        //Add active class in clicked btn
        const clickBtn = document.getElementById(`button-${id}`);
        clickBtn.classList.add("active")
        // jsObject
        displayLevelsWords(JsObject.data)
    })
}
const removeActiveBtn = () => {
  //Remove all active class of lesson btn
        const clickedBtn = document.querySelectorAll("#lesson-section button");
        clickedBtn.forEach(button => {
            button.classList.remove("active")
        });
}

// 6️⃣ loadSpinner 
const addLoadSpinner = (status) => {
  if(status == true){
    document.getElementById("spinner-container").classList.remove("hidden");
    document.getElementById("vocabulary-container").classList.add("hidden");
  }else{
    document.getElementById("spinner-container").classList.add("hidden");
    document.getElementById("vocabulary-container").classList.remove("hidden"); 
  }
}

// 5️⃣ Display vocabulary cards of the selected lesson level
//    → This runs after words of a level are fetched
const displayLevelsWords = (specificLevelWordsArray) => {  //specificLevelWordsArray mane nirdishto ekti level er onekgulo words ekta array te ache 
    const vocabularyContainer = document.getElementById("vocabulary-container");
    vocabularyContainer.innerHTML = "";
    if(specificLevelWordsArray.length < 1){
        vocabularyContainer.innerHTML = `
        <div class="col-span-full text-center">
        <img class="mx-auto" src="./assets/alert-error.png" alt="">
        <p class="bangla-font ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h1 class="bangla-font font-bold text-xl">নেক্সট Lesson এ যান</h1>
      </div>
        `;
        addLoadSpinner(false);
        return;
    }
    specificLevelWordsArray.forEach(objectOfArray => {
        const wordCard = document.createElement("div");
        wordCard.innerHTML = `
        <div class="flex flex-col gap-5 text-center bg-white p-5 rounded-lg">
            <h3 class="font-bold text-2xl bangla-font">${objectOfArray.word? objectOfArray.word : "শব্দ পাওয়া যায় নি"}</h3>
            <p class="font-semibold text-xl bangla-font">${objectOfArray.meaning? objectOfArray.meaning : "অর্থ পাওয়া যায় নি" }</p>
            <div>
              <h3 class="font-semibold opacity-80 text-2xl bangla-font">${objectOfArray.pronunciation? objectOfArray.pronunciation : "শব্দ পাওয়া যায় নি"}</h3>
            </div>
            <div class="flex justify-between">
            <button onclick="showModal(${objectOfArray.id})" class="bg-[#1A91FF10] p-2 rounded-sm hover:bg-[#1A91FF40]"><i class="fa-solid fa-circle-info"></i></button>
            <button class="bg-[#1A91FF10] p-2 rounded-sm hover:bg-[#1A91FF40]"><i class="fa-solid fa-volume-high"></i></button>
          </div>
          </div>
        `;
        vocabularyContainer.appendChild(wordCard)
    });
    addLoadSpinner(false);
}



// 7️⃣  function to open the modal using dialog showModal() method
const dialogueModal = document.getElementById("my_modal_5");
const showModal = (id) => {
    dialogueModal.showModal(); // for  Open modal
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    fetch(url)
    .then(resp => resp.json())
    .then(objJs => displayInfoDetails(objJs))
}
// 8️⃣
const displayInfoDetails = (objJs) => {
    dialogueModal.innerText = "";
    const infoSection = document.createElement("div");
    infoSection.innerHTML = `
    <div class="modal-box w-[800px] ">
      <div class="border-1 border-blue-100 p-2 rounded-lg space-y-4">
        <h1 class="font-bold text-xl">${objJs.data.word}( <span><i class="fa-solid fa-microphone-lines"></i></span>:  ${objJs.data.pronunciation})</h1>
        <div class="flex flex-col gap-2">
          <p class="font-bold">meaning</p>
          <p class="bangla-font text-sm">${objJs.data.meaning? objJs.data.meaning : "Not found"}</p>
        </div>
        <div class="flex flex-col gap-2">
          <p class="font-semibold">Example</p>
          <p>${objJs.data.sentence}</p>
        </div>
        <div class="flex flex-col gap-2">
          <div> <p class=" font-semibold">Synonyms</p> </div>
          <div class="flex gap-3">
            <div>${(objJs.data.synonyms && objJs.data.synonyms.length > 0? createElement(objJs.data.synonyms) : "Not found")}</div>
          </div>
        </div>
      </div>
    <div class="modal-action">
      <form method="dialog">
      <!-- if there is a button in form, it will close the modal -->
      <button class="btn btn-active btn-secondary bg-violet-600 border-violet-800 py-1">Complete Learning</button>
      </form>
    </div>
  </div>
    `;
    dialogueModal.appendChild(infoSection);
}

// 9️⃣ write a function to  create synonym buttons automatic.
const createElement = (array) =>{
  const htmlElements = array.map((element) => `<span class="btn bg-blue-100">${element}</span>`);
  const toString = htmlElements.join(" ");
  return toString ;
}

// 3️⃣ Create lesson buttons dynamically and display them in the lesson section
//    → This runs after lessons are fetched in showMessage()
const displayLessons = (lessons) => {
    const lessonSection = document.getElementById("lesson-section")
    lessons.forEach(Lesson => {
        const lessonButton = document.createElement("div");
        lessonButton.innerHTML = `
            <div>
              <button id="button-${Lesson.level_no}" onclick="loadLevelWord(${Lesson.level_no})" class= "btn btn-soft btn-primary"><i class="fa-solid fa-book-open"></i>Lesson -${Lesson.level_no}</button>
            </div>
        `;
        lessonSection.appendChild(lessonButton);
    });
}


// 🔟 write a function to search lesson word
const clickBtn = () => {
  // remove active class in lesson button when click search btn
  removeActiveBtn()
    // get input value
    const input = document.getElementById("input-data");
    const searchValue = input.value.trim().toLowerCase();
    // fetch url
    const url = `https://openapi.programming-hero.com/api/words/all`
    fetch(url)
    .then(response => response.json())
    .then(jsObject => {
        const objectOfArray = jsObject.data //array
        const filterData = objectOfArray.filter(object =>
            object.word.toLowerCase().includes(searchValue)
        )
        displayLevelsWords(filterData);
    }) 
}
