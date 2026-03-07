const loadLessonTabs = async ()=> {
    const response = await fetch("https://openapi.programming-hero.com/api/levels/all");

    const data = await response.json();

    displayLessonTabs(data);
}

async function loadLessonCards(id) {
    const response = await fetch(`https://openapi.programming-hero.com/api/level/${id}`);
    const data = await response.json();

    displayLessonCards(data.data);
    
    activeTabs(id);
}

function activeTabs(id) {
    const lessonbtn = document.getElementById(`lesson${id}`);
    const allbtn = document.querySelectorAll('.lessonBtn');

    allbtn.forEach(e=> e.classList.add('btn-outline'));

    lessonbtn.classList.remove('btn-outline');
}

function activeLoader(status) {
    if(status) {
        document.getElementById("loader").classList.remove('hidden');
        document.getElementById("lessonContents").classList.add('hidden');
    }else{
        document.getElementById("loader").classList.add('hidden');
        document.getElementById("lessonContents").classList.remove('hidden');
    }
}

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN";
    window.speechSynthesis.speak(utterance);
}

function loadSynonyms(element) {
    const words = element.map(el=> `<span class="btn">${el}</span>`);
    return words.join(" ");
}

async function loadWordDetail(id) {
    // activeLoader(true);

    const response = await fetch(`https://openapi.programming-hero.com/api/word/${id}`);
    const data = await response.json();

    const modalSection = document.getElementById('modalPop');
    modalSection.innerHTML = `
         <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box space-y-4">
                <h3 class="text-2xl font-bold">${data.data.word} (<i class="fa-solid fa-microphone-lines"></i>:${data.data.pronunciation})</h3>
                <div>
                    <h5 class="font-bold text-xl">Meaning</h5>
                    <p>${data.data.meaning}</p>
                </div>
                <div>
                    <h5 class="font-bold text-xl">Example</h5>
                    <p>${data.data.sentence}</p>
                </div>
                <div>
                    <h5 class="font-bold text-xl">সমার্থক শব্দ গুলো</h5>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        ${loadSynonyms(data.data.synonyms)}
                    </div>
                </div>
                <div class="modal-action">
                <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn btn-primary">Complete Learning</button>
                </form>
                </div>
            </div>
            </dialog>
    `;

    const modalBtn = document.getElementById("my_modal_5");
    modalBtn.showModal();
}


function displayLessonCards(words) {
    activeLoader(true);


    const lessonContents = document.getElementById("lessonContents");
    lessonContents.innerHTML="";

    if(words.length === 0) {
            lessonContents.innerHTML=`
                <div class="text-center col-span-full">
                    <img src="./assets/alert-error.png" class="m-auto">
                    <p>এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                    <h3 class="text-[25px] font-medium">নেক্সট Lesson এ যান</h3>
                </div>
            `;
        
        activeLoader(false);
        return;
    }
    
    words.forEach(word => {

        const wordCard = document.createElement("div");
        wordCard.innerHTML = `<div class="bg-white p-6 text-center space-y-3 rounded-sm">
                        <h3 class="text-[26px] font-bold">${word.word? word.word : "শব্দ পাওয়া যায়নি"}</h3>
                        <p>Meaning/Pronunciation</p>
                        <h5 class="text-[18px] font-semibold">"${word.meaning? word.meaning : "অর্থ পাওয়া যায়নি"}/${word.pronunciation ? word.pronunciation: "উচ্চারন পাওয়া যায়নি"}"</h5>
                        <div class="flex items-center justify-between text-black">
                            <button onclick="loadWordDetail(${word.id})" class="btn"><i class="fa-solid fa-circle-info"></i></button>
                            <button onclick="pronounceWord('${word.word}')" class="btn"><i class="fa-solid fa-volume-high"></i></button>
                        </div>
                    </div>`

        lessonContents.append(wordCard);

        activeLoader(false);

    })
}


function displayLessonTabs(lesson) {
    const lessonTabs = document.getElementById('lessonTabs');
    lessonTabs.innerHTML ="";

    lesson.data.forEach(element => {
        // console.log(element.level_no)

        const btn = document.createElement("button");
        btn.className = "lessonBtn btn btn-outline btn-primary text-[14px] font-bold";

        btn.innerHTML = `<i class="fa-solid fa-book-open"></i> Lesson -${element.level_no}
        `;

        btn.setAttribute("onclick", `loadLessonCards(${element.level_no})`);
        btn.setAttribute("id", `lesson${element.level_no}`);

        lessonTabs.append(btn);

    });
}

loadLessonTabs();


document.getElementById('searchBtn').addEventListener('click', ()=> {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();

    console.log(searchInput)
    
    fetch('https://openapi.programming-hero.com/api/words/all')
    .then(response => response.json())
    .then(data=> {
        const allWords = data.data;

        const filterWords = allWords.filter(word => {
            return word.word.toLowerCase().includes(searchInput);
        })

        displayLessonCards(filterWords);
    })

    document.querySelectorAll('.lessonBtn').forEach(e=>e.classList.add('btn-outline'));
    
})

