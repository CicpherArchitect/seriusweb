import { WebSocketServer } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket>;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.clients = new Map();

    this.wss.on('connection', (ws, req) => {
      const token = req.url?.split('token=')[1];
      
      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = (decoded as any).userId;
        
        this.clients.set(userId, ws);

        ws.on('close', () => {
          this.clients.delete(userId);
        });
      } catch (error) {
        ws.close(1008, 'Invalid token');
      }
    });
  }

  public broadcast(event: string, data: any) {
    const message = JSON.stringify({ event, data });
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  public sendToUser(userId: string, event: string, data: any) {
    const client = this.clients.get(userId);
    if (client?.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event, data }));
    }
  }
}