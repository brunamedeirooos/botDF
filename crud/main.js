'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_noticia')) ?? []
const setLocalStorage = (dbNoticia) => localStorage.setItem("db_noticia", JSON.stringify(dbNoticia))

// CRUD - create read update delete
const deleteNoticia = (index) => {
    const dbNoticia = readNoticia()
    dbNoticia.splice(index, 1)
    setLocalStorage(dbNoticia)
}

const updateNoticia = (index, noticia) => {
    const dbNoticia = readNoticia()
    dbNoticia[index] = noticia
    setLocalStorage(dbNoticia)
}

const readNoticia = () => getLocalStorage()

const createNoticia = (noticia) => {
    const dbNoticia = getLocalStorage()
    dbNoticia.push (noticia)
    setLocalStorage(dbNoticia)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('titulo').dataset.index = 'new'
}

const saveNoticia = () => {
    debugger
    if (isValidFields()) {
        const noticia = {
            titulo: document.getElementById('titulo').value,
            conteudo: document.getElementById('conteudo').value,
            autor: document.getElementById('autor').value,
            categoria: document.getElementById('categoria').value
        }
        const index = document.getElementById('titulo').dataset.index
        if (index == 'new') {
            createNoticia(noticia)
            updateTable()
            closeModal()
        } else {
            updateNoticia(index, noticia)
            updateTable()
            closeModal()
        }
    }
}
const createRow = (noticia, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${noticia.titulo}</td>
        <td>${noticia.conteudo}</td>
        <td>${noticia.autor}</td>
        <td>${noticia.categoria}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableNoticia>tbody').appendChild(newRow)
}
const clearTable = () => {
    const rows = document.querySelectorAll('#tableNoticia>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}
const updateTable = () => {
    const dbNoticia = readNoticia()
    clearTable()
    dbNoticia.forEach(createRow)
}
const fillFields = (noticia) => {
    document.getElementById('titulo').value = noticia.titulo
    document.getElementById('conteudo').value = noticia.conteudo
    document.getElementById('autor').value = noticia.autor
    document.getElementById('categoria').value = noticia.categoria
    document.getElementById('titulo').dataset.index = noticia.index
}
const editNoticia = (index) => {
    const noticia = readNoticia()[index]
    noticia.index = index
    fillFields(noticia)
    openModal()
}
const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')
        if (action == 'edit') {
            editNoticia(index)
        } else {
            const noticia = readNoticia()[index]
            const response = confirm(`Deseja realmente excluir esta notícia? ${noticia.titulo}`)
            if (response) {
                deleteNoticia(index)
                updateTable()
            }
        }
    }
}
updateTable()
// Eventos
document.getElementById('cadastrarNoticia')
    .addEventListener('click', openModal)
document.getElementById('modalClose')
    .addEventListener('click', closeModal)
document.getElementById('salvar')
    .addEventListener('click', saveNoticia)
document.querySelector('#tableNoticia>tbody')
    .addEventListener('click', editDelete)
document.getElementById('cancelar')
    .addEventListener('click', closeModal)