import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class RecurringService {
  constructor(private prisma: PrismaService) {}

  // Run every 5 minutes to check for recurring tasks
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleRecurringTasks() {
    const now = new Date()

    const rules = await this.prisma.recurringRule.findMany({
      where: {
        nextOccurrence: {
          lte: now,
        },
      },
    })

    for (const rule of rules) {
      try {
        const templateData = JSON.parse(rule.templateData)

        // Create new todo
        await this.prisma.todo.create({
          data: {
            ...templateData,
            recurringRuleId: rule.id,
          },
        })

        // Calculate next occurrence
        const nextOccurrence = this.calculateNextOccurrence(
          rule.nextOccurrence,
          rule.frequency,
          rule.interval,
        )

        // Update rule
        await this.prisma.recurringRule.update({
          where: { id: rule.id },
          data: { nextOccurrence },
        })

        console.log(`Created recurring todo for rule ${rule.id}`)
      } catch (error) {
        console.error(`Error processing recurring rule ${rule.id}:`, error)
      }
    }
  }

  private calculateNextOccurrence(current: Date, frequency: string, interval: number): Date {
    const next = new Date(current)

    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + interval)
        break
      case 'weekly':
        next.setDate(next.getDate() + interval * 7)
        break
      case 'monthly':
        next.setMonth(next.getMonth() + interval)
        break
      case 'yearly':
        next.setFullYear(next.getFullYear() + interval)
        break
    }

    return next
  }
}
