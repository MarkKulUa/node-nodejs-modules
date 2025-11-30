import { ServerResponse } from 'http';

export function handleServerError(res: ServerResponse, error: unknown) {
    console.error('Server error:', error);

    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: 'Internal server error'
    }));
}

export function handle404(res: ServerResponse) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: 'Endpoint not found'
    }));
}
