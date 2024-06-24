export default () => {
    const gameId = useState('gameId');
    return useVingRecord({
        id: gameId.value,
        fetchApi: `/api/${useRestVersion()}/game/${gameId.value}`,
        createApi: `/api/${useRestVersion()}/game`,
        query: { includeMeta: true, includeOptions: true },
    });
}