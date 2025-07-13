// hooks/useTable.tsx
import { useState, useEffect } from 'react'
import { Table } from 'antd'

export function useTable({
  api = '',
  id = 'id',
  columns,
  fetchFn
}) {
  const [dataSource, setDataSource] = useState<[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  const getList = async (extraParams = {}) => {
    setLoading(true)
    try {
      const res = await fetchFn({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...extraParams
      })
      setDataSource(res.list)
      setPagination((p) => ({ ...p, total: res.total }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getList()
  }, [pagination.current, pagination.pageSize])

  const onChange = (page: number, pageSize: number) => {
    setPagination((p) => ({ ...p, current: page, pageSize }))
  }

  const table = () =>
    <Table
      rowKey={id}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange
      }}
    />

  return {
    table,
    dataSource,
    loading,
    pagination,
    onChange,
    reload: getList
  }
}
