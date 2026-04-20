[{
    title: 'The Very Simple Pretend Miner',
    intro: 'Welcome to the VSPM! 👋. <br/><br/> Press ESC to end the tour.'
},
{
    title: 'Level of Work!',
    element: document.querySelector('.level_of_work'),
    intro: 'The level of work determines whether your mining efforts get included. If you do not exceed the work level, your transaction is not added to the block.'
},
{
    title: 'Number of Zeros',
    element: document.querySelector('.number_of_zeros'),
    intro: 'This is the mathematical puzzle you have to pass. Your hash value needs to have this many zeros preceding it. In bitcoin mining, the hash has to have about 14 leading zeros!! If you try to find more than 4 zeros, you\'ll hang up your computer.' +
        '<br/>If the number of leading zeros isn\'t found, the block keep getting hashed over and over until it does.'
},
{
    title: 'The Nonce',
    element: document.querySelector(".nonce_info"),
    intro: 'A nonce is an abbreviation for "number only used once," which is a number added to a hashed—or encrypted—block in a blockchain that, when rehashed, meets the difficulty level restrictions.'
},
{
    title: 'The Hash',
    element: document.querySelector('.hash_info'),
    intro: 'This is the hashed value of the transaction as well as the nonce.' +
        'The hash has to have the specified number of zeros as well as meet the level of work for it to be added to the chain.'
}]