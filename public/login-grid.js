document.addEventListener('DOMContentLoaded', () => {
    // A collection of high-quality images related to homes and travel
    const imageUrls = [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2070',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071',
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1964',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980',
        'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36f?q=80&w=1974',
        'https://images.unsplash.com/photo-1616594039964-ae9197a4a6ea?q=80&w=1964',
        'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1992',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2057',
        'https://images.unsplash.com/photo-1571504211935-1c936b327411?q=80&w=1974'
    ];

    const gridCells = document.querySelectorAll('.grid-item img');

    function changeImage() {
        const randomCellIndex = Math.floor(Math.random() * gridCells.length);
        const cellToChange = gridCells[randomCellIndex];
        const randomImageIndex = Math.floor(Math.random() * imageUrls.length);
        const newImageUrl = imageUrls[randomImageIndex];
        
        if (cellToChange.src === newImageUrl) {
            return;
        }

        cellToChange.style.opacity = '0';

        setTimeout(() => {
            cellToChange.src = newImageUrl;
            cellToChange.style.opacity = '1';
        }, 500);
    }

    // Change an image every 3 seconds
    setInterval(changeImage, 3000);
});