import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_ENDPOINT = 'https://api.freeapi.app/api/v1/public/meals'

const getMealArray = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  if (Array.isArray(payload?.data?.meals)) return payload.data.meals
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const getIngredients = (meal) => {
  return Array.from({ length: 20 }, (_, index) => {
    const position = index + 1
    const ingredient = meal[`strIngredient${position}`]?.trim()
    const measure = meal[`strMeasure${position}`]?.trim()

    if (!ingredient) return null
    return [measure, ingredient].filter(Boolean).join(' ')
  }).filter(Boolean)
}

const normalizeMeal = (meal) => ({
  id: meal.idMeal || meal.id || meal._id || meal.strMeal,
  name: meal.strMeal || meal.name || meal.title || 'Untitled meal',
  category: meal.strCategory || meal.category || 'General',
  area: meal.strArea || meal.area || 'Global',
  image: meal.strMealThumb || meal.thumbnail || meal.image || '',
  instructions: meal.strInstructions || meal.instructions || meal.description || '',
  tags: (meal.strTags || meal.tags || '')
    .toString()
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean),
  youtube: meal.strYoutube || meal.youtube || '',
  source: meal.strSource || meal.source || '',
  ingredients: getIngredients(meal),
})

const fetchMeals = async () => {
  const response = await fetch(API_ENDPOINT)
  if (!response.ok) throw new Error('Unable to load meals right now')

  const payload = await response.json()
  const meals = getMealArray(payload).map(normalizeMeal)

  if (!meals.length) throw new Error('No meals were found')
  return meals
}

function App() {
  const [meals, setMeals] = useState([])
  const [selectedMealId, setSelectedMealId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let shouldUpdate = true

    const loadMeals = async () => {
      try {
        const mealList = await fetchMeals()
        if (shouldUpdate) {
          setMeals(mealList)
          setSelectedMealId(mealList[0]?.id || null)
          setError('')
        }
      } catch (err) {
        if (shouldUpdate) {
          setError(err.message || 'Something went wrong')
        }
      } finally {
        if (shouldUpdate) {
          setLoading(false)
        }
      }
    }

    loadMeals()

    return () => {
      shouldUpdate = false
    }
  }, [])

  const categories = useMemo(() => {
    return ['All', ...new Set(meals.map((meal) => meal.category).filter(Boolean))]
  }, [meals])

  const filteredMeals = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return meals.filter((meal) => {
      const matchesCategory = categoryFilter === 'All' || meal.category === categoryFilter
      const matchesSearch =
        !normalizedSearch ||
        meal.name.toLowerCase().includes(normalizedSearch) ||
        meal.area.toLowerCase().includes(normalizedSearch) ||
        meal.category.toLowerCase().includes(normalizedSearch) ||
        meal.ingredients.some((ingredient) => ingredient.toLowerCase().includes(normalizedSearch))

      return matchesCategory && matchesSearch
    })
  }, [categoryFilter, meals, searchTerm])

  const selectedMeal = useMemo(() => {
    return meals.find((meal) => meal.id === selectedMealId) || filteredMeals[0] || null
  }, [filteredMeals, meals, selectedMealId])

  const totalIngredients = meals.reduce((total, meal) => total + meal.ingredients.length, 0)
  const averageIngredients = meals.length ? Math.round(totalIngredients / meals.length) : 0

  return (
    <main className="meal-shell">
      <header className="meal-hero">
        <div>
          <span className="eyebrow">Meals API</span>
          <h1>Recipe Browser</h1>
          <p>
            Explore meal ideas with clear photos, cuisine labels, ingredient lists, and cooking notes in one tidy view.
          </p>
        </div>

        <div className="hero-stats" aria-label="Meal summary">
          <div>
            <strong>{meals.length}</strong>
            <span>Meals</span>
          </div>
          <div>
            <strong>{categories.length > 1 ? categories.length - 1 : 0}</strong>
            <span>Categories</span>
          </div>
          <div>
            <strong>{averageIngredients}</strong>
            <span>Avg. ingredients</span>
          </div>
        </div>
      </header>

      <section className="toolbar" aria-label="Meal filters">
        <label className="search-field">
          <span>Search meals</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by meal, cuisine, or ingredient"
          />
        </label>

        <label className="select-field">
          <span>Category</span>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <div className="result-count">{filteredMeals.length} shown</div>
      </section>

      {loading && (
        <section className="meal-grid" aria-label="Loading meals">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="meal-card skeleton-card" key={index}>
              <div className="skeleton-image"></div>
              <div className="skeleton-line wide"></div>
              <div className="skeleton-line"></div>
            </div>
          ))}
        </section>
      )}

      {!loading && error && (
        <section className="state-panel error-panel">
          <h2>Meals could not load</h2>
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </section>
      )}

      {!loading && !error && (
        <section className="meal-layout">
          <div className="meal-grid" aria-label="Meal list">
            {filteredMeals.map((meal) => (
              <article
                className={`meal-card ${selectedMeal?.id === meal.id ? 'active' : ''}`}
                key={meal.id}
              >
                <button type="button" onClick={() => setSelectedMealId(meal.id)}>
                  {meal.image ? <img src={meal.image} alt={meal.name} /> : <div className="image-fallback">Meal</div>}
                  <span className="card-body">
                    <span className="card-meta">
                      <span>{meal.category}</span>
                      <span>{meal.area}</span>
                    </span>
                    <strong>{meal.name}</strong>
                    <span className="ingredient-count">{meal.ingredients.length} ingredients</span>
                  </span>
                </button>
              </article>
            ))}
          </div>

          {filteredMeals.length === 0 && (
            <div className="state-panel">
              <h2>No matching meals</h2>
              <p>Try a different search term or switch the category back to All.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('All')
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {selectedMeal && filteredMeals.length > 0 && (
            <aside className="meal-detail">
              {selectedMeal.image && <img src={selectedMeal.image} alt={selectedMeal.name} />}
              <div className="detail-content">
                <div className="detail-tags">
                  <span>{selectedMeal.category}</span>
                  <span>{selectedMeal.area}</span>
                </div>
                <h2>{selectedMeal.name}</h2>

                {selectedMeal.tags.length > 0 && (
                  <div className="tag-list">
                    {selectedMeal.tags.slice(0, 4).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}

                <section>
                  <h3>Ingredients</h3>
                  <ul className="ingredient-list">
                    {selectedMeal.ingredients.slice(0, 10).map((ingredient) => (
                      <li key={ingredient}>{ingredient}</li>
                    ))}
                  </ul>
                </section>

                {selectedMeal.instructions && (
                  <section>
                    <h3>Instructions</h3>
                    <p className="instructions">{selectedMeal.instructions}</p>
                  </section>
                )}

                <div className="detail-actions">
                  {selectedMeal.youtube && (
                    <a href={selectedMeal.youtube} target="_blank" rel="noreferrer">
                      Watch Video
                    </a>
                  )}
                  {selectedMeal.source && (
                    <a href={selectedMeal.source} target="_blank" rel="noreferrer">
                      View Source
                    </a>
                  )}
                </div>
              </div>
            </aside>
          )}
        </section>
      )}
    </main>
  )
}

export default App
