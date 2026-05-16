import { useCallback, useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Plus, Pencil, Trash2, Search, RefreshCw } from 'lucide-react'
import { apiClient } from '@/core/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

export type FieldType = 'text' | 'number' | 'email' | 'tel' | 'textarea' | 'select' | 'date' | 'datetime-local' | 'checkbox'

export interface FieldConfig {
  key: string
  label: string
  type?: FieldType
  required?: boolean
  options?: { value: string; label: string }[]
  col?: boolean
  readOnly?: boolean
}

export interface ResourceConfig {
  title: string
  description: string
  moduleCode: string
  icon: LucideIcon
  endpoint: string
  fields: FieldConfig[]
  idKey?: string
  readOnly?: boolean
}

function getVal(row: Record<string, unknown>, key: string): unknown {
  if (row[key] !== undefined) return row[key]
  const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
  return row[camel]
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'boolean') return v ? 'Да' : 'Нет'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

// Универсальная страница CRUD для любого модуля API
export function ResourceCrudPage({ config }: { config: ResourceConfig }) {
  const Icon = config.icon
  const idKey = config.idKey ?? 'id'
  const cols = config.fields.filter((f) => f.col !== false)

  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await apiClient.get<Record<string, unknown>[]>(config.endpoint)
    if (res.success && Array.isArray(res.data)) {
      setRows(res.data)
    } else {
      setError(res.error ?? 'Ошибка загрузки')
      setRows([])
    }
    setLoading(false)
  }, [config.endpoint])

  useEffect(() => { load() }, [load])

  const filtered = rows.filter((row) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return cols.some((c) => formatCell(getVal(row, c.key)).toLowerCase().includes(q))
  })

  const openCreate = () => {
    setEditing(null)
    const init: Record<string, string> = {}
    config.fields.forEach((f) => { if (!f.readOnly) init[f.key] = '' })
    setForm(init)
    setOpen(true)
  }

  const openEdit = (row: Record<string, unknown>) => {
    setEditing(row)
    const init: Record<string, string> = {}
    config.fields.forEach((f) => {
      const v = getVal(row, f.key)
      init[f.key] = v === null || v === undefined ? '' : String(v)
    })
    setForm(init)
    setOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const body: Record<string, unknown> = {}
    config.fields.forEach((f) => {
      if (f.readOnly) return
      let v: unknown = form[f.key]
      if (f.type === 'number') v = Number(v) || 0
      if (f.type === 'checkbox') v = form[f.key] === 'true'
      if (v !== '') body[f.key] = v
    })

    const id = editing ? getVal(editing, idKey) : null
    const res = id
      ? await apiClient.put(`${config.endpoint}/${id}`, body)
      : await apiClient.post(config.endpoint, body)

    setSaving(false)
    if (res.success) {
      setOpen(false)
      load()
    } else {
      alert(res.error ?? 'Ошибка сохранения')
    }
  }

  const handleDelete = async (row: Record<string, unknown>) => {
    if (!confirm('Удалить запись?')) return
    const id = getVal(row, idKey)
    const res = await apiClient.delete(`${config.endpoint}/${id}`)
    if (res.success) load()
    else alert(res.error ?? 'Ошибка удаления')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{config.title}</h1>
              <Badge variant="outline">{config.moduleCode}</Badge>
            </div>
            <p className="text-muted-foreground text-sm">{config.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
          {!config.readOnly && (
            <Button size="sm" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <CardDescription className="ml-auto">
              {filtered.length} из {rows.length} записей
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Загрузка...</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {cols.map((c) => (
                      <TableHead key={c.key}>{c.label}</TableHead>
                    ))}
                    {!config.readOnly && <TableHead className="w-24">Действия</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={cols.length + (config.readOnly ? 0 : 1)} className="text-center py-8 text-muted-foreground">
                        Нет данных
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((row) => (
                      <TableRow key={String(getVal(row, idKey))}>
                        {cols.map((c) => (
                          <TableCell key={c.key} className="max-w-[220px] truncate">
                            {formatCell(getVal(row, c.key))}
                          </TableCell>
                        ))}
                        {!config.readOnly && (
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" type="button" onClick={() => openEdit(row)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" type="button" onClick={() => handleDelete(row)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Редактировать' : 'Создать'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            {config.fields.filter((f) => !f.readOnly).map((f) => (
              <div key={f.key} className="space-y-1">
                <Label>{f.label}{f.required ? ' *' : ''}</Label>
                {f.type === 'textarea' ? (
                  <Textarea
                    value={form[f.key] ?? ''}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    required={f.required}
                  />
                ) : f.type === 'select' ? (
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                    value={form[f.key] ?? ''}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    required={f.required}
                  >
                    <option value="">—</option>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                    value={form[f.key] ?? ''}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    required={f.required}
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
