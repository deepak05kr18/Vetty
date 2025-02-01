// Card constructor
class Card {
    constructor(header, desc) {
        this.header = header;
        this.desc = desc;
        this.creationTime = new Date().toISOString();
    }
}

// List constructor
class List {
    constructor(header) {
        this.header = header;
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card);
        this.sortCards();
    }

    deleteCard(index) {
        if (index >= 0 && index < this.cards.length) {
            this.cards.splice(index, 1);
            this.sortCards();
        }
    }

    sortCards() {
        this.cards.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));
    }
}

// Persistent data handling
function LoadStorage() {
    const ListStored = JSON.parse(localStorage.getItem('jiraBoard')) || [];
    return ListStored.map(listData => {
        const list = new List(listData.header);
        listData.cards.forEach(cardData => {
            list.addCard(new Card(cardData.header, cardData.desc));
        });
        return list;
    });
}

function SaveStorage(board) {
    localStorage.setItem('jiraBoard', JSON.stringify(board));
}

// Board initialization
const board = LoadStorage();
const boardElement = document.getElementById('board');
const addListButton = document.getElementById('addListButton');

// Render the board
function temp() {
    boardElement.innerHTML = '';
    board.forEach((list, listIndex) => {
        const listElement = document.createElement('div');
        listElement.classList.add('list');
        listElement.dataset.index = listIndex;

        const listHeader = document.createElement('h3');
        listHeader.textContent = list.header;
        listElement.appendChild(listHeader);

        const deleteListButton = document.createElement('button');
        deleteListButton.textContent = 'X';
        deleteListButton.onclick = () => deleteList(listIndex);
        listElement.appendChild(deleteListButton);

        list.cards.forEach((card, cardIndex) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.index = cardIndex;

            const cardHeader = document.createElement('strong');
            cardHeader.textContent = card.header;
            const cardDesc = document.createElement('span');
            cardDesc.textContent = card.desc;

            const CardDeleteButton = document.createElement('button');
            CardDeleteButton.textContent = 'X';
            CardDeleteButton.onclick = () => deleteCard(listIndex, cardIndex);

            cardElement.appendChild(cardHeader);
            cardElement.appendChild(document.createElement('br'));
            cardElement.appendChild(cardDesc);
            cardElement.appendChild(CardDeleteButton);
            listElement.appendChild(cardElement);
        });

        const CardAddButton = document.createElement('button');
        CardAddButton.textContent = '+';
        CardAddButton.onclick = () => addCard(listIndex);
        listElement.appendChild(CardAddButton);

        boardElement.appendChild(listElement);
    });
}

// Adding a list
function addList() {
    const header = prompt("Enter List Header:");
    if (header) {
        board.push(new List(header));
        SaveStorage(board);
        temp();
    }
}

// Adding a card to a list
function addCard(listIndex) {
    if (listIndex >= 0 && listIndex < board.length) {
        const header = prompt("Enter Card Header:");
        const desc = prompt("Enter Card Description:");
        if (header && desc) {
            board[listIndex].addCard(new Card(header, desc));
            SaveStorage(board);
            temp();
        }
    }
}

// Deleting a card
function deleteCard(listIndex, cardIndex) {
    if (listIndex >= 0 && listIndex < board.length) {
        board[listIndex].deleteCard(cardIndex);
        SaveStorage(board);
        temp();
    }
}

// Deleting a list
function deleteList(listIndex) {
    if (listIndex >= 0 && listIndex < board.length) {
        board.splice(listIndex, 1);
        SaveStorage(board);
        temp();
    }
}

// Event listeners
addListButton.addEventListener('click', addList);

// Initial render
temp();