// Write your code here...

const menu = document.getElementById("menu-items")

const dishImage = document.getElementById("dish-image")
const dishName = document.getElementById("dish-name")
const dishDesc = document.getElementById("dish-description")
const dishPrice = document.getElementById("dish-price")

const cartNum = document.getElementById("number-in-cart")
const table = document.getElementById("table")
const tableNum = document.getElementById("tableNum")
const tableItem = document.getElementById("tableItem")
const total = document.getElementById("total")
let totalCalc = 0

const cart = {}

function fetchMenu(){
    fetch("./db.json")
    .then(response => response.json())
    .then(promise => {
        for (const item of promise.menu) {
            menuItem(item)
        }
    }) 
}

function fetchItem(item){
    fetch("./db.json")
    .then(response => response.json())
    .then(promise => {
        const itemFound = promise.menu.find(element => element.name == item)
        const index = itemFound.id - 1
        dishImage.setAttribute("src", promise.menu[index].image)
        dishName.textContent = promise.menu[index].name
        dishDesc.textContent = promise.menu[index].description
        dishPrice.textContent = `$${promise.menu[index].price}`
    }) 
}

function menuItem(calledItem){
    const item = document.createElement("span")
    item.textContent = calledItem.name
    menu.append(item)
}

document.getElementById("menu-items").addEventListener("click", event => {
    fetchItem(event.target.textContent)
})

document.getElementById("cart-form").addEventListener("submit", event => {
    event.preventDefault()
    if (cart[dishName.textContent] == undefined){
        cart[dishName.textContent] = event.target["cart-amount"].value
        const value1 = event.target["cart-amount"].value
        const value2 = dishName.textContent
        const value3 = `$${parseInt(dishPrice.textContent.slice(1)) * parseInt(event.target["cart-amount"].value)}`
        createRow(value1, value2, value3, dishName.textContent)
    }
    else{
        cart[dishName.textContent] = parseInt(cart[dishName.textContent]) + parseInt(event.target["cart-amount"].value)
        const tableId = document.getElementsByClassName(`${dishName.textContent}`)
        tableId[0].textContent = cart[dishName.textContent]
        tableId[2].textContent = `$${parseInt(dishPrice.textContent.slice(1)) * cart[dishName.textContent]}`
    }
    cartNum.textContent = cart[dishName.textContent]
    totalCalc += parseInt(dishPrice.textContent.slice(1)) * parseInt(event.target["cart-amount"].value)
    total.textContent = `$${totalCalc}`
})

function createRow(value1, value2, value3, att = null){
    let newRow = table.insertRow()
    createCell(newRow, value1, att)
    createCell(newRow, value2, att)
    createCell(newRow, value3, att)
}

function createCell(newRow, value){
    let newCell = newRow.insertCell()
    newCell.setAttribute("class", dishName.textContent)
    newCell.append(document.createTextNode(value))
}

function main(){
    fetchMenu()
    fetchItem("Chips & Guacamole")
}

main()