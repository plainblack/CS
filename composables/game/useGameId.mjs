export default (id) => {
    const gameId = useState('gameId');
    if (id)
        gameId.value = id;
    return gameId;
}