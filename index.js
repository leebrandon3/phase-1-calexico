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

const cart = {
    id: 0,
    items: {},
    "grand-total": 0
}

function fetchMenu(){
    fetch("http://localhost:3000/menu")
    .then(response => response.json())
    .then(promise => {
        for (const item of promise) {
            menuItem(item)
        }
    }) 
}

function fetchItem(item){
    fetch("http://localhost:3000/menu")
    .then(response => response.json())
    .then(promise => {
        const itemFound = promise.find(element => element.name == item)
        const index = itemFound.id - 1
        dishImage.setAttribute("src", promise[index].image)
        dishName.textContent = promise[index].name
        dishDesc.textContent = promise[index].description
        dishPrice.textContent = `$${promise[index].price}`
    }) 
}

function fetchCart(){
    fetch("http://localhost:3000/cart")
    .then(response => response.json())
    .then(promise => {
        cart.id = promise[0].id
        cart.items = promise[0].items
        cart["grand-total"] = promise[0]["grand-total"]
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
    const name = dishName.textContent
    if (cart.items[name] == undefined){
        cart.items[name] = {}
        cart.items[name].id = name
        cart.items[name].amount = event.target["cart-amount"].value
        cart.items[name].name = name
        cart.items[name].total = `$${parseInt(dishPrice.textContent.slice(1)) * parseInt(event.target["cart-amount"].value)}`

        // Update createRow to be cleaner
        createRow(cart.items[name])
    }
    else{
        cart.items[name].amount = parseInt(cart.items[name].amount) + parseInt(event.target["cart-amount"].value)
        const tableId = document.getElementsByClassName(`${name}`)
        tableId[0].textContent = cart.items[name].amount
        tableId[2].textContent = `$${parseInt(dishPrice.textContent.slice(1)) * cart.items[name].amount}`
        cart.items[name].total = `$${parseInt(dishPrice.textContent.slice(1)) * cart.items[name].amount}`
    }
    cartNum.textContent = cart.items[name].amount
    cart["grand-total"] += parseInt(dishPrice.textContent.slice(1)) * parseInt(event.target["cart-amount"].value)
    total.textContent = `$${cart["grand-total"]}`

    patch(cart)
})

function createRow(object){
    let newRow = table.insertRow()
    createCell(newRow, object.amount)
    createCell(newRow, object.name)
    createCell(newRow, object.total)
}

function createCell(newRow, value){
    let newCell = newRow.insertCell()
    newCell.setAttribute("class", dishName.textContent)
    newCell.append(document.createTextNode(value))
}

function patch(object){
    fetch(`http://localhost:3000/cart/${object.id}`, {
        method: "PATCH",
        header: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify(object)
    })
    .then(response => response.json())
    .then(promise => console.log(promise))
}

function main(){
    fetchMenu()
    fetchItem("Chips & Guacamole")
    fetchCart()
}

main()