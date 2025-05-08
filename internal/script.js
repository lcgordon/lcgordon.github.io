document.addEventListener('DOMContentLoaded', function() {
    const grid = new Muuri('.grid', {
        dragEnabled: true,
        dragHandle: '.grid-item-header',
        layout: {
            fillGaps: false,
            horizontal: false,
            alignRight: false,
            alignBottom: false,
            rounding: true,
            respectDimensions: true,
            alignItems: { x: 'left', y: 'top' }
        },
        dragStartPredicate: {
            distance: 0,
            delay: 0,
            handle: true
        },
        layoutDuration: 400,
        layoutEasing: 'ease',
        dragRelease: {
            duration: 400,
            easing: 'ease',
            useDragContainer: true
        },
        dragSort: true,
        dragSortInterval: 50,
        dragSortPredicate: {
            threshold: 30,
            action: 'move'
        }
    });

    // Update cursor during drag
    grid.on('dragStart', function(item) {
        item.getElement().querySelector('.grid-item-header').style.cursor = 'grabbing';
    });

    grid.on('dragEnd', function(item) {
        item.getElement().querySelector('.grid-item-header').style.cursor = 'grab';
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            grid.refreshItems().layout();
        }, 100);
    });
});