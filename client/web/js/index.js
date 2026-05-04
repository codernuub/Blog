//For the reviews by the Students in the homepage
const reviews = [{
        name: 'Rudra',
        role: 'Student',
        review: 'It was a great program, full of learning! The faculty was also very knowledgeable'
    },
    {
        name: 'Neha',
        role: 'Student',
        review: '2xcell has the most engaging resources! I could watch the 2D/3D videos multiple times to gain conceptual clarity.'
    },
    {
        name: 'Rajesh Shah',
        role: 'Parent',
        review: 'The gamified learning made concepts so much fun to understand!'
    },
    {
        name: 'Meena Malhotra',
        role: 'Parent',
        review: 'My son used to fumble while speaking in English. But thanks to 2xcell he has mastered the art of communication.'
    },
    {
        name: 'Vandana Rai',
        role: 'Teacher',
        review: 'As a teacher I can make my own worksheets, or choose from the library on 2xcell to share with my students! Lots of time saving. It is an amazing platform that makes study fun and engaging!'
    },
    {
        name: 'Subhangi Dutt',
        role: 'Teacher',
        review: '2xcell has an endless supply of resources! It has interactive content that can be easily accessed by both teachers and students alike!'
    },
    {
        name: 'Meena Joshi',
        role: 'Teacher',
        review: 'As a teacher, what I value most in online teaching is the emphasis on learning process and needs of the learners. 2xcell fulfills all of that and much more!'
    },
]

let currentCard = 0

//Creating the reviews from the data above
reviews.forEach((review, index) => {

    //Create the review card
    let card = document.createElement('div')
    card.classList.add('f1')
    card.id = `${index}`
    if (index > currentCard) {
        card.classList.add('hidden')
    }

    let newLine = document.createElement('br')

    //Create the body of review
    let reviewElement = document.createElement('p')
    reviewElement.innerText = review.review

    //Create the image element of reviewer
    let imageElement = document.createElement('img')
    imageElement.src = review.image ? review.image : "https://img.icons8.com/color/50/000000/user.png"

    //Create the eleemnt for name of the reviewer
    let nameElement = document.createElement('h4')
    nameElement.innerText = review.name

    //Create the elemnt for role of the reviewer
    let roleElement = document.createElement('h5')
    roleElement.innerText = review.role

    //Add the children to the parent card 
    card.appendChild(reviewElement)
    card.appendChild(newLine)
    card.appendChild(imageElement)
    card.appendChild(nameElement)
    card.appendChild(roleElement)

    //Add the card to the page
    document.querySelector('.review_carousel').appendChild(card)

})

//Function to control the carousel
const slideLeft = () => {
    document.getElementById(currentCard).classList.add('hidden');
    currentCard = (currentCard + 1) % reviews.length;
    document.getElementById(currentCard).classList.remove('hidden');
}
const slideRight = () => {
    document.getElementById(currentCard).classList.add('hidden');
    currentCard--;
    if (currentCard < 0) {
        currentCard = reviews.length - 1
    }
    document.getElementById(currentCard).classList.remove('hidden');
}


//function to submit the  registration data
const submitRegistrationData = async() => {
    const name = document.getElementById('registration_name').value
    const contact = document.getElementById('registration_contact').value
    const email = document.getElementById('registration_email').value
    const grade = document.getElementById('grade').value
    const state = document.getElementById('registration_state').value

    // await fetch(``)
    //     .then(response => response.json())
    //         .then(response => {

    //         })
    openOTPModal()
}

//Function to submit the OTP 
const submitOTP = async() => {

    const otp = document.getElementById('otp_input').value
        // await fetch(``)
        //     .then(response => response.json())
        //         .then(response => {

    //         })

    closeOTPModal()
}


//Function to control the modal of otp
const MODAL_TRANSITION_TIME = 150

const openOTPModal = () => {
    // document.getElementById("newsletter_modal").classList.remove('hidden');
    document.getElementById("otp_modal_bg").style.display = "block";
    document.getElementById("otp_modal").style.display = "block";
    setTimeout(() => {
        document.getElementById("otp_modal").style.opacity = "1";
        document.getElementById("otp_modal_bg").style.opacity = "1";
    }, MODAL_TRANSITION_TIME);
}

const closeOTPModal = () => {
    // document.getElementById("newsletter_modal").classList.add('hidden');
    document.getElementById("otp_modal").style.opacity = "0";
    document.getElementById("otp_modal_bg").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("otp_modal").style.display = "none";
        document.getElementById("otp_modal_bg").style.display = "none";
    }, MODAL_TRANSITION_TIME);
}




//Function to control the modal of subscription

const openModal = () => {
    // document.getElementById("newsletter_modal").classList.remove('hidden');
    document.getElementById("newsletter_modal_bg").style.display = "block";
    document.getElementById("newsletter_modal").style.display = "block";
    setTimeout(() => {
        document.getElementById("newsletter_modal").style.opacity = "1";
        document.getElementById("newsletter_modal_bg").style.opacity = "1";
    }, MODAL_TRANSITION_TIME);
}

const closeModal = () => {
    // document.getElementById("newsletter_modal").classList.add('hidden');
    document.getElementById("newsletter_modal").style.opacity = "0";
    document.getElementById("newsletter_modal_bg").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("newsletter_modal").style.display = "none";
        document.getElementById("newsletter_modal_bg").style.display = "none";
    }, MODAL_TRANSITION_TIME);
}




// //For the carousel of benefits of 2xcell in students section
// const arr = [
//     '2xcell creates multiple opportunities for engagement as compared to any other platform',
//     'Higher Level ofEngagement = More data points',
//     '2xcell creates multiple opportunities for engagement as compared to any other platform',
//     'Higher Level ofEngagement = More data points',
//     '2xcell creates multiple opportunities for engagement as compared to any other platform',
//     'Higher Level ofEngagement = More data points',
//     '2xcell creates multiple opportunities for engagement as compared to any other platform',
//     'Higher Level ofEngagement = More data points',
//     '2xcell creates multiple opportunities for engagement as compared to any other platform',
// ];

// //Creating carousel cards from the array of texts
// let visibleCardsIndex = 1
// if (window.matchMedia("(max-width: 420px").matches) {
//     visibleCardsIndex = 0
// }
// arr.forEach((text, index) => {

//     //Create the card element
//     let card = document.createElement('div')
//     card.classList.add('carousel_card')
//     card.id = `carouselCard_${index + 1}`
//     if (index > visibleCardsIndex) {
//         card.classList.add('hidden')
//     }

//     //Create the card number 
//     let carouselCardNumber = document.createElement('span')
//     carouselCardNumber.classList.add('carousel_card_number')
//     carouselCardNumber.innerText = (index + 1) + "."

//     //Create element of card text
//     let cardBody = document.createElement('span')
//     cardBody.classList.add('carousel_card_body')
//     cardBody.innerText = text

//     //Add the elements to card 
//     card.appendChild(carouselCardNumber)
//     card.appendChild(cardBody)

//     //Add carousel card to the carousel
//     document.querySelector('.carousel').appendChild(card)
// })

// //Function to control the carousel
// let pointer = 1
// let controlValue = 2
// if (window.matchMedia("(max-width: 420px").matches) {
//     controlValue = 1
// }

// const moveRight = () => {
//     if (pointer + controlValue <= arr.length) {
//         document.getElementById(`carouselCard_${pointer}`).classList.add('hidden')
//         document.getElementById(`carouselCard_${pointer+controlValue}`).classList.remove('hidden')
//         pointer++;
//     }
// }
// const moveLeft = () => {
//     if (pointer - controlValue >= 0) {
//         document.getElementById(`carouselCard_${pointer+(controlValue-1)}`).classList.add('hidden')
//         document.getElementById(`carouselCard_${pointer-1}`).classList.remove('hidden')
//         pointer--;
//     }
// }