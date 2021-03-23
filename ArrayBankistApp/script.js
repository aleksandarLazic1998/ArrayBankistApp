'use strict';
//=========================================/SIMPLE ARRAY METHODS/================================//
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements:
//
const labelWelcome = document.querySelector('.welcome');

//
const labelDate = document.querySelector('.date');

//
const labelBalance = document.querySelector('.balance__value');

//
const labelSumIn = document.querySelector('.summary__value--in');

//
const labelSumOut = document.querySelector('.summary__value--out');

//
const labelSumInterest = document.querySelector('.summary__value--interest');

//
const labelTimer = document.querySelector('.timer');


//
const containerApp = document.querySelector('.app');

//
const containerMovements = document.querySelector('.movements');


//
const btnLogin = document.querySelector('.login__btn');

//
const btnTransfer = document.querySelector('.form__btn--transfer');

//
const btnLoan = document.querySelector('.form__btn--loan');

//
const btnClose = document.querySelector('.form__btn--close');

//
const btnSort = document.querySelector('.btn--sort');


//
const inputLoginUsername = document.querySelector('.login__input--user');

//
const inputLoginPin = document.querySelector('.login__input--pin');

//
const inputTransferTo = document.querySelector('.form__input--to');

//
const inputTransferAmount = document.querySelector('.form__input--amount');

//
const inputLoanAmount = document.querySelector('.form__input--loan-amount');

//
const inputCloseUsername = document.querySelector('.form__input--user');

//
const inputClosePin = document.querySelector('.form__input--pin');


//Displays transactions in banking account
const displayMovements = function (movements) {
  //da izbrise sve kolone koje su dodate lazno i onda tek da dodaje nove kolone
  containerMovements.innerHTML = '';
  //.textContent = 0
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
    </div >`;
    //Ovo ubacuje neki html u html kod kao sto je const html 
    //.insertAdjencentHTML prima dva parametra 1.:pozicija u kojuj zelimo da attachujemo html 2: string koji kontejnu html
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// console.log(containerMovements.innerHTML);

//Calculate Total Balance
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(((acc, curr) => acc + curr), 0);
  labelBalance.textContent = `${account.balance} €`;

};
//Prikaz depozita
const calcDisplaySummary = function (account) {
  const incomes = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcome = account.movements.filter(mov => mov < 0).reduce((acc, currEl) => acc + currEl, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((interest, i, arr) => {
      console.log(arr)
      return interest >= 1;
    })
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};


//Create usernames for users
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    //Napravili smo svakom korisniku novi kljuc u kome ima username: i sta vraca
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
//map menja niz ili forEachne menja
const updateUi = function (account) {
  displayMovements(account.movements)

  //Display balance
  calcDisplayBalance(account)

  //display summary
  calcDisplaySummary(account);
};


//eVENT hANDLER
let currentAccount;

//LOGIN INTO ACC
btnLogin.addEventListener('click', function (event) {
  //Prevent form from submiting
  event.preventDefault()

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display ui and wlcome balance
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //after login clear fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
    updateUi(currentAccount);

  }
});
//TRANSFER AMMOUNT
btnTransfer.addEventListener('click', function (e) {
  //to prevent reloading the page
  e.preventDefault();
  const ammount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (ammount > 0 && receiverAccount && currentAccount.balance >= ammount && receiverAccount?.username !== currentAccount.username) {
    currentAccount.movements.push(-ammount);
    receiverAccount.movements.push(+ammount);
    //Update UI
    updateUi(currentAccount);}
});
//REQUEST LOAN
//only grants loans if 1 deposit of 10% loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  //0.1 je 10%
  if (loanAmount > 0 && currentAccount.movements.some(mov => mov >= loanAmount * 0.1)) {
    //Add movement
    currentAccount.movements.push(loanAmount);

    //update UI
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
 });

//DELETE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const indexOfAcc = accounts.findIndex(acc => acc.username === currentAccount.username);

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    accounts.splice(indexOfAcc, 1);
    containerApp.style.opacity = 0;
  }
  //mora poslle if statementa
  inputCloseUsername.value = inputClosePin.value = '';
});

//SORT DEPOSITS AND WITHDRAWALS
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});













/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//-----------------------------------------------/FILTER METHOD/---------------------------------------------------------------
//  const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];  !!!!!!!!!!!!!!!!!!!!!!





//-------------------------------------------------/FIND METHOD/------------------------------------------------
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal)//Ovo ce vratiti prviu uslov koji odgovara bollean vrednost

// //FIND metoda je ista kao filter metoda samo st filter metoda vraca ceo niz koji ispunjava uslov dok find vraca prvi clan u nizu koji ispunjava uslov

// console.log(accounts)
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account)





//-------------------------------------------------/Some every METHOD/------------------------------------------------
// console.log(movements)
// //Ovo je samo testiranje da li ima ovog clana u nizu
// console.log(movements.includes(-130))

// //some je kao da smo napisali if there is any value that fullfil
// const anyDep = movements.some(mov => mov > 0);
// console.log(anyDep);

// //EVERY METODA JE ISTA KAO SOME SAMO STO DA BI EVERY METODA VRATILA TRUEEE MORA SVAKI ELEMENT U NIZU DA PRODJE TEST 
// //INACE JE FALSE

// //fLAT,FLATMAP

// //KADA IMAMO NIZ U NIZU TO SU VISE DIMENZIONALNI NIZOVI FLAT SLUZI DA IH PRETVORI U JEDNODIMENZIONE
// const arr = [[1, 2, 3], [4, 5, 6,], 7, 8, 9];
// arr.flat();
// console.log(arr.flat());//[1,2,3,4,5,6,7,8,9] ali ovo vazi samo za jednu dimenziju


// //sorting//=======================

// const owners = ["Jonas", "Zach", "Adam", "Martha"];
// console.log(owners.sort());//Sortirano od a do z
// //SORTING MUTIRA NIZ
// //strings


// //numbers
// //pretvori brojeve u stringove i sortira ih

// console.log(movements.sort());//sortira ih po prvom broj

// movements.sort((a, b) => {
//   //ako je a manje od 0 prvo ce a pa b ako je a pozitivan br
//   //retur a>0 a,b
//   //reurn a>0 b,a
//   if (a > b) {
//     return 1;
//   } if (b > a) {
//     return - 1; 
//   }
// });//od najmanjeg broja do najveceg

// movements.sort((a, b) => {
//   //ako je a manje od 0 prvo ce a pa b ako je a pozitivan br
//   //retur a>0 a,b
//   //reurn a>0 b,a
//   if (a > b) {
//     return -1;
//   } if (b > a) {
//     return 1; 
//   }
// });//od najveceg do najmanjeg


































// Coding Challenge #2


/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

// GOOD LUCK 😀
// */

// const calcAverageHumanAge = function (ages) {
//   //dogs in human age
//   const humanAge = ages.map(function (age) {
//     if (age <= 2) {
//       return 2 * age;
//     } else {
//       return 16 + age * 4
//     }
//   });
//   const adult = humanAge.filter(age => age >= 18);
//   const averageAdult = adult.reduce(function (acc, currAge) {
//     return acc + currAge;
//   }, 0) / adult.length;

// console.log(adult)
// console.log(averageAdult)
// console.log(humanAge)
//   return averageAdult;
// }

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// console.log('--------------------------')
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);


// const deoposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deoposits)

// // const deposit = [];
// // for (const mov of movements) {
// //   if (mov > 0) {
// //     deposit.push(mov);
// //   }
// // } dobija se isti rezultat a razlika je sa filter metodom

// //small challenge 

// const withdrawal = movements.filter(mov => mov < 0);
// console.log(withdrawal);

//-----------------------------------------------/REDUCE METHOD/---------------------------------------------------------------
// accumulator = sum += i
// const balance = movements.reduce(function (accumulator, currentEl, currentIndex, arr) {
//   console.log(`Itteration num:  ${currentIndex}: ${accumulator}`);
//   return accumulator + currentEl;

// }, 0);
// //reduce ima 2 parametra (function, od kog broja krece ) = ((acc, currVal)=>acc + currVal, 0)
//                                                             //Parametar1                 , Parametar 2)               

// console.log(balance);



// let balanceSum = 0; 
// for (const mov of movements) {
//   balanceSum += mov;
// }
// console.log(balanceSum);

//Maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, movements[0]);
// console.log(max)


/////////////////////////////////////////////////
//=========================================/SIMPLE ARRAY METHODS/================================//
//Arrays su objekti
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

//1.SLICE
//uzmemo parce niza i da ne utice na original
//vraca nam subArr
console.log(arr.slice(2));//['c', 'd', 'e']

//begin and end parameter
console.log(arr.slice(2, 3));//['c', 'd'];
console.log(arr.slice(-2));//['d', 'e'];
console.log(arr.slice());//['a', 'b', 'c', 'd', 'e'];
//ovo je isto kao da smo odradili 
//console.log([...arr]); = console.log(arr.slice());


//2.//SPLICE
//Radi isto sto i slice samo je razlika u tome sto splice mutira orignalni array
console.log(arr.slice(2));//['c', 'd', 'e']
arr.splice(-1);//ovim smo se otarasili zadnjeg el ['a', 'b', 'c', 'd'];

console.log(arr); //['a', 'b'] ekstraktovani elementi su nestali iz originalnog niza i nestali u splice


//3.REVERSE
//reversuje niz naopako
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'j'];



console.log(arr2.reverse());//reverse mutira originalni arr
console.log(arr2);


//4.CONCAT
const letters = arr.concat(arr2);
//OVO CE SPPOJITI OBA NIZA U JEDAN ALI PRVI CE BITI ONAJ NA KOJI NADOVEZUJEMO DRUGI
console.log([...arr, ...arr2]);
//CONCAT ne mutira originalni array


//5. JOIN 
//join metoda pretvara niz u string suprotno od split

console.log(letters.join(' - ')); // a - b - c - d - e - j - i - h - g - j 

//==============================================/LOOP ARRAY SA FOR EACH/=========================================//
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//POZITIVNI BR SU DEPOZITI, NEGATIVNI RETRAW
// for (const movement of movements) {
//Prisetimo se pristupanju kaunterima
for(const [i, movement] of movement.entries()){ 
  if (movement > 0) {
    console.log(`Movement:${i+1}, You deposited: ${movement}`);
  } else {
    console.log(`Movement:${i+1}, You withdrew: ${Math.abs(movement)}`);//abs ce nam skinuti minus
  }
}
/*
Movement:1, You deposited: 200
...
Movement:8, You deposited: 1300
*/

/*
console.log('=====================/F O R _ E A C H/=====================')
//For each loopoju kroz noz i kroz svaku itteration i passovace ovu fju
//Nad svakom itteracijom dobice trenutni index vrednosti nad kojom loopoju znaci prvo ce 200, pa 450, -400...



//FOREACH
movements.forEach(function (index,  movement, array) {
  if (movement > 0) {
    console.log(`Movement:${index+1}, You deposited: ${movement}`);
  } else {
    console.log(`Movement:${index+1}, You withdrew: ${Math.abs(movement)}`);//abs ce nam skinuti minus
  }
});*/


// console.log('=======================MOJA PROBA=========================')
// movements.forEach(function (movement) {
//   movement > 0 ? console.log(`You deposited ${movement}`) : console.log(`You withdrew ${Math.abs(movement)}`)//abs ce nam skinuti minus
// });  OVO JE TACNO ✔✔✔✔✔✔✔✔✔✔

// 0: function (200)
// 1: function(450).... do kraja niza*/








//==============================================/FOR EACH WITH MAPS & SETS/=========================================//
/*
//MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});


//SET
const currenciesUnique = new Set(['GBP', 'USD', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);

});*/


/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

// GOOD LUCK 😀
// 

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCopy = dogsJulia.slice();
  dogsJuliaCopy.splice(0, 1);
  dogsJuliaCopy.splice(-2);
  console.log(dogsJuliaCopy);

  const dogs = [...dogsJuliaCopy, ...dogsKate];
  console.log(dogs)

  dogs.forEach(function (years, index){
    const type = years >= 3 ? 'adult🐉' : 'puppy🦝'
    console.log(`Dog number ${index + 1} is an ${type}, and its ${years} years old`);
  });



};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);*/



//==============================================/MAP && FILTER && REDUCE/=========================================//
/*
MAP je slican forEach metodi razlika je u tome sto map metoda napravi novi array u odnosu na original metodu ne pravi kopiju nego potpuno novi niz
[3,1,4,3,2].map(cuurent *2) =[6,2,8,6,2]  [6,2,8,6,2] != [3,1,4,3,2]
*/
/*
FILTER sluzi da filtrira elemente u trenutnom redu
[3,1,4,3,2].filte(cuurent > 2) =[3,4,3]; i on stavlja u nov niz
*/
/*
REDUCE boils ("reduces") all array elements down to one single value ("Adding all elements together")
[3,1,4,3,2].reduce(acc + curr) = 13; i on stavlja u nov niz
acc= ACCUMULATOR Moze se reci da je reduce reduce-ovao ceo niz na jednu single value


//==============================================/MAP METHOD /=========================================//
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//Recimo da suEur i hocemo da ih konvertujemo u USD
const eurToUsd = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

const movementsUSD = movements.map(mov => mov * eurToUsd);
console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) {
  movementsUSDfor.push(mov * eurToUsd);
  console.log(movementsUSDfor);
}

//MAP ima pristup  indexu i celom nizu

const movementsDescript = movements.map((movement, index) => 
  // if (movement > 0) {
  //   return(`Movement:${index+1}, You deposited: ${movement}`);
  // } else {
  //   return(`Movement:${index+1}, You withdrew: ${Math.abs(movement)}`);//abs ce nam skinuti minus
  // }

 `Movement:${index + 1}, You ${movement>0? 'deposited' : 'withdrew'} ${Math.abs(movement)}`
);
console.log(movementsDescript);*/

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// //ovo mze i u vise varijabli
// const eurToUsd = 1.1;

//PIPLINE
// const totalDepositUSD =
//   movements
//   .filter(mov => mov > 0)
//     .map((mov, i, arr) => {
//       // console.log(arr)
//       return mov * eurToUsd;})
//   .reduce((acc, currMov) => acc + currMov, 0);

// console.log(totalDepositUSD)
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const calcAverageHumanAge = function (ages) {
//     //dogs in human age
//   const humanAge = ages.map(age => age <= 2 ? 2 * age : 16 + age * 4).filter(age => age >= 18).reduce((acc, currAge,i,arr) => acc + currAge / arr.length, 0);


//     return humanAge;
// }
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]))