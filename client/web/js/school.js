//For the carousel of benefits of 2xcell in students section
const arr = [
    '2xcell creates multiple opportunities for engagement as compared to any other platform',
    'Higher Level of Engagement = More data points',
    '2xcell creates multiple opportunities for engagement as compared to any other platform',
    'Higher Level of Engagement = More data points',
    '2xcell creates multiple opportunities for engagement as compared to any other platform',
    'Higher Level of Engagement = More data points',
    '2xcell creates multiple opportunities for engagement as compared to any other platform',
    'Higher Level of Engagement = More data points',
    '2xcell creates multiple opportunities for engagement as compared to any other platform',
];

//Creating carousel cards from the array of texts
let visibleCardsIndex = 1
if (window.matchMedia("(max-width: 420px").matches) {
    visibleCardsIndex = 0
}
arr.forEach((text, index) => {

    //Create the card element
    let card = document.createElement('div')
    card.classList.add('carousel_card')
    card.id = `carouselCard_${index + 1}`
    if (index > visibleCardsIndex) {
        card.classList.add('hidden')
    }

    //Create the card number 
    let carouselCardNumber = document.createElement('span')
    carouselCardNumber.classList.add('carousel_card_number')
    carouselCardNumber.innerText = (index + 1) + "."

    //Create element of card text
    let cardBody = document.createElement('span')
    cardBody.classList.add('carousel_card_body')
    cardBody.innerText = text

    //Add the elements to card 
    card.appendChild(carouselCardNumber)
    card.appendChild(cardBody)

    //Add carousel card to the carousel
    document.querySelector('.carousel').appendChild(card)
})

//Function to control the carousel
let pointer = 1
let controlValue = 2
if (window.matchMedia("(max-width: 420px").matches) {
    controlValue = 1
}

const moveRight = () => {
    if (pointer + controlValue <= arr.length) {
        document.getElementById(`carouselCard_${pointer}`).classList.add('hidden')
        document.getElementById(`carouselCard_${pointer+controlValue}`).classList.remove('hidden')
        pointer++;
    }
}
const moveLeft = () => {
    if (pointer - controlValue >= 0) {
        document.getElementById(`carouselCard_${pointer+(controlValue-1)}`).classList.add('hidden')
        document.getElementById(`carouselCard_${pointer-1}`).classList.remove('hidden')
        pointer--;
    }
}