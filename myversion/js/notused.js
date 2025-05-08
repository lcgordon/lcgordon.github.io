// js/webcam-init.js
window.initWebcamWindow = (windowId) => {
    const container = document.querySelector(`#${windowId} #webcam-root`);
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(window.WebcamWindow));
    }
};

window.cleanupWebcamWindow = (windowId) => {
    const container = document.querySelector(`#${windowId} #webcam-root`);
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.unmount();
    }
};