import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_ENDPOINT = 'https://api.freeapi.app/api/v1/public/randomusers'

const getUserArray = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  if (Array.isArray(payload?.data?.results)) return payload.data.results
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const formatName = (name = {}) => {
  return [name.title, name.first, name.last].filter(Boolean).join(' ') || 'Unknown User'
}

const formatAddress = (location = {}) => {
  const street = location.street
  const streetText =
    typeof street === 'string' ? street : [street?.number, street?.name].filter(Boolean).join(' ')

  return [streetText, location.city, location.state, location.country].filter(Boolean).join(', ')
}

const normalizeUser = (user) => ({
  id: user.login?.uuid || user.id?.value || user.email || crypto.randomUUID(),
  name: formatName(user.name),
  firstName: user.name?.first || 'User',
  username: user.login?.username || 'profile',
  email: user.email || 'No email available',
  phone: user.phone || user.cell || 'Not provided',
  gender: user.gender || 'unspecified',
  age: user.dob?.age || 'N/A',
  birthday: user.dob?.date ? new Date(user.dob.date).toLocaleDateString() : 'Not available',
  registered: user.registered?.date ? new Date(user.registered.date).toLocaleDateString() : 'Not available',
  city: user.location?.city || 'Unknown city',
  country: user.location?.country || 'Unknown country',
  timezone: user.location?.timezone?.description || user.location?.timezone?.offset || 'Local time unavailable',
  address: formatAddress(user.location),
  avatar: user.picture?.large || user.picture?.medium || user.picture?.thumbnail || '',
  nationality: user.nat || 'N/A',
})

const fetchUsers = async () => {
  const response = await fetch(API_ENDPOINT)
  if (!response.ok) throw new Error('Unable to load random users')

  const payload = await response.json()
  const users = getUserArray(payload).map(normalizeUser)

  if (!users.length) throw new Error('No user profiles were found')
  return users
}

function App() {
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let shouldUpdate = true

    const loadUsers = async () => {
      try {
        const userList = await fetchUsers()
        if (shouldUpdate) {
          setUsers(userList)
          setSelectedUserId(userList[0]?.id || null)
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

    loadUsers()

    return () => {
      shouldUpdate = false
    }
  }, [])

  const genderOptions = useMemo(() => {
    const options = new Set(users.map((user) => user.gender).filter(Boolean))
    return ['All', ...options]
  }, [users])

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return users.filter((user) => {
      const matchesGender = genderFilter === 'All' || user.gender === genderFilter
      const matchesSearch =
        !normalizedSearch ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.username.toLowerCase().includes(normalizedSearch) ||
        user.city.toLowerCase().includes(normalizedSearch) ||
        user.country.toLowerCase().includes(normalizedSearch)

      return matchesGender && matchesSearch
    })
  }, [genderFilter, searchTerm, users])

  const selectedUser = useMemo(() => {
    return users.find((user) => user.id === selectedUserId) || filteredUsers[0] || null
  }, [filteredUsers, selectedUserId, users])

  const countryCount = new Set(users.map((user) => user.country)).size
  const averageAge = users.length
    ? Math.round(users.reduce((total, user) => total + Number(user.age || 0), 0) / users.length)
    : 0

  const refreshUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const userList = await fetchUsers()
      setUsers(userList)
      setSelectedUserId(userList[0]?.id || null)
      setSearchTerm('')
      setGenderFilter('All')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="users-shell">
      <header className="users-hero">
        <div>
          <span className="eyebrow">Random Users API</span>
          <h1>People Directory</h1>
          <p>
            Browse generated profiles with contact details, location data, account info, and a clean profile preview.
          </p>
        </div>

        <div className="hero-stats" aria-label="Directory summary">
          <div>
            <strong>{users.length}</strong>
            <span>Profiles</span>
          </div>
          <div>
            <strong>{countryCount}</strong>
            <span>Countries</span>
          </div>
          <div>
            <strong>{averageAge || 0}</strong>
            <span>Avg. age</span>
          </div>
        </div>
      </header>

      <section className="toolbar" aria-label="User filters">
        <label className="search-field">
          <span>Search users</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, email, city, or country"
          />
        </label>

        <label className="select-field">
          <span>Gender</span>
          <select value={genderFilter} onChange={(event) => setGenderFilter(event.target.value)}>
            {genderOptions.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </label>

        <button className="refresh-button" type="button" onClick={refreshUsers} disabled={loading}>
          {loading ? 'Loading' : 'Refresh'}
        </button>
      </section>

      {loading && (
        <section className="user-grid" aria-label="Loading users">
          {Array.from({ length: 8 }, (_, index) => (
            <div className="user-card skeleton-card" key={index}>
              <div className="skeleton-avatar"></div>
              <div className="skeleton-line wide"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))}
        </section>
      )}

      {!loading && error && (
        <section className="state-panel error-panel">
          <h2>Users could not load</h2>
          <p>{error}</p>
          <button type="button" onClick={refreshUsers}>
            Try Again
          </button>
        </section>
      )}

      {!loading && !error && (
        <section className="directory-layout">
          <div className="directory-main">
            <div className="result-row">
              <strong>{filteredUsers.length} profiles shown</strong>
              {(searchTerm || genderFilter !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    setGenderFilter('All')
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>

            {filteredUsers.length > 0 ? (
              <div className="user-grid" aria-label="User list">
                {filteredUsers.map((user) => (
                  <article className={`user-card ${selectedUser?.id === user.id ? 'active' : ''}`} key={user.id}>
                    <button type="button" onClick={() => setSelectedUserId(user.id)}>
                      {user.avatar ? <img src={user.avatar} alt={user.name} /> : <div className="avatar-fallback">?</div>}
                      <span className="card-body">
                        <span className="card-topline">
                          <span>{user.nationality}</span>
                          <span>{user.gender}</span>
                        </span>
                        <strong>{user.name}</strong>
                        <span className="muted">@{user.username}</span>
                        <span className="location-line">{user.city}, {user.country}</span>
                      </span>
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="state-panel">
                <h2>No matching users</h2>
                <p>Try another search term or switch the gender filter back to All.</p>
              </div>
            )}
          </div>

          {selectedUser && filteredUsers.length > 0 && (
            <aside className="profile-panel">
              <div className="profile-cover"></div>
              <div className="profile-content">
                {selectedUser.avatar ? (
                  <img className="profile-avatar" src={selectedUser.avatar} alt={selectedUser.name} />
                ) : (
                  <div className="profile-avatar avatar-fallback">?</div>
                )}
                <span className="profile-chip">{selectedUser.nationality} profile</span>
                <h2>{selectedUser.name}</h2>
                <p>@{selectedUser.username}</p>

                <div className="profile-stats" aria-label="Profile details">
                  <div>
                    <strong>{selectedUser.age}</strong>
                    <span>Age</span>
                  </div>
                  <div>
                    <strong>{selectedUser.gender}</strong>
                    <span>Gender</span>
                  </div>
                  <div>
                    <strong>{selectedUser.country}</strong>
                    <span>Country</span>
                  </div>
                </div>

                <dl className="info-list">
                  <div>
                    <dt>Email</dt>
                    <dd>{selectedUser.email}</dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>{selectedUser.phone}</dd>
                  </div>
                  <div>
                    <dt>Address</dt>
                    <dd>{selectedUser.address || 'Not available'}</dd>
                  </div>
                  <div>
                    <dt>Birthday</dt>
                    <dd>{selectedUser.birthday}</dd>
                  </div>
                  <div>
                    <dt>Registered</dt>
                    <dd>{selectedUser.registered}</dd>
                  </div>
                  <div>
                    <dt>Timezone</dt>
                    <dd>{selectedUser.timezone}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          )}
        </section>
      )}
    </main>
  )
}

export default App
