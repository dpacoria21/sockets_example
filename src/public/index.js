const socket = io();

const $button = document.querySelector('button');
const $input = document.querySelector('#textMessage');
const $boxChat = document.querySelector('.chat');
const $container = document.querySelector('#container');

socket.on('get-messages', async () => {
    const messages = (await axios.get('http://localhost:4000/message')).data.chatUnsa.Messages;
    const $messages = document.querySelectorAll('#message');
    messages.forEach((message, i) => {
        if (message.message !== $messages[i]?.textContent.trim()) {
            $boxChat.insertAdjacentHTML('beforeend',
                `
            <li class="relative rounded-md py-0 rounded-tl-none bg-blue-500 w-fit h-fit px-4 py-2 my-5 mx-3">
                <p id="message" class="text-sm text-white leading-tight">${message.message}</p>
                <span 
                    class="
                        absolute w-0 h-0 transparent
                        right-full top-0
                        border-r-[3.5px] border-r-blue-500
                        border-l-[3.5px] border-l-transparent
                        border-b-[3.5px] border-b-transparent
                        border-t-[3.5px] border-t-blue-500
                    "
                ></span>
            </li>`);
        }
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    $container.scrollBy(0, $boxChat.clientHeight);
})


$button.addEventListener('click', async (e) => {
    e.preventDefault();
    socket.emit('send-message', { message: $input.value.trim(), chat: 'Chat-Unsa' });
    $input.value = '';
});