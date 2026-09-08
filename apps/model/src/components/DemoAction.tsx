'use client'
import { useState } from 'react'
export function DemoAction() {
  const [open, setOpen] = useState(false)
  return (
    <div className="demo-action">
      <button
        className="button button-gold"
        aria-expanded={open}
        aria-controls="demo-explanation"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Close demo information' : 'About this demo offer'}
      </button>
      <div id="demo-explanation" hidden={!open}>
        <p role="status">
          This is a fictional offer. There is no casino to visit, no deposit to
          make and no bonus to claim. You can continue exploring the comparison.
        </p>
      </div>
    </div>
  )
}
