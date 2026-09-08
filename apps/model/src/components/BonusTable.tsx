import Link from 'next/link'
import { depositLabel, type ModelCasino } from '@/lib/catalogue'
import { Arrow } from './Icons'

export function BonusTable({
  casinos,
  compact = false,
}: {
  casinos: ModelCasino[]
  compact?: boolean
}) {
  return (
    <div className="bonus-table-wrap">
      <table className="bonus-table">
        <caption>
          {compact
            ? 'A closer look at a few example offers'
            : 'Fictional welcome offers — none are redeemable'}
        </caption>
        <thead>
          <tr>
            <th scope="col">Casino</th>
            <th scope="col">Example offer</th>
            <th scope="col">Conditions</th>
            <th scope="col">Min. deposit</th>
            <th scope="col">
              <span className="sr-only">Details</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {casinos.slice(0, compact ? 3 : undefined).map((c) => (
            <tr key={c.slug}>
              <th scope="row">{c.name}</th>
              <td>{c.bonus}</td>
              <td>{c.terms}</td>
              <td>{depositLabel(c.minDeposit)} CAD</td>
              <td>
                <Link
                  href={`/casino/${c.slug}`}
                  aria-label={`Read ${c.name} demo details`}
                >
                  <Arrow diagonal />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
