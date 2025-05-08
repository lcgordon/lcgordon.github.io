// MobileNavigation.js
window.MobileNavigation = function MobileNavigation() {
    const [icons, setIcons] = React.useState([]);
    const [isDarkMode, setIsDarkMode] = React.useState(false);
  
    React.useEffect(() => {
        const desktopIcons = document.querySelectorAll('.desktop-icon');
        const iconsData = Array.from(desktopIcons)
            .filter(icon => icon.getAttribute('data-window'))
            .map(icon => ({
                name: icon.querySelector('span')?.textContent || '',
                imgSrc: icon.querySelector('img')?.src || '',
                type: icon.getAttribute('data-window')
            }))
            .filter(icon => icon.type !== 'guestbook');
        
        setIcons(iconsData);
  
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDarkMode(document.body.classList.contains('dark-theme'));
                }
            });
        });
  
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
  
        return () => observer.disconnect();
    }, []);
  
    const handleIconClick = (type) => {
        if (type && window.WindowSystem?.createWindow) {
            window.WindowSystem.createWindow(type);
        }
    };

    return React.createElement("div", {
        className: "fixed grid grid-cols-3 gap-6 top-20 left-4 right-4 pointer-events-none"
    }, icons.map((icon) => 
        React.createElement("button", {
            key: icon.type,
            onClick: () => handleIconClick(icon.type),
            className: "flex flex-col items-center gap-2 p-2 pointer-events-auto hover:scale-110 transition-transform"
        }, [
            React.createElement("div", {
                key: "icon-container",
                className: "w-16 h-16 flex items-center justify-center"
            },
                React.createElement("img", {
                    key: "icon-img",
                    src: icon.imgSrc,
                    alt: icon.name,
                    className: "w-12 h-12 object-contain"
                })
            ),
            React.createElement("div", {
                key: "text-container",
                className: "text-center"
            },
                React.createElement("span", {
                    key: "icon-text",
                    className: `text-sm font-medium drop-shadow-lg ${isDarkMode ? 'text-white' : 'text-pink-600'}`
                }, icon.name)
            )
        ])
    ));
};