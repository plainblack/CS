export default () => {
    const hotWrapper = useState('hotWrapper');
    if (hotWrapper.value != null)
        hotWrapper.value.hotInstance.suspendRender();
}