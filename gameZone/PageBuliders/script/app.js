// הגדרת משנים גלובליים
let colorInput = document.getElementById("background-color");
let newDiv = document.createElement("div");
let divWidth = document.getElementById('width');
let divHeight = document.getElementById('height');
let textBox = document.getElementById("content");
let fontSizeInput = document.getElementById("font-size");
let fontTypeInput = document.getElementById("font-type");
let borderRadius = document.getElementById("radius");
//יצירת div לפי הגדרות המשתמש
function addDiv() {
    let newDiv = document.createElement("div");
    newDiv.style.width = divWidth.value.includes('px') ? divWidth.value : divWidth.value + 'px';
    newDiv.style.height = divHeight.value.includes('px') ? divHeight.value : divHeight.value + 'px';
    newDiv.style.backgroundColor = colorInput.value;
    newDiv.style.fontSize = fontSizeInput.value.includes('px') ? fontSizeInput.value : fontSizeInput.value + 'px';
    newDiv.style.border = "2px solid black";
    newDiv.innerText = textBox.value;
    newDiv.style.borderRadius = borderRadius.value.includes('px') ? borderRadius.value : borderRadius.value + 'px';
    let destinationDiv = document.getElementById("emptySpace");
    destinationDiv.appendChild(newDiv);

}
//פונקציה להשבת נתונים ראשוניים לתיבות
function reset() {
    divWidth.value = "100px";
    divHeight.value = "100px";
    textBox.value = "";
    fontSizeInput.value = "10px";
    borderRadius.value = "5px";
    colorInput.value = "#3980C8";
}
//פונקציה לצורך ניקוי המסך
function clearScreen() {
    let destinationDiv = document.getElementById("emptySpace");
    destinationDiv.innerHTML = ""; 

}

//הוספת פעולה לכפתורים. 
let myButton = document.querySelector("#addBtn");
myButton.addEventListener("click", addDiv);

let myButton2 = document.querySelector("#resetBtn");
myButton2.addEventListener("click", reset);

let myButton3 = document.querySelector(".clear");
myButton3.addEventListener("click", clearScreen);

