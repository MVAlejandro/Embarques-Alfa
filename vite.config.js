import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/shipments/',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login.html'),
                clients: resolve(__dirname, 'clients.html'),
                units: resolve(__dirname, 'units.html'),
                orders: resolve(__dirname, 'orders.html'),
                production: resolve(__dirname, 'production.html'),
                transport: resolve(__dirname, 'transport.html'),
                shipments: resolve(__dirname, 'shipments.html'),
                bills: resolve(__dirname, 'bills.html'),
                planning: resolve(__dirname, 'planning.html'),
            }
        },
    },
});
