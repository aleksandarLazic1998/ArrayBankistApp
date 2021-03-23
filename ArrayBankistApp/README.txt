Dnevnik projekta
za pocetak menjamo Kolone Current Balanca
1:
*1.Dobra je praksa da se sve pise u funkcijama a ne u globalnom scope-u
pisemo funkciju da prikaze sve pokrete u banci tipa depozit i withdraw
const displayMOvements = function (movements) {

*2.Objekat containerMovements.innerHTML stavljamo da je empty string iz razloga jer u html smo vec
napravili lazno a to ne zelimo pa brisem sve a pravu datu stavljamo dole
  containerMovements.innerHTML = '';

*3.Podatke korisnika mozemo sa forEach metodom da precesljamo

movements = account1.movement = [200, 450, -400, 3000, -650, -130, 70, 1300]
//za svaki clan u nizu pisemo fju koja ce da dodaje vrednost value = "mov" = 200,450 ...
//i br na kojoj je poziciji radimo sa "i"
  movements.forEach(function (mov, i) {

      //proveravamo koji je tip ako je pozitivan broj on ima klasu deposit ako je minus on ima klasu withdrawal
    const type = mov > 0 ? 'deposit' : 'withdrawal';



    const html = `
    <div class="movements__row">
    //ovements__type--${type} = 'deposit' || 'withdrawal' i to ce promeniti izgled u zeleno ili crveno
    //${i + 1} broji od 1 pa do zadnjeg clana niza ${type}= je isto kao i gore
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    //${mov} je vrednost svakog clana u trenutnom itteraju
    <div class="movements__value">${mov}</div>
    </div >`;
    //Ovo ubacuje neki html u html kod kao sto je const html 
    //.insertAdjencentHTML prima dva parametra 1.:pozicija u kojuj zelimo da attachujemo html 2: string koji kontejnu html
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMOvements(account1.movements)
console.log(containerMovements.innerHTML);

/*


*/