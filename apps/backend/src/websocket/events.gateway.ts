import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:8081'],
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private familyMembers: Map<string, Set<string>> = new Map() // familyId -> Set<socketId>

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)

    // Remove from all families
    this.familyMembers.forEach((members, familyId) => {
      members.delete(client.id)
      if (members.size === 0) {
        this.familyMembers.delete(familyId)
      }
    })
  }

  @SubscribeMessage('family:join')
  handleJoinFamily(client: Socket, familyId: string) {
    client.join(familyId)

    if (!this.familyMembers.has(familyId)) {
      this.familyMembers.set(familyId, new Set())
    }
    this.familyMembers.get(familyId).add(client.id)

    // Notify family members about online presence
    const onlineCount = this.familyMembers.get(familyId).size
    this.server.to(familyId).emit('family:presence', { count: onlineCount })

    console.log(`Client ${client.id} joined family ${familyId}`)
  }

  @SubscribeMessage('family:leave')
  handleLeaveFamily(client: Socket, familyId: string) {
    client.leave(familyId)

    const members = this.familyMembers.get(familyId)
    if (members) {
      members.delete(client.id)
      const onlineCount = members.size
      this.server.to(familyId).emit('family:presence', { count: onlineCount })
    }

    console.log(`Client ${client.id} left family ${familyId}`)
  }

  // Emit events to family members
  emitToFamily(familyId: string, event: string, data: any) {
    this.server.to(familyId).emit(event, data)
  }

  // Helper methods for todos
  emitTodoCreated(familyId: string, todo: any) {
    this.emitToFamily(familyId, 'todo:created', todo)
  }

  emitTodoUpdated(familyId: string, todo: any) {
    this.emitToFamily(familyId, 'todo:updated', todo)
  }

  emitTodoDeleted(familyId: string, todoId: string) {
    this.emitToFamily(familyId, 'todo:deleted', { id: todoId, familyId })
  }

  // Helper methods for shopping
  emitShoppingCreated(familyId: string, item: any) {
    this.emitToFamily(familyId, 'shopping:created', item)
  }

  emitShoppingUpdated(familyId: string, item: any) {
    this.emitToFamily(familyId, 'shopping:updated', item)
  }

  emitShoppingDeleted(familyId: string, itemId: string) {
    this.emitToFamily(familyId, 'shopping:deleted', { id: itemId, familyId })
  }

  // Helper methods for planned purchases
  emitPlannedCreated(familyId: string, purchase: any) {
    this.emitToFamily(familyId, 'planned:created', purchase)
  }

  emitPlannedUpdated(familyId: string, purchase: any) {
    this.emitToFamily(familyId, 'planned:updated', purchase)
  }

  emitPlannedDeleted(familyId: string, purchaseId: string) {
    this.emitToFamily(familyId, 'planned:deleted', { id: purchaseId, familyId })
  }
}
