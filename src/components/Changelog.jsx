import React from 'react'
import './Changelog.css'

function Changelog() {
  return (
    <section className="changelog" id="changelog">
      <div className="changelog__container">
        <h2 className="changelog__title neon-text">Изменения</h2>

        <div className="changelog__content">
          <div className="changelog__entry">
            <div className="changelog__version-badge">v 0.1</div>
            <div className="changelog__date">Дата релиза</div>
            <ul className="changelog__list">
              <li className="changelog__item">
                <span className="changelog__tag changelog__tag--new">NEW</span>
                Здесь будет описание изменения...
              </li>
              <li className="changelog__item">
                <span className="changelog__tag changelog__tag--fix">FIX</span>
                Здесь будет описание исправления...
              </li>
              <li className="changelog__item">
                <span className="changelog__tag changelog__tag--improve">UPD</span>
                Здесь будет описание улучшения...
              </li>
            </ul>
          </div>

          {/* Заглушка */}
          <div className="changelog__placeholder">
            <p>Здесь будут появляться новые обновления...</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Changelog