export const mockLocalStorage = () => {
    const store: { [key: string]: string } = {};
    
    const localStorage = {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            Object.keys(store).forEach(key => delete store[key]);
        })
    };

    Object.defineProperty(window, 'localStorage', {
        value: localStorage
    });

    return localStorage;
}; 