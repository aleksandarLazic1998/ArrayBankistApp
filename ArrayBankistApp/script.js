'use strict';

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
