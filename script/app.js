
// Set the start date and time
const startDate = new Date('October 7, 2023 06:30:00').getTime();

// Update the counter every second
setInterval(function () {
    const now = new Date().getTime();
    const elapsedTime = now - startDate;

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    // Display the result
    document.getElementById('counter').innerHTML = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
}, 1000);

document.querySelector('.menu-icon').addEventListener('click', function () {
    this.classList.toggle('active');
    document.querySelector('.nav').classList.toggle('active');
});