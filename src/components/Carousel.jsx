import React, { useState, useEffect, useCallback } from 'react'
import './Carousel.css'

const slides = [
  {
    image: '/images/slide1.png',
    caption: 'Автоматический фарм ресурсов'
  },
  {
    image: '/images/slide2.png',
    caption: 'Умная адаптация под игровые ситуации'
  },
  {
    image: '/images/slide3.png',
    caption: 'Детальная статистика и отчёты'
  },
]

function Carousel() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const total = slides.length

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + total) % total)
  }, [total])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(next, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, next])

  return (
    <section className="carousel-section">
      <div className="carousel"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="carousel__viewport">
          <div
            className="carousel__track"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div className="carousel__slide" key={index}>
                <div className="carousel__image-wrapper">
                  <img
                    src={slide.image}
                    alt={slide.caption}
                    className="carousel__image"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.classList.add('carousel__image-wrapper--placeholder')
                    }}
                  />
                </div>
                <p className="carousel__caption">{slide.caption}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="carousel__btn carousel__btn--prev" onClick={prev} aria-label="Предыдущий">
          ‹
        </button>
        <button className="carousel__btn carousel__btn--next" onClick={next} aria-label="Следующий">
          ›
        </button>

        <div className="carousel__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`carousel__dot ${index === current ? 'carousel__dot--active' : ''}`}
              onClick={() => setCurrent(index)}
              aria-label={`Слайд ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Carousel