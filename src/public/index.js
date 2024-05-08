const socket = io();

const $button = document.querySelector('button');
const $input = document.querySelector('#textMessage');
const $boxChat = document.querySelector('.chat');


socket.on('get-messages', async (payload) => {
    $boxChat.innerText = '';
    const messages = (await axios.get('http://localhost:4000/message')).data.chatUnsa.Messages;
    messages.forEach((message) => {
        const li = document.createElement('li');
        li.innerText = message.message;
        $boxChat.append(li);
    })
})

$button.addEventListener('click', async (e) => {
    e.preventDefault();
    socket.emit('send-message', $input.value);
    $input.value = '';
});