export default () => {
    const hotWrapper = useState('hotWrapper', () => null);
    if (hotWrapper.value != null)
        hotWrapper.value.hotInstance.resumeRender();
}