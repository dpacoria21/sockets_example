const socket = io();

const $button = document.querySelector('button');
const $input = document.querySelector('#textMessage');
const $boxChat = document.querySelector('.chat');


socket.on('get-messages', (payload) => {
    $boxChat.innerText = '';
    payload.forEach((message) => {
        const li = document.createElement('li');
        li.innerText = message;
        $boxChat.append(li);
    })
})

$button.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('send-message', $input.value);
    $input.value = '';
});