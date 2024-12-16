document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('button')
    btn.addEventListener('submit', () => {
        const cityInput = document.querySelector('#cityInput')
         if(cityInput === '') {
            window.alert("Por Favor insira algo!!!")
         }
    })
})