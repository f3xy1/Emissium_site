import React from 'react'
import './Pricing.css'

function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="pricing__container">
        <h2 className="pricing__title neon-text">Цены</h2>

        <div className="pricing__table-wrapper">
          <table className="pricing__table">
            <thead>
              <tr>
                <th>Версия</th>
                <th>Базовая</th>
                <th>Полная</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Пример функции 1</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Пример функции 2</td>
                <td>—</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Пример функции 3</td>
                <td>—</td>
                <td>✓</td>
              </tr>
              {/* Добавляйте строки здесь */}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Pricing