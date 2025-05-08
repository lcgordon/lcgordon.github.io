// Taskbar functionality
function addWindowToTaskbar(type, window) {
    const activeWindows = document.getElementById('active-windows');
    const button = document.createElement('button');
    button.className = 'px-3 py-1 bg-white/50 hover:bg-white/80 rounded text-sm flex items-center gap-2';
    button.innerHTML = `
        <i class="fas fa-window-maximize"></i>
        <span>${type}</span>
    `;
    button.onclick = () => toggleWindow(window);
    activeWindows.appendChild(button);
    window.taskbarButton = button;
}

function removeWindowFromTaskbar(window) {
    if (window.taskbarButton) {
        window.taskbarButton.remove();
    }
}

function updateTaskbarButton(window) {
    if (window.taskbarButton) {
        if (window.style.display === 'none') {
            window.taskbarButton.classList.add('opacity-50');
        } else {
            window.taskbarButton.classList.remove('opacity-50');
        }
    }
}

function toggleWindow(window) {
    if (window.style.display === 'none') {
        window.style.display = '';
        window.style.zIndex = ++zIndex;
    } else {
        window.style.display = 'none';
    }
    updateTaskbarButton(window);
}