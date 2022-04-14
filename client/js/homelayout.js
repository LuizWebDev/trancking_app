let port = 3000
let username = localStorage.getItem('username')

fetch(`http://localhost:${port}/users/${username}`) 
.then(resp => resp.json())
.then(resp => setuserid(resp))

function setuserid(resp) {
    user_id = resp.user_id
    localStorage.setItem('user_id', resp.user_id);
}

let user_id = localStorage.getItem('user_id')

//submit form in modal
const addHabitForm = document.getElementById('addHabitForm');
addHabitForm.addEventListener('submit', addHabit);


async function addHabit(e) {
    e.preventDefault();
    const formData = new FormData(addHabitForm)
    const formDataSerialised = Object.fromEntries(formData)
    const jsonObject = {...formDataSerialised, user_id: user_id}
    console.log(jsonObject)

    try{
        const response = await fetch (`http://localhost:${port}/habits/${username}`, {
        method: 'POST', 
        body: JSON.stringify(jsonObject),
        headers: {
            'Content-Type': 'application/json'
        }
        })
        const json = await response.json();
        console.log(json)
        window.location.reload()
    }catch(e){
        console.error(e);
        alert('There was an error')
    }

}




//load container below

fetch(`http://localhost:${port}/habits/find/${username}`) //change endpoint
.then(resp => resp.json())
/* .then(resp => console.log(resp)) */
.then(resp => showTracking(resp))


//should this be async?
function showTracking(habits) {
    habits.forEach(habit => {
    const main = document.querySelector('main')

    const ahabit = document.createElement('div')
    ahabit.setAttribute('class', 'habitContainer');
    ahabit.style.borderColor = habit.color

    const hab_div = document.createElement('div')
    hab_div.setAttribute('class', 'hab_section');
    
    const habitName = document.createElement('h3')
    habitName.setAttribute('class', 'hab_title');
    habitName.style.color = habit.color
    habitName.textContent = habit.name
    const habitDesc = document.createElement('p')
    habitDesc.setAttribute('class', 'habit_Desc');
    habitDesc.textContent = habit.description
    const habitFrequency = document.createElement('p')
    habitFrequency.setAttribute('class', 'hab_Descript');
    habitFrequency.textContent = `${habit.frequency} times per ${habit.day_month}`

      
    const updateButton = document.createElement('input')
    updateButton.setAttribute('class', 'btn_update');
    updateButton.setAttribute('type', 'submit')
    updateButton.setAttribute('value', 'update') 
    updateButton.addEventListener('click', function(){
        habitUpdate(habit.habit_id)
    }) 
    
    
    //DAILYCOUNT
    const currentCount = document.createElement('p')
    currentCount.setAttribute('class', 'hab_count');
    currentCount.setAttribute('class', 'currentCount')
   
    /* let todayCount = localStorage.getItem(`${habit.habit_id}Count`)
    console.log(todayCount)
    currentCount.textContent = `${todayCount} times today` */ 

    const showChartButton = document.createElement('input')
    showChartButton.setAttribute('class', 'btn_chart');
    showChartButton.setAttribute('type', 'submit')
    showChartButton.setAttribute('value', 'Show tracking')
    showChartButton.addEventListener('click', function() {
        openChartModal(habit.habit_id, habit.color )
    });
//modal here that opens to chart
    const chart = document.createElement('canvas')
    chart.id = `tracking${habit.habit_id}`;
    chart.style.width = "100%";
    chart.style.display = 'none'
    

    ahabit.appendChild(habitName)
    ahabit.appendChild(habitDesc)
    ahabit.appendChild(habitFrequency)
    ahabit.appendChild(currentCount)
    ahabit.appendChild(hab_div)
    hab_div.append(updateButton)
    hab_div.append(showChartButton)
    ahabit.appendChild(chart)

    
    
    main.appendChild(ahabit)
    console.log('habitlisted')
    
    })
}

function openChartModal(habit_id, habit_colour) {
    //create modal
        
    fetch(`http://localhost:${port}/habits/getcount/${habit_id}`) //change endpoint
    .then(resp => resp.json())
    .then(resp => useValues(resp))

    let weekData

    function useValues(resp) {
        
        const array = resp;
        length = resp.length;
        let startInd
        if (length<7) {
            startInd = 0
        } else {
            startInd =-7;
        }
        
        weekData = (array.slice([startInd]));
        console.log(weekData)    

        xAxes = weekData.map(day => day.date_trunc)
        console.log(xAxes)
        yValues = weekData.map(day => day.count)
        console.log(yValues)

        let trackingBar = new Chart(`tracking${habit_id}`, {
            type: "bar",
            data: {
                labels: xAxes,
                datasets: [{
                backgroundColor: habit_colour,
                data: yValues
                }]
            },
            options: {    legend: {display: false},
            title: {
            display: true,
            text: "Progress over the last week"}
        }}); 
    }
    const chart = document.getElementById(`tracking${habit_id}`)
    chart.style.display = 'block'
    chart.style.cursor = 'pointer'

    chart.addEventListener('click', () => {
        chart.style.display = 'none'
    })
}







function habitUpdate(habit_id){
    console.log(habit_id)
    
    fetch(`http://localhost:${port}/habits/count/${habit_id}`, {
      method: 'POST',
      body: JSON.stringify({habit_id: habit_id}),
      headers: { 'Content-Type': 'application/json' },
    })
    location.reload();
    console.log('++')
};


const logoutUser = document.getElementById('logout')
logoutUser.addEventListener('click', logUserOut)

function logUserOut(){
    localStorage.clear();
    location.href = 'login.html';
}

