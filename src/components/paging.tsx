import React from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'

interface PagingProps {
  pageIndex: number
  hasNextPage?: boolean
  totalPage?: number
  onNextPageClick?: () => void
  onPrevPageClick?: () => void
}
function Paging({
  pageIndex,
  hasNextPage,
  onNextPageClick,
  onPrevPageClick,
  totalPage,
}: PagingProps) {
  return (
    <div className='flex flex-row justify-center gap-1'>
      <Button disabled={pageIndex === 0} onClick={onPrevPageClick}>
        Prev
      </Button>
      <Label className='font-medium text-xl'>
        <span>
          ...{pageIndex + 1}{' '}
          {totalPage && totalPage > 0 && <span>/ {totalPage}</span>}
        </span>
        ...
      </Label>
      <Button disabled={!hasNextPage} onClick={onNextPageClick}>
        Next
      </Button>
    </div>
  )
}

export default Paging
