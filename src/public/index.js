const socket = io();

const $button = document.querySelector('button');
const $input = document.querySelector('#textMessage');
const $boxChat = document.querySelector('.chat');


socket.on('get-messages', async (payload) => {
    const messages = (await axios.get('http://localhost:4000/message')).data.chatUnsa.Messages;
    const $messages = document.querySelectorAll('li') || [];
    messages.forEach((message, i) => {
        const li = document.createElement('li');
        if (message.message !== $messages[i]?.textContent) {
            li.innerText = message.message;
            $boxChat.append(li);
        }
    })
})

$button.addEventListener('click', async (e) => {
    e.preventDefault();
    socket.emit('send-message', { message: $input.value, chat: 'Chat-Unsa' });
    $input.value = '';
});