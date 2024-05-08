const socket = io();

const $button = document.querySelector('button');
const $input = document.querySelector('#textMessage');
const $boxChat = document.querySelector('.chat');

socket.on('get-messages', (payload) => {
    console.log('hola')
    $boxChat.innerText = '';
    payload.forEach((message) => {
        const li = document.createElement(`li`);
        li.innerText = (message);
        $boxChat.append(li);
    })
})

$button.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('molestar', $input.value);
});