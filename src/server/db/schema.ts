import { InferSelectModel, sql } from 'drizzle-orm'
import { int, text, real, sqliteTable, index } from 'drizzle-orm/sqlite-core'

export const tasksTable = sqliteTable(
  'tasks',
  {
    id: text().primaryKey(),
    name: text().notNull(),
    state: text({
      enum: ['success', 'running', 'failure', 'abandoned']
    }).notNull(),
    error: text(),
    worker: text(),
    executionTime: real('execution_time'),
    startedAt: int('started_at', { mode: 'timestamp' }).notNull(),
    finishedAt: int('finished_at', { mode: 'timestamp' }),
    args: text({ mode: 'json' }).$type<Array<any>>(),
    kwargs: text({ mode: 'json' }).$type<Record<string, any>>(),
    returnValue: text('return_value', { mode: 'json' }).$type<{
      return_value: any
    }>()
  },
  (t) => [
    index('idx_tasks__state').on(t.state),
    index('idx_tasks__started_at').on(t.startedAt),
    index('idx_tasks__name').on(sql`name COLLATE NOCASE`),
    index('idx_tasks__finished_at').on(t.finishedAt),
    index('idx_tasks__execution_time').on(t.executionTime)
  ]
)

export type TaskSelect = InferSelectModel<typeof tasksTable>
