let socket = null;

const setSocket = (newSocket) => {
    socket = newSocket;
};
const getSocket = () => {
    
    if (!socket) {
        console.log('Socket is not initialized.');
    }
    return socket;
};

module.exports = { setSocket, getSocket };
