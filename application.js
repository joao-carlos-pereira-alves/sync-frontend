let username;

const websocketURL = 'ws://localhost:3000/websocket'; // Substitua pela URL correta do seu servidor Rails
const socket = new WebSocket(websocketURL);

socket.addEventListener('open', (event) => {
  console.log('WebSocket connected:', event);
});

socket.addEventListener('close', (event) => {
  console.log('WebSocket disconnected:', event);
});

socket.addEventListener('message', (event) => {
  // Lógica para lidar com os dados recebidos do servidor
  const data = JSON.parse(event.data);

  console.log('WebSocket received data:', data);

  if (data?.message?.type?.includes('message')) {
    const message = data.message.content;
    const username = data.message.username;
    const created_at = data.message.created_at;
  
    innerHtml(message, username, created_at);
  }

  if (data?.type?.includes('confirm_subscription')) {
    hideLoginDiv();
  }
});

function subscriptionChannel() {
  setUserNameInput();

  const subscriptionMessage = {
    command: 'subscribe',
    identifier: JSON.stringify({ channel: 'ChatChannel', chat_id: '1' }) // Substitua pelo nome do canal desejado
  };

  socket.send(JSON.stringify(subscriptionMessage));

  clearInputName();
}

function sendMessage() {
  const message = getInputMessage();
  const messageData = {
    command: 'message',
    identifier: JSON.stringify({ channel: 'ChatChannel', chat_id: '1' }), // Substitua pelo nome do canal desejado
    data: JSON.stringify({ body_message: message, username: username }) // Substitua pelo conteúdo da mensagem que deseja enviar
  };
  
  socket.send(JSON.stringify(messageData));
  clearInputMessage();
}

function innerHtml(message, username, created_at) {
  const div = document.getElementById('card-message-box');
  div.innerHTML += `<div class="transparent row items-center">
    <div class="col-1 avatar row justify-center items-center">
      A
    </div>
    <div class="col-6 transparent row">
      <div class="col-12 transparent font-weight-bold">
        ${username}
      </div>
      <div class="col-12 transparent">
        ${message}
      </div>
    </div>
    <div class="col-3 transparent text-end">
        ${created_at}
      </div>
  </div>
  `
}

function getInputMessage() {
  const inputValue = document.getElementById('input-message');
  return inputValue.value
}

function clearInputMessage() {
  const inputValue = document.getElementById('input-message');
  inputValue.value = null;
}

function setUserNameInput() {
  const inputValue = document.getElementById('input-name');
  username = inputValue.value;
}

function clearInputName() {
  const inputValue = document.getElementById('input-name');
  inputValue.value = null;
}

function hideLoginDiv() {
  const loginDiv = document.getElementById('login-card');
  const cardMessageBoxDiv = document.getElementById('card-message-box');
  const inputCardDiv = document.getElementById('input-card');

  loginDiv.classList.add('hidden');
  cardMessageBoxDiv.classList.remove('hidden');
  inputCardDiv.classList.remove('hidden');
}